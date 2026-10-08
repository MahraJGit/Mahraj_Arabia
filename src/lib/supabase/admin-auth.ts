import type { UserRole } from "@/lib/cms/types";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export async function signInWithSupabase(email: string, password: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { profile: null as AdminProfile | null, error: error?.message ?? "Unable to sign in." };
  }

  const profile = await getAdminProfileById(data.user.id);
  if (!profile) {
    await supabase.auth.signOut();
    return {
      profile: null,
      error: "No admin profile found for this account.",
    };
  }

  return { profile, error: null as string | null };
}

export async function getAdminProfileById(
  userId: string
): Promise<AdminProfile | null> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const role: UserRole = data.role === "admin" ? "admin" : "editor";

  return {
    id: String(data.id),
    name: String(data.name ?? "Mahraj user"),
    email: String(data.email ?? ""),
    role,
  };
}
