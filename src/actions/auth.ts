"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";
import {
  DEMO_ADMIN,
  isDemoAdminCredentials,
  isDemoMode,
} from "@/lib/auth/demo";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  clearLoginFailures,
  getLoginLock,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";
import { createSession } from "@/lib/auth/session";
import { getModels } from "@/lib/db/models";
import { toId } from "@/lib/db/ids";
import type { UserRole } from "@/lib/cms/types";
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

  if (isDemoMode()) {
    recordLoginFailure(email);
    return { error: INVALID };
  }

  const { User } = await getModels();
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const user = await User.findOne({
    email: { $regex: `^${escaped}$`, $options: "i" },
  })
    .select("name email role hash salt loginAttempts lockUntil")
    .lean();

  if (!user) {
    recordLoginFailure(email);
    return { error: INVALID };
  }

  const lockUntil =
    user.lockUntil instanceof Date ? user.lockUntil.getTime() : 0;
  if (lockUntil && lockUntil > Date.now()) {
    return {
      error: "This account is temporarily locked. Try again later.",
    };
  }

  const verified = await verifyPassword({
    password,
    hash: typeof user.hash === "string" ? user.hash : null,
    salt: typeof user.salt === "string" ? user.salt : null,
  });

  if (!verified) {
    const result = recordLoginFailure(email);
    const attempts = Number(user.loginAttempts ?? 0) + 1;
    const locked = result.locked
      ? new Date(Date.now() + 10 * 60 * 1000)
      : null;

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          loginAttempts: attempts,
          ...(locked ? { lockUntil: locked } : {}),
        },
      }
    );

    return { error: INVALID };
  }

  clearLoginFailures(email);

  if (verified === "payload") {
    const next = await hashPassword(password);
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          hash: next.hash,
          salt: next.salt,
          loginAttempts: 0,
          lockUntil: null,
        },
      }
    );
  } else {
    await User.updateOne(
      { _id: user._id },
      { $set: { loginAttempts: 0, lockUntil: null } }
    );
  }

  const role: UserRole = user.role === "admin" ? "admin" : "editor";

  await createSession({
    userId: toId(user._id),
    email: typeof user.email === "string" ? user.email : email,
    name: typeof user.name === "string" ? user.name : "Mahraj user",
    role,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const { clearSession } = await import("@/lib/auth/session");
  await clearSession();
  redirect("/admin");
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}
