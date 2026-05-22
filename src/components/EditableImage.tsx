import { type ReactNode, useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { useContentStore } from "@/lib/content";
import { uploadFile } from "@/lib/storage";

interface Props {
  contentKey: string;
  defaultUrl: string;
  className?: string;
  fallback?: ReactNode;
  alt?: string;
}

export function EditableImage({ contentKey, defaultUrl, className, fallback, alt }: Props) {
  const { isAdmin, editMode } = useAdmin();
  const { get, set } = useContentStore();
  const url = get(contentKey, defaultUrl);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const canEdit = isAdmin && editMode;

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const publicUrl = await uploadFile(f, "images");
      await set(contentKey, publicUrl);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const showImage = url && url.length > 0;

  return (
    <div className={`relative group ${canEdit ? "cursor-pointer" : ""}`} onClick={() => canEdit && fileRef.current?.click()}>
      {showImage ? (
        <img src={url} alt={alt ?? ""} className={className} loading="lazy" />
      ) : (
        fallback ?? <div className={`${className} bg-muted`} />
      )}
      {canEdit && (
        <>
          <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-white">
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium">تغيير</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
        </>
      )}
    </div>
  );
}
