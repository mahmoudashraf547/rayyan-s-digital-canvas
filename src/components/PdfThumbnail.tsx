import { useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import { FileText } from "lucide-react";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const cache = new Map<string, string>();

interface Props {
  url: string;
  className?: string;
  /** Render scale multiplier (higher = sharper). */
  scale?: number;
}

export function PdfThumbnail({ url, className, scale = 1.4 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(cache.get(url) ?? null);
  const [error, setError] = useState(false);
  const [pages, setPages] = useState<number | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const cached = cache.get(url);
    if (cached) {
      setDataUrl(cached);
    }

    (async () => {
      try {
        const loading = pdfjs.getDocument(url);
        const doc = await loading.promise;
        if (cancelled) return;
        setPages(doc.numPages);

        if (cached) return;

        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        ctx.scale(dpr, dpr);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        if (cancelled) return;
        const data = canvas.toDataURL("image/jpeg", 0.85);
        cache.set(url, data);
        setDataUrl(data);
      } catch (e) {
        console.error("PDF thumbnail failed", e);
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, scale]);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {/* Skeleton */}
      {!dataUrl && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-lavender/40 to-accent/40 animate-pulse flex items-center justify-center">
          <FileText className="w-10 h-10 text-primary/30" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col items-center justify-center gap-1 text-rose-500">
          <FileText className="w-8 h-8" />
          <span className="text-[10px]">تعذر التحميل</span>
        </div>
      )}
      {dataUrl && (
        <img
          src={dataUrl}
          alt="PDF preview"
          loading="lazy"
          className="w-full h-full object-cover object-top"
        />
      )}
      {pages !== null && dataUrl && (
        <span className="absolute bottom-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-foreground/70 text-white backdrop-blur-sm">
          {pages} {pages === 1 ? "صفحة" : "صفحات"}
        </span>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
