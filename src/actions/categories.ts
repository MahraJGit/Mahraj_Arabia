"use server";

import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireEditor } from "@/lib/cms/permissions";
import { revalidateBlogPaths } from "@/lib/cms/revalidate";
import { asObjectId, isContentId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import {
  deleteBlogCategory,
  findBlogCategoryBySlug,
  insertBlogCategory,
  isSupabaseContentEnabled,
  updateBlogCategory,
} from "@/lib/supabase/content";
import { flattenZod } from "@/lib/validation/flatten";
import { categoryInputSchema } from "@/lib/validation/category";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  href?: string;
};

async function assertUniqueCategorySlug(slug: string, excludeId?: string) {
  if (isSupabaseContentEnabled()) {
    const existing = await findBlogCategoryBySlug(slug, excludeId);
    return !existing;
  }

  const { Category } = await getModels();
  const filter: Record<string, unknown> = { slug };
  if (excludeId && isObjectId(excludeId)) {
    filter._id = { $ne: asObjectId(excludeId) };
  }
  const existing = await Category.findOne(filter).select("_id").lean();
  return !existing;
}

async function resolveMediaSnapshot(imageId?: string) {
  if (!imageId) {
    return {
      imageId: null as string | null,
      imageUrl: "",
      imageAlt: "",
      imageFilename: "",
      imageWidth: null as number | null,
      imageHeight: null as number | null,
    };
  }

  if (!isObjectId(imageId)) {
    return null;
  }

  const { Media } = await getModels();
  const image = await Media.findById(imageId)
    .select("url alt filename width height")
    .lean();
  if (!image) return null;

  return {
    imageId,
    imageUrl: String(image.url ?? ""),
    imageAlt: String(image.alt ?? ""),
    imageFilename: String(image.filename ?? ""),
    imageWidth: typeof image.width === "number" ? image.width : null,
    imageHeight: typeof image.height === "number" ? image.height : null,
  };
}

export async function saveCategory(
  id: string | null,
  raw: unknown
): Promise<ActionResult> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  const parsed = categoryInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  const data = parsed.data;
  const unique = await assertUniqueCategorySlug(data.slug, id ?? undefined);
  if (!unique) {
    return {
      fieldErrors: { slug: "This URL slug is already used by another category." },
    };
  }

  const media = await resolveMediaSnapshot(data.image || undefined);
  if (data.image && !media) {
    return { fieldErrors: { image: "That image is no longer available." } };
  }

  let savedId = id;

  if (isSupabaseContentEnabled()) {
    const payload = {
      title: data.title,
      slug: data.slug,
      subtitle: data.subtitle || "",
      imageId: media?.imageId ?? null,
      imageUrl: media?.imageUrl ?? "",
      imageAlt: media?.imageAlt ?? "",
      imageFilename: media?.imageFilename ?? "",
      imageWidth: media?.imageWidth ?? null,
      imageHeight: media?.imageHeight ?? null,
    };

    if (id) {
      if (!isContentId(id)) return { error: "This category could not be found." };
      const result = await updateBlogCategory(id, payload);
      if (result.duplicateSlug) {
        return {
          fieldErrors: {
            slug: "This URL slug is already used by another category.",
          },
        };
      }
      if (!result.ok) return { error: "This category could not be found." };
    } else {
      const created = await insertBlogCategory(payload);
      if (created.duplicateSlug) {
        return {
          fieldErrors: {
            slug: "This URL slug is already used by another category.",
          },
        };
      }
      savedId = created.id;
    }
  } else {
    const { Category } = await getModels();
    const $set: Record<string, unknown> = {
      title: data.title,
      slug: data.slug,
      subtitle: data.subtitle || "",
    };
    const $unset: Record<string, number> = {};

    if (data.image && isObjectId(data.image)) {
      $set.image = asObjectId(data.image);
    } else if (id) {
      $unset.image = 1;
    }

    try {
      if (id) {
        if (!isObjectId(id)) return { error: "This category could not be found." };
        const update: Record<string, unknown> = { $set };
        if (Object.keys($unset).length > 0) update.$unset = $unset;
        const updated = await Category.findByIdAndUpdate(id, update, { new: true });
        if (!updated) return { error: "This category could not be found." };
      } else {
        const created = await Category.create($set);
        savedId = toId(created._id);
      }
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        return {
          fieldErrors: { slug: "This URL slug is already used by another category." },
        };
      }
      return { error: "The category could not be saved. Please try again." };
    }
  }

  await revalidateBlogPaths();
  revalidatePath("/admin/categories");
  if (savedId) revalidatePath(`/admin/categories/${savedId}`);
  revalidatePath("/admin/blog");
  return { href: `/admin/categories/${savedId}?saved=saved` };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isContentId(id)) return { error: "This category could not be found." };

  const { Post } = await getModels();
  const used = await Post.countDocuments({ category: id });
  if (used > 0) {
    return {
      error:
        used === 1
          ? "This category cannot be deleted because it is assigned to 1 blog post. Reassign that post first."
          : `This category cannot be deleted because it is assigned to ${used} blog posts. Reassign those posts first.`,
    };
  }

  if (isSupabaseContentEnabled()) {
    await deleteBlogCategory(id);
  } else {
    if (!isObjectId(id)) return { error: "This category could not be found." };
    const { Category } = await getModels();
    const doc = await Category.findById(id).select("title").lean();
    if (!doc) return { error: "This category could not be found." };
    await Category.deleteOne({ _id: asObjectId(id) });
  }

  await revalidateBlogPaths();
  revalidatePath("/admin/categories");
  revalidatePath("/admin/blog");
  return { href: "/admin/categories?saved=deleted" };
}
