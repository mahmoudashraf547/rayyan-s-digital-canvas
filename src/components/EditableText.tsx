import { createElement, useEffect, useState, useRef } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useContentStore, type TextStyle } from "@/lib/content";
import { cn } from "@/lib/utils";
import { TypographyCustomizer } from "./TypographyCustomizer";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface Props {
  contentKey: string;
  defaultValue: string;
  as?: Tag;
  className?: string;
  multiline?: boolean;
}

const FONT_FAMILY_CLASSES = {
  default: "font-sans",
  tajawal: "font-tajawal",
  cairo: "font-cairo",
  "el-messiri": "font-el-messiri",
  montserrat: "font-montserrat",
};

const DEFAULT_STYLE: TextStyle = {
  fontFamily: "default",
  color: "currentColor",
  fontSize: "text-base",
};

export function EditableText({ contentKey, defaultValue, as = "p", className, multiline = false }: Props) {
  const { isAdmin, editMode } = useAdmin();
  const { get, set, getStyle, setStyle } = useContentStore();
  const value = get(contentKey, defaultValue);
  const style = getStyle(contentKey) || DEFAULT_STYLE;
  const [draft, setDraft] = useState(value);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(value), [value]);

  const canEdit = isAdmin && editMode;

  const handleSaveStyle = (newStyle: TextStyle) => {
    setStyle(contentKey, newStyle);
    setCustomizing(false);
  };

  const textColorStyle = style.color !== "currentColor" ? { color: style.color } : {};

  if (canEdit) {
    if (multiline) {
      return (
        <div ref={containerRef} className="relative">
          <textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => draft !== value && set(contentKey, draft)}
            onFocus={() => setCustomizing(true)}
            className={cn(
              "w-full bg-accent/40 border-2 border-dashed border-primary/40 rounded-lg p-3 outline-none focus:border-primary resize-none",
              className,
            )}
            rows={Math.max(2, Math.min(10, draft.split("\n").length + 1))}
            dir="rtl"
          />
          {customizing && (
            <TypographyCustomizer
              value={style}
              onChange={handleSaveStyle}
              isOpen={customizing}
              onClose={() => setCustomizing(false)}
              position={{ top: 10, left: 10 }}
            />
          )}
        </div>
      );
    }

    return (
      <div ref={containerRef} className="relative">
        <input
          ref={inputRef as React.Ref<HTMLInputElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== value && set(contentKey, draft)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onFocus={() => setCustomizing(true)}
          className={cn(
            "w-full bg-accent/40 border-2 border-dashed border-primary/40 rounded-lg px-3 py-2 outline-none focus:border-primary",
            FONT_FAMILY_CLASSES[style.fontFamily],
            style.fontSize,
            className,
          )}
          style={textColorStyle}
          dir="rtl"
        />
        {customizing && (
          <TypographyCustomizer
            value={style}
            onChange={handleSaveStyle}
            isOpen={customizing}
            onClose={() => setCustomizing(false)}
            position={{ top: 10, left: 10 }}
          />
        )}
      </div>
    );
  }

  return createElement(
    as,
    {
      className: cn(
        FONT_FAMILY_CLASSES[style.fontFamily],
        style.fontSize,
        className,
      ),
      style: textColorStyle,
    },
    value
  );
}
