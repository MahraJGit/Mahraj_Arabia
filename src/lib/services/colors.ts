export type BrandColor = {
  hex: string;
  selected: boolean;
};

export function normalizeHex(value: string) {
  const raw = value.trim();
  const match = raw.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return "";
  const digits = match[1];
  const full =
    digits.length === 3
      ? digits
          .split("")
          .map((char) => char + char)
          .join("")
      : digits;
  return `#${full.toLowerCase()}`;
}

export function readBrandColors(value: unknown): BrandColor[] {
  if (!Array.isArray(value)) return [];
  const colors = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const hex = normalizeHex(String((item as { hex?: unknown }).hex ?? ""));
    if (!hex) return [];
    return [{ hex, selected: Boolean((item as { selected?: unknown }).selected) }];
  });
  const unique = colors.filter(
    (color, index) => colors.findIndex((item) => item.hex === color.hex) === index
  );
  const firstSelected = unique.findIndex((color) => color.selected);
  return unique.slice(0, 8).map((color, index) => ({
    ...color,
    selected: firstSelected === -1 ? index === 0 : index === firstSelected,
  }));
}
