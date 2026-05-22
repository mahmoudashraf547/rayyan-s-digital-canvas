import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteItem {
  id: string;
  section_key: string;
  title: string | null;
  description: string | null;
  file_path: string | null;
  file_type: string | null;
  file_url: string | null;
  meta: Record<string, unknown>;
  position: number;
}

export function useSiteItems(sectionKey: string) {
  const [items, setItems] = useState<SiteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("site_items")
      .select("*")
      .eq("section_key", sectionKey)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    setItems((data ?? []) as SiteItem[]);
    setLoading(false);
  }, [sectionKey]);

  useEffect(() => {
    reload();
    const ch = supabase
      .channel(`items_${sectionKey}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_items", filter: `section_key=eq.${sectionKey}` },
        () => reload(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [sectionKey, reload]);

  const add = useCallback(async (item: Partial<SiteItem>) => {
    const { error } = await supabase.from("site_items").insert({
      section_key: sectionKey,
      title: item.title ?? null,
      description: item.description ?? null,
      file_url: item.file_url ?? null,
      file_type: item.file_type ?? null,
      meta: (item.meta ?? {}) as never,
      position: items.length,
    });
    if (error) throw error;
  }, [sectionKey, items.length]);

  const update = useCallback(async (id: string, patch: Partial<SiteItem>) => {
    await supabase.from("site_items").update(patch as never).eq("id", id);
  }, []);

  const remove = useCallback(async (id: string) => {
    await supabase.from("site_items").delete().eq("id", id);
  }, []);

  return { items, loading, add, update, remove, reload };
}
