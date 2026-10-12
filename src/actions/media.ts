"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import sharp from "sharp";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireEditor } from "@/lib/cms/permissions";
import { listMedia, type MediaListItem } from "@/lib/media/queries";
import { isSupabaseContentEnabled } from "@/lib/supabase/content";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function searchMedia(query?: string): Promise<MediaListItem[]> {
  await requireEditor();
  return listMedia(query);
}

export async function uploadMedia(formData: FormData): Promise<
  { error: string; item?: undefined } | { error?: undefined; item: MediaListItem }
> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured for media uploads." };
  }

  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image to upload." };
  }
  if (!ALLOWED.has(file.type)) {
    return { error: "Use a JPG, PNG, WebP, or GIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Images must be 8 MB or smaller." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let meta;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    return { error: "That file could not be read as an image." };
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const id = randomUUID();
  const path = `inline/${id}.${ext}`;
  const client = getSupabaseAdminClient();

  const { error: uploadError } = await client.storage.from("cms-media").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
    metadata: {
      alt: alt || file.name.replace(/\.[^.]+$/, ""),
      width: String(meta.width ?? ""),
      height: String(meta.height ?? ""),
    },
  });

  if (uploadError) {
    return { error: uploadError.message || "The image could not be uploaded." };
  }

  const { data } = client.storage.from("cms-media").getPublicUrl(path);
  revalidatePath("/admin/media");

  return {
    item: {
      id,
      alt: alt || file.name.replace(/\.[^.]+$/, ""),
      filename: file.name || path,
      mimeType: file.type,
      filesize: file.size,
      width: meta.width ?? null,
      height: meta.height ?? null,
      url: data.publicUrl,
      thumbnailUrl: data.publicUrl,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function deleteMedia(id: string): Promise<{ error?: string; href?: string }> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };

  const client = getSupabaseAdminClient();
  const folders = ["covers", "inline", "categories"];
  let deleted = false;

  for (const folder of folders) {
    const { data } = await client.storage.from("cms-media").list(folder, { limit: 200 });
    const match = (data ?? []).find((file) => file.id === id || file.name.startsWith(id));
    if (!match) continue;
    const { error } = await client.storage.from("cms-media").remove([`${folder}/${match.name}`]);
    if (!error) {
      deleted = true;
      break;
    }
  }

  if (!deleted) return { error: "This image could not be found." };

  revalidatePath("/admin/media");
  return { href: "/admin/media?saved=deleted" };
}
