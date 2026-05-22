import { type ReactNode } from "react";
import { motion } from "framer-motion";

export function SectionWrap({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold gradient-title">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
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
