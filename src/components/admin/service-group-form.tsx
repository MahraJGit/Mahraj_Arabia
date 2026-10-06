"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteServiceGroup, saveServiceGroup } from "@/actions/service-groups";
import { CharCount, Field } from "@/components/admin/field";
import { PublishStatusBanner } from "@/components/admin/publish-banner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/cms/slug";
import type { ServiceGroupRecord } from "@/lib/services/queries";

export function ServiceGroupForm({
  group,
  defaultSortOrder = 10,
}: {
  group?: ServiceGroupRecord;
  defaultSortOrder?: number;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(group?.title ?? "");
  const [slug, setSlug] = useState(group?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(group?.slug));
  const [menuDescription, setMenuDescription] = useState(group?.menuDescription ?? "");
  const [sortOrder, setSortOrder] = useState(String(group?.sortOrder ?? defaultSortOrder));
  const [showInMegaMenu, setShowInMegaMenu] = useState(group?.showInMegaMenu ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const generated = useMemo(() => slugify(title), [title]);
  const published = group?.status === "published";

  function markDirty() {
    setDirty(true);
  }

  function submit(status: "draft" | "published") {
    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slugLocked ? slug : generated);
    formData.set("menuDescription", menuDescription);
    formData.set("sortOrder", sortOrder);
    if (showInMegaMenu) formData.set("showInMegaMenu", "on");
    formData.set("_status", status);
    start(async () => {
      setError(null);
      setErrors({});
      const result = await saveServiceGroup(group?.id ?? null, formData);
      if (result?.fieldErrors) setErrors(result.fieldErrors);
      if (result?.error) setError(result.error);
      if (result?.href) {
        setDirty(false);
        router.push(result.href);
        router.refresh();
      }
    });
  }

  function cancel() {
    if (dirty && !window.confirm("You have unsaved changes. Leave this page?")) {
      return;
    }
    router.push("/admin/service-groups");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PublishStatusBanner
        status={group?.status ?? "draft"}
        kind="group"
      />

      <Field
        label="Family name"
        htmlFor="title"
        error={errors.title}
        hint="This name appears on the left of the Services menu."
      >
        <Input
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            markDirty();
          }}
        />
      </Field>

      <Field
        label="URL slug"
        htmlFor="slug"
        error={errors.slug}
        hint="Used internally. This group does not have its own public page."
      >
        <Input
          id="slug"
          value={slugLocked ? slug : generated}
          onChange={(event) => {
            setSlugLocked(true);
            setSlug(event.target.value);
            markDirty();
          }}
        />
      </Field>

      <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
        <Checkbox
          checked={showInMegaMenu}
          onChange={(event) => {
            setShowInMegaMenu(event.target.checked);
            markDirty();
          }}
        />
        <span>
          <strong className="block">Show in the Services menu</strong>
          Turn off to hide this family. Its services stay in the dashboard.
        </span>
      </label>

      <Field
        label="Menu position"
        htmlFor="sortOrder"
        hint="Lower numbers appear first. Use 10, 20, 30 so you can insert items later."
        error={errors.sortOrder}
      >
        <Input
          id="sortOrder"
          type="number"
          min={0}
          value={sortOrder}
          onChange={(event) => {
            setSortOrder(event.target.value);
            markDirty();
          }}
        />
      </Field>

      <Field
        label="Description"
        htmlFor="menuDescription"
        hint="Optional note for editors only. Not shown on the website."
        error={errors.menuDescription}
      >
        <Textarea
          id="menuDescription"
          maxLength={200}
          value={menuDescription}
          onChange={(event) => {
            setMenuDescription(event.target.value);
            markDirty();
          }}
        />
        <CharCount value={menuDescription} max={200} />
      </Field>

      {confirmUnpublish ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-medium">Unpublish this family?</p>
          <p className="mt-1">
            This hides the family from the Services menu until you publish it again.
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

      <div className="flex flex-wrap gap-2">
        {published ? (
          <Button type="button" variant="outline" disabled={pending} onClick={() => submit("published")}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled={pending} onClick={() => submit("draft")}>
            {pending ? "Saving…" : "Save draft"}
          </Button>
        )}
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
          Cancel
        </Button>
      </div>

      {group ? (
        <div className="border-t border-border pt-6">
          {confirmDelete ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium">Delete this family?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This cannot be undone. If it still contains services, deletion will be blocked.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      const result = await deleteServiceGroup(group.id);
                      if (result?.error) {
                        setError(result.error);
                        setConfirmDelete(false);
                      }
                      if (result?.href) {
                        setDirty(false);
                        router.push(result.href);
                        router.refresh();
                      }
                    })
                  }
                >
                  Delete family
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Keep family
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              Delete family
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
