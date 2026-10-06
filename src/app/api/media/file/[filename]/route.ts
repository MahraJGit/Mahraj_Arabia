import { NextResponse } from "next/server";

import { getModels } from "@/lib/db/models";
import { getObjectStream, s3Enabled } from "@/lib/media/s3";
import { isSafeMediaFilename } from "@/lib/public/media";

export const runtime = "nodejs";

const SIZE_KEYS = ["thumbnail", "card", "hero"] as const;

function normalizeFilename(raw: string) {
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return "";
  }
  return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mimeForFile(
  filename: string,
  doc: Record<string, unknown>
): string {
  if (doc.filename === filename && typeof doc.mimeType === "string") {
    return doc.mimeType;
  }
  const sizes = isRecord(doc.sizes) ? doc.sizes : {};
  for (const key of SIZE_KEYS) {
    const size = sizes[key];
    if (
      isRecord(size) &&
      size.filename === filename &&
      typeof size.mimeType === "string" &&
      size.mimeType
    ) {
      return size.mimeType;
    }
  }
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".webp")) return "image/webp";
  if (filename.endsWith(".gif")) return "image/gif";
  if (filename.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename: raw } = await context.params;
  const filename = normalizeFilename(raw);

  if (!isSafeMediaFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (!s3Enabled()) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const { Media } = await getModels();
    const doc = await Media.findOne({
      $or: [
        { filename },
        { "sizes.thumbnail.filename": filename },
        { "sizes.card.filename": filename },
        { "sizes.hero.filename": filename },
      ],
    })
      .select("filename mimeType sizes")
      .lean();

    if (!doc) {
      return new NextResponse("Not found", { status: 404 });
    }

    const object = await getObjectStream(filename);

    if (!object) {
      return new NextResponse("Not found", { status: 404 });
    }

    const contentType =
      object.contentType || mimeForFile(filename, doc as Record<string, unknown>);

    return new NextResponse(object.stream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
