import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2 } from "lucide-react";
import { TABS } from "./Navbar";
import { useContentStore } from "@/lib/content";

export function TabNamesEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { get, set } = useContentStore();
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const d: Record<string, string> = {};
    TABS.forEach((t) => (d[t.id] = get(`tab.${t.id}.label`, t.label)));
    return d;
  });

  const save = async () => {
    await Promise.all(
      TABS.map((t) =>
        drafts[t.id] !== get(`tab.${t.id}.label`, t.label)
          ? set(`tab.${t.id}.label`, drafts[t.id])
          : Promise.resolve(),
      ),
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold gradient-title">تحرير أسماء التبويبات</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent" aria-label="إغلاق">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {TABS.map((t) => (
                <div key={t.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    {t.label}
                  </label>
                  <input
                    value={drafts[t.id] ?? ""}
                    onChange={(e) => setDrafts((p) => ({ ...p, [t.id]: e.target.value }))}
                    className="w-full bg-accent/40 border border-primary/30 rounded-xl px-3 py-2 outline-none focus:border-primary text-sm"
                    dir="rtl"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={save}
                className="flex-1 gradient-cta px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                حفظ
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-accent/60 hover:bg-accent"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
