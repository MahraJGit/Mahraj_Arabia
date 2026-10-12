export type MediaSnapshot = {
  imageId: string | null;
  imageUrl: string;
  imageAlt: string;
  imageFilename: string;
  imageWidth: number | null;
  imageHeight: number | null;
};

export const emptyMediaSnapshot = (): MediaSnapshot => ({
  imageId: null,
  imageUrl: "",
  imageAlt: "",
  imageFilename: "",
  imageWidth: null,
  imageHeight: null,
});

export type ClientMediaMeta = {
  id?: string;
  url?: string;
  alt?: string;
  filename?: string;
  width?: number | null;
  height?: number | null;
};

/** Resolve media for Supabase denormalized image columns. */
export async function resolveMediaSnapshot(
  imageId?: string,
  clientMeta?: ClientMediaMeta | null,
  existing?: MediaSnapshot | null
): Promise<MediaSnapshot | null> {
  if (!imageId) return emptyMediaSnapshot();

  if (clientMeta?.id === imageId && clientMeta.url) {
    return {
      imageId,
      imageUrl: String(clientMeta.url ?? ""),
      imageAlt: String(clientMeta.alt ?? ""),
      imageFilename: String(clientMeta.filename ?? ""),
      imageWidth: typeof clientMeta.width === "number" ? clientMeta.width : null,
      imageHeight: typeof clientMeta.height === "number" ? clientMeta.height : null,
    };
  }

  if (existing?.imageId === imageId) {
    return existing;
  }

  return null;
}
