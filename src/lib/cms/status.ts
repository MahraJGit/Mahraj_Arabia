import type { PublishStatus } from "@/lib/cms/types";

export function publishStatus(value: unknown): PublishStatus {
  return value === "published" ? "published" : "draft";
}

export function statusLabel(status: PublishStatus) {
  return status === "published" ? "Published" : "Draft";
}
