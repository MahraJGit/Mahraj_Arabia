import {
  countBlogPostsForCategory,
  isSupabaseContentEnabled,
  listBlogCategories,
} from "@/lib/supabase/content";

export type BlogCategory = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  postCount: number;
};

export async function getCategories(): Promise<BlogCategory[]> {
  if (!isSupabaseContentEnabled()) return [];

  try {
    const categories = await listBlogCategories();

    const counts = await Promise.all(
      categories.map(
        async (category) =>
          [category.id, await countBlogPostsForCategory(category.id)] as const
      )
    );
    const countById = new Map(counts);

    return categories.map((category) => ({
      id: category.id,
      title: category.title,
      slug: category.slug,
      subtitle: category.subtitle,
      image: category.imageUrl?.trim() || "",
      postCount: countById.get(category.id) ?? 0,
    }));
  } catch {
    return [];
  }
}
