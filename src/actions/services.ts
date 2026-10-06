"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireServiceEditor } from "@/lib/cms/permissions";
import { revalidateServicePaths } from "@/lib/cms/revalidate";
import { swapAdjacentSortOrder } from "@/lib/cms/reorder";
import { slugify } from "@/lib/cms/slug";
import { asObjectId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { readBrandColors } from "@/lib/services/colors";
import { nextSortOrder } from "@/lib/services/queries";
import {
  PERFORMANCE_COLUMN_LABELS,
  SPACE_COLUMN_LABELS,
  columnLabels,
} from "@/lib/services/table-labels";
import { flattenZod } from "@/lib/validation/flatten";
import { serviceDraftSchema, type ServiceInput } from "@/lib/validation/service";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  href?: string;
};

async function assertUniqueServiceSlug(slug: string, excludeId?: string) {
  const { Service } = await getModels();
  const filter: Record<string, unknown> = { slug };
  if (excludeId && isObjectId(excludeId)) {
    filter._id = { $ne: asObjectId(excludeId) };
  }
  const existing = await Service.findOne(filter).select("_id").lean();
  return !existing;
}

function withRowIds<T extends Record<string, unknown>>(rows: T[]) {
  return rows.map((row) => ({
    ...row,
    id: typeof row.id === "string" && row.id ? row.id : randomUUID(),
  }));
}

function compactApplications(rows: ServiceInput["applications"]) {
  return rows.filter((row) => {
    const points = Array.isArray(row.points) ? row.points : [];
    return (
      String(row.title ?? "").trim() ||
      String(row.description ?? "").trim() ||
      points.some((point) => String(point.label ?? "").trim())
    );
  });
}

function compactPerformance(rows: ServiceInput["performanceRows"]) {
  return rows.filter(
    (row) =>
      String(row.useCase ?? "").trim() ||
      String(row.recommended ?? "").trim() ||
      String(row.forceReduction ?? "").trim()
  );
}

function compactSpace(rows: ServiceInput["spaceRows"]) {
  return rows.filter(
    (row) =>
      String(row.useCase ?? "").trim() ||
      String(row.recommended ?? "").trim() ||
      String(row.impact ?? "").trim() ||
      String(row.slip ?? "").trim() ||
      String(row.acoustic ?? "").trim() ||
      String(row.maintenance ?? "").trim()
  );
}

function toDocument(data: ServiceInput) {
  const related = data.relatedServices.filter((id) => isObjectId(id));
  return {
    title: data.title,
    slug: data.slug,
    parent: asObjectId(data.parent),
    excerpt: data.excerpt,
    relatedServices: related.map(asObjectId),
    sortOrder: data.sortOrder,
    showInMegaMenu: data.showInMegaMenu,
    detailReady: data.detailReady,
    detailTitle: data.title,
    heroTitle: data.heroTitle || "",
    heroDescription: data.heroDescription || "",
    overviewTitle: data.overviewTitle || "",
    overviewDescription: data.overviewDescription || "",
    guideTitle: data.guideTitle || "",
    guideDescription: data.guideDescription || "",
    applications: withRowIds(
      compactApplications(data.applications).map((application) => ({
        title: application.title,
        description: application.description,
        icon: application.icon || "",
        points: withRowIds(
          application.points.filter((point) => point.label.trim())
        ),
      }))
    ),
    showPerformanceMatrix: data.showPerformanceMatrix,
    performanceTitle: data.performanceTitle || "",
    performanceDescription: data.performanceDescription || "",
    performanceLabels: columnLabels(data.performanceLabels, PERFORMANCE_COLUMN_LABELS),
    performanceRows: withRowIds(compactPerformance(data.performanceRows)),
    density: data.density || "",
    warranty: data.warranty || "",
    brandingTitle: data.brandingTitle || "Custom Branding & Color",
    brandingDescription: data.brandingDescription || "",
    brandColorLabel: data.brandColorLabel || "",
    brandColors: readBrandColors(data.brandColors),
    showSpaceRequirements: data.showSpaceRequirements,
    spaceTitle: data.spaceTitle || "",
    spaceDescription: data.spaceDescription || "",
    spaceLabels: columnLabels(data.spaceLabels, SPACE_COLUMN_LABELS),
    spaceRows: withRowIds(compactSpace(data.spaceRows)),
    showProcess: data.showProcess,
    processTitle: data.processTitle || "",
    processDescription: data.processDescription || "",
    processSteps: data.processSteps
      .map((step) => ({ label: step.label.trim() }))
      .filter((step) => step.label),
    faqIntro: data.faqIntro || "",
    faqs: data.faqs
      .map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      }))
      .filter((faq) => faq.question && faq.answer),
    caseStudiesTitle: data.caseStudiesTitle || "",
    caseStudiesDescription: data.caseStudiesDescription || "",
    projectsTitle: data.projectsTitle || "",
    projectsDescription: data.projectsDescription || "",
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    _status: data._status,
  };
}

function normalizeServiceInput(raw: unknown) {
  if (!raw || typeof raw !== "object") return raw;
  const data = { ...(raw as Record<string, unknown>) };
  if (Array.isArray(data.applications)) {
    data.applications = compactApplications(
      data.applications as ServiceInput["applications"]
    );
  }
  if (Array.isArray(data.performanceRows)) {
    data.performanceRows = compactPerformance(
      data.performanceRows as ServiceInput["performanceRows"]
    );
  }
  if (Array.isArray(data.spaceRows)) {
    data.spaceRows = compactSpace(data.spaceRows as ServiceInput["spaceRows"]);
  }
  if (Array.isArray(data.processSteps)) {
    data.processSteps = data.processSteps.filter((step) => {
      if (!step || typeof step !== "object") return false;
      return String((step as { label?: unknown }).label ?? "").trim();
    });
  }
  if (Array.isArray(data.faqs)) {
    data.faqs = data.faqs.filter((faq) => {
      if (!faq || typeof faq !== "object") return false;
      const question = String((faq as { question?: unknown }).question ?? "").trim();
      const answer = String((faq as { answer?: unknown }).answer ?? "").trim();
      return question || answer;
    });
  }
  return data;
}

