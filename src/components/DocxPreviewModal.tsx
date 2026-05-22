import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2 } from "lucide-react";

interface Props {
  url: string | null;
  title?: string;
  onClose: () => void;
}

export function DocxPreviewModal({ url, title, onClose }: Props) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setErr("");
    setHtml("");
    (async () => {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const mammoth = await import("mammoth/mammoth.browser");
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtml(result.value);
      } catch (e) {
        setErr("تعذّر فتح الملف");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [url, onClose]);

  return (
    <AnimatePresence>
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-foreground/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-strong rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-accent">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="font-semibold truncate">{title ?? "معاينة المستند"}</h3>
              </div>
              <a href={url} download className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl bg-accent/60 hover:bg-accent">
                <Download className="w-4 h-4" /> تحميل
              </a>
            </div>

            <div className="flex-1 overflow-auto p-6 sm:p-10 bg-card">
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
              {err && <p className="text-center text-destructive">{err}</p>}
              {html && (
                <div
                  className="docx-content prose prose-neutral max-w-none rtl:text-right leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
