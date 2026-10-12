import { isDemoMode } from "@/lib/auth/demo";
import { getDemoMedia } from "@/lib/cms/demo-data";
import { isSupabaseContentEnabled } from "@/lib/supabase/content";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

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

const PAGE_SIZE = 25;

function publicUrl(path: string) {
  const { data } = getSupabaseAdminClient().storage.from("cms-media").getPublicUrl(path);
  return data.publicUrl;
}

function toItem(file: {
  id?: string | null;
  name: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}, folder: string): MediaListItem {
  const path = `${folder}/${file.name}`;
  const url = publicUrl(path);
  const meta = file.metadata ?? {};
  return {
    id: String(file.id || path),
    alt: String(meta.alt ?? file.name.replace(/\.[^.]+$/, "")),
    filename: file.name,
    mimeType: String(meta.mimetype ?? meta.contentType ?? ""),
    filesize: Number(meta.size ?? 0),
    width: typeof meta.width === "number" ? meta.width : null,
    height: typeof meta.height === "number" ? meta.height : null,
    url,
    thumbnailUrl: url,
    createdAt: String(file.created_at || file.updated_at || ""),
  };
}

export function toMediaListItem(doc: MediaListItem): MediaListItem {
  return doc;
}

export async function listMedia(query?: string): Promise<MediaListItem[]> {
  if (!isSupabaseContentEnabled()) {
    if (isDemoMode()) return getDemoMedia();
    return [];
  }

  const client = getSupabaseAdminClient();
  const folders = ["covers", "inline", "categories"];
  const items: MediaListItem[] = [];

  for (const folder of folders) {
    const { data, error } = await client.storage.from("cms-media").list(folder, {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error || !data) continue;
    for (const file of data) {
      if (!file.name || file.name.endsWith("/")) continue;
      items.push(
        toItem(
          {
            id: file.id,
            name: file.name,
            metadata: (file.metadata as Record<string, unknown> | null) ?? null,
            created_at: file.created_at ?? undefined,
            updated_at: file.updated_at ?? undefined,
          },
          folder
        )
      );
    }
  }

  const q = query?.trim().toLowerCase();
  const filtered = q
    ? items.filter(
        (item) =>
          item.filename.toLowerCase().includes(q) ||
          item.alt.toLowerCase().includes(q)
      )
    : items;

  return filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listMediaLibrary(args: { q?: string; page?: number }) {
  const page = Math.max(1, args.page ?? 1);
  const items = await listMedia(args.q);
  const total = items.length;
  const start = (page - 1) * PAGE_SIZE;
  return {
    items: items.slice(start, start + PAGE_SIZE),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
