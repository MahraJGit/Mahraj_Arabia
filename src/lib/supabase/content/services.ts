import type { PublishStatus } from "@/lib/cms/types";
import { emptyLexicalDoc } from "@/lib/cms/lexical";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type {
  FaqItem,
  ServiceCaseStudyItem,
  ServiceHighlightItem,
  ServiceRow,
  ServiceWrite,
} from "@/lib/supabase/content/types";

function client() {
  return getSupabaseAdminClient();
}

function asFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      return {
        question: String(row.question ?? "").trim(),
        answer: String(row.answer ?? "").trim(),
      };
    })
    .filter((item) => item.question && item.answer);
}

function asPoints(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value
    .map((point) => {
      if (typeof point === "string") return point.trim();
      if (point && typeof point === "object") {
        return String((point as { label?: unknown }).label ?? "").trim();
      }
      return "";
    })
    .filter(Boolean)
    .slice(0, 6);
}

function asHighlights(value: unknown): ServiceHighlightItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      return {
        title: String(row.title ?? "").trim(),
        description: String(row.description ?? "").trim(),
        icon: String(row.icon ?? "").trim() || "layers",
        points: asPoints(row.points),
      };
    })
    .filter((item) => item.title && item.description)
    .slice(0, 6);
}

function asCaseStudies(value: unknown): ServiceCaseStudyItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      return {
        title: String(row.title ?? "").trim(),
        imageUrl: String(row.imageUrl ?? row.image_url ?? "").trim(),
        imageAlt: String(row.imageAlt ?? row.image_alt ?? "").trim(),
        meta: String(row.meta ?? "").trim(),
        badge: String(row.badge ?? "").trim(),
        price: String(row.price ?? "").trim(),
      };
    })
    .filter((item) => item.title && item.imageUrl)
    .slice(0, 6);
}

function asTags(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 8);
}

export function asServiceRecord(row: ServiceRow, familyTitle = "") {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: row.content ?? emptyLexicalDoc(),
    coverImage: String(row.cover_image_id ?? ""),
    coverUrl: String(row.cover_image_url ?? ""),
    coverAlt: String(row.cover_image_alt ?? ""),
    coverFilename: String(row.cover_image_filename ?? ""),
    coverWidth: typeof row.cover_image_width === "number" ? row.cover_image_width : null,
    coverHeight: typeof row.cover_image_height === "number" ? row.cover_image_height : null,
    parent: String(row.family_id ?? ""),
    parentTitle: familyTitle,
    status: (row.status === "published" ? "published" : "draft") as PublishStatus,
    tags: asTags(row.tags),
    metaTitle: String(row.meta_title ?? ""),
    metaDescription: String(row.meta_description ?? ""),
    focusKeyword: String(row.focus_keyword ?? ""),
    faqDescription: String(row.faq_intro ?? ""),
    faqs: asFaqs(row.faqs),
    highlightsTitle: String(row.highlights_title ?? ""),
    highlightsDescription: String(row.highlights_description ?? ""),
    highlights: asHighlights(row.highlights),
    caseStudiesTitle: String(row.case_studies_title ?? ""),
    caseStudiesDescription: String(row.case_studies_description ?? ""),
    caseStudies: asCaseStudies(row.case_studies),
    sortOrder: Number(row.sort_order ?? 10),
    showInMegaMenu: row.show_in_mega_menu !== false,
    featured: Boolean(row.featured),
    updatedAt: String(row.updated_at ?? ""),
    // admin list compatibility
    image: String(row.cover_image_id ?? ""),
    imageUrl: String(row.cover_image_url ?? ""),
    imageAlt: String(row.cover_image_alt ?? ""),
    imageFilename: String(row.cover_image_filename ?? ""),
    imageWidth: typeof row.cover_image_width === "number" ? row.cover_image_width : null,
    imageHeight: typeof row.cover_image_height === "number" ? row.cover_image_height : null,
    overviewImage: "",
    overviewImageUrl: "",
    relatedServices: [] as string[],
    detailReady: row.status === "published",
    heroTitle: String(row.hero_title ?? ""),
    heroDescription: String(row.excerpt ?? ""),
    overviewTitle: "",
    overviewDescription: "",
    guideTitle: String(row.highlights_title ?? ""),
    guideDescription: String(row.highlights_description ?? ""),
    applications: asHighlights(row.highlights).map((item) => ({
      title: item.title,
      description: item.description,
      icon: item.icon,
      points: item.points.map((label) => ({ label })),
    })),
    showProcess: false,
    processTitle: "",
    processDescription: "",
    processSteps: [] as { label: string }[],
    faqIntro: String(row.faq_intro ?? ""),
    seoTitle: String(row.meta_title ?? ""),
    seoDescription: String(row.meta_description ?? ""),
  };
}

