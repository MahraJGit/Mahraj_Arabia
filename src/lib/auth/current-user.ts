import { DEMO_ADMIN, isDemoMode } from "@/lib/auth/demo";
import { readSession } from "@/lib/auth/session";
import type { AdminUser, UserRole } from "@/lib/cms/types";
import { getAdminProfileById } from "@/lib/supabase/admin-auth";
import { isSupabaseAuthEnabled } from "@/lib/supabase/env";

export async function getCurrentUser(): Promise<AdminUser | null> {
  const session = await readSession();
  if (!session) return null;

  if (isSupabaseAuthEnabled()) {
    const profile = await getAdminProfileById(session.userId);
    if (!profile) return null;
    return profile;
  }

  if (isDemoMode() || session.userId === DEMO_ADMIN.id) {
    return {
      id: DEMO_ADMIN.id,
      name: session.name || DEMO_ADMIN.name,
      email: session.email || DEMO_ADMIN.email,
      role: session.role === "admin" ? "admin" : "editor",
    };
  }

  return null;
}

export function isAdmin(role: UserRole) {
  return role === "admin";
}
