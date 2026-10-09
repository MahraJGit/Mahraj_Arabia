import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type {
  BlogCategoryRow,
  BlogCategoryWrite,
} from "@/lib/supabase/content/types";

function client() {
  return getSupabaseAdminClient();
}

function asCategory(row: BlogCategoryRow) {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    subtitle: String(row.subtitle ?? ""),
    image: String(row.image_id ?? ""),
    imageUrl: String(row.image_url ?? ""),
    imageAlt: String(row.image_alt ?? ""),
    imageFilename: String(row.image_filename ?? ""),
    imageWidth: typeof row.image_width === "number" ? row.image_width : null,
    imageHeight: typeof row.image_height === "number" ? row.image_height : null,
    updatedAt: String(row.updated_at ?? ""),
  };
}

export async function listBlogCategories() {
  const { data, error } = await client()
    .from("blog_categories")
    .select("*")
    .order("title", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as BlogCategoryRow[]).map(asCategory);
}

export async function getBlogCategory(id: string) {
  const { data, error } = await client()
    .from("blog_categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return asCategory(data as BlogCategoryRow);
}

export async function findBlogCategoryBySlug(slug: string, excludeId?: string) {
  let query = client()
    .from("blog_categories")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? String(data.id) : null;
}

export async function insertBlogCategory(input: BlogCategoryWrite) {
  const { data, error } = await client()
    .from("blog_categories")
    .insert({
      title: input.title,
      slug: input.slug,
      subtitle: input.subtitle || "",
      image_id: input.imageId,
      image_url: input.imageUrl || "",
      image_alt: input.imageAlt || "",
      image_filename: input.imageFilename || "",
      image_width: input.imageWidth,
      image_height: input.imageHeight,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { id: null as string | null, duplicateSlug: true as const };
    }
    throw new Error(error.message);
  }

  return { id: String(data.id), duplicateSlug: false as const };
}

export async function updateBlogCategory(id: string, input: BlogCategoryWrite) {
  const { data, error } = await client()
    .from("blog_categories")
    .update({
      title: input.title,
      slug: input.slug,
      subtitle: input.subtitle || "",
      image_id: input.imageId,
      image_url: input.imageUrl || "",
      image_alt: input.imageAlt || "",
      image_filename: input.imageFilename || "",
      image_width: input.imageWidth,
      image_height: input.imageHeight,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, duplicateSlug: true as const };
    }
    throw new Error(error.message);
  }

  if (!data) return { ok: false as const, duplicateSlug: false as const };
  return { ok: true as const, duplicateSlug: false as const };
}

export async function deleteBlogCategory(id: string) {
  const { error } = await client().from("blog_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getBlogCategoryOptions() {
  const categories = await listBlogCategories();
  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    slug: category.slug,
  }));
}
