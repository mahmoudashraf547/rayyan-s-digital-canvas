import { EditableText } from "@/components/EditableText";

function Field({ label, contentKey, defaultValue }: { label: string; contentKey: string; defaultValue: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-xs sm:text-[13px] text-muted-foreground/90 font-medium whitespace-nowrap">{label}</div>
      <div className="min-w-0 flex-1">
        <EditableText
          contentKey={contentKey}
          defaultValue={defaultValue}
          as="p"
          className="text-xs sm:text-sm text-foreground/90 font-semibold"
        />
      </div>
    </div>
  );
}

export function ProfileMetadataHome() {
  return (
    <div className="mt-6 rounded-2xl border border-border/80 bg-white/40 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.06)] p-4 sm:p-6">
      <div className="mb-3">
        <div className="text-sm sm:text-base font-bold text-foreground/80">معلومات الملف الشخصي</div>
        <div className="text-xs text-muted-foreground">يمكنك تعديل البيانات مباشرة من الصفحة</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <Field label="اسم المرشح" contentKey="home.profile.candidateName" defaultValue="اسم المرشح" />
        <Field label="الرقم الجامعي" contentKey="home.profile.universityId" defaultValue="الرقم الجامعي" />
        <Field label="اسم مدرسة التدريب" contentKey="home.profile.trainingSchool" defaultValue="اسم مدرسة التدريب" />
        <Field label="اسم المشرف" contentKey="home.profile.supervisorName" defaultValue="اسم المشرف" />
        <Field label="اسم المعلم المتعاون" contentKey="home.profile.cooperatingTeacherName" defaultValue="اسم المعلم المتعاون" />
      </div>
    </div>
  );
}