function toWriteRow(input: ServiceWrite) {
  return {
    title: input.title,
    hero_title: input.heroTitle || "",
    slug: input.slug,
    excerpt: input.excerpt || "",
    content: input.content ?? emptyLexicalDoc(),
    cover_image_id: input.coverImageId,
    cover_image_url: input.coverImageUrl || "",
    cover_image_alt: input.coverImageAlt || "",
    cover_image_filename: input.coverImageFilename || "",
    cover_image_width: input.coverImageWidth,
    cover_image_height: input.coverImageHeight,
    family_id: input.familyId,
    status: input.status,
    tags: input.tags.slice(0, 8),
    meta_title: input.metaTitle || "",
    meta_description: input.metaDescription || "",
    focus_keyword: input.focusKeyword || "",
    faq_intro: input.faqDescription || "",
    faqs: input.faqs,
    highlights_title: input.highlightsTitle || "",
    highlights_description: input.highlightsDescription || "",
    highlights: input.highlights,
    case_studies_title: input.caseStudiesTitle || "",
    case_studies_description: input.caseStudiesDescription || "",
    case_studies: input.caseStudies,
    sort_order: input.sortOrder,
    show_in_mega_menu: input.showInMegaMenu,
    featured: Boolean(input.featured),
  };
}

export async function listCmsServices(filters?: {
  q?: string;
  status?: "all" | PublishStatus;
  group?: string;
  featured?: "all" | "featured" | "not-featured";
  menu?: "all" | "visible" | "hidden";
  sort?: "position" | "name" | "updated";
  page?: number;
  limit?: number;
}) {
  let query = client().from("services").select("*", { count: "exact" });

  if (filters?.status === "published" || filters?.status === "draft") {
    query = query.eq("status", filters.status);
  }
  if (filters?.group) query = query.eq("family_id", filters.group);
  if (filters?.featured === "featured") query = query.eq("featured", true);
  if (filters?.featured === "not-featured") query = query.eq("featured", false);
  if (filters?.menu === "visible") query = query.eq("show_in_mega_menu", true);
  if (filters?.menu === "hidden") query = query.eq("show_in_mega_menu", false);

  if (filters?.sort === "name") query = query.order("title", { ascending: true });
  else if (filters?.sort === "updated") query = query.order("updated_at", { ascending: false });
  else query = query.order("sort_order", { ascending: true }).order("title", { ascending: true });

  const page = Math.max(1, filters?.page ?? 1);
  const limit = filters?.limit ?? 50;
  const from = (page - 1) * limit;
  const { data, error, count } = await query.range(from, from + limit - 1);
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as ServiceRow[];
  const q = filters?.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) || row.slug.toLowerCase().includes(q)
    );
  }

  const familyIds = [...new Set(rows.map((row) => row.family_id).filter(Boolean))];
  const familyTitles = new Map<string, string>();
  if (familyIds.length > 0) {
    const { data: families } = await client()
      .from("service_families")
      .select("id, title")
      .in("id", familyIds);
    for (const family of families ?? []) {
      familyTitles.set(String(family.id), String(family.title ?? ""));
    }
  }

  return {
    items: rows.map((row) => {
      const record = asServiceRecord(row, familyTitles.get(row.family_id) ?? "");
      return {
        id: record.id,
        title: record.title,
        slug: record.slug,
        parentId: record.parent,
        parentTitle: record.parentTitle || "—",
        sortOrder: record.sortOrder,
        detailReady: true,
        showInMegaMenu: record.showInMegaMenu,
        featured: record.featured,
        status: record.status,
        updatedAt: record.updatedAt,
      };
    }),
    total: count ?? rows.length,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? rows.length) / limit)),
  };
}

