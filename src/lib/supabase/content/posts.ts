import type { PublishStatus } from "@/lib/cms/types";
import { emptyLexicalDoc } from "@/lib/cms/lexical";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { BlogPostRow, BlogPostWrite, FaqItem } from "@/lib/supabase/content/types";

function client() {
  return getSupabaseAdminClient();
}

function asFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      return {
        question: String(row.question ?? "").trim(),
        answer: String(row.answer ?? "").trim(),
      };
    })
    .filter((item) => item.question && item.answer);
}

function asTags(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 8);
}

function metaTitle(row: BlogPostRow) {
  return String(row.meta_title || row.seo_title || "");
}

function metaDescription(row: BlogPostRow) {
  return String(row.meta_description || row.seo_description || "");
}

export function asBlogPostRecord(row: BlogPostRow, categoryTitle = "") {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: row.content ?? emptyLexicalDoc(),
    coverImage: String(row.cover_image_id ?? ""),
    coverUrl: String(row.cover_image_url ?? ""),
    coverAlt: String(row.cover_image_alt ?? ""),
    coverFilename: String(row.cover_image_filename ?? ""),
    coverWidth: typeof row.cover_image_width === "number" ? row.cover_image_width : null,
    coverHeight: typeof row.cover_image_height === "number" ? row.cover_image_height : null,
    category: String(row.category_id ?? ""),
    categoryTitle,
    status: (row.status === "published" ? "published" : "draft") as PublishStatus,
    tags: asTags(row.tags),
    metaTitle: metaTitle(row),
    metaDescription: metaDescription(row),
    focusKeyword: String(row.focus_keyword ?? ""),
    faqDescription: String(row.faq_intro ?? ""),
    faqs: asFaqs(row.faqs),
    publishedAt: row.published_at ? String(row.published_at) : "",
    updatedAt: String(row.updated_at ?? ""),
    // compatibility aliases used by older admin list UI
    seoTitle: metaTitle(row),
    seoDescription: metaDescription(row),
    author: String(row.author ?? ""),
    featured: Boolean(row.featured),
    inlineMedia: {} as Record<string, never>,
  };
}

function toWriteRow(input: BlogPostWrite) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt || "",
    content: input.content ?? emptyLexicalDoc(),
    cover_image_id: input.coverImageId,
    cover_image_url: input.coverImageUrl || "",
    cover_image_alt: input.coverImageAlt || "",
    cover_image_filename: input.coverImageFilename || "",
    cover_image_width: input.coverImageWidth,
    cover_image_height: input.coverImageHeight,
    category_id: input.categoryId,
    status: input.status,
    tags: input.tags.slice(0, 8),
    meta_title: input.metaTitle || "",
    meta_description: input.metaDescription || "",
    focus_keyword: input.focusKeyword || "",
    faq_intro: input.faqDescription || "",
    faqs: input.faqs,
    published_at: input.publishedAt,
    // keep legacy columns populated for safety
    seo_title: input.metaTitle || "",
    seo_description: input.metaDescription || "",
    featured: Boolean(input.featured),
    author: input.author || "",
  };
}

export async function listBlogPosts(filters?: {
  q?: string;
  status?: "all" | PublishStatus;
  category?: string;
  sort?: "published" | "updated" | "title";
  page?: number;
  limit?: number;
}) {
  let query = client().from("blog_posts").select("*", { count: "exact" });

  if (filters?.status === "published" || filters?.status === "draft") {
    query = query.eq("status", filters.status);
  }
  if (filters?.category) query = query.eq("category_id", filters.category);

  if (filters?.sort === "title") query = query.order("title", { ascending: true });
  else if (filters?.sort === "updated") query = query.order("updated_at", { ascending: false });
  else {
    query = query
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false });
  }

  const page = Math.max(1, filters?.page ?? 1);
  const limit = filters?.limit ?? 25;
  const from = (page - 1) * limit;
  const { data, error, count } = await query.range(from, from + limit - 1);
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as BlogPostRow[];
  const q = filters?.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.excerpt.toLowerCase().includes(q)
    );
  }

  const categoryIds = [...new Set(rows.map((row) => row.category_id).filter(Boolean))] as string[];
  const titles = new Map<string, string>();
  if (categoryIds.length > 0) {
    const { data: categories } = await client()
      .from("blog_categories")
      .select("id, title")
      .in("id", categoryIds);
    for (const category of categories ?? []) {
      titles.set(String(category.id), String(category.title ?? ""));
    }
  }

  const [allRes, publishedRes, draftRes] = await Promise.all([
    client().from("blog_posts").select("id", { count: "exact", head: true }),
    client().from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    client().from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  return {
    items: rows.map((row) => {
      const record = asBlogPostRecord(row, titles.get(String(row.category_id ?? "")) ?? "");
      return {
        id: record.id,
        title: record.title,
        slug: record.slug,
        categoryTitle: record.categoryTitle || "—",
        author: record.author,
        featured: record.featured,
        status: record.status,
        publishedAt: record.publishedAt,
        updatedAt: record.updatedAt,
        coverUrl: record.coverUrl,
      };
    }),
    total: count ?? rows.length,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? rows.length) / limit)),
    counts: {
      all: allRes.count ?? 0,
      published: publishedRes.count ?? 0,
      draft: draftRes.count ?? 0,
    },
  };
}

