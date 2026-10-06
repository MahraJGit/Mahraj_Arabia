"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/actions/auth";
import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { asObjectId, isObjectId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import {
  cleanEmail,
  cleanName,
  emailError,
  nameError,
  passwordError,
  roleValue,
} from "@/lib/users/fields";

export type UserActionResult = {
  error: string | null;
  field: "name" | "email" | "role" | "password" | "confirm" | null;
  href?: string;
};

function fail(
  error: string,
  field: UserActionResult["field"] = null
): UserActionResult {
  return { error, field };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type ParsedAccount =
  | { ok: false; error: UserActionResult }
  | {
      ok: true;
      name: string;
      email: string;
      role: "admin" | "editor";
      password: string;
    };

function readAccount(formData: FormData, passwordRequired: boolean): ParsedAccount {
  const name = cleanName(String(formData.get("name") ?? ""));
  const email = cleanEmail(String(formData.get("email") ?? ""));
  const role = roleValue(String(formData.get("role") ?? ""));
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const invalidName = nameError(name);
  if (invalidName) return { ok: false, error: fail(invalidName, "name") };

  const invalidEmail = emailError(email);
  if (invalidEmail) return { ok: false, error: fail(invalidEmail, "email") };

  if (!role) return { ok: false, error: fail("Choose Admin or Editor.", "role") };

  const invalidPassword = passwordError(password, passwordRequired);
  if (invalidPassword) return { ok: false, error: fail(invalidPassword, "password") };

  if (password && password !== confirm) {
    return {
      ok: false,
      error: fail("Password and confirmation do not match.", "confirm"),
    };
  }

  return { ok: true, name, email, role, password };
}

async function emailTaken(email: string, excludeId?: string) {
  const { User } = await getModels();
  const filter: Record<string, unknown> = {
    email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
  };
  if (excludeId && isObjectId(excludeId)) {
    filter._id = { $ne: asObjectId(excludeId) };
  }
  const existing = await User.findOne(filter).select("_id").lean();
  return Boolean(existing);
}

export async function createUser(formData: FormData): Promise<UserActionResult> {
  await requireAdmin();
  if (isDemoMode()) return fail(demoWriteBlockedMessage()!);
  const account = readAccount(formData, true);
  if (!account.ok) return account.error;

  if (await emailTaken(account.email)) {
    return fail("Another account already uses this email.", "email");
  }

  const next = await hashPassword(account.password);
  const { User } = await getModels();
  await User.create({
    name: account.name,
    email: account.email,
    role: account.role,
    hash: next.hash,
    salt: next.salt,
    loginAttempts: 0,
    lockUntil: null,
  });

  revalidatePath("/admin/users");
  return { error: null, field: null, href: "/admin/users?saved=created" };
}

export async function updateUser(formData: FormData): Promise<UserActionResult> {
  const actor = await requireAdmin();
  if (isDemoMode()) return fail(demoWriteBlockedMessage()!);
  const id = String(formData.get("id") ?? "");
  if (!isObjectId(id)) return fail("This user could not be found.");

  const account = readAccount(formData, false);
  if (!account.ok) return account.error;

  const { User } = await getModels();
  const existing = await User.findById(asObjectId(id)).select("role").lean();
  if (!existing) return fail("This user could not be found.");

  const currentRole = existing.role === "admin" ? "admin" : "editor";
  if (currentRole === "admin" && account.role === "editor") {
    const admins = await User.countDocuments({ role: "admin" });
    if (admins <= 1) {
      return fail(
        "This is the last admin. Add another admin before changing this role.",
        "role"
      );
    }
  }

  if (await emailTaken(account.email, id)) {
    return fail("Another account already uses this email.", "email");
  }

  const $set: Record<string, unknown> = {
    name: account.name,
    email: account.email,
    role: account.role,
  };

  if (account.password) {
    const next = await hashPassword(account.password);
    $set.hash = next.hash;
    $set.salt = next.salt;
    $set.loginAttempts = 0;
    $set.lockUntil = null;
  }

  await User.updateOne({ _id: asObjectId(id) }, { $set });

  if (actor.id === id) {
    await createSession({
      userId: actor.id,
      email: account.email,
      name: account.name,
      role: account.role,
    });
    revalidatePath("/admin", "layout");
  }

  revalidatePath("/admin/users");

  if (actor.id === id && account.role !== "admin") {
    return { error: null, field: null, href: "/admin" };
  }

  return { error: null, field: null, href: "/admin/users?saved=updated" };
}

export async function deleteUser(id: string): Promise<UserActionResult> {
  const actor = await requireAdmin();
  if (isDemoMode()) return fail(demoWriteBlockedMessage()!);
  if (!isObjectId(id)) return fail("This user could not be found.");
  if (actor.id === id) {
    return fail("You cannot remove the account you are signed in with.");
  }

  const { User } = await getModels();
  const existing = await User.findById(asObjectId(id)).select("role").lean();
  if (!existing) return fail("This user could not be found.");

  if (existing.role === "admin") {
    const admins = await User.countDocuments({ role: "admin" });
    if (admins <= 1) {
      return fail("The last admin cannot be removed.");
    }
  }

  await User.deleteOne({ _id: asObjectId(id) });
  revalidatePath("/admin/users");
  return { error: null, field: null, href: "/admin/users?saved=deleted" };
}
