import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TextStyle {
  fontFamily: "tajawal" | "cairo" | "el-messiri" | "montserrat" | "default";
  color: string;
  fontSize: "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl" | "text-3xl" | "text-4xl";
}

interface ContentRecord {
  text: string;
  style?: TextStyle;
}

type ContentMap = Record<string, string>;
type StyleMap = Record<string, TextStyle>;

interface ContentCtx {
  content: ContentMap;
  styles: StyleMap;
  loading: boolean;
  get: (key: string, fallback: string) => string;
  set: (key: string, value: string) => Promise<void>;
  getStyle: (key: string) => TextStyle | undefined;
  setStyle: (key: string, style: TextStyle) => Promise<void>;
  reload: () => Promise<void>;
}

const Ctx = createContext<ContentCtx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({});
  const [styles, setStyles] = useState<StyleMap>({});
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("site_content").select("key, value");
    const map: ContentMap = {};
    const styleMap: StyleMap = {};
    (data ?? []).forEach((row: { key: string; value: unknown }) => {
      if (typeof row.value === "string") {
        map[row.key] = row.value;
      } else if (row.value && typeof row.value === "object") {
        const record = row.value as ContentRecord;
        if ("text" in record) {
          map[row.key] = String(record.text);
          if (record.style) {
            styleMap[row.key] = record.style;
          }
        }
      }
    });
    setContent(map);
    setStyles(styleMap);
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

  const getStyle = useCallback(
    (key: string) => styles[key],
    [styles],
  );

  const set = useCallback(async (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    const currentStyle = styles[key];
    const record: ContentRecord = { text: value };
    if (currentStyle) {
      record.style = currentStyle;
    }
    await supabase
      .from("site_content")
      .upsert({ key, value: record as any }, { onConflict: "key" });
  }, [styles]);

  const setStyle = useCallback(async (key: string, style: TextStyle) => {
    setStyles((prev) => ({ ...prev, [key]: style }));
    const text = content[key] || "";
    const record: ContentRecord = { text, style };
    await supabase
      .from("site_content")
      .upsert({ key, value: record as any }, { onConflict: "key" });
  }, [content]);

  const value = useMemo<ContentCtx>(
    () => ({ content, styles, loading, get, set, getStyle, setStyle, reload }),
    [content, styles, loading, get, set, getStyle, setStyle, reload]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContentStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ContentProvider missing");
  return ctx;
}
