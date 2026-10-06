"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { deleteService, saveService } from "@/actions/services";
import { CharCount, Field } from "@/components/admin/field";
import { MediaPicker } from "@/components/admin/media-picker";
import { PublishStatusBanner } from "@/components/admin/publish-banner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/cms/slug";
import { normalizeHex } from "@/lib/services/colors";
import { DEFAULT_FAQ_INTRO, DEFAULT_FAQS } from "@/lib/services/faqs";
import {
  HIGHLIGHT_ICONS,
  HIGHLIGHT_ICON_NAMES,
  highlightIconName,
} from "@/lib/services/highlight-icons";
import {
  DEFAULT_PROCESS_DESCRIPTION,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_PROCESS_TITLE,
} from "@/lib/services/process";
import type { ServiceOption, ServiceRecord } from "@/lib/services/queries";
import {
  PERFORMANCE_COLUMN_LABELS,
  SPACE_COLUMN_LABELS,
} from "@/lib/services/table-labels";
import type { ServiceInput } from "@/lib/validation/service";
import { cn } from "@/lib/utils";

const TABS = ["Basics", "Page", "Highlights", "Optional", "Related", "SEO"] as const;

type Tab = (typeof TABS)[number];

function emptyService(): ServiceInput {
  return {
    title: "",
    slug: "",
    parent: "",
    excerpt: "",
    image: "",
    overviewImage: "",
    relatedServices: [],
    sortOrder: 10,
    showInMegaMenu: true,
    detailReady: false,
    heroTitle: "",
    heroDescription: "",
    overviewTitle: "",
    overviewDescription: "",
    guideTitle: "",
    guideDescription: "",
    applications: [],
    showPerformanceMatrix: false,
    performanceTitle: "",
    performanceDescription: "",
    performanceLabels: [...PERFORMANCE_COLUMN_LABELS],
    performanceRows: [],
    density: "",
    warranty: "",
    brandingTitle: "",
    brandingDescription: "",
    brandColorLabel: "",
    brandColors: [],
    showSpaceRequirements: false,
    spaceTitle: "",
    spaceDescription: "",
    spaceLabels: [...SPACE_COLUMN_LABELS],
    spaceRows: [],
    showProcess: true,
    processTitle: DEFAULT_PROCESS_TITLE,
    processDescription: DEFAULT_PROCESS_DESCRIPTION,
    processSteps: DEFAULT_PROCESS_STEPS.map((label) => ({ label })),
    faqIntro: DEFAULT_FAQ_INTRO,
    faqs: DEFAULT_FAQS.map((faq) => ({ ...faq })),
    caseStudiesTitle: "",
    caseStudiesDescription: "",
    projectsTitle: "",
    projectsDescription: "",
    seoTitle: "",
    seoDescription: "",
    _status: "draft",
  };
}

function fromRecord(service: ServiceRecord): ServiceInput {
  const defaults = emptyService();
  return {
    ...defaults,
    title: service.title,
    slug: service.slug,
    parent: service.parent,
    excerpt: service.excerpt,
    image: service.image,
    overviewImage: service.overviewImage,
    relatedServices: service.relatedServices,
    sortOrder: service.sortOrder,
    showInMegaMenu: service.showInMegaMenu,
    detailReady: service.detailReady,
    heroTitle: service.heroTitle,
    heroDescription: service.heroDescription,
    overviewTitle: service.overviewTitle,
    overviewDescription: service.overviewDescription,
    guideTitle: service.guideTitle,
    guideDescription: service.guideDescription,
    applications: service.applications,
    showPerformanceMatrix: service.showPerformanceMatrix,
    performanceTitle: service.performanceTitle,
    performanceDescription: service.performanceDescription,
    performanceLabels: service.performanceLabels as ServiceInput["performanceLabels"],
    performanceRows: service.performanceRows,
    density: service.density,
    warranty: service.warranty,
    brandingTitle: service.brandingTitle,
    brandingDescription: service.brandingDescription,
    brandColorLabel: service.brandColorLabel,
    brandColors: service.brandColors,
    showSpaceRequirements: service.showSpaceRequirements,
    spaceTitle: service.spaceTitle,
    spaceDescription: service.spaceDescription,
    spaceLabels: service.spaceLabels as ServiceInput["spaceLabels"],
    spaceRows: service.spaceRows,
    showProcess: service.showProcess,
    processTitle: service.processTitle,
    processDescription: service.processDescription,
    processSteps: service.processSteps,
    faqIntro: service.faqIntro,
    faqs: service.faqs,
    caseStudiesTitle: service.caseStudiesTitle,
    caseStudiesDescription: service.caseStudiesDescription,
    projectsTitle: service.projectsTitle,
    projectsDescription: service.projectsDescription,
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    _status: service.status,
  };
}

