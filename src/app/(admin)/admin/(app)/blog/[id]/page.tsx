import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-chrome";
import { SavedBanner } from "@/components/admin/field";
import { PostForm } from "@/components/admin/post-form";
import { requireUser } from "@/actions/auth";
import { getPost, listCategoryOptions } from "@/lib/blog/queries";

export default async function EditPostPage({
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
  const [post, categories] = await Promise.all([getPost(id), listCategoryOptions()]);
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader
        title={post.title || "Edit post"}
        description="Changes to a published post appear on the live website immediately."
      />
      <SavedBanner value={saved} />
      <PostForm post={post} categories={categories} />
    </>
  );
}
