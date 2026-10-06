import { AdminPageHeader } from "@/components/admin/page-chrome";
import { CategoryForm } from "@/components/admin/category-form";
import { requireUser } from "@/actions/auth";

export default async function NewCategoryPage() {
  await requireUser();

  return (
    <>
      <AdminPageHeader
        title="New category"
        description="Categories are used by blog posts for topic filters. Saving makes the category available immediately."
      />
      <CategoryForm />
    </>
  );
}
