import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { EditableText } from "./EditableText";

interface Comment { id: string; name: string; message: string; created_at: string }

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("comments").select("id, name, message, created_at").eq("approved", true).order("created_at", { ascending: false }).limit(20);
      setComments((data ?? []) as Comment[]);
    };
    load();
    const ch = supabase.channel("comments_pub").on("postgres_changes", { event: "*", schema: "public", table: "comments" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("comments").insert({ name: name.trim(), email: email.trim() || null, message: message.trim() });
    setSending(false);
    if (!error) {
      setSent(true);
      setName(""); setEmail(""); setMessage("");
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.a
          href="mailto:rayyanalnabhani23@gmail.com"
          whileHover={{ y: -3 }}
          className="glass rounded-2xl p-5 flex items-center gap-4 floating-card"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky to-lavender flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
            <EditableText contentKey="contact.email" defaultValue="rayyanalnabhani23@gmail.com" as="p" className="font-semibold text-sm truncate" />
          </div>
        </motion.a>
        <motion.a
          href="tel:+96897550512"
          whileHover={{ y: -3 }}
          className="glass rounded-2xl p-5 flex items-center gap-4 floating-card"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lavender to-accent flex items-center justify-center">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">الهاتف</p>
            <EditableText contentKey="contact.phone" defaultValue="97550512" as="p" className="font-semibold text-sm" />
          </div>
        </motion.a>
      </div>

      <div className="glass-strong rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold gradient-title mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> اترك رسالة
        </h3>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" required maxLength={80} className="px-4 py-3 rounded-xl bg-input/60 border border-border outline-none focus:ring-2 focus:ring-ring" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد (اختياري)" type="email" className="px-4 py-3 rounded-xl bg-input/60 border border-border outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="رسالتك…" rows={4} required maxLength={2000} className="w-full px-4 py-3 rounded-xl bg-input/60 border border-border outline-none focus:ring-2 focus:ring-ring resize-none" />
          <button type="submit" disabled={sending} className="gradient-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sent ? "تم الإرسال ✓" : "إرسال"}
          </button>
        </form>
      </div>

      {comments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground/80">رسائل الزوار</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {comments.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-4">
                <p className="font-semibold text-sm text-primary">{c.name}</p>
                <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">{c.message}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{new Date(c.created_at).toLocaleDateString("ar")}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
