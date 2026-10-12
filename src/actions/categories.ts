"use server";

import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireEditor } from "@/lib/cms/permissions";
import { revalidateBlogPaths } from "@/lib/cms/revalidate";
import { isUuid } from "@/lib/db/ids";
import {
  countBlogPostsForCategory,
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

export async function saveCategory(
  id: string | null,
  raw: unknown
): Promise<ActionResult> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured. Connect Supabase to manage categories." };
  }

  const parsed = categoryInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  const data = parsed.data;
  const existing = await findBlogCategoryBySlug(data.slug, id ?? undefined);
  if (existing) {
    return {
      fieldErrors: { slug: "This URL slug is already used by another category." },
    };
  }

  const payload = {
    title: data.title,
    slug: data.slug,
    subtitle: data.subtitle || "",
    imageId: data.image || null,
    imageUrl: data.imageUrl || "",
    imageAlt: data.imageAlt || "",
    imageFilename: data.imageFilename || "",
    imageWidth: data.imageWidth ?? null,
    imageHeight: data.imageHeight ?? null,
  };

  let savedId = id;
  if (id) {
    if (!isUuid(id)) return { error: "This category could not be found." };
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

  await revalidateBlogPaths();
  revalidatePath("/admin/categories");
  if (savedId) revalidatePath(`/admin/categories/${savedId}`);
  revalidatePath("/admin/blog");
  return { href: `/admin/categories/${savedId}?saved=saved` };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured." };
  }
  if (!isUuid(id)) return { error: "This category could not be found." };

  const used = await countBlogPostsForCategory(id);
  if (used > 0) {
    return {
      error:
        used === 1
          ? "This category cannot be deleted because it is assigned to 1 blog post. Reassign that post first."
          : `This category cannot be deleted because it is assigned to ${used} blog posts. Reassign those posts first.`,
    };
  }

  await deleteBlogCategory(id);
  await revalidateBlogPaths();
  revalidatePath("/admin/categories");
  revalidatePath("/admin/blog");
  return { href: "/admin/categories?saved=deleted" };
}
