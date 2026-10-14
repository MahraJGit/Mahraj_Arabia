"use server";

import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireEditor } from "@/lib/cms/permissions";
import { revalidateBlogPaths } from "@/lib/cms/revalidate";
import { isLexicalDoc, normalizeLexicalDoc } from "@/lib/cms/lexical";
import { isContentId, isUuid } from "@/lib/db/ids";
import {
  deleteBlogPost,
  findBlogPostBySlug,
  getBlogCategory,
  getBlogPost,
  insertBlogPost,
  isSupabaseContentEnabled,
  updateBlogPost,
} from "@/lib/supabase/content";
import { flattenZod } from "@/lib/validation/flatten";
import { postDraftSchema, type PostInput } from "@/lib/validation/post";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  href?: string;
};

export async function savePost(
  id: string | null,
  raw: unknown
): Promise<ActionResult> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured. Connect Supabase to manage blogs." };
  }

  const parsed = postDraftSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: flattenZod(parsed.error) };

  const data = parsed.data;
  const existingSlug = await findBlogPostBySlug(data.slug, id ?? undefined);
  if (existingSlug) {
    return { fieldErrors: { slug: "This URL slug is already used by another post." } };
  }

  if (data.category) {
    if (!isContentId(data.category)) {
      return { fieldErrors: { category: "Please choose a category." } };
    }
    const category = await getBlogCategory(data.category);
    if (!category) {
      return { fieldErrors: { category: "That category is no longer available." } };
    }
  }

  if (data.content != null && !isLexicalDoc(data.content)) {
    return { fieldErrors: { content: "Article content is not in a readable format." } };
  }

  const existing = id && isUuid(id) ? await getBlogPost(id) : null;
  if (id && !existing) return { error: "This post could not be found." };

  const publishedAtInput = data.publishedAt?.trim() || "";
  const publishedAt =
    data._status === "published"
      ? publishedAtInput
        ? new Date(publishedAtInput).toISOString()
        : existing?.publishedAt || new Date().toISOString()
      : publishedAtInput
        ? new Date(publishedAtInput).toISOString()
        : existing?.publishedAt || null;

  const write = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || "",
    content: normalizeLexicalDoc(data.content),
    coverImageId: data.coverImageId || null,
    coverImageUrl: data.coverImageUrl || "",
    coverImageAlt: data.coverImageAlt || "",
    coverImageFilename: data.coverImageFilename || "",
    coverImageWidth: data.coverImageWidth ?? null,
    coverImageHeight: data.coverImageHeight ?? null,
    categoryId: data.category && isContentId(data.category) ? data.category : null,
    author: data.author || "",
    authorRole: data.authorRole || "",
    authorImageId: data.authorImageId || null,
    authorImageUrl: data.authorImageUrl || "",
    authorImageAlt: data.authorImageAlt || data.author || "",
    authorImageFilename: data.authorImageFilename || "",
    authorImageWidth: data.authorImageWidth ?? null,
    authorImageHeight: data.authorImageHeight ?? null,
    featured: Boolean(data.featured),
    status: data._status,
    tags: data.tags,
    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",
    focusKeyword: data.focusKeyword || "",
    faqDescription: data.faqDescription || "",
    faqs: data.faqs,
    publishedAt,
  };

  let savedId = id;
  if (id) {
    const result = await updateBlogPost(id, write);
    if (result.duplicateSlug) {
      return { fieldErrors: { slug: "This URL slug is already used by another post." } };
    }
    if (!result.ok) return { error: "This post could not be found." };
  } else {
    const created = await insertBlogPost(write);
    if (created.duplicateSlug) {
      return { fieldErrors: { slug: "This URL slug is already used by another post." } };
    }
    savedId = created.id;
  }

  const previousSlug = existing?.slug ?? "";
  await revalidateBlogPaths(data.slug);
  if (previousSlug && previousSlug !== data.slug) {
    await revalidateBlogPaths(previousSlug);
  }
  revalidatePath("/admin/blog");
  if (savedId) revalidatePath(`/admin/blog/${savedId}`);
  revalidatePath("/admin");

  const saved = data._status === "published" ? "published" : "draft";
  return {
    href: id ? `/admin/blog/${savedId}?saved=${saved}` : `/admin/blog?saved=${saved}`,
  };
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured." };
  }
  if (!isUuid(id)) return { error: "This post could not be found." };

  const slug = await deleteBlogPost(id);
  await revalidateBlogPaths(slug);
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  return { href: "/admin/blog?saved=deleted" };
}
