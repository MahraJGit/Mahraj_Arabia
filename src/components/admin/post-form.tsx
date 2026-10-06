"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deletePost, savePost } from "@/actions/posts";
import { CharCount, Field } from "@/components/admin/field";
import { LexicalEditor } from "@/components/admin/lexical-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import { PublishStatusBanner } from "@/components/admin/publish-banner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyLexicalDoc } from "@/lib/cms/lexical";
import { slugify } from "@/lib/cms/slug";
import type { CategoryOption, PostRecord } from "@/lib/blog/queries";
import type { PostInput } from "@/lib/validation/post";
import { cn } from "@/lib/utils";

const TABS = ["Basic", "Content", "SEO"] as const;
type Tab = (typeof TABS)[number];

function todayDateInput() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function emptyPost(): PostInput {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: emptyLexicalDoc(),
    coverImage: "",
    seoTitle: "",
    seoDescription: "",
    category: "",
    author: "By Mahraj Engineering Team",
    authorImage: "",
    readTime: "",
    publishedAt: "",
    featured: false,
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
    coverImage: post.coverImage,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    category: post.category,
    author: post.author,
    authorImage: post.authorImage,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    featured: post.featured,
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
  const [tab, setTab] = useState<Tab>("Basic");
  const [values, setValues] = useState<PostInput>(post ? fromRecord(post) : emptyPost());
  const [slugLocked, setSlugLocked] = useState(Boolean(post?.slug));
  const [coverPreview, setCoverPreview] = useState({
    url: post?.coverUrl ?? "",
    alt: post?.coverAlt ?? "",
    filename: post?.coverFilename ?? "",
    width: post?.coverWidth ?? null,
    height: post?.coverHeight ?? null,
  });
  const [authorPreview, setAuthorPreview] = useState({
    url: post?.authorImageUrl ?? "",
    alt: post?.authorImageAlt ?? "",
    filename: post?.authorImageFilename ?? "",
    width: post?.authorImageWidth ?? null,
    height: post?.authorImageHeight ?? null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const published = post?.status === "published";
  const generated = useMemo(() => slugify(values.title), [values.title]);
  const slugChanged = Boolean(post?.slug && values.slug && values.slug !== post.slug);
  const today = useMemo(() => todayDateInput(), []);

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

  function submit(status: "draft" | "published", leave = false) {
    const payload: PostInput = {
      ...values,
      slug: slugLocked ? values.slug : generated,
      _status: status,
    };
    start(async () => {
      setError(null);
      setErrors({});
      const result = await savePost(post?.id ?? null, payload);
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        if (result.fieldErrors.content) setTab("Content");
        else if (result.fieldErrors.seoTitle || result.fieldErrors.seoDescription) setTab("SEO");
        else setTab("Basic");
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }
      setDirty(false);
      if (leave) {
        router.push("/admin/blog?saved=published");
        return;
      }
      if (result.href) router.push(result.href);
    });
  }

  function remove() {
    if (!post) return;
    start(async () => {
      const result = await deletePost(post.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDirty(false);
      if (result.href) router.push(result.href);
    });
  }

  return (
    <div className="space-y-6">
      <PublishStatusBanner
        status={post?.status ?? "draft"}
        kind="post"
        liveHref={published && post?.slug ? `/blog/${post.slug}` : undefined}
      />

      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "px-3 py-2 text-sm font-medium",
              tab === item
                ? "border-b-2 border-brand text-ink"
                : "text-muted-foreground hover:text-ink"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Basic" ? (
        <div className="grid max-w-2xl gap-5">
          <Field label="Title" htmlFor="title" error={errors.title}>
            <Input
              id="title"
              value={values.title}
              onChange={(event) => {
                update("title", event.target.value);
                if (!slugLocked) update("slug", slugify(event.target.value));
              }}
            />
          </Field>
          <Field
            label="URL slug"
            htmlFor="slug"
            hint={
              published
                ? "Changing a published URL can break existing links and search results."
                : "Generated from the title until you edit it."
            }
            error={errors.slug}
          >
            <div className="flex gap-2">
              <Input
                id="slug"
                value={slugLocked ? values.slug : generated}
                onChange={(event) => {
                  setSlugLocked(true);
                  update("slug", event.target.value);
                }}
              />
              {slugLocked ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSlugLocked(false);
                    update("slug", generated);
                  }}
                >
                  Reset
                </Button>
              ) : null}
            </div>
            {published && slugChanged ? (
              <p className="mt-2 text-xs text-amber-800">
                This will change the live URL from /blog/{post?.slug} to /blog/{values.slug}.
                Existing links will stop working unless you keep the original slug.
              </p>
            ) : null}
          </Field>
          <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt}>
            <Textarea
              id="excerpt"
              maxLength={300}
              value={values.excerpt ?? ""}
              onChange={(event) => update("excerpt", event.target.value)}
            />
            <CharCount value={values.excerpt ?? ""} max={300} />
          </Field>
          <Field label="Category" htmlFor="category" error={errors.category}>
            <select
              id="category"
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              value={values.category ?? ""}
              onChange={(event) => update("category", event.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Author" htmlFor="author" error={errors.author}>
            <Input
              id="author"
              value={values.author ?? ""}
              onChange={(event) => update("author", event.target.value)}
            />
          </Field>
          <MediaPicker
            label="Author image"
            value={values.authorImage ?? ""}
            previewUrl={authorPreview.url}
            previewAlt={authorPreview.alt}
            previewFilename={authorPreview.filename}
            previewWidth={authorPreview.width}
            previewHeight={authorPreview.height}
            error={errors.authorImage}
            onChange={(next) => {
              update("authorImage", next.id);
              setAuthorPreview({
                url: next.url,
                alt: next.alt,
                filename: next.filename ?? "",
                width: next.width ?? null,
                height: next.height ?? null,
              });
            }}
          />
          <MediaPicker
            label="Cover image"
            value={values.coverImage ?? ""}
            previewUrl={coverPreview.url}
            previewAlt={coverPreview.alt}
            previewFilename={coverPreview.filename}
            previewWidth={coverPreview.width}
            previewHeight={coverPreview.height}
            error={errors.coverImage}
            onChange={(next) => {
              update("coverImage", next.id);
              setCoverPreview({
                url: next.url,
                alt: next.alt,
                filename: next.filename ?? "",
                width: next.width ?? null,
                height: next.height ?? null,
              });
            }}
          />
          <Field
            label="Read time"
            htmlFor="readTime"
            hint="For example: 9 min read"
            error={errors.readTime}
          >
            <Input
              id="readTime"
              value={values.readTime ?? ""}
              onChange={(event) => update("readTime", event.target.value)}
            />
          </Field>
          <Field
            label="Published date"
            htmlFor="publishedAt"
            hint="Today or a future date. Past dates are unavailable. Left empty, the date is set on first publish."
            error={errors.publishedAt}
          >
            <Input
              id="publishedAt"
              type="date"
              min={today}
              value={values.publishedAt ?? ""}
              onChange={(event) => {
                const next = event.target.value;
                if (next && next < today) return;
                update("publishedAt", next);
              }}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={Boolean(values.featured)}
              onChange={(event) => update("featured", event.target.checked)}
            />
            Featured on the blog listing
          </label>
        </div>
      ) : null}

      {tab === "Content" ? (
        <LexicalEditor
          value={values.content}
          mediaById={post?.inlineMedia}
          onChange={(content) => update("content", content)}
          error={errors.content}
        />
      ) : null}

      {tab === "SEO" ? (
        <div className="grid max-w-xl gap-5">
          <Field
            label="SEO title"
            hint="Overrides the post title in search results. Open Graph uses this and the cover image."
            error={errors.seoTitle}
          >
            <Input
              value={values.seoTitle ?? ""}
              onChange={(event) => update("seoTitle", event.target.value)}
            />
          </Field>
          <Field label="SEO description" error={errors.seoDescription}>
            <Textarea
              maxLength={200}
              value={values.seoDescription ?? ""}
              onChange={(event) => update("seoDescription", event.target.value)}
            />
            <CharCount value={values.seoDescription ?? ""} max={200} />
          </Field>
        </div>
      ) : null}

      {confirmUnpublish ? (
        <div className="max-w-xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-medium">Unpublish this post?</p>
          <p className="mt-1">The public article will no longer be visible until you publish it again.</p>
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

      <div className="flex flex-wrap gap-2 border-t border-border pt-5">
        {published ? (
          <Button type="button" variant="outline" disabled={pending} onClick={() => submit("published")}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled={pending} onClick={() => submit("draft")}>
            {pending ? "Saving…" : "Save draft"}
          </Button>
        )}
        <Button type="button" disabled={pending} onClick={() => submit("published", true)}>
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
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")}>
          Cancel
        </Button>
      </div>

      {post ? (
        <div>
          {confirmDelete ? (
            <div className="max-w-xl rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium">Delete this post?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The public URL will stop working. Images stay in Media.
              </p>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="destructive" disabled={pending} onClick={remove}>
                  Delete
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Keep post
                </Button>
              </div>
            </div>
          ) : (
            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(true)}>
              Delete post
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
