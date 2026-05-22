import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2 } from "lucide-react";
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
  const [width, setWidth] = useState(800);

  useEffect(() => {
    if (!url) return;

    const updateWidth = () => {
      const w = typeof window !== "undefined" ? Math.min(window.innerWidth - 64, 900) : 800;
      setWidth(w);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", updateWidth);
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

            <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
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
                <div className="flex flex-col items-center gap-6">
                  {Array.from({ length: pages }, (_, index) => (
                    <div key={index} className="w-full flex justify-center">
                      <div className="w-full max-w-[900px] rounded-[28px] overflow-hidden shadow-soft bg-white">
                        <Page
                          pageNumber={index + 1}
                          width={width}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Document>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
