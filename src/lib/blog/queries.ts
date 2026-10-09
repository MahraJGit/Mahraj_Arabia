import { asObjectId, isContentId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { isDemoMode } from "@/lib/auth/demo";
import {
  getDemoCategories,
  getDemoCategory,
  getDemoCategoryOptions,
  getDemoPost,
  getDemoPosts,
} from "@/lib/cms/demo-data";
import { collectUploadIds, type InlineMedia } from "@/lib/cms/lexical";
import { publishStatus } from "@/lib/cms/status";
import type { PublishStatus } from "@/lib/cms/types";
import {
  getBlogCategory,
  getBlogCategoryOptions,
  isSupabaseContentEnabled,
  listBlogCategories,
} from "@/lib/supabase/content";

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  categoryTitle: string;
  author: string;
  featured: boolean;
  status: PublishStatus;
  publishedAt: string;
  updatedAt: string;
  coverUrl: string;
};

export type CategoryOption = {
  id: string;
  title: string;
  slug: string;
};

export type CategoryListItem = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  postCount: number;
  updatedAt: string;
  imageUrl: string;
};

export type CategoryRecord = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  imageUrl: string;
  imageAlt: string;
  imageFilename: string;
  imageWidth: number | null;
  imageHeight: number | null;
};

export type PostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  coverImage: string;
  coverUrl: string;
  coverAlt: string;
  coverFilename: string;
  coverWidth: number | null;
  coverHeight: number | null;
  seoTitle: string;
  seoDescription: string;
  category: string;
  author: string;
  authorImage: string;
  authorImageUrl: string;
  authorImageAlt: string;
  authorImageFilename: string;
  authorImageWidth: number | null;
  authorImageHeight: number | null;
  readTime: string;
  publishedAt: string;
  featured: boolean;
  status: PublishStatus;
  inlineMedia: Record<string, InlineMedia>;
};

