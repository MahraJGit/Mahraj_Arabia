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
        title="Upload blog"
        description="Cover image, tags, SEO, rich content, and publishing state are stored in Supabase."
      />
      <PostForm categories={categories} />
    </>
  );
}
