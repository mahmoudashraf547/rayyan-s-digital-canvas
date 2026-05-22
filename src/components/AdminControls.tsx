import { motion } from "framer-motion";
import { Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  layout?: "horizontal" | "vertical";
  className?: string;
}

export function AdminControls({
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  layout = "horizontal",
  className = "",
}: Props) {
  const controls = [
    { icon: Copy, label: "نسخ", action: onDuplicate, color: "text-blue-600" },
    { icon: ArrowUp, label: "أعلى", action: onMoveUp, color: "text-green-600" },
    { icon: ArrowDown, label: "أسفل", action: onMoveDown, color: "text-orange-600" },
    { icon: Trash2, label: "حذف", action: onDelete, color: "text-red-600" },
  ].filter((c) => c.action);

  if (controls.length === 0) return null;

  const isVertical = layout === "vertical";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex ${isVertical ? "flex-col" : "flex-row"} gap-1.5 ${className}`}
    >
      {controls.map((ctrl, idx) => {
        const Icon = ctrl.icon;
        return (
          <motion.button
            key={ctrl.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={ctrl.action}
            className={`p-2 rounded-lg bg-white/70 hover:bg-white border border-white/40 shadow-soft hover:shadow-elegant transition ${ctrl.color}`}
            aria-label={ctrl.label}
            title={ctrl.label}
          >
            <Icon className="w-4 h-4" />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
