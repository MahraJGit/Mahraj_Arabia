import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseAuthEnabled,
} from "@/lib/supabase/env";

/**
 * Families, categories, and profile CMS data live in Supabase when
 * the project URL and service-role key are configured.
 */
export function isSupabaseContentEnabled() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

/** Prefer Supabase for identity when auth + content backends are both set. */
export function isSupabaseAdminEnabled() {
  return isSupabaseAuthEnabled() && isSupabaseContentEnabled();
}
