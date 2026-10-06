import { asObjectId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";

export type MediaSize = "thumbnail" | "card" | "hero";

export type PublicMediaSize = {
  url?: string;
  filename?: string;
  width?: number | null;
  height?: number | null;
  mimeType?: string;
  filesize?: number;
};

export type PublicMedia = {
  id: string;
  alt: string;
  caption: string;
  url: string;
  filename: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  focalX: number | null;
  focalY: number | null;
  sizes: Partial<Record<MediaSize, PublicMediaSize>>;
};

const FALLBACK = "/images/advantage-installation.jpg";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readSize(value: unknown): PublicMediaSize | undefined {
  if (!isRecord(value)) return undefined;
  return {
    url: typeof value.url === "string" ? value.url : undefined,
    filename: typeof value.filename === "string" ? value.filename : undefined,
    width: readNumber(value.width),
    height: readNumber(value.height),
    mimeType: typeof value.mimeType === "string" ? value.mimeType : undefined,
    filesize: readNumber(value.filesize) ?? undefined,
  };
}

export function mediaFileUrl(filename: string) {
  return `/api/media/file/${encodeURIComponent(filename)}`;
}

export function toPublicMedia(doc: unknown): PublicMedia | null {
  if (!isRecord(doc)) return null;
  const filename = typeof doc.filename === "string" ? doc.filename : "";
  const url =
    typeof doc.url === "string" && doc.url
      ? doc.url
      : filename
        ? mediaFileUrl(filename)
        : "";
  const sizesRaw = isRecord(doc.sizes) ? doc.sizes : {};

  return {
    id: toId(doc._id ?? doc.id),
    alt: typeof doc.alt === "string" ? doc.alt : "",
    caption: typeof doc.caption === "string" ? doc.caption : "",
    url,
    filename,
    mimeType: typeof doc.mimeType === "string" ? doc.mimeType : "",
    width: readNumber(doc.width),
    height: readNumber(doc.height),
    focalX: readNumber(doc.focalX),
    focalY: readNumber(doc.focalY),
    sizes: {
      thumbnail: readSize(sizesRaw.thumbnail),
      card: readSize(sizesRaw.card),
      hero: readSize(sizesRaw.hero),
    },
  };
}

function readSizeUrl(media: PublicMedia, size: MediaSize) {
  const url = media.sizes[size]?.url;
  return typeof url === "string" && url ? url : undefined;
}

export function resolveMediaUrl(
  value: string | PublicMedia | null | undefined,
  preferredSize?: MediaSize
) {
  if (!value) {
    return { url: FALLBACK, alt: "" };
  }

  if (typeof value === "string") {
    const looksLikeUrl = value.startsWith("/") || /^https?:\/\//.test(value);
    return { url: looksLikeUrl ? value : FALLBACK, alt: "" };
  }

  const sized =
    (preferredSize && readSizeUrl(value, preferredSize)) ||
    readSizeUrl(value, "hero") ||
    readSizeUrl(value, "card") ||
    value.url;

  return {
    url:
      sized && (sized.startsWith("/") || /^https?:\/\//.test(sized))
        ? sized
        : FALLBACK,
    alt: value.alt ?? "",
  };
}

export async function loadMediaMap(ids: string[]) {
  const unique = [...new Set(ids.filter((id) => isObjectId(id)))];
  const map = new Map<string, PublicMedia>();
  if (unique.length === 0) return map;

  const { Media } = await getModels();
  const docs = await Media.find({ _id: { $in: unique.map(asObjectId) } }).lean();
  for (const doc of docs) {
    const media = toPublicMedia(doc);
    if (media?.id) map.set(media.id, media);
  }
  return map;
}

export function mediaIdFromValue(value: unknown): string {
  if (typeof value === "string" && isObjectId(value)) return value;
  if (isRecord(value)) {
    const id = value.id ?? value._id;
    const next = toId(id);
    if (isObjectId(next)) return next;
  }
  return "";
}

export function isSafeMediaFilename(filename: string) {
  if (!filename || filename.length > 255) return false;
  if (filename !== filename.normalize()) return false;
  if (filename.includes("\0") || filename.includes("/") || filename.includes("\\")) {
    return false;
  }
  if (filename.includes("..") || filename.startsWith(".")) return false;
  return /^[A-Za-z0-9._ ()+:@,-]+$/.test(filename);
}
