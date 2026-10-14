"use server";

import { redirect } from "next/navigation";

import {
  DEMO_ADMIN,
  isDemoAdminCredentials,
  isDemoMode,
} from "@/lib/auth/demo";
import {
  clearLoginFailures,
  getLoginLock,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";
import { createSession } from "@/lib/auth/session";
import { signInWithSupabase } from "@/lib/supabase/admin-auth";
import { isSupabaseAuthEnabled } from "@/lib/supabase/env";

export type LoginState = {
  error: string | null;
};

const INVALID = "Invalid email or password.";

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const memoryLock = getLoginLock(email);
  if (memoryLock.locked) {
    return {
      error: "Too many failed attempts. Try again in 10 minutes.",
    };
  }

  if (isSupabaseAuthEnabled()) {
    const { profile, error } = await signInWithSupabase(email, password);
    if (!profile) {
      recordLoginFailure(email);
      return { error: error === "Invalid login credentials" ? INVALID : error || INVALID };
    }

    clearLoginFailures(email);
    await createSession({
      userId: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
    });
    redirect("/admin");
  }

  if (
    isDemoAdminCredentials(email, password) ||
    (isDemoMode() && isDemoAdminCredentials(email, password))
  ) {
    clearLoginFailures(email);
    await createSession({
      userId: DEMO_ADMIN.id,
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: DEMO_ADMIN.role,
    });
    redirect("/admin");
  }

  recordLoginFailure(email);
  return { error: INVALID };
}

export async function logoutAction() {
  const { clearSession } = await import("@/lib/auth/session");
  await clearSession();
  redirect("/admin");
}
