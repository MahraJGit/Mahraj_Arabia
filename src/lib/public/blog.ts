import { asObjectId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { collectUploadIds } from "@/lib/cms/lexical";
import {
  loadMediaMap,
  resolveMediaUrl,
  type PublicMedia,
} from "@/lib/public/media";
import type { LexicalContent } from "@/lib/public/rich-text";

export type BlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  date: string;
  author: string;
  authorImage: string;
  authorImageAlt: string;
  category: string;
  categorySlug: string;
  href: string;
};

export type { BlogCategory } from "@/lib/public/categories";
export { getCategories } from "@/lib/public/categories";

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  coverImage: PublicMedia | null;
  seoTitle: string;
  seoDescription: string;
  category: { id: string; title: string; slug: string } | null;
  author: string;
  authorImage: PublicMedia | null;
  readTime: string;
  publishedAt: string | null;
  featured: boolean;
  inlineMedia: Record<string, PublicMedia>;
};

const published = { _status: "published" } as const;

type LeanDoc = Record<string, unknown> & { _id?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatDate(value?: Date | string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function publishedAtIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value) return value;
  return null;
}

function resolveImage(
  media: PublicMedia | null | undefined,
  size?: "thumbnail" | "card" | "hero"
) {
  const resolved = resolveMediaUrl(media ?? null, size);
  return {
    url: resolved.url || "/images/advantage-installation.jpg",
    alt: resolved.alt,
  };
}

export function toBlogCard(
  post: PublicPost,
  imageSize?: "thumbnail" | "card" | "hero"
): BlogCard {
  const image = resolveImage(post.coverImage, imageSize ?? "card");
  const hasAuthorImage = Boolean(
    post.authorImage && (post.authorImage.url || post.authorImage.sizes)
  );
  const authorImage = hasAuthorImage
    ? resolveMediaUrl(post.authorImage, "thumbnail")
    : { url: "", alt: "" };

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    image: image.url,
    imageAlt: image.alt || post.title,
    readTime: post.readTime,
    date: formatDate(post.publishedAt),
    author: post.author || "By Mahraj Engineering Team",
    authorImage: authorImage.url,
    authorImageAlt: authorImage.alt || post.author || "Article author",
    category: post.category?.title ?? "Insights",
    categorySlug: post.category?.slug ?? "",
    href: `/blog/${post.slug}`,
  };
}

function toPublicPost(
  doc: LeanDoc,
  media: Map<string, PublicMedia>,
  category?: { id: string; title: string; slug: string } | null
): PublicPost {
  const coverId = toId(doc.coverImage);
  const authorImageId = toId(doc.authorImage);
  const categoryId = toId(doc.category);
  const inlineIds = collectUploadIds(doc.content);
  const inlineMedia: Record<string, PublicMedia> = {};
  for (const id of inlineIds) {
    const item = media.get(id);
    if (item) inlineMedia[id] = item;
  }

  return {
    id: toId(doc._id),
    title: typeof doc.title === "string" ? doc.title : "",
    slug: typeof doc.slug === "string" ? doc.slug : "",
    excerpt: typeof doc.excerpt === "string" ? doc.excerpt : "",
    content: doc.content ?? null,
    coverImage: media.get(coverId) ?? null,
    seoTitle: typeof doc.seoTitle === "string" ? doc.seoTitle : "",
    seoDescription:
      typeof doc.seoDescription === "string" ? doc.seoDescription : "",
    category:
      category ??
      (isRecord(doc.category)
        ? {
            id: categoryId,
            title:
              typeof doc.category.title === "string"
                ? doc.category.title
                : "Insights",
            slug:
              typeof doc.category.slug === "string" ? doc.category.slug : "",
          }
        : null),
    author: typeof doc.author === "string" ? doc.author : "",
    authorImage: media.get(authorImageId) ?? null,
    readTime: typeof doc.readTime === "string" ? doc.readTime : "",
    publishedAt: publishedAtIso(doc.publishedAt),
    featured: Boolean(doc.featured),
    inlineMedia,
  };
}

function collectPostMediaIds(docs: LeanDoc[]) {
  const ids: string[] = [];
  for (const doc of docs) {
    const cover = toId(doc.coverImage);
    const author = toId(doc.authorImage);
    if (cover) ids.push(cover);
    if (author) ids.push(author);
    ids.push(...collectUploadIds(doc.content));
  }
  return ids;
}

