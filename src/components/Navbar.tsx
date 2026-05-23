import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { EditableText } from "./EditableText";
import { useContentStore } from "@/lib/content";

export const TABS = [
  { id: "home", label: "الرئيسية" },
  { id: "axis1", label: "الكفايات الأكاديمية" },
  { id: "axis2", label: "التنوع في التدريس" },
  { id: "axis3", label: "القيم المهنية" },
  { id: "axis4", label: "ثقافة البحث" },
  { id: "axis5", label: "المهارات التقنية" },
  { id: "contact", label: "تواصل" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function Navbar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  const { get } = useContentStore();
  const tabLabel = (id: TabId, fallback: string) => get(`tab.${id}.label`, fallback);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "py-2" : "py-3"}`}>
      <div className="px-3 sm:px-4">
        <div className={`glass rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between max-w-6xl mx-auto transition-all ${scrolled ? "shadow-elegant" : ""}`}>
          <EditableText
            contentKey="brand.title"
            defaultValue="ملف الإنجاز"
            as="span"
            className="font-extrabold text-lg sm:text-xl gradient-title"
          />

          <nav className="hidden lg:flex items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition ${
                  active === t.id ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {active === t.id && (
                  <motion.span
                    layoutId="tabPill"
                    className="absolute inset-0 gradient-cta rounded-xl"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{tabLabel(t.id, t.label)}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-accent transition"
            aria-label="القائمة"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-2 px-3"
          >
            <div className="glass-strong rounded-2xl p-2 max-w-6xl mx-auto grid grid-cols-2 gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { onChange(t.id); setOpen(false); }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium text-right transition ${
                    active === t.id ? "gradient-cta text-primary-foreground" : "hover:bg-accent"
                  }`}
                >
                  {tabLabel(t.id, t.label)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
