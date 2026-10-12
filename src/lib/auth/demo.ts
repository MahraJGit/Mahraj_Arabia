/** Demo CMS mode when Supabase CMS is not configured. */

import { isSupabaseContentEnabled } from "@/lib/supabase/content/enabled";

export const DEMO_ADMIN = {
  id: "demo-admin-001",
  email: "admin@mahrajarabia.com",
  password: "Admin@123",
  name: "Mahraj Arabia Admin",
  role: "admin" as const,
};

export const DEMO_AUTH_SECRET =
  "mahraj-arabia-demo-auth-secret-change-in-production";

export function isDemoMode() {
  return !isSupabaseContentEnabled();
}

export function isDemoAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_ADMIN.email &&
    password === DEMO_ADMIN.password
  );
}
