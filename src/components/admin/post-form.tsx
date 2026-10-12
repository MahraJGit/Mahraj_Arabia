"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deletePost, savePost } from "@/actions/posts";
import { CoverUpload, type CoverValue } from "@/components/admin/cover-upload";
import { CharCount, Field } from "@/components/admin/field";
import { FaqEditor } from "@/components/admin/faq-editor";
import {
  FormActionBar,
  FormPanel,
  FormSelect,
  FormShell,
  FormSidebar,
  SidebarBlock,
} from "@/components/admin/form-shell";
import { LexicalEditor } from "@/components/admin/lexical-editor";
import { PublishStatusBanner } from "@/components/admin/publish-banner";
import { TagsInput } from "@/components/admin/tags-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyLexicalDoc } from "@/lib/cms/lexical";
import { slugify } from "@/lib/cms/slug";
import type { CategoryOption, PostRecord } from "@/lib/blog/queries";
import type { PostInput } from "@/lib/validation/post";

function emptyPost(): PostInput {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: emptyLexicalDoc(),
    coverImageId: "",
    coverImageUrl: "",
    coverImageAlt: "",
    coverImageFilename: "",
    coverImageWidth: null,
    coverImageHeight: null,
    category: "",
    author: "",
    featured: false,
    tags: [],
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    faqDescription: "",
    faqs: [],
    _status: "draft",
  };
}

