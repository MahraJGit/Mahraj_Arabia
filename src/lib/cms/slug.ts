export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueFilename(original: string) {
  const cleaned = original
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const stamp = Date.now().toString(36);
  const dot = cleaned.lastIndexOf(".");
  if (dot <= 0) return `${stamp}-${cleaned || "image"}`;
  return `${cleaned.slice(0, dot)}-${stamp}${cleaned.slice(dot)}`;
}
