import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { EditableText } from "./EditableText";

export function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative watercolor-bg px-4 pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Floating decorative blobs */}
      <div className="absolute top-10 right-8 w-32 h-32 rounded-full bg-sky/40 blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-lavender/50 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 pill-badge"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <EditableText contentKey="hero.badge" defaultValue="التخصص: التربية الفنية" as="span" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EditableText
            contentKey="hero.title"
            defaultValue="ملف التدريب الميداني"
            as="h1"
            className="text-4xl sm:text-6xl font-extrabold gradient-title leading-tight"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <EditableText
            contentKey="hero.subtitle"
            defaultValue="للمعلم الطالب: ريّان النبهاني"
            as="h2"
            className="text-xl sm:text-2xl font-bold text-foreground/85"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-xl mx-auto"
        >
          <EditableText
            contentKey="hero.description"
            defaultValue="مساحة تجمع بين الإبداع الفني والممارسة التربوية، توثّق نموّي المهني وتعكس فلسفتي في تعليم الفن."
            as="p"
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            multiline
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onEnter}
            className="gradient-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-base"
          >
            ادخل إلى الملف
            <ArrowLeft className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
