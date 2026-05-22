import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureAdmin } from "@/lib/admin.functions";

interface AdminCtx {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
}

const Ctx = createContext<AdminCtx | null>(null);
const ADMIN_EMAIL = "admin@portfolio.local";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    // Ensure admin account exists (idempotent)
    ensureAdmin().catch((e) => console.error("ensureAdmin failed", e));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAdmin(!!session?.user);
      if (!session?.user) setEditMode(false);
    });
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session?.user));
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const email = username.includes("@") ? username : (username === "admin" ? ADMIN_EMAIL : `${username}@portfolio.local`);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: "بيانات الدخول غير صحيحة" };
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setEditMode(false);
  }, []);

  return (
    <Ctx.Provider value={{ isAdmin, editMode, setEditMode, login, logout, loginOpen, setLoginOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AdminProvider missing");
  return ctx;
}
