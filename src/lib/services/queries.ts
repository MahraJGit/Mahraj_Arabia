import { asObjectId, isContentId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { isDemoMode } from "@/lib/auth/demo";
import {
  getDemoService,
  getDemoServiceGroup,
  getDemoServiceGroups,
  getDemoServicesList,
} from "@/lib/cms/demo-data";
import { readBrandColors } from "@/lib/services/colors";
import { publishStatus } from "@/lib/cms/status";
import type { PublishStatus } from "@/lib/cms/types";
import { readFaqIntro, readFaqs } from "@/lib/services/faqs";
import {
  DEFAULT_PROCESS_DESCRIPTION,
  DEFAULT_PROCESS_TITLE,
  readProcessSteps,
} from "@/lib/services/process";
import {
  PERFORMANCE_COLUMN_LABELS,
  SPACE_COLUMN_LABELS,
  columnLabels,
} from "@/lib/services/table-labels";
import {
  getServiceFamily,
  getServiceFamilyTitles,
  isSupabaseContentEnabled,
  listServiceFamilies,
  nextServiceFamilySortOrder,
} from "@/lib/supabase/content";

export type ServiceGroupListItem = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  showInMegaMenu: boolean;
  status: PublishStatus;
  serviceCount: number;
  updatedAt: string;
};

export type ServiceGroupRecord = {
  id: string;
  title: string;
  slug: string;
  menuDescription: string;
  sortOrder: number;
  showInMegaMenu: boolean;
  status: PublishStatus;
};

export type ServiceListItem = {
  id: string;
  title: string;
  slug: string;
  parentId: string;
  parentTitle: string;
  sortOrder: number;
  detailReady: boolean;
  showInMegaMenu: boolean;
  status: PublishStatus;
  updatedAt: string;
};

export type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  parent: string;
  excerpt: string;
  image: string;
  imageUrl: string;
  imageAlt: string;
  imageFilename: string;
  imageWidth: number | null;
  imageHeight: number | null;
  overviewImage: string;
  overviewImageUrl: string;
  relatedServices: string[];
  sortOrder: number;
  showInMegaMenu: boolean;
  detailReady: boolean;
  heroTitle: string;
  heroDescription: string;
  overviewTitle: string;
  overviewDescription: string;
  guideTitle: string;
  guideDescription: string;
  applications: {
    title: string;
    description: string;
    icon: string;
    points: { label: string }[];
  }[];
  showPerformanceMatrix: boolean;
  performanceTitle: string;
  performanceDescription: string;
  performanceLabels: string[];
  performanceRows: {
    useCase: string;
    recommended: string;
    forceReduction: string;
  }[];
  density: string;
  warranty: string;
  brandingTitle: string;
  brandingDescription: string;
  brandColorLabel: string;
  brandColors: { hex: string; selected: boolean }[];
  showSpaceRequirements: boolean;
  spaceTitle: string;
  spaceDescription: string;
  spaceLabels: string[];
  spaceRows: {
    useCase: string;
    recommended: string;
    impact: string;
    slip: string;
    acoustic: string;
    maintenance: string;
  }[];
  showProcess: boolean;
  processTitle: string;
  processDescription: string;
  processSteps: { label: string }[];
  faqIntro: string;
  faqs: { question: string; answer: string }[];
  caseStudiesTitle: string;
  caseStudiesDescription: string;
  projectsTitle: string;
  projectsDescription: string;
  seoTitle: string;
  seoDescription: string;
  status: PublishStatus;
};

export type ServiceOption = {
  id: string;
  title: string;
};

export type ServiceSort = "position" | "name" | "updated";

