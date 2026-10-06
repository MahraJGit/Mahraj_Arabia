"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteCategory, saveCategory } from "@/actions/categories";
import { Field } from "@/components/admin/field";
import { MediaPicker } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/cms/slug";
import type { CategoryRecord } from "@/lib/blog/queries";
import type { CategoryInput } from "@/lib/validation/category";

function emptyCategory(): CategoryInput {
  return { title: "", slug: "", subtitle: "", image: "" };
}

function fromRecord(category: CategoryRecord): CategoryInput {
  return {
    title: category.title,
    slug: category.slug,
    subtitle: category.subtitle,
    image: category.image,
  };
}

export function CategoryForm({
  category,
  postCount = 0,
}: {
  category?: CategoryRecord;
  postCount?: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryInput>(
    category ? fromRecord(category) : emptyCategory()
  );
  const [slugLocked, setSlugLocked] = useState(Boolean(category?.slug));
  const [imagePreview, setImagePreview] = useState({
    url: category?.imageUrl ?? "",
    alt: category?.imageAlt ?? "",
    filename: category?.imageFilename ?? "",
    width: category?.imageWidth ?? null,
    height: category?.imageHeight ?? null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const generated = useMemo(() => slugify(values.title), [values.title]);

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  function update<K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  function submit() {
    const payload: CategoryInput = {
      ...values,
      slug: slugLocked ? values.slug : generated,
    };
    start(async () => {
      setError(null);
      setErrors({});
      const result = await saveCategory(category?.id ?? null, payload);
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }
      setDirty(false);
      if (result.href) router.push(result.href);
    });
  }

  function remove() {
    if (!category) return;
    start(async () => {
      const result = await deleteCategory(category.id);
      if (result.error) {
        setError(result.error);
        setConfirmDelete(false);
        return;
      }
      setDirty(false);
      if (result.href) router.push(result.href);
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        Categories appear on the public blog as soon as they are saved. There is no draft state.
      </div>

      <Field label="Name" htmlFor="title" error={errors.title}>
        <Input
          id="title"
          value={values.title}
          onChange={(event) => {
            update("title", event.target.value);
            if (!slugLocked) update("slug", slugify(event.target.value));
          }}
        />
      </Field>
      <Field label="URL slug" htmlFor="slug" error={errors.slug}>
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
      </Field>
      <Field
        label="Subtitle"
        htmlFor="subtitle"
        hint="Shown under the name on topic cards."
        error={errors.subtitle}
      >
        <Input
          id="subtitle"
          value={values.subtitle ?? ""}
          onChange={(event) => update("subtitle", event.target.value)}
        />
      </Field>
      <MediaPicker
        label="Category image"
        value={values.image ?? ""}
        previewUrl={imagePreview.url}
        previewAlt={imagePreview.alt}
        previewFilename={imagePreview.filename}
        previewWidth={imagePreview.width}
        previewHeight={imagePreview.height}
        error={errors.image}
        onChange={(next) => {
          update("image", next.id);
          setImagePreview({
            url: next.url,
            alt: next.alt,
            filename: next.filename ?? "",
            width: next.width ?? null,
            height: next.height ?? null,
          });
        }}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2 border-t border-border pt-5">
        <Button type="button" disabled={pending} onClick={submit}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/categories")}>
          Cancel
        </Button>
      </div>

      {category ? (
        <div>
          {confirmDelete ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium">Delete this category?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {postCount > 0
                  ? `This category is used by ${postCount} ${postCount === 1 ? "post" : "posts"}. Reassign ${postCount === 1 ? "it" : "them"} first.`
                  : "This will not delete blog posts."}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={pending || postCount > 0}
                  onClick={remove}
                >
                  Delete
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Keep category
                </Button>
              </div>
            </div>
          ) : (
            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(true)}>
              Delete category
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
