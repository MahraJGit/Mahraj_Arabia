import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-chrome";
import { SavedBanner } from "@/components/admin/field";
import { CategoryForm } from "@/components/admin/category-form";
import { requireUser } from "@/actions/auth";
import { countPostsForCategory, getCategory } from "@/lib/blog/queries";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const { id } = await params;
  const query = await searchParams;
  const saved = Array.isArray(query.saved) ? query.saved[0] : query.saved;
  const [category, postCount] = await Promise.all([
    getCategory(id),
    countPostsForCategory(id),
  ]);
  if (!category) notFound();

  return (
    <>
      <AdminPageHeader
        title={category.title || "Edit category"}
        description="Changing a slug updates the topic filter on the public blog."
      />
      <SavedBanner value={saved} />
      <CategoryForm category={category} postCount={postCount} />
    </>
  );
}
