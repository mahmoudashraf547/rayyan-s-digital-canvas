import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TextStyle {
  fontFamily: "tajawal" | "cairo" | "el-messiri" | "montserrat" | "default";
  color: string;
  fontSize: "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl" | "text-3xl" | "text-4xl";
}

interface TypographyCustomizerProps {
  value: TextStyle;
  onChange: (style: TextStyle) => void;
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
}

const FONT_FAMILIES = [
  { id: "default", label: "Default", value: "default", className: "font-sans" },
  { id: "tajawal", label: "Tajawal", value: "tajawal", className: "font-tajawal" },
  { id: "cairo", label: "Cairo", value: "cairo", className: "font-cairo" },
  { id: "el-messiri", label: "El Messiri", value: "el-messiri", className: "font-el-messiri" },
  { id: "montserrat", label: "Montserrat", value: "montserrat", className: "font-montserrat" },
];

const COLOR_PALETTE = [
  { name: "Purple", value: "#A855F7" },
  { name: "Violet", value: "#7C3AED" },
  { name: "Royal Blue", value: "#2563EB" },
  { name: "Slate Gray", value: "#64748B" },
  { name: "Dark Charcoal", value: "#1F2937" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
];

const FONT_SIZES = [
  { label: "Small", value: "text-sm" },
  { label: "Base", value: "text-base" },
  { label: "Medium", value: "text-lg" },
  { label: "Large", value: "text-xl" },
  { label: "X-Large", value: "text-2xl" },
  { label: "2X-Large", value: "text-3xl" },
  { label: "3X-Large", value: "text-4xl" },
];

export function TypographyCustomizer({
  value,
  onChange,
  isOpen,
  onClose,
  position,
}: TypographyCustomizerProps) {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [customColor, setCustomColor] = useState(value.color);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomColor(value.color);
  }, [value.color]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
        setShowColorMenu(false);
        setShowSizeMenu(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentFont = FONT_FAMILIES.find((f) => f.value === value.fontFamily);
  const currentSize = FONT_SIZES.find((s) => s.value === value.fontSize);

  return (
    <div
      ref={toolbarRef}
      className={cn(
        "absolute z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-3",
        "flex flex-col gap-4 min-w-max",
      )}
      style={{
        top: position ? `${position.top}px` : 'auto',
        left: position ? `${position.left}px` : 'auto',
      }}
      dir="rtl"
    >
      {/* Font Family Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setShowFontMenu(!showFontMenu);
            setShowColorMenu(false);
            setShowSizeMenu(false);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 w-full justify-between"
        >
          <span className="text-sm font-medium text-gray-700">{currentFont?.label || "Font"}</span>
          <ChevronDown size={16} className={cn("transition-transform", showFontMenu && "rotate-180")} />
        </button>
        {showFontMenu && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.id}
                onClick={() => {
                  onChange({ ...value, fontFamily: font.value as TextStyle["fontFamily"] });
                  setShowFontMenu(false);
                }}
                className={cn(
                  "block w-full text-right px-4 py-2 text-sm hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0",
                  value.fontFamily === font.value && "bg-purple-100 font-semibold text-purple-700",
                  font.className
                )}
              >
                {font.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColorMenu(!showColorMenu);
            setShowFontMenu(false);
            setShowSizeMenu(false);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: value.color }}
            />
            <span className="text-sm font-medium text-gray-700">Color</span>
          </div>
          <ChevronDown size={16} className={cn("transition-transform", showColorMenu && "rotate-180")} />
        </button>
        {showColorMenu && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    onChange({ ...value, color: color.value });
                    setCustomColor(color.value);
                    setShowColorMenu(false);
                  }}
                  className={cn(
                    "w-full h-8 rounded-lg border-2 transition-all hover:scale-110",
                    value.color === color.value ? "border-gray-800" : "border-gray-300"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-600">Custom Color</span>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    onChange({ ...value, color: e.target.value });
                  }}
                  className="w-full h-8 rounded cursor-pointer border border-gray-300"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Font Size Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setShowSizeMenu(!showSizeMenu);
            setShowFontMenu(false);
            setShowColorMenu(false);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 w-full justify-between"
        >
          <span className="text-sm font-medium text-gray-700">{currentSize?.label || "Size"}</span>
          <ChevronDown size={16} className={cn("transition-transform", showSizeMenu && "rotate-180")} />
        </button>
        {showSizeMenu && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => {
                  onChange({ ...value, fontSize: size.value as TextStyle["fontSize"] });
                  setShowSizeMenu(false);
                }}
                className={cn(
                  "block w-full text-right px-4 py-2 text-sm hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0",
                  value.fontSize === size.value && "bg-purple-100 font-semibold text-purple-700",
                  size.value
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        إغلاق
      </button>
    </div>
  );
}
