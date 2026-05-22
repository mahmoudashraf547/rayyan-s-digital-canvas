import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, TABS, type TabId } from "@/components/Navbar";
import { UniversityCard } from "@/components/UniversityCard";
import { Hero } from "@/components/Hero";
import { EditableText } from "@/components/EditableText";
import { SectionWrap, GlassCard } from "@/components/SectionWrap";
import { FileSection } from "@/components/FileSection";
import { ContactSection } from "@/components/ContactSection";
import { DynamicSubsections } from "@/components/DynamicSubsections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ملف التدريب الميداني — ريّان النبهاني" },
      { name: "description", content: "ملف إنجاز للمعلم الطالب ريّان النبهاني — تخصص التربية الفنية، جامعة السلطان قابوس." },
      { property: "og:title", content: "ملف التدريب الميداني — ريّان النبهاني" },
      { property: "og:description", content: "ملف إنجاز فني تربوي تفاعلي." },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState<TabId>("home");
  const portfolioRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen">
      <Navbar active={tab} onChange={(t) => { setTab(t); window.scrollTo({ top: 0, behavior: "smooth" }); }} />

      <main className="px-3 sm:px-4 pb-24 max-w-6xl mx-auto">
        <div className="mt-4 mb-8">
          <UniversityCard />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {tab === "home" && <HomeTab onEnter={() => setTab("axis1")} portfolioRef={portfolioRef} />}
            {tab === "axis1" && <Axis1Tab />}
            {tab === "axis2" && <Axis2Tab />}
            {tab === "axis3" && <Axis3Tab />}
            {tab === "axis4" && <Axis4Tab />}
            {tab === "axis5" && <Axis5Tab />}
            {tab === "contact" && (
              <SectionWrap id="contact" title="تواصل معي" subtitle="أسعد بتلقي رسائلكم">
                <ContactSection />
                <DynamicSubsections />
              </SectionWrap>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="text-center py-8 text-xs text-muted-foreground">
        <EditableText contentKey="footer.text" defaultValue="© ريّان النبهاني — ملف التدريب الميداني" as="p" />
      </footer>
    </div>
  );
}

function HomeTab({ onEnter, portfolioRef }: { onEnter: () => void; portfolioRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="space-y-10">
      <Hero onEnter={onEnter} />

      <div ref={portfolioRef} className="grid sm:grid-cols-2 gap-4">
        <GlassCard>
          <h3 className="text-xl font-bold gradient-title mb-2">
            <EditableText contentKey="home.intro.title" defaultValue="مقدّمة" as="span" />
          </h3>
          <EditableText
            contentKey="home.intro.body"
            defaultValue="يضمّ هذا الملف خططًا تدريسية، أوراقًا تأمّلية، مشاريع طلابية، وأدلّة على تطوّري المهني خلال التربية الميدانية."
            as="p"
            className="text-sm text-foreground/75 leading-relaxed"
            multiline
          />
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-bold gradient-title mb-2">
            <EditableText contentKey="home.philosophy.title" defaultValue="فلسفتي في التدريس" as="span" />
          </h3>
          <EditableText
            contentKey="home.philosophy.body"
            defaultValue="أؤمن بأن تعليم الفن رحلة اكتشاف للذات، وأن المعلّم وسيط يفتح أمام طلابه نوافذ للتعبير والإبداع، ويوازن بين المعرفة التقنية والحرية الفنية."
            as="p"
            className="text-sm text-foreground/75 leading-relaxed"
            multiline
          />
        </GlassCard>
      </div>

      <SectionWrap id="cv" title="السيرة الذاتية">
        <FileSection sectionKey="home.cv" title="" emptyHint="لم تُرفع السيرة الذاتية بعد." />
      </SectionWrap>

      <SectionWrap id="reflections" title="الأوراق التأمّلية">
        <FileSection sectionKey="home.reflections" title="" emptyHint="لا توجد أوراق تأمّلية بعد." />
      </SectionWrap>

      <DynamicSubsections />
    </div>
  );
}

