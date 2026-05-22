import { motion } from "framer-motion";
import { type SiteItem } from "@/lib/items";
import { ItemEditor } from "./ItemEditor";
import { AdminControls } from "./AdminControls";
import { FileUploadZone } from "./FileUploadZone";

interface Props {
  item: SiteItem;
  canEdit: boolean;
  onDelete: () => void;
  onUpdateTitle: (title: string) => void;
  onUpdateDescription: (desc: string) => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onUploadFile?: (file: File) => void;
  autoFocus?: boolean;
}

export function ItemCard({
  item,
  canEdit,
  onDelete,
  onUpdateTitle,
  onUpdateDescription,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onUploadFile,
  autoFocus = false,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={canEdit ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="group glass rounded-3xl p-5 sm:p-6 border border-white/40 hover:shadow-elegant transition-shadow"
    >
      <div className="space-y-4">
        {/* Content Editor */}
        <ItemEditor
          title={item.title ?? ""}
          description={item.description ?? ""}
          onSaveTitle={onUpdateTitle}
          onSaveDescription={onUpdateDescription}
          canEdit={canEdit}
          autoFocus={autoFocus}
        />

        {/* File area */}
        {!item.file_url && onUploadFile && (
          <FileUploadZone
            onFileSelect={onUploadFile}
            canEdit={canEdit}
          />
        )}

        {/* Admin controls */}
        {canEdit && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <AdminControls
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              layout="horizontal"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
