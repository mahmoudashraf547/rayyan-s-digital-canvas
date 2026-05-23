import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";

import { ProfileMetadataHome } from "./ProfileMetadataHome";

export function UniversityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-strong rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto overflow-hidden"
    >
      {/* Main layout container with RTL support */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 sm:gap-8">
        
        {/* Text content - RIGHT side (in RTL) */}
        <div className="flex-1 min-w-0 space-y-3 order-1 sm:order-2 text-center sm:text-right">

          <div>
            <EditableText
              contentKey="uni.name"
              defaultValue="جامعة السلطان قابوس"
              as="h2"
              className="text-2xl sm:text-4xl font-extrabold gradient-title leading-tight"
            />
          </div>
          
          <div className="space-y-2 pt-1">
            <EditableText
              contentKey="uni.college"
              defaultValue="كلية التربية"
              as="p"
              className="text-lg sm:text-xl font-semibold text-foreground/90"
            />
            <EditableText
              contentKey="uni.dept"
              defaultValue="قسم المناهج وطرق التدريس"
              as="p"
              className="text-sm sm:text-base text-muted-foreground font-medium"
            />
          </div>

          <div className="pt-2">
            <EditableText
              contentKey="uni.major"
              defaultValue="التربية الفنية"
              as="p"
              className="text-lg sm:text-xl font-bold bg-gradient-to-l from-violet to-primary bg-clip-text text-transparent"
            />
          </div>

          <ProfileMetadataHome />
        </div>


        {/* Premium Logo Container - LEFT side (in RTL) */}
        <motion.div
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="order-2 sm:order-1 shrink-0"
        >
          {/* Gradient border effect container */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {/* Gradient border background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet/40 via-primary/30 to-accent/40 p-1 opacity-80"></div>
            
            {/* Glass card with content */}
            <div className="absolute inset-0 rounded-3xl p-1">
              <div className="w-full h-full rounded-[1.375rem] bg-gradient-to-br from-white/95 via-accent/20 to-lavender/20 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-elegant overflow-hidden">
                <EditableImage
                  contentKey="uni.logo"
                  defaultUrl=""
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-14 h-14 sm:w-16 sm:h-16 text-primary/60" />
                    </div>
                  }
                  className="w-full h-full object-contain p-4 sm:p-5"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
