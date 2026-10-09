"use server";

import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireEditor } from "@/lib/cms/permissions";
import { revalidateBlogPaths } from "@/lib/cms/revalidate";
import { isLexicalDoc, normalizeLexicalDoc } from "@/lib/cms/lexical";
import { asObjectId, isContentId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { getBlogCategory, isSupabaseContentEnabled } from "@/lib/supabase/content";
import { flattenZod } from "@/lib/validation/flatten";
import { postDraftSchema, type PostInput } from "@/lib/validation/post";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  href?: string;
};

async function assertUniquePostSlug(slug: string, excludeId?: string) {
  const { Post } = await getModels();
  const filter: Record<string, unknown> = { slug };
  if (excludeId && isObjectId(excludeId)) {
    filter._id = { $ne: asObjectId(excludeId) };
  }
  const existing = await Post.findOne(filter).select("_id").lean();
  return !existing;
}

function parsePublishedAt(value: string | undefined) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? "").trim());
  if (!match) return null;
  return new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0)
  );
}

function resolvePublishedAt(
  data: PostInput,
  existing: Date | undefined
) {
  const incoming = parsePublishedAt(data.publishedAt);
  if (incoming) return incoming;
  if (existing) return existing;
  if (data._status === "published") return new Date();
  return null;
}

export async function savePost(
  id: string | null,
  raw: unknown
): Promise<ActionResult> {
  await requireEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  const parsed = postDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  const data = parsed.data;
  const unique = await assertUniquePostSlug(data.slug, id ?? undefined);
  if (!unique) {
    return {
      fieldErrors: { slug: "This URL slug is already used by another post." },
    };
  }

  const { Post, Category, Media } = await getModels();

  if (data._status === "published" || data.category) {
    if (!data.category || !isContentId(data.category)) {
      return { fieldErrors: { category: "Please choose a category." } };
    }
    if (isSupabaseContentEnabled()) {
      const category = await getBlogCategory(data.category);
      if (!category) {
        return { fieldErrors: { category: "That category is no longer available." } };
      }
    } else if (isObjectId(data.category)) {
      const category = await Category.findById(data.category).select("_id").lean();
      if (!category) {
        return { fieldErrors: { category: "That category is no longer available." } };
      }
    } else {
      return { fieldErrors: { category: "Please choose a category." } };
    }
  }

  if (data.coverImage) {
    const cover = await Media.findById(data.coverImage).select("_id").lean();
    if (!cover) {
      return { fieldErrors: { coverImage: "That cover image is no longer available." } };
    }
  }

  if (data.authorImage) {
    const authorImage = await Media.findById(data.authorImage).select("_id").lean();
    if (!authorImage) {
      return {
        fieldErrors: { authorImage: "That author image is no longer available." },
      };
    }
  }

  if (data.content != null && !isLexicalDoc(data.content)) {
    return { fieldErrors: { content: "Article content is not in a readable format." } };
  }

  const previous =
    id && isObjectId(id)
      ? await Post.findById(id).select("slug publishedAt").lean()
      : null;
  if (id && !previous) return { error: "This post could not be found." };

  const previousSlug = previous ? String(previous.slug ?? "") : "";
  const existingPublishedAt =
    previous?.publishedAt instanceof Date ? previous.publishedAt : undefined;
  const publishedAt = resolvePublishedAt(data, existingPublishedAt);
  const content = normalizeLexicalDoc(data.content);

  const $set: Record<string, unknown> = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || "",
    content,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    author: data.author?.trim() || "By Mahraj Engineering Team",
    readTime: data.readTime || "",
    featured: Boolean(data.featured),
    _status: data._status,
  };
  const $unset: Record<string, number> = {};

  if (data.category && isContentId(data.category)) {
    $set.category = data.category;
  } else if (id) {
    $unset.category = 1;
  }

  if (data.coverImage && isObjectId(data.coverImage)) {
    $set.coverImage = asObjectId(data.coverImage);
  } else if (id) {
    $unset.coverImage = 1;
  }

  if (data.authorImage && isObjectId(data.authorImage)) {
    $set.authorImage = asObjectId(data.authorImage);
  } else if (id) {
    $unset.authorImage = 1;
  }

  if (publishedAt) {
    $set.publishedAt = publishedAt;
  }

  let savedId = id;
  try {
    if (id) {
      if (!isObjectId(id)) return { error: "This post could not be found." };
      const update: Record<string, unknown> = { $set };
      if (Object.keys($unset).length > 0) update.$unset = $unset;
      const updated = await Post.findByIdAndUpdate(id, update, { new: true });
      if (!updated) return { error: "This post could not be found." };
    } else {
      const created = await Post.create($set);
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
        fieldErrors: { slug: "This URL slug is already used by another post." },
      };
    }
    return { error: "The post could not be saved. Please try again." };
  }

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
  if (!isObjectId(id)) return { error: "This post could not be found." };
  const { Post } = await getModels();
  const doc = await Post.findById(id).select("slug").lean();
  if (!doc) return { error: "This post could not be found." };
  await Post.deleteOne({ _id: asObjectId(id) });
  await revalidateBlogPaths(String(doc.slug ?? ""));
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  return { href: "/admin/blog?saved=deleted" };
}
