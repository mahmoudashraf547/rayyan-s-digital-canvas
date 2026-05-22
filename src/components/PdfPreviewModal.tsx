import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface Props {
  url: string | null;
  title?: string;
  onClose: () => void;
}

export function PdfPreviewModal({ url, title, onClose }: Props) {
  const [pages, setPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    if (!url) return;
    setPageNum(1);
    const w = typeof window !== "undefined" ? Math.min(window.innerWidth - 48, 900) : 800;
    setWidth(w);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setPageNum((p) => Math.min(pages || p, p + 1));
      if (e.key === "ArrowRight") setPageNum((p) => Math.max(1, p - 1));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [url, pages, onClose]);

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
            className="glass-strong rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" aria-label="إغلاق">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="font-semibold truncate">{title ?? "معاينة PDF"}</h3>
              </div>
              <a href={url} download className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl bg-accent/60 hover:bg-accent">
                <Download className="w-4 h-4" /> تحميل
              </a>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-muted/30">
              <Document
                file={url}
                onLoadSuccess={({ numPages }) => setPages(numPages)}
                loading={
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                }
                error={<p className="text-center text-destructive p-8">تعذّر فتح الملف</p>}
              >
                <Page pageNumber={pageNum} width={width} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 p-3 border-t border-border shrink-0">
                <button
                  onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                  disabled={pageNum <= 1}
                  className="p-2 rounded-lg hover:bg-accent disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium tabular-nums">
                  {pageNum} / {pages}
                </span>
                <button
                  onClick={() => setPageNum((p) => Math.min(pages, p + 1))}
                  disabled={pageNum >= pages}
                  className="p-2 rounded-lg hover:bg-accent disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
