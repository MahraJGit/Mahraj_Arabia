"use server";

import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { requireServiceEditor } from "@/lib/cms/permissions";
import { revalidateServicePaths } from "@/lib/cms/revalidate";
import { isLexicalDoc, normalizeLexicalDoc } from "@/lib/cms/lexical";
import { isUuid } from "@/lib/db/ids";
import {
  deleteCmsService,
  findCmsServiceBySlug,
  getCmsService,
  getServiceFamily,
  insertCmsService,
  isSupabaseContentEnabled,
  nextCmsServiceSortOrder,
  swapCmsServiceSortOrder,
  updateCmsService,
} from "@/lib/supabase/content";
import { flattenZod } from "@/lib/validation/flatten";
import { serviceDraftSchema, type ServiceInput } from "@/lib/validation/service";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  href?: string;
};

export async function saveService(
  id: string | null,
  raw: unknown
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured. Connect Supabase to manage services." };
  }

  const parsed = serviceDraftSchema.safeParse(raw);
  if (!parsed.success) return { fieldErrors: flattenZod(parsed.error) };
  const data = parsed.data as ServiceInput;

  const duplicate = await findCmsServiceBySlug(data.slug, id ?? undefined);
  if (duplicate) {
    return { fieldErrors: { slug: "This URL slug is already used by another service." } };
  }

  const parent = await getServiceFamily(data.parent);
  if (!parent) return { fieldErrors: { parent: "Please choose a family." } };

  if (data.content != null && !isLexicalDoc(data.content)) {
    return { fieldErrors: { content: "Service content is not in a readable format." } };
  }

  const existing = id && isUuid(id) ? await getCmsService(id) : null;
  if (id && !existing) return { error: "This service could not be found." };

  const sortOrder =
    existing?.sortOrder && existing.sortOrder > 0
      ? existing.sortOrder
      : await nextCmsServiceSortOrder(data.parent);

  const write = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || "",
    content: normalizeLexicalDoc(data.content),
    coverImageId: data.coverImageId || null,
    coverImageUrl: data.coverImageUrl || "",
    coverImageAlt: data.coverImageAlt || "",
    coverImageFilename: data.coverImageFilename || "",
    coverImageWidth: data.coverImageWidth ?? null,
    coverImageHeight: data.coverImageHeight ?? null,
    familyId: data.parent,
    status: data._status,
    tags: data.tags,
    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",
    focusKeyword: data.focusKeyword || "",
    faqDescription: data.faqDescription || "",
    faqs: data.faqs,
    highlightsTitle: data.highlightsTitle || "",
    highlightsDescription: data.highlightsDescription || "",
    highlights: data.highlights,
    caseStudiesTitle: data.caseStudiesTitle || "",
    caseStudiesDescription: data.caseStudiesDescription || "",
    caseStudies: data.caseStudies,
    sortOrder,
    showInMegaMenu: data.showInMegaMenu,
  };

  let savedId = id;
  if (id) {
    const result = await updateCmsService(id, write);
    if (result.duplicateSlug) {
      return { fieldErrors: { slug: "This URL slug is already used by another service." } };
    }
    if (!result.ok) return { error: "This service could not be found." };
  } else {
    const created = await insertCmsService(write);
    if (created.duplicateSlug) {
      return { fieldErrors: { slug: "This URL slug is already used by another service." } };
    }
    savedId = created.id;
  }

  const previousSlug = existing?.slug ?? "";
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

export async function deleteService(id: string): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };
  if (!isUuid(id)) return { error: "This service could not be found." };

  const slug = await deleteCmsService(id);
  await revalidateServicePaths(slug);
  revalidatePath("/admin/services");
  return { href: "/admin/services?saved=deleted" };
}

export async function moveService(
  id: string,
  direction: "earlier" | "later" | "up" | "down"
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };
  if (!isUuid(id)) return { error: "This service could not be found." };

  const current = await getCmsService(id);
  if (!current) return { error: "This service could not be found." };

  const { listCmsServices } = await import("@/lib/supabase/content");
  const siblings = await listCmsServices({
    group: current.parent,
    sort: "position",
    limit: 200,
  });
  const index = siblings.items.findIndex((item) => item.id === id);
  const earlier = direction === "earlier" || direction === "up";
  const swapWith = earlier ? siblings.items[index - 1] : siblings.items[index + 1];
  if (!swapWith) return { href: "/admin/services" };

  await swapCmsServiceSortOrder(id, swapWith.id);
  revalidatePath("/admin/services");
  await revalidateServicePaths(current.slug);
  return { href: "/admin/services" };
}

export async function reorderServices(
  groupId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };
  if (!isUuid(groupId)) return { error: "This family could not be found." };

  const { getSupabaseAdminClient } = await import("@/lib/supabase/server");
  const client = getSupabaseAdminClient();
  for (let index = 0; index < orderedIds.length; index += 1) {
    const id = orderedIds[index];
    if (!id || !isUuid(id)) continue;
    const { error } = await client
      .from("services")
      .update({ sort_order: (index + 1) * 10 })
      .eq("id", id)
      .eq("family_id", groupId);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { href: "/admin/services" };
}

export async function duplicateService(id: string): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };
  if (!isUuid(id)) return { error: "This service could not be found." };

  const doc = await getCmsService(id);
  if (!doc) return { error: "This service could not be found." };

  const base = `${doc.slug}-copy`;
  let slug = base;
  for (let attempt = 2; await findCmsServiceBySlug(slug); attempt += 1) {
    slug = `${base}-${attempt}`;
  }

  const created = await insertCmsService({
    title: `Copy of ${doc.title}`,
    slug,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImageId: doc.coverImage || null,
    coverImageUrl: doc.coverUrl,
    coverImageAlt: doc.coverAlt,
    coverImageFilename: doc.coverFilename,
    coverImageWidth: doc.coverWidth,
    coverImageHeight: doc.coverHeight,
    familyId: doc.parent,
    status: "draft",
    tags: doc.tags,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    focusKeyword: doc.focusKeyword,
    faqDescription: doc.faqDescription || doc.faqIntro || "",
    faqs: doc.faqs,
    highlightsTitle: doc.highlightsTitle || "",
    highlightsDescription: doc.highlightsDescription || "",
    highlights: doc.highlights || [],
    caseStudiesTitle: doc.caseStudiesTitle || "",
    caseStudiesDescription: doc.caseStudiesDescription || "",
    caseStudies: doc.caseStudies || [],
    sortOrder: await nextCmsServiceSortOrder(doc.parent),
    showInMegaMenu: doc.showInMegaMenu,
  });

  if (!created.id) return { error: "Could not duplicate this service." };
  revalidatePath("/admin/services");
  return { href: `/admin/services/${created.id}?saved=draft` };
}
