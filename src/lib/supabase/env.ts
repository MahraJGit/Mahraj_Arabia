export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
}

/** True when Supabase Auth env is configured for dynamic admin login. */
export function isSupabaseAuthEnabled() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
