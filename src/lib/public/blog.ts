import {
  getArabiaFeaturedPosts,
  getArabiaPostBySlug,
  getArabiaPostSlugs,
  getArabiaPostsList,
  getArabiaRelatedPosts,
} from "@/content/arabia-posts";
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
  readTime: string;
  date: string;
  author: string;
  authorImage: string;
  authorImageAlt: string;
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
  faqs: { question: string; answer: string }[];
  category: { id: string; title: string; slug: string } | null;
  author: string;
  authorImage: null;
  readTime: string;
  publishedAt: string | null;
  featured: boolean;
  inlineMedia: Record<string, never>;
};

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
    readTime?: string;
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
      "/images/profile/porta-cabin-site-office.png",
    imageAlt:
      post.coverAlt ||
      (typeof post.coverImage === "object" ? post.coverImage?.alt : undefined) ||
      post.title,
    readTime: post.readTime || "",
    date: formatDate(post.publishedAt),
    author: post.author || "",
    authorImage: "",
    authorImageAlt: "",
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
    return getArabiaPostsList({ page, limit, categorySlug, search });
  }

  try {
    let categoryId: string | undefined;
    if (categorySlug) {
      const categories = await getCategories();
      categoryId = categories.find((item) => item.slug === categorySlug)?.id;
      if (!categoryId) {
        return getArabiaPostsList({ page, limit, categorySlug, search });
      }
    }

    const result = await listPublishedBlogPosts({
      page,
      limit,
      categoryId,
      search,
    });

    if (result.total === 0 && !categorySlug && !search) {
      return getArabiaPostsList({ page, limit, categorySlug, search });
    }

    return {
      docs: result.rows.map((row) => toBlogCard(row)),
      page: result.page,
      totalPages: result.totalPages,
      totalDocs: result.total,
    };
  } catch {
    return getArabiaPostsList({ page, limit, categorySlug, search });
  }
}

export async function getFeaturedPosts(limit = 3) {
  if (!isSupabaseContentEnabled()) return getArabiaFeaturedPosts(limit);
  try {
    const result = await listPublishedBlogPosts({ page: 1, limit });
    if (result.rows.length === 0) return getArabiaFeaturedPosts(limit);
    return result.rows.map((row) => toBlogCard(row));
  } catch {
    return getArabiaFeaturedPosts(limit);
  }
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeId: string,
  limit = 3
) {
  if (!isSupabaseContentEnabled()) {
    return getArabiaRelatedPosts(categorySlug, excludeId, limit);
  }
  try {
    const categories = await getCategories();
    const categoryId = categories.find((item) => item.slug === categorySlug)?.id;
    const result = await listPublishedBlogPosts({
      page: 1,
      limit,
      categoryId,
      excludeId,
    });
    if (result.rows.length === 0) {
      return getArabiaRelatedPosts(categorySlug, excludeId, limit);
    }
    return result.rows.map((row) => toBlogCard(row));
  } catch {
    return getArabiaRelatedPosts(categorySlug, excludeId, limit);
  }
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  if (!isSupabaseContentEnabled()) return getArabiaPostBySlug(slug);

  try {
    const post = await getBlogPostBySlug(slug, true);
    if (!post) return getArabiaPostBySlug(slug);

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
      faqs: post.faqs,
      category: post.category
        ? {
            id: post.category,
            title: post.categoryTitle,
            slug: post.categorySlug,
          }
        : null,
      author: "",
      authorImage: null,
      readTime: "",
      publishedAt: post.publishedAt || null,
      featured: false,
      inlineMedia: {},
    };
  } catch {
    return getArabiaPostBySlug(slug);
  }
}

export async function getPostSlugs() {
  if (!isSupabaseContentEnabled()) return getArabiaPostSlugs();
  try {
    const slugs = await listPublishedBlogPostSlugs();
    return slugs.length > 0 ? slugs : getArabiaPostSlugs();
  } catch {
    return getArabiaPostSlugs();
  }
}