function fromRecord(post: PostRecord): PostInput {
  return {
    ...emptyPost(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content ?? emptyLexicalDoc(),
    coverImageId: post.coverImage,
    coverImageUrl: post.coverUrl,
    coverImageAlt: post.coverAlt,
    coverImageFilename: post.coverFilename,
    coverImageWidth: post.coverWidth,
    coverImageHeight: post.coverHeight,
    category: post.category,
    author: post.author || "",
    featured: Boolean(post.featured),
    tags: Array.isArray((post as { tags?: string[] }).tags)
      ? ((post as { tags?: string[] }).tags ?? [])
      : [],
    metaTitle: post.seoTitle || (post as { metaTitle?: string }).metaTitle || "",
    metaDescription:
      post.seoDescription || (post as { metaDescription?: string }).metaDescription || "",
    focusKeyword: (post as { focusKeyword?: string }).focusKeyword || "",
    faqDescription: (post as { faqDescription?: string }).faqDescription || "",
    faqs: Array.isArray((post as { faqs?: PostInput["faqs"] }).faqs)
      ? ((post as { faqs?: PostInput["faqs"] }).faqs ?? [])
      : [],
    _status: post.status,
  };
}

export function PostForm({
  post,
  categories,
}: {
  post?: PostRecord;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<PostInput>(post ? fromRecord(post) : emptyPost());
  const [slugLocked, setSlugLocked] = useState(Boolean(post?.slug));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const published = post?.status === "published";
  const generated = useMemo(() => slugify(values.title), [values.title]);
  const slug = slugLocked ? values.slug : generated;

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  function update<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  function setCover(next: CoverValue | null) {
    update("coverImageId", next?.id ?? "");
    update("coverImageUrl", next?.url ?? "");
    update("coverImageAlt", next?.alt ?? values.coverImageAlt ?? "");
    update("coverImageFilename", next?.filename ?? "");
    update("coverImageWidth", next?.width ?? null);
    update("coverImageHeight", next?.height ?? null);
  }

  function submit(status: "draft" | "published") {
    const payload: PostInput = {
      ...values,
      slug,
      _status: status,
    };
    start(async () => {
      setError(null);
      setErrors({});
      const result = await savePost(post?.id ?? null, payload);
      if (result?.error) setError(result.error);
      if (result?.fieldErrors) setErrors(result.fieldErrors);
      if (result?.href) {
        setDirty(false);
        router.push(result.href);
        router.refresh();
      }
    });
  }

  function cancel() {
    if (dirty && !window.confirm("You have unsaved changes. Leave this page?")) return;
    router.push("/admin/blog");
  }

  const cover: CoverValue | null = values.coverImageUrl
    ? {
        id: values.coverImageId || "",
        url: values.coverImageUrl,
        alt: values.coverImageAlt || "",
        filename: values.coverImageFilename || "",
        width: values.coverImageWidth ?? null,
        height: values.coverImageHeight ?? null,
      }
    : null;

  return (
    <FormShell>
      <PublishStatusBanner
        status={post?.status ?? "draft"}
        kind="post"
        liveHref={published && slug ? `/blog/${slug}` : undefined}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <FormPanel title="Content" description="Write the article visitors will read.">
          <Field label="Title" htmlFor="title" error={errors.title}>
            <Input
              id="title"
              placeholder="Dubai property market trends"
              value={values.title}
              className="h-11 rounded-xl text-base"
              onChange={(event) => {
                update("title", event.target.value);
                if (!slugLocked) update("slug", slugify(event.target.value));
              }}
            />
          </Field>

          <Field
            label="URL slug"
            htmlFor="slug"
            hint={slug ? `Public URL: /blog/${slug}` : "Used in the public URL"}
            error={errors.slug}
          >
            <Input
              id="slug"
              value={slug}
              className="rounded-xl font-mono text-sm"
              onChange={(event) => {
                setSlugLocked(true);
                update("slug", event.target.value);
              }}
            />
          </Field>

          <Field
            label="Excerpt"
            htmlFor="excerpt"
            error={errors.excerpt}
            meta={<CharCount value={values.excerpt ?? ""} max={300} />}
          >
            <Textarea
              id="excerpt"
              placeholder="A short summary for listing cards."
              maxLength={300}
              value={values.excerpt ?? ""}
              className="min-h-24 rounded-xl"
              onChange={(event) => update("excerpt", event.target.value)}
            />
          </Field>

          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">Article body</p>
            <LexicalEditor
              value={values.content}
              mediaById={post?.inlineMedia}
              onChange={(content) => update("content", content)}
              error={errors.content}
            />
          </div>
        </FormPanel>

        <FormSidebar>
          <SidebarBlock title="Cover image">
            <CoverUpload value={cover} error={errors.coverImageUrl} onChange={setCover} />
            {values.coverImageUrl ? (
              <Field
                label="Cover alt text"
                htmlFor="coverImageAlt"
                hint="Describe the image for accessibility and SEO."
                error={errors.coverImageAlt}
              >
                <Input
                  id="coverImageAlt"
                  value={values.coverImageAlt ?? ""}
                  placeholder={values.title || "Cover image description"}
                  className="rounded-xl"
                  onChange={(event) => update("coverImageAlt", event.target.value)}
                />
              </Field>
            ) : null}
          </SidebarBlock>

          <SidebarBlock title="Author">
            <Field label="Author name" htmlFor="author" error={errors.author}>
              <Input
                id="author"
                value={values.author ?? ""}
                placeholder="Mahraj Arabia Team"
                className="rounded-xl"
                onChange={(event) => update("author", event.target.value)}
              />
            </Field>
            <label className="flex items-start gap-2.5 rounded-xl border border-border px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-border"
                checked={Boolean(values.featured)}
                onChange={(event) => update("featured", event.target.checked)}
              />
              <span>
                <span className="font-medium text-ink">Featured blog</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Show this post in the featured carousel on /blog.
                </span>
              </span>
            </label>
          </SidebarBlock>

          <SidebarBlock title="Category">
            <FormSelect
              id="category"
              value={values.category ?? ""}
              error={errors.category}
              onChange={(value) => update("category", value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </FormSelect>
          </SidebarBlock>

          <SidebarBlock title="Status">
            <FormSelect
              id="status"
              value={values._status}
              onChange={(value) => update("_status", value as "draft" | "published")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </FormSelect>
            <p className="text-xs text-muted-foreground">
              Draft stays private. Published appears on the website.
            </p>
          </SidebarBlock>

          <SidebarBlock title="Tags">
            <TagsInput value={values.tags} onChange={(tags) => update("tags", tags)} />
          </SidebarBlock>
        </FormSidebar>
      </div>

      <FormPanel title="SEO" description="Search title, description, and focus keyword.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Meta title"
            error={errors.metaTitle}
            meta={<CharCount value={values.metaTitle ?? ""} max={60} />}
          >
            <Input
              value={values.metaTitle ?? ""}
              placeholder="Leave blank to use the article title"
              className="rounded-xl"
              onChange={(event) => update("metaTitle", event.target.value)}
            />
          </Field>
          <Field label="Focus keyword" error={errors.focusKeyword}>
            <Input
              value={values.focusKeyword ?? ""}
              placeholder="e.g. modular offices Riyadh"
              className="rounded-xl"
              onChange={(event) => update("focusKeyword", event.target.value)}
            />
          </Field>
          <Field
            className="md:col-span-2"
            label="Meta description"
            error={errors.metaDescription}
            meta={<CharCount value={values.metaDescription ?? ""} max={160} />}
          >
            <Textarea
              maxLength={200}
              value={values.metaDescription ?? ""}
              placeholder="Leave blank to use the excerpt"
              className="min-h-28 rounded-xl"
              onChange={(event) => update("metaDescription", event.target.value)}
            />
          </Field>
        </div>
      </FormPanel>

      <FaqEditor
        description={values.faqDescription ?? ""}
        value={values.faqs}
        onDescriptionChange={(faqDescription) => update("faqDescription", faqDescription)}
        onChange={(faqs) => update("faqs", faqs)}
        errors={errors}
      />

      {confirmUnpublish ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Unpublish this blog?</p>
          <p className="mt-1 text-amber-900/80">
            It will disappear from the public website until you publish again.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => {
                setConfirmUnpublish(false);
                submit("draft");
              }}
            >
              Unpublish
            </Button>
            <Button type="button" variant="ghost" onClick={() => setConfirmUnpublish(false)}>
              Keep published
            </Button>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {post && confirmDelete ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium">Delete this blog permanently?</p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const result = await deletePost(post.id);
                  if (result?.error) setError(result.error);
                  if (result?.href) {
                    setDirty(false);
                    router.push(result.href);
                    router.refresh();
                  }
                })
              }
            >
              Delete blog
            </Button>
            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
              Keep blog
            </Button>
          </div>
        </div>
      ) : null}

      <FormActionBar>
        <Button type="button" variant="outline" disabled={pending} onClick={() => submit("draft")}>
          {pending ? "Saving…" : "Save draft"}
        </Button>
        <Button type="button" disabled={pending} onClick={() => submit("published")}>
          {pending ? "Saving…" : published ? "Update published" : "Publish"}
        </Button>
        {published ? (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => setConfirmUnpublish(true)}
          >
            Unpublish
          </Button>
        ) : null}
        <Button type="button" variant="ghost" onClick={cancel}>
          Back
        </Button>
        {dirty ? <span className="text-xs text-muted-foreground">Unsaved changes</span> : null}
        <div className="ms-auto">
          {post && !confirmDelete ? (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          ) : null}
        </div>
      </FormActionBar>
    </FormShell>
  );
}
