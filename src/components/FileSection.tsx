import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { useSiteItems } from "@/lib/items";
import { uploadFile, getFileTypeFromName } from "@/lib/storage";
import { FileCard } from "./FileCard";
import { AddItemButton } from "./AddItemButton";
import { EditableText } from "./EditableText";

interface Props {
  sectionKey: string;
  title: string;
  accept?: string;
  emptyHint?: string;
  layout?: "grid" | "list";
  hideTitle?: boolean;
  onDelete?: () => void;
}

export function FileSection({
  sectionKey,
  title,
  accept = ".pdf,.docx,.doc,.ppt,.pptx,.mp4,.webm,image/*",
  emptyHint,
  layout = "grid",
  hideTitle = false,
  onDelete,
}: Props) {
  const { isAdmin, editMode } = useAdmin();
  const { items, add, remove, update, duplicate, move } = useSiteItems(sectionKey);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(true);

  const canEdit = isAdmin && editMode;

  const handleDeleteSection = () => {
    setVisible(false);
    onDelete?.();
  };

  if (!visible) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        const type = getFileTypeFromName(f.name);
        const url = await uploadFile(f, sectionKey);
        await add({ title: f.name.replace(/\.[^.]+$/, ""), file_url: url, file_type: type });
      }
    } catch (e) {
      console.error(e);
      alert("فشل الرفع");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const createEmptyItem = async () => {
    try {
      await add({
        title: "عنصر جديد",
        description: "",
        file_type: "other",
      });
    } catch (e) {
      console.error(e);
      alert("فشل إنشاء العنصر");
    }
  };

  return (
    <div>
      {(canEdit || !hideTitle) && (
        <div className={`flex flex-wrap items-center justify-between mb-4 ${hideTitle && !canEdit ? "hidden" : ""}`}>
          {!hideTitle && (
            <EditableText
              contentKey={`section.${sectionKey}.title`}
              defaultValue={title}
              as="h3"
              className="text-xl sm:text-2xl font-bold gradient-title"
            />
          )}
          {canEdit && (
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <AddItemButton
                onClick={createEmptyItem}
                label="إضافة عنصر"
                size="sm"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl gradient-cta text-primary-foreground border-0"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                رفع ملف
              </button>
              <button
                type="button"
                onClick={handleDeleteSection}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                حذف القسم
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          {canEdit ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-3 mx-auto text-muted-foreground hover:text-primary transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/60 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm">اضغط لرفع الملفات أو اسحبها هنا</span>
              </button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs">أو</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <AddItemButton
                onClick={createEmptyItem}
                label="إنشاء عنصر جديد"
                size="md"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileText className="w-8 h-8 opacity-50" />
              <p className="text-sm italic">{emptyHint ?? "لا توجد عناصر بعد."}</p>
            </div>
          )}
        </motion.div>
      ) : (
        <div className={layout === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {items.map((it, idx) => (
            <FileCard
              key={it.id}
              item={it}
              canEdit={canEdit}
              onDelete={() => remove(it.id)}
              onRename={(t) => update(it.id, { title: t })}
              onDuplicate={canEdit ? () => duplicate(it.id) : undefined}
              onMoveUp={canEdit && idx > 0 ? () => move(it.id, -1) : undefined}
              onMoveDown={canEdit && idx < items.length - 1 ? () => move(it.id, 1) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
