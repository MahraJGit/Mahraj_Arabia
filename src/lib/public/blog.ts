import {
  getBlogPostBySlug,
  isSupabaseContentEnabled,
  listPublishedBlogPosts,
  listPublishedBlogPostSlugs,
} from "@/lib/supabase/content";
import { getCategories } from "@/lib/public/categories";

export type BlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  author: string;
  category: string;
  categorySlug: string;
  href: string;
  tags?: string[];
};

export type { BlogCategory } from "@/lib/public/categories";
export { getCategories } from "@/lib/public/categories";

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  coverImage: { url: string; alt: string } | null;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  tags: string[];
  faqDescription: string;
  faqs: { question: string; answer: string }[];
  category: { id: string; title: string; slug: string } | null;
  author: string;
  publishedAt: string | null;
  featured: boolean;
  inlineMedia: Record<string, never>;
};

function emptyPostsPage(page = 1, limit = 6) {
  return {
    docs: [] as BlogCard[],
    page,
    totalPages: 1,
    totalDocs: 0,
    limit,
  };
}

function formatDate(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toBlogCard(
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverUrl?: string;
    coverAlt?: string;
    coverImage?: string | { url?: string; alt?: string } | null;
    categoryTitle?: string;
    categorySlug?: string;
    category?: string | { title?: string; slug?: string } | null;
    publishedAt?: string | null;
    author?: string;
    tags?: string[];
  },
  _size?: string
): BlogCard {
  const categoryTitle =
    post.categoryTitle ||
    (typeof post.category === "object" && post.category ? post.category.title : "") ||
    "";
  const categorySlug =
    post.categorySlug ||
    (typeof post.category === "object" && post.category ? post.category.slug : "") ||
    "";

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    image:
      post.coverUrl ||
      (typeof post.coverImage === "object" && post.coverImage?.url) ||
      "",
    imageAlt:
      post.coverAlt ||
      (typeof post.coverImage === "object" ? post.coverImage?.alt : undefined) ||
      post.title,
    date: formatDate(post.publishedAt),
    author: post.author || "",
    category: categoryTitle,
    categorySlug,
    href: `/blog/${post.slug}`,
    tags: post.tags || [],
  };
}

export async function getPosts({
  page = 1,
  limit = 6,
  categorySlug,
  search,
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  search?: string;
} = {}) {
  if (!isSupabaseContentEnabled()) {
    return emptyPostsPage(page, limit);
  }

  try {
    let categoryId: string | undefined;
    if (categorySlug) {
      const categories = await getCategories();
      categoryId = categories.find((item) => item.slug === categorySlug)?.id;
      if (!categoryId) {
        return emptyPostsPage(page, limit);
      }
    }

    const result = await listPublishedBlogPosts({
      page,
      limit,
      categoryId,
      search,
    });

    return {
      docs: result.rows.map((row) => toBlogCard(row)),
      page: result.page,
      totalPages: result.totalPages,
      totalDocs: result.total,
      limit,
    };
  } catch {
    return emptyPostsPage(page, limit);
  }
}

export async function getFeaturedPosts(limit = 3) {
  if (!isSupabaseContentEnabled()) return [];

  try {
    const featured = await listPublishedBlogPosts({
      page: 1,
      limit,
      featuredOnly: true,
    });
    if (featured.rows.length > 0) {
      return featured.rows.map((row) => toBlogCard(row));
    }

    // No featured flag set — show latest published posts instead of static demos.
    const latest = await listPublishedBlogPosts({ page: 1, limit });
    return latest.rows.map((row) => toBlogCard(row));
  } catch {
    return [];
  }
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeId: string,
  limit = 3
) {
  if (!isSupabaseContentEnabled()) return [];

  try {
    const categories = await getCategories();
    const categoryId = categories.find((item) => item.slug === categorySlug)?.id;
    const result = await listPublishedBlogPosts({
      page: 1,
      limit,
      categoryId,
      excludeId,
    });
    return result.rows.map((row) => toBlogCard(row));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  if (!isSupabaseContentEnabled()) return null;

  try {
    const post = await getBlogPostBySlug(slug, true);
    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverUrl
        ? { url: post.coverUrl, alt: post.coverAlt || post.title }
        : null,
      seoTitle: post.metaTitle || post.title,
      seoDescription: post.metaDescription || post.excerpt,
      focusKeyword: post.focusKeyword,
      tags: post.tags,
      faqDescription: post.faqDescription || "",
      faqs: post.faqs,
      category: post.category
        ? {
            id: post.category,
            title: post.categoryTitle,
            slug: post.categorySlug,
          }
        : null,
      author: post.author,
      publishedAt: post.publishedAt || null,
      featured: post.featured,
      inlineMedia: {},
    };
  } catch {
    return null;
  }
}

export async function getPostSlugs() {
  if (!isSupabaseContentEnabled()) return [];
  try {
    return await listPublishedBlogPostSlugs();
  } catch {
    return [];
  }
}
