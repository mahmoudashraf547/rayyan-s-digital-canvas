import { createElement, useEffect, useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useContentStore } from "@/lib/content";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: Tag;
  className?: string;
  multiline?: boolean;
}

export function EditableText({ contentKey, defaultValue, as = "p", className, multiline = false }: Props) {
  const { isAdmin, editMode } = useAdmin();
  const { get, set } = useContentStore();
  const value = get(contentKey, defaultValue);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const canEdit = isAdmin && editMode;

  if (canEdit) {
    if (multiline) {
      return (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== value && set(contentKey, draft)}
          className={cn(
            "w-full bg-accent/40 border-2 border-dashed border-primary/40 rounded-lg p-3 outline-none focus:border-primary resize-none",
            className,
          )}
          rows={Math.max(2, Math.min(10, draft.split("\n").length + 1))}
          dir="rtl"
        />
      );
    }
    return (
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== value && set(contentKey, draft)}
        className={cn(
          "w-full bg-accent/40 border-2 border-dashed border-primary/40 rounded-lg px-3 py-2 outline-none focus:border-primary",
          className,
        )}
        dir="rtl"
      />
    );
  }

  return createElement(as, { className }, value);
}