const TAB_FIELDS: Record<Tab, string[]> = {
  Basics: ["title", "slug", "parent", "excerpt", "image", "detailReady", "showInMegaMenu"],
  Page: [
    "heroTitle",
    "heroDescription",
    "overviewTitle",
    "overviewDescription",
    "overviewImage",
    "caseStudiesTitle",
    "caseStudiesDescription",
    "projectsTitle",
    "projectsDescription",
  ],
  Highlights: ["guideTitle", "guideDescription", "applications"],
  Optional: [
    "showPerformanceMatrix",
    "performanceTitle",
    "performanceDescription",
    "performanceLabels",
    "performanceRows",
    "density",
    "warranty",
    "brandingTitle",
    "brandingDescription",
    "brandColorLabel",
    "brandColors",
    "showSpaceRequirements",
    "spaceTitle",
    "spaceDescription",
    "spaceLabels",
    "spaceRows",
    "showProcess",
    "processTitle",
    "processDescription",
    "processSteps",
    "faqIntro",
    "faqs",
  ],
  Related: ["relatedServices"],
  SEO: ["seoTitle", "seoDescription"],
};

function tabForError(fieldErrors: Record<string, string>): Tab {
  const keys = Object.keys(fieldErrors);
  for (const tab of TABS) {
    if (keys.some((key) => TAB_FIELDS[tab].some((field) => key === field || key.startsWith(`${field}.`)))) {
      return tab;
    }
  }
  return "Basics";
}

