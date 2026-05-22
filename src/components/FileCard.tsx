import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, File, Video, Image as ImageIcon, Play,
  Eye, Trash2, Download, Pencil, Check, X,
  Copy, ArrowUp, ArrowDown, Maximize2,
} from "lucide-react";
import { type SiteItem } from "@/lib/items";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { DocxPreviewModal } from "./DocxPreviewModal";
import { PdfThumbnail } from "./PdfThumbnail";

interface Props {
  item: SiteItem;
  canEdit: boolean;
  onDelete: () => void;
  onRename: (title: string) => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const TYPE_META: Record<string, { label: string; badge: string }> = {
  pdf: { label: "PDF", badge: "from-rose-200/80 to-pink-200/80 text-rose-700" },
  docx: { label: "DOCX", badge: "from-blue-200/80 to-sky-200/80 text-blue-700" },
  video: { label: "VIDEO", badge: "from-violet-200/80 to-purple-200/80 text-violet-700" },
  image: { label: "IMAGE", badge: "from-amber-200/80 to-orange-200/80 text-amber-700" },
  other: { label: "FILE", badge: "from-accent to-lavender text-primary" },
};

export function FileCard({ item, canEdit, onDelete, onRename, onDuplicate, onMoveUp, onMoveDown }: Props) {
  const [preview, setPreview] = useState<"pdf" | "docx" | "video" | "image" | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title ?? "");

  const type = (item.file_type ?? "other") as keyof typeof TYPE_META;
  const url = item.file_url ?? "";
  const meta = TYPE_META[type] ?? TYPE_META.other;

  const openPreview = () => {
    if (type === "pdf") setPreview("pdf");
    else if (type === "docx") setPreview("docx");
    else if (type === "video") setPreview("video");
    else if (type === "image") setPreview("image");
    else window.open(url, "_blank");
  };

  const renderThumb = () => {
    if (type === "pdf") return <PdfThumbnail url={url} className="w-full h-full" />;
    if (type === "image")
      return <img src={url} alt={item.title ?? ""} loading="lazy" className="w-full h-full object-cover" />;
    if (type === "video")
      return (
        <>
          <video src={url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-elegant">
              <Play className="w-6 h-6 text-primary fill-primary" />
            </div>
          </div>
        </>
      );
    if (type === "docx")
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 flex flex-col items-center justify-center text-blue-700">
          <File className="w-14 h-14 mb-2" />
          <span className="text-xs font-semibold">مستند Word</span>
        </div>
      );
    return (
      <div className="w-full h-full bg-gradient-to-br from-accent to-lavender flex items-center justify-center text-primary">
        <FileText className="w-14 h-14" />
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="group glass rounded-3xl overflow-hidden floating-card border border-white/40 hover:shadow-elegant transition-shadow"
      >
        {/* Thumbnail */}
        <button
          onClick={openPreview}
          className="relative block w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-lavender/30 to-accent/30"
          aria-label="معاينة"
        >
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
            {renderThumb()}
          </div>

          {/* Top gradient + badge */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-foreground/30 to-transparent pointer-events-none" />
          <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-br ${meta.badge} shadow-soft`}>
            {meta.label}
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-md">
              <Maximize2 className="w-4 h-4" /> فتح المعاينة
            </span>
          </div>
        </button>

        {/* Body */}
        <div className="p-4">
          {editing ? (
            <div className="flex items-center gap-1 mb-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 min-w-0 text-sm bg-accent/40 border border-primary/40 rounded-lg px-2 py-1.5 outline-none"
                autoFocus
              />
              <button onClick={() => { onRename(title); setEditing(false); }} className="p-1.5 text-primary"><Check className="w-4 h-4" /></button>
              <button onClick={() => { setTitle(item.title ?? ""); setEditing(false); }} className="p-1.5"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <h4 className="font-semibold text-sm sm:text-base truncate" title={item.title ?? undefined}>
              {item.title ?? "بدون عنوان"}
            </h4>
          )}

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={openPreview}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-xl bg-gradient-to-r from-accent to-lavender/70 text-primary hover:shadow-soft transition"
            >
              <Eye className="w-4 h-4" /> معاينة
            </button>
            <a
              href={url}
              download
              className="p-2 rounded-xl bg-accent/50 hover:bg-accent transition"
              aria-label="تحميل"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>

          {canEdit && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/60">
              <button onClick={() => setEditing(true)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-accent/40 hover:bg-accent" aria-label="تعديل">
                <Pencil className="w-3.5 h-3.5" /> تعديل
              </button>
              {onDuplicate && (
                <button onClick={onDuplicate} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-accent/40 hover:bg-accent" aria-label="تكرار">
                  <Copy className="w-3.5 h-3.5" /> تكرار
                </button>
              )}
              {onMoveUp && (
                <button onClick={onMoveUp} className="p-1.5 rounded-lg bg-accent/40 hover:bg-accent" aria-label="للأعلى">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
              {onMoveDown && (
                <button onClick={onMoveDown} className="p-1.5 rounded-lg bg-accent/40 hover:bg-accent" aria-label="للأسفل">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={onDelete} className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive" aria-label="حذف">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {preview === "pdf" && <PdfPreviewModal url={url} title={item.title ?? undefined} onClose={() => setPreview(null)} />}
      {preview === "docx" && <DocxPreviewModal url={url} title={item.title ?? undefined} onClose={() => setPreview(null)} />}
      {preview === "video" && (
        <div className="fixed inset-0 z-[120] bg-foreground/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <video src={url} controls autoPlay className="w-full rounded-2xl shadow-elegant" />
          </div>
        </div>
      )}
      {preview === "image" && (
        <div className="fixed inset-0 z-[120] bg-foreground/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <img src={url} alt={item.title ?? ""} className="max-h-[90vh] max-w-full rounded-2xl shadow-elegant" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
