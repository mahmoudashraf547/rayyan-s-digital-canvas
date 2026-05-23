import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, LogOut, Settings, Eye, ShieldCheck, Layers } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { TabNamesEditor } from "./TabNamesEditor";

export function AdminBar() {
  const { isAdmin, editMode, setEditMode, logout, setLoginOpen } = useAdmin();
  const [tabEditorOpen, setTabEditorOpen] = useState(false);

  if (!isAdmin) {
    return (
      <motion.button
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setLoginOpen(true)}
        className="fixed bottom-4 left-4 z-50 glass rounded-full p-3 hover:scale-110 transition shadow-lg"
        aria-label="دخول المدير"
        title="دخول المدير"
      >
        <Settings className="w-5 h-5 text-primary" />
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-4 left-4 z-50 glass-strong rounded-2xl px-3 py-2 flex items-center gap-2"
      >
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/60">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">المدير</span>
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
            editMode ? "gradient-cta text-primary-foreground" : "bg-accent/60 hover:bg-accent"
          }`}
        >
          {editMode ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          {editMode ? "معاينة" : "تحرير الموقع"}
        </button>

        <button
          onClick={() => setTabEditorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-accent/60 hover:bg-accent transition"
          title="تحرير أسماء التبويبات"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">التبويبات</span>
        </button>

        <button
          onClick={logout}
          className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition"
          aria-label="خروج"
          title="خروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </motion.div>

      <TabNamesEditor open={tabEditorOpen} onClose={() => setTabEditorOpen(false)} />
    </>
  );
}
