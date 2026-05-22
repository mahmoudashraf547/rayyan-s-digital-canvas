import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "admin@portfolio.local";
const ADMIN_PASSWORD = "rayan123";

/**
 * Idempotently ensure the single admin account exists.
 * Called once on app load so the static credentials always work.
 */
export const ensureAdmin = createServerFn({ method: "POST" }).handler(async () => {
  // List existing users (filter by email)
  const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listErr) throw new Error(listErr.message);

  const existing = list.users.find((u) => u.email === ADMIN_EMAIL);
  if (existing) {
    return { ok: true, created: false };
  }

  const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { role: "admin", username: "admin" },
  });
  if (createErr) throw new Error(createErr.message);
  return { ok: true, created: true };
});
