import { motion } from "framer-motion";
import { EditableText } from "./EditableText";

const FIELDS: { key: string; label: string; defaultValue: string }[] = [
  { key: "profile.candidate", label: "اسم المرشح", defaultValue: "ريّان النبهاني" },
  { key: "profile.studentId", label: "الرقم الجامعي", defaultValue: "—" },
  { key: "profile.school", label: "مدرسة التدريب", defaultValue: "—" },
  { key: "profile.supervisor", label: "المشرف", defaultValue: "—" },
  { key: "profile.mentor", label: "المعلم المتعاون", defaultValue: "—" },
];

export function ProfileMetadata() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-3xl p-5 sm:p-6 max-w-4xl mx-auto"
      dir="rtl"
    >
      <h3 className="text-sm font-bold text-primary/80 mb-4 tracking-wide">
        البيانات التعريفية
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-l from-accent/30 to-lavender/20 border border-white/40 px-3.5 py-2.5"
          >
            <span className="text-xs font-semibold text-muted-foreground shrink-0">
              {f.label}
            </span>
            <EditableText
              contentKey={f.key}
              defaultValue={f.defaultValue}
              as="span"
              className="text-xs sm:text-sm font-medium text-foreground/90 text-left truncate"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