export type ListQuery = {
  q?: string;
  status?: "all" | PublishStatus;
  menu?: "all" | "visible" | "hidden";
  group?: string;
  ready?: "all" | "ready" | "soon";
  sort?: ServiceSort;
  page?: number;
  limit?: number;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function when(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

async function serviceCountsByParent(parentIds: string[]) {
  if (parentIds.length === 0) return new Map<string, number>();
  if (isDemoMode()) return new Map<string, number>();

  const { Service } = await getModels();
  const counts = await Service.aggregate<{ _id: unknown; total: number }>([
    { $match: { parent: { $in: parentIds } } },
    { $group: { _id: "$parent", total: { $sum: 1 } } },
  ]);
  return new Map(counts.map((row) => [toId(row._id), row.total]));
}

export async function listServiceGroups(query: ListQuery = {}) {
  const page = Math.max(1, query.page ?? 1);
  const limit = query.limit ?? 50;

  if (isDemoMode()) {
    let items = getDemoServiceGroups();
    if (query.q?.trim()) {
      const q = query.q.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q)
      );
    }
    if (query.status === "draft" || query.status === "published") {
      items = items.filter((item) => item.status === query.status);
    }
    if (query.menu === "visible") {
      items = items.filter((item) => item.showInMegaMenu);
    }
    if (query.menu === "hidden") {
      items = items.filter((item) => !item.showInMegaMenu);
    }
    const total = items.length;
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  }

  if (isSupabaseContentEnabled()) {
    const families = await listServiceFamilies({
      q: query.q,
      status: query.status,
      menu: query.menu,
    });
    const total = families.length;
    const start = (page - 1) * limit;
    const pageItems = families.slice(start, start + limit);
    const countMap = await serviceCountsByParent(pageItems.map((item) => item.id));

    const items: ServiceGroupListItem[] = pageItems.map((family) => ({
      id: family.id,
      title: family.title || "Untitled",
      slug: family.slug,
      sortOrder: family.sortOrder,
      showInMegaMenu: family.showInMegaMenu,
      status: family.status,
      serviceCount: countMap.get(family.id) ?? 0,
      updatedAt: family.updatedAt,
    }));

    return {
      items,
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  }

  const { MainService, Service } = await getModels();
  const filter: Record<string, unknown> = {};

  if (query.q?.trim()) {
    const rx = new RegExp(escapeRegex(query.q.trim()), "i");
    filter.$or = [{ title: rx }, { slug: rx }];
  }
  if (query.status === "draft" || query.status === "published") {
    filter._status = query.status;
  }
  if (query.menu === "visible") filter.showInMegaMenu = { $ne: false };
  if (query.menu === "hidden") filter.showInMegaMenu = false;

  const [docs, total] = await Promise.all([
    MainService.find(filter)
      .sort({ sortOrder: 1, title: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    MainService.countDocuments(filter),
  ]);

  const ids = docs.map((doc) => doc._id);
  const counts = await Service.aggregate<{ _id: unknown; total: number }>([
    { $match: { parent: { $in: ids } } },
    { $group: { _id: "$parent", total: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((row) => [toId(row._id), row.total]));

  const items: ServiceGroupListItem[] = docs.map((doc) => ({
    id: toId(doc._id),
    title: String(doc.title ?? "Untitled"),
    slug: String(doc.slug ?? ""),
    sortOrder: Number(doc.sortOrder ?? 0),
    showInMegaMenu: doc.showInMegaMenu !== false,
    status: publishStatus(doc._status),
    serviceCount: countMap.get(toId(doc._id)) ?? 0,
    updatedAt: when(doc.updatedAt),
  }));

  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

export async function getServiceGroup(id: string): Promise<ServiceGroupRecord | null> {
  if (isDemoMode()) {
    return getDemoServiceGroup(id);
  }
  if (!isContentId(id)) return null;

  if (isSupabaseContentEnabled()) {
    const family = await getServiceFamily(id);
    if (!family) return null;
    return {
      id: family.id,
      title: family.title,
      slug: family.slug,
      menuDescription: family.menuDescription,
      sortOrder: family.sortOrder,
      showInMegaMenu: family.showInMegaMenu,
      status: family.status,
    };
  }

  if (!isObjectId(id)) return null;
  const { MainService } = await getModels();
  const doc = await MainService.findById(id).lean();
  if (!doc) return null;
  return {
    id: toId(doc._id),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    menuDescription: String(doc.menuDescription ?? ""),
    sortOrder: Number(doc.sortOrder ?? 10),
    showInMegaMenu: doc.showInMegaMenu !== false,
    status: publishStatus(doc._status),
  };
}

export async function countServicesInGroup(groupId: string) {
  if (isDemoMode()) {
    if (groupId === "demo-group-1") return getDemoServicesList().length;
    return 0;
  }
  if (!isContentId(groupId)) return 0;
  const { Service } = await getModels();
  return Service.countDocuments({ parent: groupId });
}

export async function listGroupOptions() {
  if (isDemoMode()) {
    return getDemoServiceGroups().map((group) => ({
      id: group.id,
      title: group.title,
    }));
  }
  if (isSupabaseContentEnabled()) {
    const families = await listServiceFamilies();
    return families.map((family) => ({
      id: family.id,
      title: family.title || "Untitled",
    }));
  }
  const { MainService } = await getModels();
  const docs = await MainService.find()
    .sort({ sortOrder: 1, title: 1 })
    .select("title")
    .lean();
  return docs.map((doc) => ({
    id: toId(doc._id),
    title: String(doc.title ?? "Untitled"),
  }));
}

export async function listServices(query: ListQuery = {}) {
  if (isDemoMode()) {
    const page = Math.max(1, query.page ?? 1);
    const limit = query.limit ?? 25;
    let items = getDemoServicesList();
    if (query.q?.trim()) {
      const q = query.q.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q)
      );
    }
    if (query.status === "draft" || query.status === "published") {
      items = items.filter((item) => item.status === query.status);
    }
    if (query.group) {
      items = items.filter((item) => item.parentId === query.group);
    }
    if (query.ready === "ready") {
      items = items.filter((item) => item.detailReady);
    }
    if (query.ready === "soon") {
      items = items.filter((item) => !item.detailReady);
    }
    if (query.sort === "name") {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (query.sort === "updated") {
      items = [...items].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    }
    const total = items.length;
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  }

  const { Service } = await getModels();
  const page = Math.max(1, query.page ?? 1);
  const limit = query.limit ?? 25;
  const filter: Record<string, unknown> = {};

  if (query.q?.trim()) {
    const rx = new RegExp(escapeRegex(query.q.trim()), "i");
    filter.$or = [{ title: rx }, { slug: rx }];
  }
  if (query.status === "draft" || query.status === "published") {
    filter._status = query.status;
  }
  if (query.group && isContentId(query.group)) {
    filter.parent = query.group;
  }
  if (query.ready === "ready") filter.detailReady = true;
  if (query.ready === "soon") {
    filter.$and = [
      ...(Array.isArray(filter.$and) ? filter.$and : []),
      { $or: [{ detailReady: { $ne: true } }, { detailReady: { $exists: false } }] },
    ];
  }

  const sort =
    query.sort === "name"
      ? { title: 1 as const }
      : query.sort === "updated"
        ? { updatedAt: -1 as const }
        : { sortOrder: 1 as const, title: 1 as const };

  const [docs, total] = await Promise.all([
    Service.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Service.countDocuments(filter),
  ]);

  const parentIds = docs.map((doc) => toId(doc.parent)).filter(Boolean);
  const parentTitles = isSupabaseContentEnabled()
    ? await getServiceFamilyTitles(parentIds)
    : await (async () => {
        const { MainService } = await getModels();
        const objectIds = parentIds.filter(isObjectId);
        const map = new Map<string, { id: string; title: string }>();
        if (objectIds.length === 0) return map;
        const parents = await MainService.find({
          _id: { $in: objectIds.map(asObjectId) },
        })
          .select("title")
          .lean();
        for (const parent of parents) {
          map.set(toId(parent._id), {
            id: toId(parent._id),
            title: String(parent.title ?? "—"),
          });
        }
        return map;
      })();

  const items: ServiceListItem[] = docs.map((doc) => {
    const parentId = toId(doc.parent);
    return {
      id: toId(doc._id),
      title: String(doc.title ?? "Untitled"),
      slug: String(doc.slug ?? ""),
      parentId,
      parentTitle: parentTitles.get(parentId)?.title ?? "—",
      sortOrder: Number(doc.sortOrder ?? 0),
      detailReady: Boolean(doc.detailReady),
      showInMegaMenu: doc.showInMegaMenu !== false,
      status: publishStatus(doc._status),
      updatedAt: when(doc.updatedAt),
    };
  });

  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

export async function listServiceOptions(excludeId?: string): Promise<ServiceOption[]> {
  if (isDemoMode()) {
    return getDemoServicesList()
      .filter((item) => item.id !== excludeId)
      .map((item) => ({ id: item.id, title: item.title }));
  }
  const { Service } = await getModels();
  const filter = excludeId && isObjectId(excludeId) ? { _id: { $ne: asObjectId(excludeId) } } : {};
  const docs = await Service.find(filter).sort({ title: 1 }).select("title").lean();
  return docs.map((doc) => ({
    id: toId(doc._id),
    title: String(doc.title ?? "Untitled"),
  }));
}

function mediaRef(value: unknown) {
  if (!value) {
    return { id: "", url: "", alt: "", filename: "", width: null as number | null, height: null as number | null };
  }
  if (typeof value === "string") {
    return { id: value, url: "", alt: "", filename: "", width: null, height: null };
  }
  const media = value as {
    _id?: unknown;
    url?: string;
    alt?: string;
    filename?: string;
    width?: number;
    height?: number;
  };
  return {
    id: toId(media._id ?? value),
    url: String(media.url ?? ""),
    alt: String(media.alt ?? ""),
    filename: String(media.filename ?? ""),
    width: typeof media.width === "number" ? media.width : null,
    height: typeof media.height === "number" ? media.height : null,
  };
}

export async function getService(id: string): Promise<ServiceRecord | null> {
  if (isDemoMode()) {
    return getDemoService(id);
  }
  if (!isObjectId(id)) return null;
  const { Service } = await getModels();
  const doc = await Service.findById(id)
    .populate("image")
    .populate("overviewImage")
    .lean();
  if (!doc) return null;

  const image = mediaRef(doc.image);
  const overview = mediaRef(doc.overviewImage);
  const related = Array.isArray(doc.relatedServices)
    ? doc.relatedServices.map((item) => toId(item)).filter(Boolean)
    : [];

  const applications = Array.isArray(doc.applications)
    ? doc.applications.map((item) => ({
        title: String(item?.title ?? ""),
        description: String(item?.description ?? ""),
        icon: String(item?.icon ?? ""),
        points: Array.isArray(item?.points)
          ? item.points.map((point: { label?: string }) => ({
              label: String(point?.label ?? ""),
            }))
          : [],
      }))
    : [];

  return {
    id: toId(doc._id),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    parent: toId(doc.parent),
    excerpt: String(doc.excerpt ?? ""),
    image: image.id,
    imageUrl: image.url,
    imageAlt: image.alt,
    imageFilename: image.filename,
    imageWidth: image.width,
    imageHeight: image.height,
    overviewImage: overview.id,
    overviewImageUrl: overview.url,
    relatedServices: related,
    sortOrder: Number(doc.sortOrder ?? 10),
    showInMegaMenu: doc.showInMegaMenu !== false,
    detailReady: Boolean(doc.detailReady),
    heroTitle: String(doc.heroTitle ?? ""),
    heroDescription: String(doc.heroDescription ?? ""),
    overviewTitle: String(doc.overviewTitle ?? ""),
    overviewDescription: String(doc.overviewDescription ?? ""),
    guideTitle: String(doc.guideTitle ?? ""),
    guideDescription: String(doc.guideDescription ?? ""),
    applications,
    showPerformanceMatrix: Boolean(doc.showPerformanceMatrix),
    performanceTitle: String(doc.performanceTitle ?? ""),
    performanceDescription: String(doc.performanceDescription ?? ""),
    performanceLabels: columnLabels(doc.performanceLabels, PERFORMANCE_COLUMN_LABELS),
    performanceRows: Array.isArray(doc.performanceRows)
      ? doc.performanceRows.map((row) => ({
          useCase: String(row?.useCase ?? ""),
          recommended: String(row?.recommended ?? ""),
          forceReduction: String(row?.forceReduction ?? ""),
        }))
      : [],
    density: String(doc.density ?? ""),
    warranty: String(doc.warranty ?? ""),
    brandingTitle: String(doc.brandingTitle ?? ""),
    brandingDescription: String(doc.brandingDescription ?? ""),
    brandColorLabel: String(doc.brandColorLabel ?? ""),
    brandColors: readBrandColors(doc.brandColors),
    showSpaceRequirements: Boolean(doc.showSpaceRequirements),
    spaceTitle: String(doc.spaceTitle ?? ""),
    spaceDescription: String(doc.spaceDescription ?? ""),
    spaceLabels: columnLabels(doc.spaceLabels, SPACE_COLUMN_LABELS),
    spaceRows: Array.isArray(doc.spaceRows)
      ? doc.spaceRows.map((row) => ({
          useCase: String(row?.useCase ?? ""),
          recommended: String(row?.recommended ?? ""),
          impact: String(row?.impact ?? ""),
          slip: String(row?.slip ?? ""),
          acoustic: String(row?.acoustic ?? ""),
          maintenance: String(row?.maintenance ?? ""),
        }))
      : [],
    showProcess: doc.showProcess !== false,
    processTitle:
      typeof doc.processTitle === "string" ? doc.processTitle : DEFAULT_PROCESS_TITLE,
    processDescription:
      typeof doc.processDescription === "string"
        ? doc.processDescription
        : DEFAULT_PROCESS_DESCRIPTION,
    processSteps: readProcessSteps(doc.processSteps),
    faqIntro: readFaqIntro(doc.faqIntro),
    faqs: readFaqs(doc.faqs),
    caseStudiesTitle: String(doc.caseStudiesTitle ?? ""),
    caseStudiesDescription: String(doc.caseStudiesDescription ?? ""),
    projectsTitle: String(doc.projectsTitle ?? ""),
    projectsDescription: String(doc.projectsDescription ?? ""),
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    status: publishStatus(doc._status),
  };
}

export async function nextSortOrder(
  collection: "main-services" | "services",
  parentId?: string
) {
  if (isDemoMode()) {
    if (collection === "main-services") {
      return getDemoServiceGroups().length * 10 + 10;
    }
    const services = getDemoServicesList().filter(
      (item) => !parentId || item.parentId === parentId
    );
    return services.length * 10 + 10;
  }
  if (collection === "main-services" && isSupabaseContentEnabled()) {
    return nextServiceFamilySortOrder();
  }
  const { MainService, Service } = await getModels();
  const Model = collection === "main-services" ? MainService : Service;
  const filter =
    collection === "services" && parentId && isContentId(parentId)
      ? { parent: parentId }
      : {};
  const last = await Model.findOne(filter).sort({ sortOrder: -1 }).select("sortOrder").lean();
  const current = Number(last?.sortOrder ?? 0);
  return current + 10;
}
