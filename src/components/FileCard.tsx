import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, File, Video, Image as ImageIcon, Eye, Trash2, Download, Pencil, Check, X } from "lucide-react";
import { type SiteItem } from "@/lib/items";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { DocxPreviewModal } from "./DocxPreviewModal";

interface Props {
  item: SiteItem;
  canEdit: boolean;
  onDelete: () => void;
  onRename: (title: string) => void;
}

export function FileCard({ item, canEdit, onDelete, onRename }: Props) {
  const [preview, setPreview] = useState<"pdf" | "docx" | "video" | "image" | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title ?? "");

  const type = item.file_type ?? "other";
  const url = item.file_url ?? "";

  const icon =
    type === "pdf" ? <FileText className="w-7 h-7" /> :
    type === "docx" ? <File className="w-7 h-7" /> :
    type === "video" ? <Video className="w-7 h-7" /> :
    type === "image" ? <ImageIcon className="w-7 h-7" /> :
    <File className="w-7 h-7" />;

  const accent =
    type === "pdf" ? "from-rose-200/70 to-pink-200/70 text-rose-700" :
    type === "docx" ? "from-blue-200/70 to-sky-200/70 text-blue-700" :
    type === "video" ? "from-violet-200/70 to-purple-200/70 text-violet-700" :
    "from-lavender to-accent text-primary";

  const openPreview = () => {
    if (type === "pdf") setPreview("pdf");
    else if (type === "docx") setPreview("docx");
    else if (type === "video") setPreview("video");
    else if (type === "image") setPreview("image");
    else window.open(url, "_blank");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        className="glass rounded-2xl p-4 floating-card group"
      >
        <div className="flex gap-3 items-start">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shrink-0 shadow-soft`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-1">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 min-w-0 text-sm bg-accent/40 border border-primary/40 rounded px-2 py-1 outline-none"
                  autoFocus
                />
                <button onClick={() => { onRename(title); setEditing(false); }} className="p-1 text-primary"><Check className="w-4 h-4" /></button>
                <button onClick={() => { setTitle(item.title ?? ""); setEditing(false); }} className="p-1"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <h4 className="font-semibold text-sm sm:text-base truncate">{item.title ?? "بدون عنوان"}</h4>
            )}
            <p className="text-xs text-muted-foreground mt-0.5 uppercase">{type}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={openPreview}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-xl bg-accent/60 hover:bg-accent transition"
          >
            <Eye className="w-4 h-4" /> معاينة
          </button>
          <a
            href={url}
            download
            className="p-2 rounded-xl bg-accent/40 hover:bg-accent transition"
            aria-label="تحميل"
          >
            <Download className="w-4 h-4" />
          </a>
          {canEdit && (
            <>
              <button onClick={() => setEditing(true)} className="p-2 rounded-xl bg-accent/40 hover:bg-accent transition" aria-label="تعديل الاسم">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={onDelete} className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition" aria-label="حذف">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
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
