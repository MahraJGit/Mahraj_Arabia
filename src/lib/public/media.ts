export type PublicMedia = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  filename?: string;
  width?: number | null;
  height?: number | null;
};

export function mediaIdFromValue(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "id" in value) {
    return String((value as { id: unknown }).id ?? "");
  }
  return "";
}

export function isSafeMediaFilename(filename: string) {
  return /^[a-zA-Z0-9._/-]+$/.test(filename) && !filename.includes("..");
}

export function mediaFileUrl(filename: string) {
  return filename;
}

export async function loadMediaMap(_ids: string[]) {
  return new Map<string, PublicMedia>();
}

export function resolveMediaUrl(
  media: PublicMedia | null | undefined,
  _size?: string
) {
  if (!media?.url) {
    return { url: "", alt: "" };
  }
  return { url: media.url, alt: media.alt || "" };
}
