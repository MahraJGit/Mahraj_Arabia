"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";

import sharp from "sharp";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireServiceEditor } from "@/lib/cms/permissions";
import { asObjectId, isObjectId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { originalFilename, storageKey, suffixedFilename, variantStorageKey } from "@/lib/media/names";
import { isSafeMediaFilename, mediaFileUrl } from "@/lib/public/media";
import { listMedia, toMediaListItem, type MediaListItem } from "@/lib/media/queries";
import { deleteObject, putObject, s3Enabled } from "@/lib/media/s3";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const SIZES = {
  thumbnail: { width: 400, height: 300 },
  card: { width: 768, height: 480 },
  hero: { width: 1600, height: 900 },
} as const;

function titled(doc: { title?: unknown } | null, kind: string) {
  if (!doc) return null;
  const title = String(doc.title ?? "").trim() || "Untitled";
  return `${kind} “${title}”`;
}

async function findMediaUsage(id: string) {
  const { Post, Category, Service } = await getModels();
  const inline = {
    $or: [0, 1, 2].flatMap((depth) => {
      const base = ["content", "root", ...Array(depth + 1).fill("children")].join(".");
      return [{ [`${base}.value`]: id }, { [`${base}.value.id`]: id }];
    }),
  };
  const [post, embedded, category, service] = await Promise.all([
    Post.findOne({ $or: [{ coverImage: id }, { authorImage: id }] }).select("title").lean(),
    Post.findOne(inline).select("title").lean(),
    Category.findOne({ image: id }).select("title").lean(),
    Service.findOne({ $or: [{ image: id }, { overviewImage: id }] }).select("title").lean(),
  ]);
  return (
    titled(post, "the post") ||
    titled(embedded, "the post") ||
    titled(category, "the category") ||
    titled(service, "the service")
  );
}

function storageKeys(doc: { filename?: unknown; sizes?: unknown }) {
  const keys: string[] = [];
  const filename = String(doc.filename ?? "");
  if (isSafeMediaFilename(filename)) keys.push(filename);
  if (!doc.sizes || typeof doc.sizes !== "object") return keys;
  for (const size of Object.values(doc.sizes as Record<string, unknown>)) {
    if (!size || typeof size !== "object") continue;
    const name = String((size as { filename?: unknown }).filename ?? "");
    if (isSafeMediaFilename(name) && !keys.includes(name)) keys.push(name);
  }
  return keys;
}

async function allocateDisplayName(
  Media: Awaited<ReturnType<typeof getModels>>["Media"],
  sourceName: string
) {
  const base = originalFilename(sourceName);
  for (let index = 0; index < 1000; index += 1) {
    const candidate = suffixedFilename(base, index);
    const taken = await Media.findOne({
      $or: [{ displayFilename: candidate }, { filename: candidate }],
    })
      .select("_id")
      .lean();
    if (!taken) {
      return { originalFilename: base, displayFilename: candidate };
    }
  }
  return {
    originalFilename: base,
    displayFilename: suffixedFilename(base, Date.now()),
  };
}

async function unsharedStorageKeys(
  Media: Awaited<ReturnType<typeof getModels>>["Media"],
  id: string,
  doc: { filename?: unknown; sizes?: unknown }
) {
  const keys = storageKeys(doc);
  if (keys.length === 0) return [];
  const others = await Media.find({
    _id: { $ne: asObjectId(id) },
    $or: [
      { filename: { $in: keys } },
      { "sizes.thumbnail.filename": { $in: keys } },
      { "sizes.card.filename": { $in: keys } },
      { "sizes.hero.filename": { $in: keys } },
    ],
  })
    .select("filename sizes")
    .lean();
  const shared = new Set<string>();
  for (const other of others) {
    if (!other || typeof other !== "object") continue;
    for (const key of storageKeys(other as { filename?: unknown; sizes?: unknown })) {
      shared.add(key);
    }
  }
  return keys.filter((key) => !shared.has(key));
}

export async function searchMedia(query?: string): Promise<MediaListItem[]> {
  await requireServiceEditor();
  return listMedia(query);
}

export async function uploadMedia(formData: FormData): Promise<
  | { error: string; item?: undefined }
  | { error?: undefined; item: MediaListItem }
> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };

  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image to upload." };
  }
  if (!alt) return { error: "Please describe the image for accessibility." };
  if (!ALLOWED.has(file.type)) {
    return { error: "Use a JPG, PNG, WebP, or GIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Images must be 8 MB or smaller." };
  }
  if (!s3Enabled()) {
    return { error: "Image storage is not configured." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const checksum = createHash("sha256").update(buffer).digest("hex");
  const { Media } = await getModels();
  const existing = await Media.findOne({ checksum }).lean();
  if (existing) {
    return { item: toMediaListItem(existing) };
  }

  let meta;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    return { error: "That file could not be read as an image." };
  }

  const mimeType = file.type;
  const filename = storageKey(mimeType);
  const names = await allocateDisplayName(Media, file.name || "image.jpg");
  const sizes: Record<string, {
    url: string;
    width: number;
    height: number;
    mimeType: string;
    filesize: number;
    filename: string;
  }> = {};
  const storedKeys: string[] = [];

  try {
    await putObject(filename, buffer, mimeType);
    storedKeys.push(filename);

    for (const [name, size] of Object.entries(SIZES)) {
      const resized = await sharp(buffer)
        .resize(size.width, size.height, { fit: "cover", position: "centre" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
      const sizedName = variantStorageKey();
      await putObject(sizedName, resized, "image/jpeg");
      storedKeys.push(sizedName);
      const sizedMeta = await sharp(resized).metadata();
      sizes[name] = {
        url: mediaFileUrl(sizedName),
        width: sizedMeta.width ?? size.width,
        height: sizedMeta.height ?? size.height,
        mimeType: "image/jpeg",
        filesize: resized.length,
        filename: sizedName,
      };
    }
  } catch {
    await Promise.all(storedKeys.map((key) => deleteObject(key).catch(() => undefined)));
    return { error: "The image could not be stored. Try again in a moment." };
  }

  try {
    const created = await Media.create({
      alt,
      caption: "",
      filename,
      originalFilename: names.originalFilename,
      displayFilename: names.displayFilename,
      mimeType,
      filesize: file.size,
      width: meta.width ?? null,
      height: meta.height ?? null,
      url: mediaFileUrl(filename),
      thumbnailURL: sizes.thumbnail?.url,
      sizes,
      checksum,
      focalX: 50,
      focalY: 50,
    });

    revalidatePath("/admin/media");
    return { item: toMediaListItem(created) };
  } catch {
    await Promise.all(storedKeys.map((key) => deleteObject(key).catch(() => undefined)));
    return { error: "The image could not be saved. Please try the upload again." };
  }
}

export async function deleteMedia(id: string): Promise<{ error?: string; href?: string }> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isObjectId(id)) return { error: "This image could not be found." };

  const { Media } = await getModels();
  const doc = await Media.findById(id).select("filename sizes").lean();
  if (!doc) return { error: "This image could not be found." };

  const usage = await findMediaUsage(id);
  if (usage) {
    return {
      error: `This image is used by ${usage}. Remove it there before deleting.`,
    };
  }

  if (s3Enabled()) {
    try {
      for (const key of await unsharedStorageKeys(Media, id, doc)) {
        await deleteObject(key);
      }
    } catch {
      return { error: "The file could not be removed from storage. Please try again." };
    }
  }

  await Media.deleteOne({ _id: asObjectId(id) });
  revalidatePath("/admin/media");
  return { href: "/admin/media?saved=deleted" };
}