export function ServiceForm({
  service,
  groups,
  relatedOptions,
}: {
  service?: ServiceRecord;
  groups: { id: string; title: string }[];
  relatedOptions: ServiceOption[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Basics");
  const [values, setValues] = useState<ServiceInput>(
    service ? fromRecord(service) : emptyService()
  );
  const [slugLocked, setSlugLocked] = useState(Boolean(service?.slug));
  const [imagePreview, setImagePreview] = useState({
    url: service?.imageUrl ?? "",
    alt: service?.imageAlt ?? "",
    filename: service?.imageFilename ?? "",
    width: service?.imageWidth ?? null,
    height: service?.imageHeight ?? null,
  });
  const [overviewPreview, setOverviewPreview] = useState({
    url: service?.overviewImageUrl ?? "",
    alt: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const published = service?.status === "published";

  const generated = useMemo(() => slugify(values.title), [values.title]);

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

  function submit(status: "draft" | "published") {
    const payload: ServiceInput = {
      ...values,
      slug: slugLocked ? values.slug : generated,
      _status: status,
    };
    start(async () => {
      setError(null);
      setErrors({});
      const result = await saveService(service?.id ?? null, payload);
      if (result?.error) setError(result.error);
      if (result?.fieldErrors) {
        setErrors(result.fieldErrors);
        setTab(tabForError(result.fieldErrors));
      }
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
    router.push("/admin/services");
  }

  return (
    <div className="space-y-6">
      <PublishStatusBanner
        status={service?.status ?? "draft"}
        kind="service"
        liveHref={
          published && (slugLocked ? values.slug : generated)
            ? `/services/${slugLocked ? values.slug : generated}`
            : undefined
        }
      />
      {service ? (
        <p className="text-sm text-muted-foreground">
          Page type: {values.detailReady ? "Full detail page" : "Coming Soon"}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-white p-1">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              tab === item ? "bg-brand/10 text-brand" : "text-muted-foreground hover:text-ink"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Basics" ? (
        <div className="grid max-w-3xl gap-5">
          <Field label="Service name" htmlFor="title" error={errors.title}>
            <Input id="title" value={values.title} onChange={(e) => update("title", e.target.value)} />
          </Field>
          <Field label="URL slug" htmlFor="slug" hint="Public page: /services/your-slug" error={errors.slug}>
            <Input
              id="slug"
              value={slugLocked ? values.slug : generated}
              onChange={(e) => {
                setSlugLocked(true);
                update("slug", e.target.value);
              }}
            />
          </Field>
          <Field label="Family" htmlFor="parent" error={errors.parent} hint="The left-hand choice this service is listed under.">
            <select
              id="parent"
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={values.parent}
              onChange={(e) => update("parent", e.target.value)}
            >
              <option value="">Select a family</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Short summary" htmlFor="excerpt" error={errors.excerpt} hint="Shown on cards, search, and meta tags.">
            <Textarea
              id="excerpt"
              maxLength={300}
              value={values.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
            />
            <CharCount value={values.excerpt} max={300} />
          </Field>
          <MediaPicker
            label="Listing image"
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
          <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
            <Checkbox
              checked={values.detailReady}
              onChange={(e) => update("detailReady", e.target.checked)}
            />
            <span>
              <strong className="block">Full detail page</strong>
              Leave this off to keep a short Coming Soon page. Turn it on only when the Page tab has the content you want visitors to see.
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
            <Checkbox
              checked={values.showInMegaMenu}
              onChange={(e) => update("showInMegaMenu", e.target.checked)}
            />
            <span>
              <strong className="block">Show in the Services menu</strong>
              Lists this service on the right when its family is selected. Set the order from the Services page.
            </span>
          </label>
        </div>
      ) : null}

      {tab === "Page" ? (
        <div className="grid max-w-3xl gap-5">
          <p className="text-sm text-muted-foreground">
            These fields are optional. Empty sections stay off the public page. They are used only when Full detail page is turned on.
          </p>
          <Field label="Page heading" hint="Leave blank to use the service name. The breadcrumb uses the service name automatically.">
            <Input
              value={values.heroTitle ?? ""}
              placeholder="Heading at the top of the page"
              onChange={(e) => update("heroTitle", e.target.value)}
            />
          </Field>
          <Field label="Hero description" hint="Optional introduction under the heading.">
            <Textarea
              value={values.heroDescription ?? ""}
              placeholder="A short introduction for this service"
              onChange={(e) => update("heroDescription", e.target.value)}
            />
          </Field>
          <Field label="Overview title" hint="Leave blank to hide the overview section.">
            <Input
              value={values.overviewTitle ?? ""}
              placeholder="Optional section heading"
              onChange={(e) => update("overviewTitle", e.target.value)}
            />
          </Field>
          <Field label="Overview description">
            <Textarea
              value={values.overviewDescription ?? ""}
              placeholder="Optional longer description"
              onChange={(e) => update("overviewDescription", e.target.value)}
            />
          </Field>
          <MediaPicker
            label="Overview image (optional)"
            value={values.overviewImage ?? ""}
            previewUrl={overviewPreview.url}
            onChange={(next) => {
              update("overviewImage", next.id);
              setOverviewPreview({ url: next.url, alt: next.alt });
            }}
          />
          <Field
            label="Case studies heading"
            hint="Optional. Leave the heading and description blank to hide this block. It uses the site’s shared project stories."
          >
            <Input
              value={values.caseStudiesTitle ?? ""}
              placeholder="Optional heading"
              onChange={(e) => update("caseStudiesTitle", e.target.value)}
            />
          </Field>
          <Field label="Case studies description" hint="Optional text under the heading. Leave blank to omit it.">
            <Textarea
              value={values.caseStudiesDescription ?? ""}
              placeholder="Optional description"
              onChange={(e) => update("caseStudiesDescription", e.target.value)}
            />
          </Field>
          <Field
            label="Projects heading"
            hint="Optional. Leave the heading and description blank to hide the projects block."
          >
            <Input
              value={values.projectsTitle ?? ""}
              placeholder="Optional heading"
              onChange={(e) => update("projectsTitle", e.target.value)}
            />
          </Field>
          <Field label="Projects description" hint="Optional text under the heading. Leave blank to omit it.">
            <Textarea
              value={values.projectsDescription ?? ""}
              placeholder="Optional description"
              onChange={(e) => update("projectsDescription", e.target.value)}
            />
          </Field>
        </div>
      ) : null}

      {tab === "Highlights" ? (
        <div className="grid max-w-3xl gap-5">
          <p className="text-sm text-muted-foreground">
            Optional feature cards. Add them only when this service needs a “where it is used” or benefits section. An empty list is not shown on the website.
          </p>
          <Field label="Section title" hint="Leave blank if you are not using this section.">
            <Input value={values.guideTitle ?? ""} onChange={(e) => update("guideTitle", e.target.value)} />
          </Field>
          <Field label="Section introduction" hint="Optional supporting text under the title.">
            <Textarea value={values.guideDescription ?? ""} onChange={(e) => update("guideDescription", e.target.value)} />
          </Field>
          {values.applications.map((application, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex justify-between gap-2">
                <p className="text-sm font-semibold">Application {index + 1}</p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...values.applications];
                      const [item] = next.splice(index, 1);
                      next.splice(index - 1, 0, item);
                      update("applications", next);
                    }}
                  >
                    Earlier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === values.applications.length - 1}
                    onClick={() => {
                      const next = [...values.applications];
                      const [item] = next.splice(index, 1);
                      next.splice(index + 1, 0, item);
                      update("applications", next);
                    }}
                  >
                    Later
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      update(
                        "applications",
                        values.applications.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Icon</p>
                <div className="flex flex-wrap gap-1">
                  {HIGHLIGHT_ICON_NAMES.map((name) => {
                    const option = HIGHLIGHT_ICONS[name];
                    const selected = highlightIconName(application.icon, index) === name;
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={name}
                        type="button"
                        title={option.label}
                        aria-label={option.label}
                        aria-pressed={selected}
                        onClick={() => {
                          const next = [...values.applications];
                          next[index] = { ...application, icon: name };
                          update("applications", next);
                        }}
                        className={cn(
                          "inline-flex size-9 items-center justify-center rounded-lg border",
                          selected
                            ? "border-brand bg-brand text-white"
                            : "border-border text-muted-foreground hover:border-brand hover:text-brand"
                        )}
                      >
                        <OptionIcon className="size-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <Input
                placeholder="Title"
                value={application.title}
                onChange={(e) => {
                  const next = [...values.applications];
                  next[index] = { ...application, title: e.target.value };
                  update("applications", next);
                }}
              />
              <Textarea
                placeholder="Description"
                value={application.description}
                onChange={(e) => {
                  const next = [...values.applications];
                  next[index] = { ...application, description: e.target.value };
                  update("applications", next);
                }}
              />
              {application.points.map((point, pointIndex) => (
                <div key={pointIndex} className="flex gap-2">
                  <Input
                    placeholder="Point"
                    value={point.label}
                    onChange={(e) => {
                      const next = [...values.applications];
                      const points = [...application.points];
                      points[pointIndex] = { label: e.target.value };
                      next[index] = { ...application, points };
                      update("applications", next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const next = [...values.applications];
                      next[index] = {
                        ...application,
                        points: application.points.filter((_, i) => i !== pointIndex),
                      };
                      update("applications", next);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = [...values.applications];
                  next[index] = {
                    ...application,
                    points: [...application.points, { label: "" }],
                  };
                  update("applications", next);
                }}
              >
                Add point
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              update("applications", [
                ...values.applications,
                { title: "", description: "", icon: "dumbbell", points: [] },
              ])
            }
          >
            <Plus className="size-4" /> Add highlight
          </Button>
        </div>
      ) : null}

      {tab === "Optional" ? (
        <div className="grid max-w-4xl gap-8">
          <p className="text-sm text-muted-foreground">
            Turn a block on only if this service needs it. Most services can leave both off.
          </p>
          <div className="grid gap-4">
          <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
            <Checkbox
              checked={values.showPerformanceMatrix}
              onChange={(e) => update("showPerformanceMatrix", e.target.checked)}
            />
            <span>
              <strong className="block">Comparison table</strong>
              Optional rows for use case, recommendation, and a detail such as a rating or measurement.
            </span>
          </label>
          {values.showPerformanceMatrix ? (
            <>
              <Field label="Heading" hint="Shown above the table. Leave blank to hide the heading.">
                <Input
                  value={values.performanceTitle ?? ""}
                  placeholder="Comparison"
                  onChange={(e) => update("performanceTitle", e.target.value)}
                />
              </Field>
              <Field label="Paragraph" hint="Optional text under the heading. Leave blank to hide it.">
                <Textarea
                  value={values.performanceDescription ?? ""}
                  placeholder="Optional paragraph"
                  onChange={(e) => update("performanceDescription", e.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Density">
                  <Input value={values.density ?? ""} onChange={(e) => update("density", e.target.value)} />
                </Field>
                <Field label="Warranty">
                  <Input value={values.warranty ?? ""} onChange={(e) => update("warranty", e.target.value)} />
                </Field>
              </div>
              <Field label="Branding title">
                <Input value={values.brandingTitle ?? ""} onChange={(e) => update("brandingTitle", e.target.value)} />
              </Field>
              <Field label="Branding description">
                <Textarea
                  value={values.brandingDescription ?? ""}
                  onChange={(e) => update("brandingDescription", e.target.value)}
                />
              </Field>
              <Field
                label="Colour selector label"
                hint="Shown above the swatches, for example EPDM Fleck Selector."
              >
                <Input
                  value={values.brandColorLabel ?? ""}
                  placeholder="EPDM Fleck Selector"
                  onChange={(e) => update("brandColorLabel", e.target.value)}
                />
              </Field>
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Colours</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={values.brandColors.length >= 8}
                    onClick={() =>
                      update("brandColors", [
                        ...values.brandColors,
                        {
                          hex: "#111111",
                          selected: values.brandColors.length === 0,
                        },
                      ])
                    }
                  >
                    <Plus className="size-4" /> Add colour
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  These appear as circular swatches on the service page. Mark one colour as the highlighted swatch.
                </p>
                {values.brandColors.length ? (
                  <ul className="grid gap-2">
                    {values.brandColors.map((color, index) => {
                      const pickerValue = normalizeHex(color.hex) || "#111111";
                      return (
                        <li key={index} className="flex flex-wrap items-center gap-2">
                          <input
                            type="color"
                            aria-label={`Choose colour ${index + 1}`}
                            value={pickerValue}
                            className="size-10 cursor-pointer rounded-full border border-border bg-transparent p-0"
                            onChange={(event) => {
                              const next = values.brandColors.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, hex: event.target.value } : item
                              );
                              update("brandColors", next);
                            }}
                          />
                          <Input
                            value={color.hex}
                            aria-label={`Hex colour ${index + 1}`}
                            className="w-32 font-mono"
                            onChange={(event) => {
                              const next = values.brandColors.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, hex: event.target.value } : item
                              );
                              update("brandColors", next);
                            }}
                            onBlur={() => {
                              const hex = normalizeHex(color.hex);
                              if (!hex || hex === color.hex) return;
                              const next = values.brandColors.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, hex } : item
                              );
                              update("brandColors", next);
                            }}
                          />
                          <Button
                            type="button"
                            variant={color.selected ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              update(
                                "brandColors",
                                values.brandColors.map((item, itemIndex) => ({
                                  ...item,
                                  selected: itemIndex === index,
                                }))
                              )
                            }
                          >
                            {color.selected ? "Highlighted" : "Highlight"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove colour ${index + 1}`}
                            onClick={() => {
                              const next = values.brandColors.filter((_, itemIndex) => itemIndex !== index);
                              if (next.length && !next.some((item) => item.selected)) {
                                next[0] = { ...next[0], selected: true };
                              }
                              update("brandColors", next);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No colours yet. Add the colours this service should show.</p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {PERFORMANCE_COLUMN_LABELS.map((fallback, index) => (
                  <Field key={fallback} label={`Column ${index + 1} label`} hint="Shown in the table header.">
                    <Input
                      value={values.performanceLabels[index] ?? ""}
                      placeholder={fallback}
                      onChange={(event) => {
                        const next = [...values.performanceLabels] as ServiceInput["performanceLabels"];
                        next[index] = event.target.value;
                        update("performanceLabels", next);
                      }}
                    />
                  </Field>
                ))}
              </div>
              <TableRows
                columns={values.performanceLabels.map(
                  (label, index) => label.trim() || PERFORMANCE_COLUMN_LABELS[index]
                )}
                rows={values.performanceRows.map((row) => [
                  row.useCase,
                  row.recommended,
                  row.forceReduction,
                ])}
                onChange={(rows) =>
                  update(
                    "performanceRows",
                    rows.map(([useCase, recommended, forceReduction]) => ({
                      useCase,
                      recommended,
                      forceReduction,
                    }))
                  )
                }
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Leave this off unless the service needs a comparison table.</p>
          )}
        </div>
          <div className="grid gap-4">
          <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
            <Checkbox
              checked={values.showSpaceRequirements}
              onChange={(e) => update("showSpaceRequirements", e.target.checked)}
            />
            <span>
              <strong className="block">Detailed comparison</strong>
              Optional. Use this only when you need extra columns such as impact, slip, acoustics, or maintenance.
            </span>
          </label>
          {values.showSpaceRequirements ? (
            <>
              <Field label="Heading" hint="Shown above the table. Leave blank to hide the heading.">
                <Input
                  value={values.spaceTitle ?? ""}
                  placeholder="Compare by use"
                  onChange={(e) => update("spaceTitle", e.target.value)}
                />
              </Field>
              <Field label="Paragraph" hint="Optional text under the heading. Leave blank to hide it.">
                <Textarea
                  value={values.spaceDescription ?? ""}
                  placeholder="Optional paragraph"
                  onChange={(e) => update("spaceDescription", e.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                {SPACE_COLUMN_LABELS.map((fallback, index) => (
                  <Field key={fallback} label={`Column ${index + 1} label`} hint="Shown in the table header.">
                    <Input
                      value={values.spaceLabels[index] ?? ""}
                      placeholder={fallback}
                      onChange={(event) => {
                        const next = [...values.spaceLabels] as ServiceInput["spaceLabels"];
                        next[index] = event.target.value;
                        update("spaceLabels", next);
                      }}
                    />
                  </Field>
                ))}
              </div>
            <TableRows
              columns={values.spaceLabels.map(
                (label, index) => label.trim() || SPACE_COLUMN_LABELS[index]
              )}
              rows={values.spaceRows.map((row) => [
                row.useCase,
                row.recommended,
                row.impact,
                row.slip,
                row.acoustic,
                row.maintenance,
              ])}
              onChange={(rows) =>
                update(
                  "spaceRows",
                  rows.map(([useCase, recommended, impact, slip, acoustic, maintenance]) => ({
                    useCase,
                    recommended,
                    impact,
                    slip,
                    acoustic,
                    maintenance,
                  }))
                )
              }
            />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Leave this off if those extra columns are not useful for this service.</p>
          )}
          </div>
          <div className="grid gap-4">
          <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
            <Checkbox
              checked={values.showProcess}
              onChange={(e) => update("showProcess", e.target.checked)}
            />
            <span>
              <strong className="block">Project process</strong>
              The numbered steps under the service content. Turn this off to hide the whole block.
            </span>
          </label>
          {values.showProcess ? (
            <>
              <Field label="Heading" hint="Leave blank to hide the heading.">
                <Input
                  value={values.processTitle ?? ""}
                  placeholder={DEFAULT_PROCESS_TITLE}
                  onChange={(e) => update("processTitle", e.target.value)}
                />
              </Field>
              <Field label="Paragraph" hint="Leave blank to hide the paragraph.">
                <Textarea
                  value={values.processDescription ?? ""}
                  placeholder={DEFAULT_PROCESS_DESCRIPTION}
                  onChange={(e) => update("processDescription", e.target.value)}
                />
              </Field>
              <div className="grid gap-3">
                {values.processSteps.map((step, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <Field label={`Step ${index + 1}`} className="min-w-0 flex-1">
                      <Input
                        value={step.label}
                        placeholder="Step name"
                        onChange={(event) => {
                          const next = values.processSteps.map((item) => ({ ...item }));
                          next[index] = { label: event.target.value };
                          update("processSteps", next);
                        }}
                      />
                    </Field>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Remove step ${index + 1}`}
                      onClick={() =>
                        update(
                          "processSteps",
                          values.processSteps.filter((_, stepIndex) => stepIndex !== index)
                        )
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    update("processSteps", [...values.processSteps, { label: "" }])
                  }
                >
                  <Plus className="size-4" /> Add step
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Leave this off to hide the project process on the service page.</p>
          )}
          </div>
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold">FAQs</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Questions shown on this service page. Remove them all to hide the FAQ list.
              </p>
            </div>
            <Field label="Intro" hint="Short note above the questions. Leave blank to hide it." error={errors.faqIntro}>
              <Textarea
                value={values.faqIntro ?? ""}
                placeholder={DEFAULT_FAQ_INTRO}
                onChange={(e) => update("faqIntro", e.target.value)}
              />
            </Field>
            {errors.faqs ? <p className="text-sm text-destructive">{errors.faqs}</p> : null}
            <div className="grid gap-4">
              {values.faqs.map((faq, index) => (
                <div key={index} className="grid gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-end gap-2">
                    <Field
                      label={`Question ${index + 1}`}
                      className="min-w-0 flex-1"
                      error={errors[`faqs.${index}.question`]}
                    >
                      <Input
                        value={faq.question}
                        placeholder="Question"
                        onChange={(event) => {
                          const next = values.faqs.map((item) => ({ ...item }));
                          next[index] = { ...faq, question: event.target.value };
                          update("faqs", next);
                        }}
                      />
                    </Field>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Remove question ${index + 1}`}
                      onClick={() =>
                        update(
                          "faqs",
                          values.faqs.filter((_, faqIndex) => faqIndex !== index)
                        )
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <Field label="Answer" error={errors[`faqs.${index}.answer`]}>
                    <Textarea
                      value={faq.answer}
                      placeholder="Answer"
                      onChange={(event) => {
                        const next = values.faqs.map((item) => ({ ...item }));
                        next[index] = { ...faq, answer: event.target.value };
                        update("faqs", next);
                      }}
                    />
                  </Field>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => update("faqs", [...values.faqs, { question: "", answer: "" }])}
              >
                <Plus className="size-4" /> Add question
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "Related" ? (
        <div className="max-w-xl space-y-3">
          <p className="text-sm text-muted-foreground">
            Optional. Choose other services to show on this page. Leave them all unchecked to hide that section.
          </p>
          {relatedOptions.map((option) => {
            const checked = values.relatedServices.includes(option.id);
            return (
              <label key={option.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={checked}
                  onChange={(e) => {
                    update(
                      "relatedServices",
                      e.target.checked
                        ? [...values.relatedServices, option.id]
                        : values.relatedServices.filter((id) => id !== option.id)
                    );
                  }}
                />
                {option.title}
              </label>
            );
          })}
          {relatedOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No other services yet.</p>
          ) : null}
        </div>
      ) : null}

      {tab === "SEO" ? (
        <div className="grid max-w-xl gap-5">
          <Field label="SEO title" hint="Overrides the service name in search results." error={errors.seoTitle}>
            <Input value={values.seoTitle ?? ""} onChange={(e) => update("seoTitle", e.target.value)} />
          </Field>
          <Field label="SEO description" error={errors.seoDescription}>
            <Textarea
              maxLength={200}
              value={values.seoDescription ?? ""}
              onChange={(e) => update("seoDescription", e.target.value)}
            />
            <CharCount value={values.seoDescription ?? ""} max={200} />
          </Field>
        </div>
      ) : null}

      {confirmUnpublish ? (
        <div className="max-w-xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-medium">Unpublish this service?</p>
          <p className="mt-1">
            This will hide the public page until you publish it again.
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

      {service ? (
        <div>
          {confirmDelete ? (
            <div className="max-w-xl rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium">Delete this service?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The public page will stop working. Images are kept in Media.
              </p>
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
          ) : (
            <Button type="button" variant="ghost" className="text-destructive" onClick={() => setConfirmDelete(true)}>
              Delete service
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function TableRows({
  columns,
  rows,
  onChange,
}: {
  columns: string[];
  rows: string[][];
  onChange: (rows: string[][]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="bg-muted/60 px-2 py-2 text-left text-xs">
                  {column}
                </th>
              ))}
              <th className="bg-muted/60" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-2 py-1">
                    <Input
                      value={cell}
                      onChange={(event) => {
                        const next = rows.map((item) => [...item]);
                        next[index][cellIndex] = event.target.value;
                        onChange(next);
                      }}
                    />
                  </td>
                ))}
                <td>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange(rows.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...rows, columns.map(() => "")])}
      >
        Add row
      </Button>
    </div>
  );
}
