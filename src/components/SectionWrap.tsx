import { type ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { EditableText } from "./EditableText";

interface SectionWrapProps {
  id: string;
  title: string;
  subtitle?: string;
  onDelete?: () => void;
  children: ReactNode;
}

export function SectionWrap({ id, title, subtitle, onDelete, children }: SectionWrapProps) {
  const { isAdmin, editMode } = useAdmin();
  const [visible, setVisible] = useState(true);
  const canDelete = Boolean(isAdmin && editMode);

  const handleDelete = () => {
    setVisible(false);
    onDelete?.();
  };

  if (!visible) return null;

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <EditableText
            contentKey={`section.${id}.title`}
            defaultValue={title}
            as="h2"
            className="text-2xl sm:text-3xl font-extrabold gradient-title"
          />
          {subtitle && (
            <EditableText
              contentKey={`section.${id}.subtitle`}
              defaultValue={subtitle}
              as="p"
              className="text-sm text-muted-foreground mt-1"
            />
          )}
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            حذف القسم
          </button>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-3xl p-5 sm:p-7 floating-card ${className}`}>
      {children}
    </div>
  );
}
