import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
  canEdit: boolean;
  loading?: boolean;
}

export function FileUploadZone({ onFileSelect, canEdit, loading = false }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  if (!canEdit) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
        dragging
          ? "border-primary bg-primary/5"
          : "border-accent/40 hover:border-primary/40"
      }`}
    >
      <input
        ref={fileRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        disabled={loading}
      />
      <div className="flex flex-col items-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">جارٍ الرفع...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">اسحب ملفًا أو اضغط للرفع</span>
          </>
        )}
      </div>
    </motion.div>
  );
}
