import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Pencil } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  onSaveTitle: (title: string) => void;
  onSaveDescription?: (desc: string) => void;
  canEdit: boolean;
  autoFocus?: boolean;
}

export function ItemEditor({
  title,
  description = "",
  onSaveTitle,
  onSaveDescription,
  canEdit,
  autoFocus = false,
}: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [titleVal, setTitleVal] = useState(title);
  const [descVal, setDescVal] = useState(description);

  useEffect(() => {
    if (autoFocus) {
      setEditingTitle(true);
    }
  }, [autoFocus]);

  const handleSaveTitle = () => {
    onSaveTitle(titleVal || "بدون عنوان");
    setEditingTitle(false);
  };

  const handleSaveDesc = () => {
    onSaveDescription?.(descVal);
    setEditingDesc(false);
  };

  return (
    <div className="space-y-3">
      {/* Title */}
      {editingTitle && canEdit ? (
        <div className="flex items-center gap-2">
          <input
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            className="flex-1 text-lg font-semibold bg-accent/40 border border-primary/40 rounded-lg px-3 py-2 outline-none"
            autoFocus
            placeholder="العنوان"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveTitle}
            className="p-2 rounded-lg text-green-600 bg-white/70 hover:bg-white border border-white/40 transition"
          >
            <Check className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setTitleVal(title);
              setEditingTitle(false);
            }}
            className="p-2 rounded-lg text-red-600 bg-white/70 hover:bg-white border border-white/40 transition"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      ) : (
        <button
          onClick={() => canEdit && setEditingTitle(true)}
          className="group flex items-center justify-between w-full text-left hover:bg-accent/30 rounded-lg px-2 py-1.5 transition"
        >
          <h4 className="font-semibold text-lg">{titleVal || "بدون عنوان"}</h4>
          {canEdit && <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-primary" />}
        </button>
      )}

      {/* Description */}
      {onSaveDescription && (
        editingDesc && canEdit ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={descVal}
              onChange={(e) => setDescVal(e.target.value)}
              className="flex-1 text-sm bg-accent/40 border border-primary/40 rounded-lg px-3 py-2 outline-none min-h-[80px] resize-none"
              placeholder="الوصف"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveDesc}
                className="px-3 py-1.5 rounded-lg text-green-600 bg-white/70 hover:bg-white border border-white/40 text-sm font-medium transition"
              >
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setDescVal(description);
                  setEditingDesc(false);
                }}
                className="px-3 py-1.5 rounded-lg text-red-600 bg-white/70 hover:bg-white border border-white/40 text-sm font-medium transition"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => canEdit && setEditingDesc(true)}
            className={`group flex items-start justify-between w-full text-left rounded-lg px-2 py-1.5 transition ${
              descVal ? "hover:bg-accent/30 text-sm text-foreground/75" : "text-xs text-muted-foreground italic"
            }`}
          >
            <span>{descVal || "أضف وصفًا..."}</span>
            {canEdit && <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-primary ml-2 shrink-0" />}
          </button>
        )
      )}
    </div>
  );
}