export async function getCmsService(id: string) {
  const { data, error } = await client()
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as ServiceRow;
  let familyTitle = "";
  if (row.family_id) {
    const { data: family } = await client()
      .from("service_families")
      .select("title")
      .eq("id", row.family_id)
      .maybeSingle();
    familyTitle = String(family?.title ?? "");
  }
  return asServiceRecord(row, familyTitle);
}

export async function getCmsServiceBySlug(slug: string, publishedOnly = false) {
  let query = client().from("services").select("*").eq("slug", slug);
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as ServiceRow;
  let familyTitle = "";
  if (row.family_id) {
    const { data: family } = await client()
      .from("service_families")
      .select("title")
      .eq("id", row.family_id)
      .maybeSingle();
    familyTitle = String(family?.title ?? "");
  }
  return asServiceRecord(row, familyTitle);
}

export async function findCmsServiceBySlug(slug: string, excludeId?: string) {
  let query = client().from("services").select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? String(data.id) : null;
}

export async function nextCmsServiceSortOrder(parentId: string) {
  const { data, error } = await client()
    .from("services")
    .select("sort_order")
    .eq("family_id", parentId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Number(data?.sort_order ?? 0) + 10;
}

export async function insertCmsService(input: ServiceWrite) {
  const { data, error } = await client()
    .from("services")
    .insert(toWriteRow(input))
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return { id: null as string | null, duplicateSlug: true as const };
    throw new Error(error.message);
  }
  return { id: String(data.id), duplicateSlug: false as const };
}

export async function updateCmsService(id: string, input: ServiceWrite) {
  const { data, error } = await client()
    .from("services")
    .update(toWriteRow(input))
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    if (error.code === "23505") return { ok: false as const, duplicateSlug: true as const };
    throw new Error(error.message);
  }
  if (!data) return { ok: false as const, duplicateSlug: false as const };
  return { ok: true as const, duplicateSlug: false as const };
}

export async function deleteCmsService(id: string) {
  const { data, error } = await client()
    .from("services")
    .delete()
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? String(data.slug ?? "") : "";
}

export async function countCmsServicesInFamily(familyId: string) {
  const { count, error } = await client()
    .from("services")
    .select("id", { count: "exact", head: true })
    .eq("family_id", familyId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function listCmsServiceOptions(excludeId?: string) {
  let query = client().from("services").select("id, title").order("title", { ascending: true });
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title ?? ""),
  }));
}

export async function listPublishedCmsServices(
  limit = 200,
  options?: { featuredOnly?: boolean }
) {
  let query = client()
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (options?.featuredOnly) query = query.eq("featured", true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as ServiceRow[];
  const familyIds = [...new Set(rows.map((row) => row.family_id))];
  const familyTitles = new Map<string, string>();
  if (familyIds.length > 0) {
    const { data: families } = await client()
      .from("service_families")
      .select("id, title")
      .in("id", familyIds);
    for (const family of families ?? []) {
      familyTitles.set(String(family.id), String(family.title ?? ""));
    }
  }

  return rows.map((row) => asServiceRecord(row, familyTitles.get(row.family_id) ?? ""));
}

export async function listPublishedCmsServiceSlugs() {
  const { data, error } = await client()
    .from("services")
    .select("slug")
    .eq("status", "published")
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => String(row.slug ?? "")).filter(Boolean);
}

export async function listCmsSiblingServices(familyId: string, excludeSlug: string) {
  const { data, error } = await client()
    .from("services")
    .select("*")
    .eq("family_id", familyId)
    .eq("status", "published")
    .neq("slug", excludeSlug)
    .order("sort_order", { ascending: true })
    .limit(3);
  if (error) throw new Error(error.message);
  return ((data ?? []) as ServiceRow[]).map((row) => asServiceRecord(row));
}

export async function swapCmsServiceSortOrder(idA: string, idB: string) {
  const [a, b] = await Promise.all([getCmsService(idA), getCmsService(idB)]);
  if (!a || !b) return false;

  const { error: errorA } = await client()
    .from("services")
    .update({ sort_order: b.sortOrder })
    .eq("id", idA);
  if (errorA) throw new Error(errorA.message);

  const { error: errorB } = await client()
    .from("services")
    .update({ sort_order: a.sortOrder })
    .eq("id", idB);
  if (errorB) throw new Error(errorB.message);
  return true;
}
