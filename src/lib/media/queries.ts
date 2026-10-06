import { toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { isDemoMode } from "@/lib/auth/demo";
import { getDemoMedia } from "@/lib/cms/demo-data";

export type MediaListItem = {
  id: string;
  alt: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number | null;
  height: number | null;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
};

const LIST_FIELDS =
  "alt filename originalFilename displayFilename mimeType filesize width height url thumbnailURL sizes createdAt";

const PAGE_SIZE = 25;

type MediaDoc = {
  _id?: unknown;
  alt?: unknown;
  filename?: unknown;
  originalFilename?: unknown;
  displayFilename?: unknown;
  mimeType?: unknown;
  filesize?: unknown;
  width?: unknown;
  height?: unknown;
  url?: unknown;
  thumbnailURL?: unknown;
  sizes?: unknown;
  createdAt?: unknown;
  [key: string]: unknown;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mediaFilter(query?: string) {
  const q = query?.trim();
  if (!q) return {};
  const pattern = escapeRegex(q);
  return {
    $or: [
      { alt: { $regex: pattern, $options: "i" } },
      { filename: { $regex: pattern, $options: "i" } },
      { originalFilename: { $regex: pattern, $options: "i" } },
      { displayFilename: { $regex: pattern, $options: "i" } },
    ],
  };
}

function thumbnailFrom(doc: MediaDoc) {
  if (typeof doc.thumbnailURL === "string" && doc.thumbnailURL.trim()) {
    return doc.thumbnailURL;
  }
  if (doc.sizes && typeof doc.sizes === "object" && !Array.isArray(doc.sizes)) {
    const thumbnail = (doc.sizes as { thumbnail?: { url?: unknown } }).thumbnail;
    if (typeof thumbnail?.url === "string" && thumbnail.url.trim()) {
      return thumbnail.url;
    }
  }
  return String(doc.url ?? "");
}

export function toMediaListItem(doc: MediaDoc): MediaListItem {
  const createdAt = doc.createdAt instanceof Date ? doc.createdAt.toISOString() : "";
  return {
    id: toId(doc._id),
    alt: String(doc.alt ?? ""),
    filename: String(
      doc.displayFilename || doc.originalFilename || doc.filename || ""
    ),
    mimeType: String(doc.mimeType ?? ""),
    filesize: Number(doc.filesize ?? 0),
    width: typeof doc.width === "number" ? doc.width : null,
    height: typeof doc.height === "number" ? doc.height : null,
    url: String(doc.url ?? ""),
    thumbnailUrl: thumbnailFrom(doc),
    createdAt,
  };
}

export async function listMedia(query?: string): Promise<MediaListItem[]> {
  if (isDemoMode()) {
    const q = query?.trim().toLowerCase();
    const items = getDemoMedia();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.alt.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q)
    );
  }
  const { Media } = await getModels();
  const docs = await Media.find(mediaFilter(query))
    .sort({ createdAt: -1 })
    .select(LIST_FIELDS)
    .limit(80)
    .lean();

  return docs.map((doc) => toMediaListItem(doc));
}

export async function listMediaLibrary(args: { q?: string; page?: number }) {
  if (isDemoMode()) {
    const q = args.q?.trim().toLowerCase();
    let items = getDemoMedia();
    if (q) {
      items = items.filter(
        (item) =>
          item.alt.toLowerCase().includes(q) ||
          item.filename.toLowerCase().includes(q)
      );
    }
    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const requested = Number.isFinite(args.page)
      ? Math.max(1, Math.floor(args.page ?? 1))
      : 1;
    const page = Math.min(requested, pageCount);
    const start = (page - 1) * PAGE_SIZE;
    return {
      items: items.slice(start, start + PAGE_SIZE),
      total,
      page,
      pageCount,
    };
  }
  const { Media } = await getModels();
  const filter = mediaFilter(args.q);
  const requested = Number.isFinite(args.page) ? Math.max(1, Math.floor(args.page ?? 1)) : 1;
  const total = await Media.countDocuments(filter);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, pageCount);
  const docs = await Media.find(filter)
    .sort({ createdAt: -1 })
    .select(LIST_FIELDS)
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean();

  return {
    items: docs.map((doc) => toMediaListItem(doc)),
    total,
    page,
    pageCount,
  };
}

export async function getMedia(id: string): Promise<MediaListItem | null> {
  if (isDemoMode()) {
    return getDemoMedia().find((item) => item.id === id) ?? null;
  }
  const { Media } = await getModels();
  const doc = await Media.findById(id).select(LIST_FIELDS).lean();
  if (!doc) return null;
  return toMediaListItem(doc);
}
