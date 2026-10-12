export function toId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "id" in value) {
    return String((value as { id: unknown }).id);
  }
  return String(value);
}

/** UUID v1–v8 (Postgres `gen_random_uuid()` / Supabase ids). */
export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

/** Content primary keys are Supabase UUIDs. */
export function isContentId(value: string) {
  return isUuid(value);
}