function Axis1Tab() {
  return (
    <SectionWrap id="axis1" title="الكفايات الأكاديمية والخبرة التخصصية" subtitle="المحور الأول">
      <FileSection sectionKey="axis1.unit" title="الوحدة التدريسية المطوّرة" />
      <FileSection sectionKey="axis1.reflection" title="الورقة التأمّلية للمحور" />
      <FileSection sectionKey="axis1.specialized" title="أوراق تأمّلية تخصصية (٣)" />
      <div className="pt-6 border-t border-border">
        <EditableText
          contentKey="section.axis1.moreSubjects.title"
          defaultValue="المساقات الأخرى"
          as="h3"
          className="text-xl font-bold gradient-title mb-4"
        />
        <div className="space-y-6">
          <FileSection sectionKey="axis1.curriculum" title="مساق المناهج" />
          <FileSection sectionKey="axis1.methods1" title="طرق التدريس ١" />
          <FileSection sectionKey="axis1.methods2" title="طرق التدريس ٢" />
          <FileSection sectionKey="axis1.projects" title="المشاريع الكبرى" />
        </div>
      </div>

      <DynamicSubsections />
    </SectionWrap>
  );
}

function Axis2Tab() {
  return (
    <SectionWrap id="axis2" title="التنوع في التدريس" subtitle="المحور الثاني">
      <FileSection sectionKey="axis2.reflection" title="الورقة التأمّلية للمحور" />
      <div>
        <EditableText
          contentKey="section.axis2.teachingPlans.title"
          defaultValue="خطط التدريس"
          as="h3"
          className="text-xl font-bold gradient-title mb-4"
        />
        <div className="space-y-6">
          <FileSection sectionKey="axis2.grade6" title="دروس الصف السادس" />
          <FileSection sectionKey="axis2.grade7" title="دروس الصف السابع" />
        </div>
      </div>
      <FileSection sectionKey="axis2.comprehensive" title="الورقة التأمّلية الشاملة" />
      <FileSection sectionKey="axis2.peer" title="أدلّة زيارة الأقران" />
      <FileSection sectionKey="axis2.parent" title="نموذج التواصل مع أولياء الأمور" />

      <DynamicSubsections />
    </SectionWrap>
  );
}

function Axis3Tab() {
  return (
    <SectionWrap id="axis3" title="القيم والاتجاهات المهنية" subtitle="المحور الثالث">
      <FileSection sectionKey="axis3.reflection" title="الورقة التأمّلية للمحور" />
      <FileSection sectionKey="axis3.philosophy" title="فلسفتي في التدريس" />
      <FileSection sectionKey="axis3.scenario" title="أداة تقييم المهنية القائمة على السيناريو" />
      <FileSection sectionKey="axis3.attendance" title="سجلّ الحضور والانصراف" />

      <DynamicSubsections />
    </SectionWrap>
  );
}

function Axis4Tab() {
  return (
    <SectionWrap id="axis4" title="ثقافة البحث والتعلّم مدى الحياة" subtitle="المحور الرابع">
      <FileSection sectionKey="axis4.reflection" title="الورقة التأمّلية للمحور" />
      <FileSection sectionKey="axis4.research" title="مشروع البحث الإجرائي" />
      <FileSection sectionKey="axis4.development" title="أدلّة التطوير المهني" />
      <FileSection sectionKey="axis4.workshops" title="خطط الورش الفنية" />
      <div className="pt-6 border-t border-border">
        <EditableText
          contentKey="section.axis4.previousProjects.title"
          defaultValue="المشاريع السابقة"
          as="h3"
          className="text-xl font-bold gradient-title mb-4"
        />
        <div className="space-y-6">
          <FileSection sectionKey="axis4.measurement" title="مشروع القياس والتقويم" />
          <FileSection sectionKey="axis4.psychology" title="مشروع علم النفس" />
          <FileSection sectionKey="axis4.special" title="مشروع ذوي الاحتياجات الخاصة" />
          <FileSection sectionKey="axis4.exhibitions" title="المعارض التخصصية" />
        </div>
      </div>

      <DynamicSubsections />
    </SectionWrap>
  );
}

function Axis5Tab() {
  return (
    <SectionWrap id="axis5" title="المهارات التقنية" subtitle="المحور الخامس">
      <FileSection sectionKey="axis5.reflection" title="الورقة التأمّلية للمحور" />
      <FileSection sectionKey="axis5.integration" title="توظيف التقنية في الخطط والدروس" />
      <FileSection sectionKey="axis5.software" title="مهارات البرامج والأجهزة" />
      <FileSection sectionKey="axis5.presentations" title="العروض التقديمية المميزة" />
      <FileSection sectionKey="axis5.worksheets" title="أوراق العمل" />

      <DynamicSubsections />
    </SectionWrap>
  );
}