export async function saveService(
  id: string | null,
  raw: unknown
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  const parsed = serviceDraftSchema.safeParse(normalizeServiceInput(raw));
  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  const data = parsed.data;
  if (id && data.relatedServices.includes(id)) {
    return {
      fieldErrors: { relatedServices: "A service cannot be related to itself." },
    };
  }

  const unique = await assertUniqueServiceSlug(data.slug, id ?? undefined);
  if (!unique) {
    return {
      fieldErrors: { slug: "This URL slug is already used by another service." },
    };
  }

  const { Service, MainService } = await getModels();
  const parent = await MainService.findById(data.parent).select("_id").lean();
  if (!parent) {
    return { fieldErrors: { parent: "Please choose a family." } };
  }

  const previous =
    id && isObjectId(id) ? await Service.findById(id).select("slug").lean() : null;
  const previousSlug = previous ? String(previous.slug ?? "") : "";
  const payload = toDocument(data);

  const $set: Record<string, unknown> = { ...payload };
  const $unset: Record<string, number> = {};

  if (data.image && isObjectId(data.image)) {
    $set.image = asObjectId(data.image);
  } else if (id) {
    delete $set.image;
    $unset.image = 1;
  } else {
    delete $set.image;
  }

  if (data.overviewImage && isObjectId(data.overviewImage)) {
    $set.overviewImage = asObjectId(data.overviewImage);
  } else {
    $set.overviewImage = null;
  }

  let savedId = id;
  try {
    if (id) {
      if (!isObjectId(id)) return { error: "This service could not be found." };
      const update: Record<string, unknown> = { $set };
      if (Object.keys($unset).length > 0) update.$unset = $unset;
      const updated = await Service.findByIdAndUpdate(id, update, { new: true });
      if (!updated) return { error: "This service could not be found." };
    } else {
      const sortOrder =
        Number(data.sortOrder) > 0
          ? data.sortOrder
          : await nextSortOrder("services", data.parent);
      const created = await Service.create({ ...$set, sortOrder });
      savedId = toId(created._id);
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return {
        fieldErrors: { slug: "This URL slug is already used by another service." },
      };
    }
    throw error;
  }

  await revalidateServicePaths(data.slug);
  if (previousSlug && previousSlug !== data.slug) {
    await revalidateServicePaths(previousSlug);
  }
  revalidatePath("/admin/services");
  if (savedId) revalidatePath(`/admin/services/${savedId}`);
  const saved = data._status === "published" ? "published" : "draft";
  return {
    href: id
      ? `/admin/services/${savedId}?saved=${saved}`
      : `/admin/services?group=${data.parent}&saved=${saved}`,
  };
}

export async function duplicateService(id: string): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isObjectId(id)) return { error: "This service could not be found." };
  const { Service } = await getModels();
  const doc = await Service.findById(id).lean();
  if (!doc) return { error: "This service could not be found." };

  const title = `Copy of ${String(doc.title ?? "Untitled")}`.trim();
  const base = slugify(String(doc.slug || doc.title || "service")) || "service";
  let slug = `${base}-copy`;
  for (let attempt = 2; !(await assertUniqueServiceSlug(slug)); attempt += 1) {
    if (attempt > 50) {
      return { error: "A copy could not be created. Please try again." };
    }
    slug = `${base}-copy-${attempt}`;
  }

  const parentId = toId(doc.parent);
  const sortOrder = parentId ? await nextSortOrder("services", parentId) : 10;
  const copy = { ...doc } as Record<string, unknown>;
  delete copy._id;
  delete copy.createdAt;
  delete copy.updatedAt;
  delete copy.__v;

  try {
    const created = await Service.create({
      ...copy,
      title,
      slug,
      sortOrder,
      _status: "draft",
    });
    const savedId = toId(created._id);
    revalidatePath("/admin/services");
    return { href: `/admin/services/${savedId}?saved=duplicated` };
  } catch {
    return { error: "The service could not be duplicated. Please try again." };
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isObjectId(id)) return { error: "This service could not be found." };
  const { Service } = await getModels();
  const doc = await Service.findById(id).select("slug").lean();
  if (!doc) return { error: "This service could not be found." };
  await Service.deleteOne({ _id: asObjectId(id) });
  await revalidateServicePaths(String(doc.slug ?? ""));
  revalidatePath("/admin/services");
  return { href: "/admin/services?saved=deleted" };
}

export async function reorderServices(
  parentId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  const { Service } = await getModels();
  const ids = orderedIds.filter(isObjectId);
  await Promise.all(
    ids.map((id, index) =>
      Service.updateOne(
        { _id: asObjectId(id), parent: asObjectId(parentId) },
        { $set: { sortOrder: (index + 1) * 10 } }
      )
    )
  );
  await revalidateServicePaths();
  revalidatePath("/admin/services");
  return {};
}

export async function moveService(
  id: string,
  direction: "earlier" | "later"
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isObjectId(id)) return { error: "This service could not be found." };
  const { Service } = await getModels();
  const current = await Service.findById(id).select("parent").lean();
  if (!current?.parent) return {};

  const result = await swapAdjacentSortOrder(Service, id, direction, {
    parent: current.parent,
  });
  if (result.error) return { error: result.error };
  if (!result.moved) return {};
  await revalidateServicePaths();
  revalidatePath("/admin/services");
  return {};
}
