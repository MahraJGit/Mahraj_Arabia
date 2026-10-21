import { isDemoMode } from "@/lib/auth/demo";
import {
  getDemoCategories,
  getDemoCategory,
  getDemoCategoryOptions,
  getDemoPost,
  getDemoPosts,
} from "@/lib/cms/demo-data";
import type { InlineMedia } from "@/lib/cms/lexical";
import type { PublishStatus } from "@/lib/cms/types";
import { isUuid } from "@/lib/db/ids";
import {
  countBlogPostsForCategory,
  getBlogCategory,
  getBlogCategoryOptions,
  getBlogPost,
  isSupabaseContentEnabled,
  listBlogCategories,
  listBlogPosts,
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
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  tags?: string[];
  faqDescription?: string;
  faqs?: { question: string; answer: string }[];
  category: string;
  author: string;
  authorRole: string;
  authorImage: string;
  authorImageUrl: string;
  authorImageAlt: string;
  authorImageFilename: string;
  authorImageWidth: number | null;
  authorImageHeight: number | null;
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

export async function listPosts(query: ListQuery = {}) {
  if (isSupabaseContentEnabled()) {
    return listBlogPosts({
      q: query.q,
      status: query.status === "draft" || query.status === "published" ? query.status : "all",
      category: query.category,
      featured: query.featured,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    });
  }

  if (!isDemoMode()) {
    return {
      items: [] as PostListItem[],
      total: 0,
      page: 1,
      pageCount: 1,
      counts: { all: 0, published: 0, draft: 0 },
    };
  }

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
    items = items.filter((item) => getDemoPost(item.id)?.category === query.category);
  }
  if (query.featured === "featured") {
    items = items.filter((item) => item.featured);
  } else if (query.featured === "standard") {
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

export async function listCategoryOptions(): Promise<CategoryOption[]> {
  if (isSupabaseContentEnabled()) return getBlogCategoryOptions();
  if (isDemoMode()) return getDemoCategoryOptions();
  return [];
}

export async function listCategories(): Promise<CategoryListItem[]> {
  if (isDemoMode() && !isSupabaseContentEnabled()) {
    return getDemoCategories();
  }
  if (!isSupabaseContentEnabled()) return [];

  const categories = await listBlogCategories();
  const counts = await Promise.all(
    categories.map(async (category) => [category.id, await countBlogPostsForCategory(category.id)] as const)
  );
  const countById = new Map(counts);
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

export async function getCategory(id: string): Promise<CategoryRecord | null> {
  if (isDemoMode() && !isSupabaseContentEnabled()) {
    return getDemoCategory(id);
  }
  if (!isUuid(id) || !isSupabaseContentEnabled()) return null;
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

export async function countPostsForCategory(id: string) {
  if (isSupabaseContentEnabled()) return countBlogPostsForCategory(id);
  if (isDemoMode()) {
    const category = getDemoCategory(id);
    if (!category) return 0;
    return getDemoPosts().filter((post) => getDemoPost(post.id)?.category === category.id).length;
  }
  return 0;
}

export async function getPost(id: string): Promise<PostRecord | null> {
  if (isSupabaseContentEnabled()) {
    if (!isUuid(id)) return null;
    return getBlogPost(id);
  }
  if (isDemoMode()) return getDemoPost(id);
  return null;
}
