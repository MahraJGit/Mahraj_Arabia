import {
  getArabiaServiceBySlug,
  getArabiaServiceCards,
  getArabiaServiceGroups,
  getArabiaServiceMegaMenu,
  getArabiaServiceSlugs,
} from "@/content/arabia-services";
import {
  getCmsServiceBySlug,
  isSupabaseContentEnabled,
  listCmsSiblingServices,
  listPublishedCmsServices,
  listPublishedCmsServiceSlugs,
  listServiceFamilies,
} from "@/lib/supabase/content";

export type ServiceCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  href: string;
  parentId: string | null;
  parentTitle: string | null;
};

export type ServiceGroup = {
  id: string;
  slug: string;
  title: string;
  sortOrder: number;
  children: ServiceCard[];
};

export type ServiceCaseStudy = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  meta: string;
  badge: string;
  price: string;
};

export type ServiceDetailView = ServiceCard & {
  content: unknown;
  tags: string[];
  faqs: { question: string; answer: string }[];
  focusKeyword: string;
  related: ServiceCard[];
  seoTitle: string;
  seoDescription: string;
  // compatibility for existing components during transition
  detailReady: boolean;
  heroTitle: string;
  heroDescription: string;
  overviewTitle: string;
  overviewDescription: string;
  overviewImage: string;
  guideTitle: string;
  guideDescription: string;
  applications: { title: string; description: string; icon: string; points: string[] }[];
  caseStudiesTitle: string;
  caseStudiesDescription: string;
  caseStudies: ServiceCaseStudy[];
  showProcess: boolean;
  processTitle: string;
  processDescription: string;
  processSteps: { label: string }[];
  faqIntro: string;
  siblings: ServiceCard[];
};

export type MegaMenuColumn = {
  title: string;
  href?: string;
  links: { label: string; href: string }[];
};

export type SearchEntry = {
  label: string;
  href: string;
  group: string;
};

function toCard(service: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl?: string;
  imageUrl?: string;
  coverAlt?: string;
  imageAlt?: string;
  parent?: string;
  parentTitle?: string;
}): ServiceCard {
  const image = service.coverUrl || service.imageUrl || "/images/profile/modular-office-complex.jpg";
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    excerpt: service.excerpt,
    image,
    imageAlt: service.coverAlt || service.imageAlt || service.title,
    href: `/services/${service.slug}`,
    parentId: service.parent || null,
    parentTitle: service.parentTitle || null,
  };
}

export async function getServices(limit = 100): Promise<ServiceCard[]> {
  if (!isSupabaseContentEnabled()) return getArabiaServiceCards(limit);
  try {
    const docs = await listPublishedCmsServices(limit);
    if (docs.length === 0) return getArabiaServiceCards(limit);
    return docs.map((doc) => toCard(doc));
  } catch {
    return getArabiaServiceCards(limit);
  }
}

export async function getServiceGroups(): Promise<ServiceGroup[]> {
  if (!isSupabaseContentEnabled()) return getArabiaServiceGroups();
  try {
    const [families, services] = await Promise.all([
      listServiceFamilies({ publishedOnly: true }),
      listPublishedCmsServices(200),
    ]);
    if (services.length === 0) return getArabiaServiceGroups();

    const childrenByParent = new Map<string, ServiceCard[]>();
    for (const service of services) {
      const card = toCard(service);
      if (!card.parentId) continue;
      const list = childrenByParent.get(card.parentId) ?? [];
      list.push(card);
      childrenByParent.set(card.parentId, list);
    }

    const groups = families
      .map((family) => ({
        id: family.id,
        slug: family.slug,
        title: family.title,
        sortOrder: family.sortOrder,
        children: childrenByParent.get(family.id) ?? [],
      }))
      .filter((group) => group.children.length > 0);

    return groups.length > 0 ? groups : getArabiaServiceGroups();
  } catch {
    return getArabiaServiceGroups();
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetailView | null> {
  if (!slug) return null;
  if (!isSupabaseContentEnabled()) return getArabiaServiceBySlug(slug);

  try {
    const service = await getCmsServiceBySlug(slug, true);
    if (!service) return getArabiaServiceBySlug(slug);

    const siblings = service.parent
      ? await listCmsSiblingServices(service.parent, slug)
      : [];
    const related = siblings.map((item) => toCard(item));
    const card = toCard(service);

    const highlights = Array.isArray(service.highlights) ? service.highlights : [];

    return {
      ...card,
      content: service.content,
      tags: service.tags,
      faqs: service.faqs,
      focusKeyword: service.focusKeyword,
      related,
      siblings: related,
      seoTitle: service.metaTitle || service.title,
      seoDescription: service.metaDescription || service.excerpt,
      detailReady: true,
      heroTitle: service.title,
      heroDescription: service.excerpt,
      overviewTitle: "",
      overviewDescription: "",
      overviewImage: card.image,
      guideTitle: service.highlightsTitle || "Key highlights",
      guideDescription: service.highlightsDescription || "",
      applications: highlights.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon,
        points: item.points,
      })),
      caseStudiesTitle: service.caseStudiesTitle || "Case studies",
      caseStudiesDescription: service.caseStudiesDescription || "",
      caseStudies: Array.isArray(service.caseStudies) ? service.caseStudies : [],
      showProcess: false,
      processTitle: "",
      processDescription: "",
      processSteps: [],
      faqIntro: service.faqIntro || service.faqDescription || "",
    };
  } catch {
    return getArabiaServiceBySlug(slug);
  }
}

export async function getServiceSlugs(): Promise<string[]> {
  if (!isSupabaseContentEnabled()) return getArabiaServiceSlugs();
  try {
    const slugs = await listPublishedCmsServiceSlugs();
    return slugs.length > 0 ? slugs : getArabiaServiceSlugs();
  } catch {
    return getArabiaServiceSlugs();
  }
}

export async function getServiceMegaMenu(): Promise<MegaMenuColumn[]> {
  if (!isSupabaseContentEnabled()) return getArabiaServiceMegaMenu();
  try {
    const groups = await getServiceGroups();
    const columns = groups.map((group) => ({
      title: group.title,
      href: "/services",
      links: group.children.map((service) => ({
        label: service.title,
        href: service.href,
      })),
    }));
    return columns.length > 0 ? columns : getArabiaServiceMegaMenu();
  } catch {
    return getArabiaServiceMegaMenu();
  }
}

export async function getServiceSearchIndex(): Promise<SearchEntry[]> {
  const groups = await getServiceGroups();
  return groups.flatMap((group) =>
    group.children.map((service) => ({
      label: service.title,
      href: service.href,
      group: group.title,
    }))
  );
}
