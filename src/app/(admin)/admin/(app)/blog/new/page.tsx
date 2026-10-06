import { AdminPageHeader } from "@/components/admin/page-chrome";
import { PostForm } from "@/components/admin/post-form";
import { requireUser } from "@/actions/auth";
import { listCategoryOptions } from "@/lib/blog/queries";

export default async function NewPostPage() {
  await requireUser();
  const categories = await listCategoryOptions();

  return (
    <>
      <AdminPageHeader
        title="New post"
        description="Save a draft at any time. Publish when the excerpt, cover image, category, and article are ready."
      />
      <PostForm categories={categories} />
    </>
  );
}
