import { isDemoMode } from "@/lib/auth/demo";
import {
  getDemoService,
  getDemoServiceGroup,
  getDemoServiceGroups,
  getDemoServicesList,
} from "@/lib/cms/demo-data";
import type { PublishStatus } from "@/lib/cms/types";
import { isUuid } from "@/lib/db/ids";
import {
  countCmsServicesInFamily,
  getCmsService,
  getServiceFamily,
  isSupabaseContentEnabled,
  listCmsServiceOptions,
  listCmsServices,
  listServiceFamilies,
  nextCmsServiceSortOrder,
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
  content?: unknown;
  image: string;
  imageUrl: string;
  imageAlt: string;
  imageFilename: string;
  imageWidth: number | null;
  imageHeight: number | null;
  coverImage?: string;
  coverUrl?: string;
  coverAlt?: string;
  coverFilename?: string;
  coverWidth?: number | null;
  coverHeight?: number | null;
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
  highlightsTitle?: string;
  highlightsDescription?: string;
  highlights?: {
    title: string;
    description: string;
    icon: string;
    points: string[];
  }[];
  caseStudiesTitle?: string;
  caseStudiesDescription?: string;
  caseStudies?: {
    title: string;
    imageUrl: string;
    imageAlt: string;
    meta: string;
    badge: string;
    price: string;
  }[];
  showProcess: boolean;
  processTitle: string;
  processDescription: string;
  processSteps: { label: string }[];
  faqIntro: string;
  faqs: { question: string; answer: string }[];
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
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

export async function listServiceGroups(query: ListQuery = {}) {
  const page = Math.max(1, query.page ?? 1);
  const limit = query.limit ?? 50;

  if (isSupabaseContentEnabled()) {
    const families = await listServiceFamilies({
      q: query.q,
      status: query.status,
      menu: query.menu,
    });
    const total = families.length;
    const start = (page - 1) * limit;
    const pageItems = families.slice(start, start + limit);
    const counts = await Promise.all(
      pageItems.map(async (family) => [family.id, await countCmsServicesInFamily(family.id)] as const)
    );
    const countMap = new Map(counts);

    return {
      items: pageItems.map((family) => ({
        id: family.id,
        title: family.title || "Untitled",
        slug: family.slug,
        sortOrder: family.sortOrder,
        showInMegaMenu: family.showInMegaMenu,
        status: family.status,
        serviceCount: countMap.get(family.id) ?? 0,
        updatedAt: family.updatedAt,
      })),
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  }

  if (!isDemoMode()) {
    return { items: [] as ServiceGroupListItem[], total: 0, page: 1, pageCount: 1 };
  }

  let items = getDemoServiceGroups();
  if (query.q?.trim()) {
    const q = query.q.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
    );
  }
  if (query.status === "draft" || query.status === "published") {
    items = items.filter((item) => item.status === query.status);
  }
  if (query.menu === "visible") items = items.filter((item) => item.showInMegaMenu);
  if (query.menu === "hidden") items = items.filter((item) => !item.showInMegaMenu);
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getServiceGroup(id: string): Promise<ServiceGroupRecord | null> {
  if (isSupabaseContentEnabled()) {
    if (!isUuid(id)) return null;
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
  if (isDemoMode()) return getDemoServiceGroup(id);
  return null;
}

export async function countServicesInGroup(groupId: string) {
  if (isSupabaseContentEnabled()) return countCmsServicesInFamily(groupId);
  if (isDemoMode()) {
    if (groupId === "demo-group-1") return getDemoServicesList().length;
    return 0;
  }
  return 0;
}

export async function listGroupOptions() {
  if (isSupabaseContentEnabled()) {
    const families = await listServiceFamilies();
    return families.map((family) => ({
      id: family.id,
      title: family.title || "Untitled",
    }));
  }
  if (isDemoMode()) {
    return getDemoServiceGroups().map((group) => ({
      id: group.id,
      title: group.title,
    }));
  }
  return [];
}

export async function listServices(query: ListQuery = {}) {
  if (isSupabaseContentEnabled()) {
    return listCmsServices({
      q: query.q,
      status: query.status === "draft" || query.status === "published" ? query.status : "all",
      group: query.group,
      menu: query.menu,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    });
  }

  if (!isDemoMode()) {
    return { items: [] as ServiceListItem[], total: 0, page: 1, pageCount: 1 };
  }

  const page = Math.max(1, query.page ?? 1);
  const limit = query.limit ?? 25;
  let items = getDemoServicesList();
  if (query.q?.trim()) {
    const q = query.q.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
    );
  }
  if (query.status === "draft" || query.status === "published") {
    items = items.filter((item) => item.status === query.status);
  }
  if (query.group) items = items.filter((item) => item.parentId === query.group);
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

export async function listServiceOptions(excludeId?: string): Promise<ServiceOption[]> {
  if (isSupabaseContentEnabled()) return listCmsServiceOptions(excludeId);
  if (isDemoMode()) {
    return getDemoServicesList()
      .filter((item) => item.id !== excludeId)
      .map((item) => ({ id: item.id, title: item.title }));
  }
  return [];
}

export async function getService(id: string): Promise<ServiceRecord | null> {
  if (isSupabaseContentEnabled()) {
    if (!isUuid(id)) return null;
    return getCmsService(id);
  }
  if (isDemoMode()) return getDemoService(id);
  return null;
}

export async function nextSortOrder(
  collection: "main-services" | "services",
  parentId?: string
) {
  if (isSupabaseContentEnabled()) {
    if (collection === "main-services") return nextServiceFamilySortOrder();
    if (parentId) return nextCmsServiceSortOrder(parentId);
    return 10;
  }
  if (isDemoMode()) {
    if (collection === "main-services") {
      return getDemoServiceGroups().length * 10 + 10;
    }
    const services = getDemoServicesList().filter(
      (item) => !parentId || item.parentId === parentId
    );
    return services.length * 10 + 10;
  }
  return 10;
}