type ListQuery = {
  q?: string;
  status?: "all" | "draft" | "published";
  category?: string;
  featured?: "all" | "featured" | "standard";
  sort?: "published" | "updated" | "title";
  page?: number;
  limit?: number;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function when(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

function dateInput(value: unknown) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mediaRef(value: unknown) {
  if (!value) {
    return {
      id: "",
      url: "",
      alt: "",
      filename: "",
      width: null as number | null,
      height: null as number | null,
    };
  }
  if (typeof value === "string") {
    return { id: value, url: "", alt: "", filename: "", width: null, height: null };
  }
  const media = value as {
    _id?: unknown;
    url?: string;
    alt?: string;
    filename?: string;
    width?: number;
    height?: number;
  };
  return {
    id: toId(media._id ?? value),
    url: String(media.url ?? ""),
    alt: String(media.alt ?? ""),
    filename: String(media.filename ?? ""),
    width: typeof media.width === "number" ? media.width : null,
    height: typeof media.height === "number" ? media.height : null,
  };
}

export async function listPosts(query: ListQuery = {}) {
  if (isDemoMode()) {
    const page = Math.max(1, query.page ?? 1);
    const limit = query.limit ?? 25;
    let items = getDemoPosts();
    if (query.q?.trim()) {
      const q = query.q.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q)
      );
    }
    if (query.status === "draft" || query.status === "published") {
      items = items.filter((item) => item.status === query.status);
    }
    if (query.category) {
      items = items.filter((item) => {
        const full = getDemoPost(item.id);
        return full?.category === query.category;
      });
    }
    if (query.featured === "featured") {
      items = items.filter((item) => item.featured);
    }
    if (query.featured === "standard") {
      items = items.filter((item) => !item.featured);
    }
    if (query.sort === "title") {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (query.sort === "updated") {
      items = [...items].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    }
    const all = getDemoPosts();
    const total = items.length;
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / limit)),
      counts: {
        all: all.length,
        published: all.filter((item) => item.status === "published").length,
        draft: all.filter((item) => item.status === "draft").length,
      },
    };
  }

  const { Post } = await getModels();
  const page = Math.max(1, query.page ?? 1);
  const limit = query.limit ?? 25;
  const filter: Record<string, unknown> = {};

  if (query.q?.trim()) {
    const rx = new RegExp(escapeRegex(query.q.trim()), "i");
    filter.$or = [{ title: rx }, { slug: rx }, { author: rx }, { excerpt: rx }];
  }
  if (query.status === "draft" || query.status === "published") {
    filter._status = query.status;
  }
  if (query.category && isContentId(query.category)) {
    filter.category = query.category;
  }
  if (query.featured === "featured") filter.featured = true;
  if (query.featured === "standard") {
    filter.$and = [
      ...(Array.isArray(filter.$and) ? filter.$and : []),
      { $or: [{ featured: { $ne: true } }, { featured: { $exists: false } }] },
    ];
  }

  const sort =
    query.sort === "title"
      ? { title: 1 as const }
      : query.sort === "updated"
        ? { updatedAt: -1 as const }
        : { publishedAt: -1 as const, updatedAt: -1 as const };

  const statusless: Record<string, unknown> = { ...filter };
  delete statusless._status;

  const [docs, total, allCount, publishedCount, draftCount] = await Promise.all([
    Post.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("coverImage", "url alt filename")
      .lean(),
    Post.countDocuments(filter),
    Post.countDocuments(statusless),
    Post.countDocuments({ ...statusless, _status: "published" }),
    Post.countDocuments({ ...statusless, _status: "draft" }),
  ]);

  const categoryIds = [
    ...new Set(docs.map((doc) => toId(doc.category)).filter(Boolean)),
  ];
  const categoryTitles = new Map<string, string>();
  if (isSupabaseContentEnabled()) {
    const categories = await listBlogCategories();
    for (const category of categories) {
      categoryTitles.set(category.id, category.title);
    }
  }
  const unresolved = categoryIds.filter(
    (id) => isObjectId(id) && !categoryTitles.has(id)
  );
  if (unresolved.length > 0) {
    const { Category } = await getModels();
    const categories = await Category.find({
      _id: { $in: unresolved.map(asObjectId) },
    })
      .select("title")
      .lean();
    for (const category of categories) {
      categoryTitles.set(toId(category._id), String(category.title ?? "—"));
    }
  }

  const items: PostListItem[] = docs.map((doc) => {
    const categoryId = toId(doc.category);
    const cover = mediaRef(doc.coverImage);
    return {
      id: toId(doc._id),
      title: String(doc.title ?? "Untitled"),
      slug: String(doc.slug ?? ""),
      categoryTitle: categoryTitles.get(categoryId) ?? "—",
      author: String(doc.author ?? "By Mahraj Engineering Team"),
      featured: Boolean(doc.featured),
      status: publishStatus(doc._status),
      publishedAt: dateInput(doc.publishedAt),
      updatedAt: when(doc.updatedAt),
      coverUrl: cover.url,
    };
  });

  return {
    items,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
    counts: {
      all: allCount,
      published: publishedCount,
      draft: draftCount,
    },
  };
}

export async function listCategoryOptions(): Promise<CategoryOption[]> {
  if (isDemoMode()) {
    return getDemoCategoryOptions();
  }
  if (isSupabaseContentEnabled()) {
    return getBlogCategoryOptions();
  }
  const { Category } = await getModels();
  const docs = await Category.find().sort({ title: 1 }).select("title slug").lean();
  return docs.map((doc) => ({
    id: toId(doc._id),
    title: String(doc.title ?? "Untitled"),
    slug: String(doc.slug ?? ""),
  }));
}

