import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, string>;

interface ContentCtx {
  content: ContentMap;
  loading: boolean;
  get: (key: string, fallback: string) => string;
  set: (key: string, value: string) => Promise<void>;
  reload: () => Promise<void>;
}

const Ctx = createContext<ContentCtx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("site_content").select("key, value");
    const map: ContentMap = {};
    (data ?? []).forEach((row: { key: string; value: unknown }) => {
      if (typeof row.value === "string") map[row.key] = row.value;
      else if (row.value && typeof row.value === "object" && "text" in row.value) {
        map[row.key] = String((row.value as { text: unknown }).text);
      }
    });
    setContent(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    const channel = supabase
      .channel("site_content_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => reload(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [reload]);

  const get = useCallback(
    (key: string, fallback: string) => content[key] ?? fallback,
    [content],
  );

  const set = useCallback(async (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    await supabase
      .from("site_content")
      .upsert({ key, value: { text: value } }, { onConflict: "key" });
  }, []);

  const value = useMemo<ContentCtx>(() => ({ content, loading, get, set, reload }), [content, loading, get, set, reload]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContentStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ContentProvider missing");
  return ctx;
}
