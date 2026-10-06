export const PERFORMANCE_COLUMN_LABELS = ["Use Case", "Recommended", "Detail"] as const;

export const SPACE_COLUMN_LABELS = [
  "Use Case",
  "Recommended",
  "Impact",
  "Slip",
  "Acoustic",
  "Maintenance",
] as const;

export function columnLabels(value: unknown, fallback: readonly string[]) {
  const source = Array.isArray(value) ? value : [];
  return fallback.map((item, index) => {
    const next = source[index];
    return typeof next === "string" && next.trim() ? next.trim() : item;
  });
}