export async function getBlogPost(id: string) {
  const { data, error } = await client()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as BlogPostRow;
  let categoryTitle = "";
  if (row.category_id) {
    const { data: category } = await client()
      .from("blog_categories")
      .select("title")
      .eq("id", row.category_id)
      .maybeSingle();
    categoryTitle = String(category?.title ?? "");
  }
  return asBlogPostRecord(row, categoryTitle);
}

export async function getBlogPostBySlug(slug: string, publishedOnly = false) {
  let query = client().from("blog_posts").select("*").eq("slug", slug);
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as BlogPostRow;
  let categoryTitle = "";
  let categorySlug = "";
  if (row.category_id) {
    const { data: category } = await client()
      .from("blog_categories")
      .select("title, slug")
      .eq("id", row.category_id)
      .maybeSingle();
    categoryTitle = String(category?.title ?? "");
    categorySlug = String(category?.slug ?? "");
  }

  return {
    ...asBlogPostRecord(row, categoryTitle),
    categorySlug,
  };
}

export async function findBlogPostBySlug(slug: string, excludeId?: string) {
  let query = client().from("blog_posts").select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? String(data.id) : null;
}

export async function insertBlogPost(input: BlogPostWrite) {
  const { data, error } = await client()
    .from("blog_posts")
    .insert(toWriteRow(input))
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return { id: null as string | null, duplicateSlug: true as const };
    throw new Error(error.message);
  }
  return { id: String(data.id), duplicateSlug: false as const };
}

export async function updateBlogPost(id: string, input: BlogPostWrite) {
  const { data, error } = await client()
    .from("blog_posts")
    .update(toWriteRow(input))
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    if (error.code === "23505") return { ok: false as const, duplicateSlug: true as const };
    throw new Error(error.message);
  }
  if (!data) return { ok: false as const, duplicateSlug: false as const };
  return { ok: true as const, duplicateSlug: false as const };
}

export async function deleteBlogPost(id: string) {
  const { data, error } = await client()
    .from("blog_posts")
    .delete()
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? String(data.slug ?? "") : "";
}

export async function countBlogPostsForCategory(categoryId: string) {
  const { count, error } = await client()
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function listPublishedBlogPostSlugs() {
  const { data, error } = await client()
    .from("blog_posts")
    .select("slug")
    .eq("status", "published")
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => String(row.slug ?? "")).filter(Boolean);
}

export async function listPublishedBlogPosts(filters?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  excludeId?: string;
  featuredOnly?: boolean;
}) {
  const page = Math.max(1, filters?.page ?? 1);
  const limit = filters?.limit ?? 6;
  let query = client()
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (filters?.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters?.excludeId) query = query.neq("id", filters.excludeId);
  if (filters?.featuredOnly) query = query.eq("featured", true);

  const from = (page - 1) * limit;
  const { data, error, count } = await query.range(from, from + limit - 1);
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as BlogPostRow[];
  const search = filters?.search?.trim().toLowerCase();
  if (search) {
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(search) ||
        row.excerpt.toLowerCase().includes(search) ||
        asTags(row.tags).some((tag) => tag.toLowerCase().includes(search))
    );
  }

  const categoryIds = [...new Set(rows.map((row) => row.category_id).filter(Boolean))] as string[];
  const categoryMap = new Map<string, { title: string; slug: string }>();
  if (categoryIds.length > 0) {
    const { data: categories } = await client()
      .from("blog_categories")
      .select("id, title, slug")
      .in("id", categoryIds);
    for (const category of categories ?? []) {
      categoryMap.set(String(category.id), {
        title: String(category.title ?? ""),
        slug: String(category.slug ?? ""),
      });
    }
  }

  return {
    rows: rows.map((row) => {
      const category = categoryMap.get(String(row.category_id ?? ""));
      return {
        ...asBlogPostRecord(row, category?.title ?? ""),
        categorySlug: category?.slug ?? "",
      };
    }),
    total: count ?? rows.length,
    page,
    totalPages: Math.max(1, Math.ceil((count ?? rows.length) / limit)),
  };
}