export async function listCategories(): Promise<CategoryListItem[]> {
  if (isDemoMode()) {
    return getDemoCategories();
  }

  const { Post } = await getModels();
  const counts = await Post.aggregate<{ _id: unknown; count: number }>([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countById = new Map(counts.map((row) => [toId(row._id), row.count]));

  if (isSupabaseContentEnabled()) {
    const categories = await listBlogCategories();
    return categories.map((category) => ({
      id: category.id,
      title: category.title || "Untitled",
      slug: category.slug,
      subtitle: category.subtitle,
      postCount: countById.get(category.id) ?? 0,
      updatedAt: category.updatedAt,
      imageUrl: category.imageUrl,
    }));
  }

  const { Category } = await getModels();
  const docs = await Category.find()
    .sort({ title: 1 })
    .populate("image", "url")
    .lean();

  return docs.map((doc) => {
    const image = mediaRef(doc.image);
    return {
      id: toId(doc._id),
      title: String(doc.title ?? "Untitled"),
      slug: String(doc.slug ?? ""),
      subtitle: String(doc.subtitle ?? ""),
      postCount: countById.get(toId(doc._id)) ?? 0,
      updatedAt: when(doc.updatedAt),
      imageUrl: image.url,
    };
  });
}

export async function getCategory(id: string): Promise<CategoryRecord | null> {
  if (isDemoMode()) {
    return getDemoCategory(id);
  }
  if (!isContentId(id)) return null;

  if (isSupabaseContentEnabled()) {
    const category = await getBlogCategory(id);
    if (!category) return null;
    return {
      id: category.id,
      title: category.title,
      slug: category.slug,
      subtitle: category.subtitle,
      image: category.image,
      imageUrl: category.imageUrl,
      imageAlt: category.imageAlt,
      imageFilename: category.imageFilename,
      imageWidth: category.imageWidth,
      imageHeight: category.imageHeight,
    };
  }

  if (!isObjectId(id)) return null;
  const { Category } = await getModels();
  const doc = await Category.findById(id).populate("image").lean();
  if (!doc) return null;
  const image = mediaRef(doc.image);
  return {
    id: toId(doc._id),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    subtitle: String(doc.subtitle ?? ""),
    image: image.id,
    imageUrl: image.url,
    imageAlt: image.alt,
    imageFilename: image.filename,
    imageWidth: image.width,
    imageHeight: image.height,
  };
}

export async function countPostsForCategory(id: string) {
  if (isDemoMode()) {
    const category = getDemoCategory(id);
    if (!category) return 0;
    return getDemoPosts().filter((post) => {
      const full = getDemoPost(post.id);
      return full?.category === category.id;
    }).length;
  }
  if (!isContentId(id)) return 0;
  const { Post } = await getModels();
  return Post.countDocuments({ category: id });
}

export async function getPost(id: string): Promise<PostRecord | null> {
  if (isDemoMode()) {
    return getDemoPost(id);
  }
  if (!isObjectId(id)) return null;
  const { Post, Media } = await getModels();
  const doc = await Post.findById(id)
    .populate("coverImage")
    .populate("authorImage")
    .lean();
  if (!doc) return null;

  const cover = mediaRef(doc.coverImage);
  const authorImage = mediaRef(doc.authorImage);
  const uploadIds = collectUploadIds(doc.content).filter(
    (mediaId) => mediaId !== cover.id && mediaId !== authorImage.id
  );
  const inlineMedia: Record<string, InlineMedia> = {};
  if (uploadIds.length > 0) {
    const extras = await Media.find({ _id: { $in: uploadIds.map(asObjectId) } })
      .select("url alt filename width height")
      .lean();
    for (const media of extras) {
      const item = mediaRef(media);
      inlineMedia[item.id] = {
        url: item.url,
        alt: item.alt,
        filename: item.filename,
        width: item.width,
        height: item.height,
      };
    }
  }

  return {
    id: toId(doc._id),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    content: doc.content ?? null,
    coverImage: cover.id,
    coverUrl: cover.url,
    coverAlt: cover.alt,
    coverFilename: cover.filename,
    coverWidth: cover.width,
    coverHeight: cover.height,
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    category: toId(doc.category),
    author: String(doc.author ?? "By Mahraj Engineering Team"),
    authorImage: authorImage.id,
    authorImageUrl: authorImage.url,
    authorImageAlt: authorImage.alt,
    authorImageFilename: authorImage.filename,
    authorImageWidth: authorImage.width,
    authorImageHeight: authorImage.height,
    readTime: String(doc.readTime ?? ""),
    publishedAt: dateInput(doc.publishedAt),
    featured: Boolean(doc.featured),
    status: publishStatus(doc._status),
    inlineMedia,
  };
}
