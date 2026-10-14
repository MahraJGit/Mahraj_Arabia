"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { createSession } from "@/lib/auth/session";
import {
  changeAdminPassword,
  isSupabaseAdminEnabled,
  updateAdminProfile,
} from "@/lib/supabase/content";

export type ProfileState = {
  error: string | null;
  field: "name" | "email" | null;
  success: string | null;
  savedAt: number | null;
  name?: string;
  email?: string;
};

export type PasswordState = {
  error: string | null;
  field: "current" | "new" | "confirm" | null;
  success: string | null;
  savedAt: number | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser();
  if (isDemoMode()) {
    return {
      error: demoWriteBlockedMessage()!,
      field: null,
      success: null,
      savedAt: null,
    };
  }
  const name = String(formData.get("name") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (name.length < 2 || name.length > 80) {
    return {
      error: "Name must be between 2 and 80 characters.",
      field: "name",
      success: null,
      savedAt: null,
    };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    return {
      error: "Enter a valid email address.",
      field: "email",
      success: null,
      savedAt: null,
    };
  }

  if (!isSupabaseAdminEnabled()) {
    return {
      error: "Supabase is not configured for profile updates.",
      field: null,
      success: null,
      savedAt: null,
    };
  }

  const result = await updateAdminProfile({
    userId: user.id,
    name,
    email,
    role: user.role,
  });
  if (result.error) {
    return {
      error: result.error,
      field: result.field ?? null,
      success: null,
      savedAt: null,
    };
  }

  await createSession({
    userId: user.id,
    email,
    name,
    role: user.role,
  });

  revalidatePath("/admin", "layout");
  revalidatePath("/admin/profile");

  return {
    error: null,
    field: null,
    success: "Profile updated.",
    savedAt: Date.now(),
    name,
    email,
  };
}

export async function changePassword(
  _prev: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const user = await requireUser();
  if (isDemoMode()) {
    return {
      error: demoWriteBlockedMessage()!,
      field: null,
      success: null,
      savedAt: null,
    };
  }
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) {
    return {
      error: "Enter your current password.",
      field: "current",
      success: null,
      savedAt: null,
    };
  }

  if (newPassword.length < 8 || newPassword.length > 128) {
    return {
      error: "New password must be between 8 and 128 characters.",
      field: "new",
      success: null,
      savedAt: null,
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      error: "New password and confirmation do not match.",
      field: "confirm",
      success: null,
      savedAt: null,
    };
  }

  if (newPassword === currentPassword) {
    return {
      error: "New password must be different from your current password.",
      field: "new",
      success: null,
      savedAt: null,
    };
  }

  if (!isSupabaseAdminEnabled()) {
    return {
      error: "Supabase is not configured for password changes.",
      field: null,
      success: null,
      savedAt: null,
    };
  }

  const result = await changeAdminPassword({
    email: user.email,
    currentPassword,
    newPassword,
    userId: user.id,
  });
  if (result.error) {
    return {
      error: result.error,
      field: result.field ?? null,
      success: null,
      savedAt: null,
    };
  }

  return {
    error: null,
    field: null,
    success: "Password changed.",
    savedAt: Date.now(),
  };
}
