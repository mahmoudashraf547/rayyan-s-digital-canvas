import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, User } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { Button } from "@/components/ui/button";

export function LoginModal() {
  const { loginOpen, setLoginOpen, login, setEditMode } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await login(username.trim(), password);
    setLoading(false);
    if (res.ok) {
      setLoginOpen(false);
      setEditMode(true);
      setUsername("");
      setPassword("");
    } else {
      setErr(res.error ?? "خطأ");
    }
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/30 backdrop-blur-md p-4"
          onClick={() => setLoginOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass-strong rounded-3xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLoginOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-accent transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-2xl gradient-cta items-center justify-center mb-3">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold gradient-title">دخول المدير</h2>
              <p className="text-sm text-muted-foreground mt-1">سجّل الدخول لتفعيل وضع التحرير</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">اسم المستخدم</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pr-10 pl-3 py-3 rounded-xl bg-input/60 border border-border outline-none focus:ring-2 focus:ring-ring"
                    placeholder="admin"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-3 py-3 rounded-xl bg-input/60 border border-border outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {err && <p className="text-sm text-destructive text-center">{err}</p>}

              <Button type="submit" disabled={loading} className="w-full gradient-cta border-0 py-6 rounded-xl text-base font-semibold">
                {loading ? "جاري الدخول…" : "دخول"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