async function loadCategoryMap(ids: string[]) {
  const unique = [...new Set(ids.filter((id) => isObjectId(id)))];
  const map = new Map<string, { id: string; title: string; slug: string }>();
  if (unique.length === 0) return map;

  const { Category } = await getModels();
  const docs = await Category.find({ _id: { $in: unique.map(asObjectId) } })
    .select("title slug")
    .lean();
  for (const doc of docs) {
    map.set(toId(doc._id), {
      id: toId(doc._id),
      title: typeof doc.title === "string" ? doc.title : "",
      slug: typeof doc.slug === "string" ? doc.slug : "",
    });
  }
  return map;
}

async function findCategoryIdBySlug(slug: string) {
  const { Category } = await getModels();
  const category = await Category.findOne({ slug }).select("_id").lean();
  return category ? toId(category._id) : "";
}

type ListArgs = {
  page?: number;
  limit?: number;
  categorySlug?: string;
  search?: string;
};

export async function getPosts({
  page = 1,
  limit = 6,
  categorySlug,
  search,
}: ListArgs = {}) {
  try {
    const { Post } = await getModels();
    const filter: Record<string, unknown> = { ...published };

    if (categorySlug) {
      const categoryId = await findCategoryIdBySlug(categorySlug);
      if (!categoryId) {
        return { docs: [] as BlogCard[], page, totalPages: 0, totalDocs: 0 };
      }
      filter.category = asObjectId(categoryId);
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { excerpt: { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = Math.max(0, (page - 1) * limit);
    const [docs, totalDocs] = await Promise.all([
      Post.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const [media, categories] = await Promise.all([
      loadMediaMap(collectPostMediaIds(docs)),
      loadCategoryMap(docs.map((doc) => toId(doc.category))),
    ]);

    return {
      docs: docs.map((doc) =>
        toBlogCard(toPublicPost(doc, media, categories.get(toId(doc.category))))
      ),
      page,
      totalPages: totalDocs === 0 ? 0 : Math.ceil(totalDocs / limit),
      totalDocs,
    };
  } catch {
    return { docs: [] as BlogCard[], page, totalPages: 0, totalDocs: 0 };
  }
}

export async function getFeaturedPosts(limit = 3) {
  try {
    const { Post } = await getModels();
    const docs = (await Post.find({ ...published, featured: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean()) as LeanDoc[];

    const [media, categories] = await Promise.all([
      loadMediaMap(collectPostMediaIds(docs)),
      loadCategoryMap(docs.map((doc) => toId(doc.category))),
    ]);

    return docs.map((doc) =>
      toBlogCard(toPublicPost(doc, media, categories.get(toId(doc.category))))
    );
  } catch {
    return [] as BlogCard[];
  }
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeId: string,
  limit = 3
) {
  try {
    const { Post } = await getModels();
    const filter: Record<string, unknown> = { ...published };
    if (isObjectId(excludeId)) {
      filter._id = { $ne: asObjectId(excludeId) };
    }
    if (categorySlug) {
      const categoryId = await findCategoryIdBySlug(categorySlug);
      if (categoryId) filter.category = asObjectId(categoryId);
    }

    const docs = (await Post.find(filter)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean()) as LeanDoc[];

    const [media, categories] = await Promise.all([
      loadMediaMap(collectPostMediaIds(docs)),
      loadCategoryMap(docs.map((doc) => toId(doc.category))),
    ]);

    return docs.map((doc) =>
      toBlogCard(toPublicPost(doc, media, categories.get(toId(doc.category))))
    );
  } catch {
    return [] as BlogCard[];
  }
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  if (!slug) return null;
  try {
    const { Post } = await getModels();
    const doc = (await Post.findOne({ ...published, slug }).lean()) as
      | LeanDoc
      | null;
    if (!doc) return null;

    const [media, categories] = await Promise.all([
      loadMediaMap(collectPostMediaIds([doc])),
      loadCategoryMap([toId(doc.category)]),
    ]);

    return toPublicPost(doc, media, categories.get(toId(doc.category)) ?? null);
  } catch {
    return null;
  }
}

export async function getPostSlugs() {
  try {
    const { Post } = await getModels();
    const docs = await Post.find(published).select("slug").lean();
    return docs
      .map((doc) => (typeof doc.slug === "string" ? doc.slug : ""))
      .filter(Boolean);
  } catch {
    return [] as string[];
  }
}

export function postContent(post: PublicPost): LexicalContent {
  return post.content as LexicalContent;
}
