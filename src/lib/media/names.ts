import { randomUUID } from "node:crypto";

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function storageKey(mimeType: string) {
  const extension = EXTENSION_BY_TYPE[mimeType] || "bin";
  return `${randomUUID()}.${extension}`;
}

export function variantStorageKey() {
  return `${randomUUID()}.jpg`;
}

export function originalFilename(name: string) {
  const base = name.split(/[/\\]/).pop() || "image";
  const cleaned = base.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 180);
  return cleaned || "image";
}

export function suffixedFilename(filename: string, index: number) {
  if (index <= 0) return filename;
  const dot = filename.lastIndexOf(".");
  if (dot <= 0) return `${filename}-${index}`;
  return `${filename.slice(0, dot)}-${index}${filename.slice(dot)}`;
}
