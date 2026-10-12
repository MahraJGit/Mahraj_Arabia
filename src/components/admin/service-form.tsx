"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteService, saveService } from "@/actions/services";
import { CaseStudiesEditor } from "@/components/admin/case-studies-editor";
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
import { HighlightsEditor } from "@/components/admin/highlights-editor";
import { LexicalEditor } from "@/components/admin/lexical-editor";
import { PublishStatusBanner } from "@/components/admin/publish-banner";
import { TagsInput } from "@/components/admin/tags-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyLexicalDoc } from "@/lib/cms/lexical";
import { slugify } from "@/lib/cms/slug";
import type { ServiceRecord } from "@/lib/services/queries";
import type { ServiceInput } from "@/lib/validation/service";

function emptyService(): ServiceInput {
  return {
    title: "",
    heroTitle: "",
    slug: "",
    excerpt: "",
    content: emptyLexicalDoc(),
    coverImageId: "",
    coverImageUrl: "",
    coverImageAlt: "",
    coverImageFilename: "",
    coverImageWidth: null,
    coverImageHeight: null,
    parent: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    faqDescription: "",
    faqs: [],
    highlightsTitle: "",
    highlightsDescription: "",
    highlights: [],
    caseStudiesTitle: "",
    caseStudiesDescription: "",
    caseStudies: [],
    sortOrder: 10,
    showInMegaMenu: true,
    _status: "draft",
  };
}

function fromRecord(service: ServiceRecord): ServiceInput {
  const highlights =
    Array.isArray(service.highlights) && service.highlights.length > 0
      ? service.highlights
      : (service.applications ?? []).map((item) => ({
          title: item.title,
          description: item.description,
          icon: item.icon,
          points: item.points.map((point) =>
            typeof point === "string" ? point : point.label
          ),
        }));

  return {
    ...emptyService(),
    title: service.title,
    heroTitle: service.heroTitle || "",
    slug: service.slug,
    excerpt: service.excerpt,
    content: (service as { content?: unknown }).content ?? emptyLexicalDoc(),
    coverImageId: service.image || (service as { coverImage?: string }).coverImage || "",
    coverImageUrl: service.imageUrl || (service as { coverUrl?: string }).coverUrl || "",
    coverImageAlt: service.imageAlt || (service as { coverAlt?: string }).coverAlt || "",
    coverImageFilename:
      service.imageFilename || (service as { coverFilename?: string }).coverFilename || "",
    coverImageWidth: service.imageWidth ?? (service as { coverWidth?: number | null }).coverWidth ?? null,
    coverImageHeight:
      service.imageHeight ?? (service as { coverHeight?: number | null }).coverHeight ?? null,
    parent: service.parent,
    tags: Array.isArray((service as { tags?: string[] }).tags)
      ? ((service as { tags?: string[] }).tags ?? [])
      : [],
    metaTitle: service.seoTitle || (service as { metaTitle?: string }).metaTitle || "",
    metaDescription:
      service.seoDescription || (service as { metaDescription?: string }).metaDescription || "",
    focusKeyword: (service as { focusKeyword?: string }).focusKeyword || "",
    faqDescription:
      (service as { faqDescription?: string }).faqDescription || service.faqIntro || "",
    faqs: Array.isArray(service.faqs) ? service.faqs : [],
    highlightsTitle: service.highlightsTitle || service.guideTitle || "",
    highlightsDescription:
      service.highlightsDescription || service.guideDescription || "",
    highlights,
    caseStudiesTitle: service.caseStudiesTitle || "",
    caseStudiesDescription: service.caseStudiesDescription || "",
    caseStudies: Array.isArray(service.caseStudies) ? service.caseStudies : [],
    sortOrder: service.sortOrder,
    showInMegaMenu: service.showInMegaMenu,
    _status: service.status,
  };
}

