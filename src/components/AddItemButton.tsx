import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "floating" | "inline";
  loading?: boolean;
}

export function AddItemButton({
  onClick,
  label = "إضافة عنصر جديد",
  size = "md",
  variant = "inline",
  loading = false,
}: Props) {
  if (variant === "floating") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={loading}
        className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-gradient-to-br from-primary to-violet shadow-elegant hover:shadow-[0_20px_60px_-20px_oklch(0.45_0.22_275_/_0.5)] text-primary-foreground transition group"
      >
        <motion.div
          animate={loading ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    );
  }

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 font-medium rounded-xl gradient-cta text-primary-foreground border-0 transition disabled:opacity-50 ${sizeClasses[size]}`}
    >
      <motion.div
        animate={loading ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
      >
        <Plus className="w-4 h-4" />
      </motion.div>
      {label}
    </motion.button>
  );
}
