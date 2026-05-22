import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";

export function UniversityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-strong rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto"
    >
      <div className="flex items-start gap-4 sm:gap-6 justify-between">
        <div className="flex-1 min-w-0 space-y-1">
          <EditableText
            contentKey="uni.name"
            defaultValue="جامعة السلطان قابوس"
            as="h2"
            className="text-xl sm:text-3xl font-extrabold gradient-title"
          />
          <EditableText
            contentKey="uni.college"
            defaultValue="كلية التربية"
            as="p"
            className="text-base sm:text-lg font-semibold text-foreground/80"
          />
          <EditableText
            contentKey="uni.dept"
            defaultValue="قسم المناهج وطرق التدريس"
            as="p"
            className="text-xs sm:text-sm text-muted-foreground"
          />
          <EditableText
            contentKey="uni.major"
            defaultValue="التربية الفنية"
            as="p"
            className="text-base sm:text-lg font-bold pt-1 bg-gradient-to-l from-violet to-primary bg-clip-text text-transparent"
          />
        </div>

        <EditableImage
          contentKey="uni.logo"
          defaultUrl=""
          fallback={
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-accent to-lavender flex items-center justify-center shadow-soft">
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
          }
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-soft shrink-0"
        />
      </div>
    </motion.div>
  );
}