export function ServiceForm({
  service,
  groups,
}: {
  service?: ServiceRecord;
  groups: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ServiceInput>(
    service ? fromRecord(service) : emptyService()
  );
  const [slugLocked, setSlugLocked] = useState(Boolean(service?.slug));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const published = service?.status === "published";
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

  function update<K extends keyof ServiceInput>(key: K, value: ServiceInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  function setCover(next: CoverValue | null) {
    update("coverImageId", next?.id ?? "");
    update("coverImageUrl", next?.url ?? "");
    update("coverImageAlt", next?.alt ?? "");
    update("coverImageFilename", next?.filename ?? "");
    update("coverImageWidth", next?.width ?? null);
    update("coverImageHeight", next?.height ?? null);
  }

  function submit(status: "draft" | "published") {
    const payload: ServiceInput = {
      ...values,
      slug,
      _status: status,
    };
    start(async () => {
      setError(null);
      setErrors({});
      const result = await saveService(service?.id ?? null, payload);
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
    router.push("/admin/services");
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
        status={service?.status ?? "draft"}
        kind="service"
        liveHref={published && slug ? `/services/${slug}` : undefined}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <FormPanel title="Content" description="Write the service page visitors will read.">
          <Field
            label="Service name"
            htmlFor="title"
            hint="Shown in menus, cards, and listings."
            error={errors.title}
          >
            <Input
              id="title"
              placeholder="Porta cabins & site offices"
              value={values.title}
              className="h-11 rounded-xl text-base"
              onChange={(event) => {
                update("title", event.target.value);
                if (!slugLocked) update("slug", slugify(event.target.value));
              }}
            />
          </Field>

          <Field
            label="Hero title"
            htmlFor="heroTitle"
            hint="Headline on the service page hero. Leave blank to use the service name."
            error={errors.heroTitle}
          >
            <Input
              id="heroTitle"
              placeholder="Portable site offices built for KSA projects"
              value={values.heroTitle ?? ""}
              className="h-11 rounded-xl text-base"
              onChange={(event) => update("heroTitle", event.target.value)}
            />
          </Field>

          <Field
            label="URL slug"
            htmlFor="slug"
            hint={slug ? `Public URL: /services/${slug}` : "Used in the public URL"}
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
              onChange={(content) => update("content", content)}
              error={errors.content}
            />
          </div>
        </FormPanel>

        <FormSidebar>
          <SidebarBlock title="Cover image">
            <CoverUpload value={cover} error={errors.coverImageUrl} onChange={setCover} />
          </SidebarBlock>

          <SidebarBlock title="Family">
            <FormSelect
              id="parent"
              value={values.parent}
              error={errors.parent}
              onChange={(value) => update("parent", value)}
            >
              <option value="">Select a family</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
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

          <SidebarBlock>
            <label className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={values.showInMegaMenu}
                onChange={(event) => update("showInMegaMenu", event.target.checked)}
                className="mt-0.5"
            />
            <span>
                <strong className="block font-medium text-ink">Show in Services menu</strong>
                <span className="text-xs text-muted-foreground">
                  Lists this service under its family in the site header.
                </span>
            </span>
          </label>
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
              placeholder="Leave blank to use the service title"
              className="rounded-xl"
              onChange={(event) => update("metaTitle", event.target.value)}
            />
          </Field>
          <Field label="Focus keyword" error={errors.focusKeyword}>
            <Input
              value={values.focusKeyword ?? ""}
              placeholder="e.g. porta cabins Riyadh"
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

      <HighlightsEditor
        title={values.highlightsTitle ?? ""}
        description={values.highlightsDescription ?? ""}
        value={values.highlights}
        onTitleChange={(highlightsTitle) => update("highlightsTitle", highlightsTitle)}
        onDescriptionChange={(highlightsDescription) =>
          update("highlightsDescription", highlightsDescription)
        }
        onChange={(highlights) => update("highlights", highlights)}
        errors={errors}
      />

      <CaseStudiesEditor
        title={values.caseStudiesTitle ?? ""}
        description={values.caseStudiesDescription ?? ""}
        value={values.caseStudies}
        onTitleChange={(caseStudiesTitle) => update("caseStudiesTitle", caseStudiesTitle)}
        onDescriptionChange={(caseStudiesDescription) =>
          update("caseStudiesDescription", caseStudiesDescription)
        }
        onChange={(caseStudies) => update("caseStudies", caseStudies)}
        errors={errors}
      />

      <FaqEditor
        description={values.faqDescription ?? ""}
        value={values.faqs}
        onDescriptionChange={(faqDescription) => update("faqDescription", faqDescription)}
        onChange={(faqs) => update("faqs", faqs)}
        errors={errors}
      />

      {confirmUnpublish ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Unpublish this service?</p>
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

      {service && confirmDelete ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium">Delete this service permanently?</p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      const result = await deleteService(service.id);
                      if (result?.error) setError(result.error);
                      if (result?.href) {
                        setDirty(false);
                        router.push(result.href);
                        router.refresh();
                      }
                    })
                  }
                >
                  Delete service
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Keep service
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
          {service && !confirmDelete ? (
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
