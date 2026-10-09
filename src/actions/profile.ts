"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/actions/auth";
import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { asObjectId, isObjectId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

  if (isSupabaseAdminEnabled()) {
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
  } else {
    if (!isObjectId(user.id)) {
      return {
        error: "Your account could not be found.",
        field: null,
        success: null,
        savedAt: null,
      };
    }

    const { User } = await getModels();
    const taken = await User.findOne({
      _id: { $ne: asObjectId(user.id) },
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    })
      .select("_id")
      .lean();

    if (taken) {
      return {
        error: "Another account already uses this email.",
        field: "email",
        success: null,
        savedAt: null,
      };
    }

    await User.updateOne({ _id: asObjectId(user.id) }, { $set: { name, email } });
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

  if (isSupabaseAdminEnabled()) {
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

  if (!isObjectId(user.id)) {
    return {
      error: "Your account could not be found.",
      field: null,
      success: null,
      savedAt: null,
    };
  }

  const { User } = await getModels();
  const doc = await User.findById(asObjectId(user.id)).select("hash salt").lean();
  const verified = await verifyPassword({
    password: currentPassword,
    hash: typeof doc?.hash === "string" ? doc.hash : null,
    salt: typeof doc?.salt === "string" ? doc.salt : null,
  });

  if (!verified) {
    return {
      error: "Current password is incorrect.",
      field: "current",
      success: null,
      savedAt: null,
    };
  }

  const next = await hashPassword(newPassword);
  await User.updateOne(
    { _id: asObjectId(user.id) },
    {
      $set: {
        hash: next.hash,
        salt: next.salt,
        loginAttempts: 0,
        lockUntil: null,
      },
    }
  );

  return {
    error: null,
    field: null,
    success: "Password changed.",
    savedAt: Date.now(),
  };
}
