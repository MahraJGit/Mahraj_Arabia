import { revalidatePath } from "next/cache";

export async function revalidateServicePaths(slug?: string | null) {
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/");
  if (slug) revalidatePath(`/services/${slug}`);
}

export async function revalidateBlogPaths(slug?: string | null) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}
