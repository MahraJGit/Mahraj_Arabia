"use server";

import { randomUUID } from "node:crypto";

import sharp from "sharp";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireEditor } from "@/lib/cms/permissions";
import { isSupabaseContentEnabled } from "@/lib/supabase/content";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const TARGET = { width: 1920, height: 1080 };

export type UploadedCover = {
  id: string;
  url: string;
  alt: string;
  filename: string;
  width: number;
  height: number;
};

export async function uploadCmsCover(
  formData: FormData
): Promise<{ error: string; item?: undefined } | { error?: undefined; item: UploadedCover }> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured for media uploads." };
  }

  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim() || "Cover image";

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image to upload." };
  }
  if (!ALLOWED.has(file.type)) {
    return { error: "Use a JPG, PNG, or WebP image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Images must be 3 MB or smaller." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let meta;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    return { error: "That file could not be read as an image." };
  }

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width !== TARGET.width || height !== TARGET.height) {
    return {
      error: `Cover image must be exactly ${TARGET.width}×${TARGET.height}px (16:9).`,
    };
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const id = randomUUID();
  const path = `covers/${id}.${ext}`;
  const client = getSupabaseAdminClient();

  const { error: uploadError } = await client.storage
    .from("cms-media")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message || "The image could not be uploaded." };
  }

  const { data } = client.storage.from("cms-media").getPublicUrl(path);

  return {
    item: {
      id,
      url: data.publicUrl,
      alt,
      filename: file.name || path,
      width,
      height,
    },
  };
}
