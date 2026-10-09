import type { UserRole } from "@/lib/cms/types";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export async function updateAdminProfile(input: {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}) {
  const admin = getSupabaseAdminClient();

  const { data: taken, error: takenError } = await admin
    .from("profiles")
    .select("id")
    .eq("email", input.email)
    .neq("id", input.userId)
    .maybeSingle();

  if (takenError) {
    return { error: takenError.message };
  }
  if (taken) {
    return { error: "Another account already uses this email.", field: "email" as const };
  }

  const { error: authError } = await admin.auth.admin.updateUserById(input.userId, {
    email: input.email,
    user_metadata: { name: input.name },
  });

  if (authError) {
    return { error: authError.message, field: "email" as const };
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      name: input.name,
      email: input.email,
      role: input.role,
    })
    .eq("id", input.userId);

  if (profileError) {
    return { error: profileError.message };
  }

  return { error: null as string | null };
}

export async function changeAdminPassword(input: {
  email: string;
  currentPassword: string;
  newPassword: string;
  userId: string;
}) {
  const authClient = getSupabaseServerClient();
  const { error: verifyError } = await authClient.auth.signInWithPassword({
    email: input.email,
    password: input.currentPassword,
  });

  if (verifyError) {
    return {
      error: "Current password is incorrect.",
      field: "current" as const,
    };
  }

  await authClient.auth.signOut();

  const admin = getSupabaseAdminClient();
  const { error } = await admin.auth.admin.updateUserById(input.userId, {
    password: input.newPassword,
  });

  if (error) {
    return { error: error.message, field: "new" as const };
  }

  return { error: null as string | null };
}
