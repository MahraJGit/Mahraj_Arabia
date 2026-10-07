import {
  getArabiaServiceBySlug,
  getArabiaServiceCards,
  getArabiaServiceGroups,
  getArabiaServiceMegaMenu,
  getArabiaServiceSlugs,
} from "@/content/arabia-services";
import { asObjectId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { readBrandColors, type BrandColor } from "@/lib/services/colors";
import {
  loadMediaMap,
  resolveMediaUrl,
  type PublicMedia,
} from "@/lib/public/media";
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

export type ServiceApplication = {
  title: string;
  description: string;
  icon: string;
  points: string[];
};

export type PerformanceRow = {
  useCase: string;
  recommended: string;
  forceReduction: string;
};

export type SpaceRow = {
  useCase: string;
  recommended: string;
  impact: string;
  slip: string;
  acoustic: string;
  maintenance: string;
};

export type ServiceDetailView = ServiceCard & {
  detailReady: boolean;
  heroTitle: string;
  heroDescription: string;
  overviewTitle: string;
  overviewDescription: string;
  overviewImage: string;
  guideTitle: string;
  guideDescription: string;
  applications: ServiceApplication[];
  showPerformanceMatrix: boolean;
  performanceTitle: string;
  performanceDescription: string;
  performanceLabels: string[];
  performanceRows: PerformanceRow[];
  density: string;
  warranty: string;
  brandingTitle: string;
  brandingDescription: string;
  brandColorLabel: string;
  brandColors: BrandColor[];
  showSpaceRequirements: boolean;
  spaceTitle: string;
  spaceDescription: string;
  spaceLabels: string[];
  spaceRows: SpaceRow[];
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
  related: ServiceCard[];
  siblings: ServiceCard[];
  seoTitle: string;
  seoDescription: string;
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

const published = { _status: "published" } as const;

type LeanDoc = Record<string, unknown> & { _id?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sortOrder(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function mediaFromMap(
  value: unknown,
  media: Map<string, PublicMedia>
): PublicMedia | null {
  const id = toId(value);
  if (!id) return null;
  return media.get(id) ?? null;
}

function resolveImage(
  value: unknown,
  media: Map<string, PublicMedia>,
  size?: "thumbnail" | "card" | "hero"
) {
  const doc = mediaFromMap(value, media);
  if (!doc) {
    return { url: "/images/advantage-installation.jpg", alt: "" };
  }
  const resolved = resolveMediaUrl(doc, size);
  return {
    url: resolved.url || "/images/advantage-installation.jpg",
    alt: resolved.alt,
  };
}

function resolveParent(
  value: unknown,
  parents: Map<string, { id: string; title: string }>
) {
  const id = toId(value);
  if (!id) return { id: null, title: null as string | null };
  const parent = parents.get(id);
  return { id, title: parent?.title ?? null };
}

function toServiceCard(
  service: LeanDoc,
  media: Map<string, PublicMedia>,
  parents: Map<string, { id: string; title: string }>,
  imageSize?: "thumbnail" | "card" | "hero"
): ServiceCard {
  const image = resolveImage(service.image, media, imageSize ?? "card");
  const parent = resolveParent(service.parent, parents);
  const slug = typeof service.slug === "string" ? service.slug : "";

  return {
    id: toId(service._id),
    slug,
    title: typeof service.title === "string" ? service.title : "",
    excerpt: typeof service.excerpt === "string" ? service.excerpt : "",
    image: image.url,
    imageAlt: image.alt || (typeof service.title === "string" ? service.title : ""),
    href: `/services/${slug}`,
    parentId: parent.id,
    parentTitle: parent.title,
  };
}

function collectMediaIds(docs: LeanDoc[]) {
  const ids: string[] = [];
  for (const doc of docs) {
    const image = toId(doc.image);
    const overview = toId(doc.overviewImage);
    if (image) ids.push(image);
    if (overview) ids.push(overview);
  }
  return ids;
}

async function loadParents(ids: string[]) {
  const unique = [...new Set(ids.filter((id) => isObjectId(id)))];
  const map = new Map<string, { id: string; title: string }>();
  if (unique.length === 0) return map;

  const { MainService } = await getModels();
  const docs = await MainService.find({ _id: { $in: unique.map(asObjectId) } })
    .select("title")
    .lean();
  for (const doc of docs) {
    map.set(toId(doc._id), {
      id: toId(doc._id),
      title: typeof doc.title === "string" ? doc.title : "",
    });
  }
  return map;
}

function toDetailView(
  service: LeanDoc,
  media: Map<string, PublicMedia>,
  parents: Map<string, { id: string; title: string }>,
  related: ServiceCard[],
  siblings: ServiceCard[]
): ServiceDetailView {
  const card = toServiceCard(service, media, parents, "hero");
  const overview = resolveImage(
    service.overviewImage ?? service.image,
    media,
    "card"
  );
  const title = card.title;
  const applications = Array.isArray(service.applications)
    ? service.applications.map((application) => {
        const row = isRecord(application) ? application : {};
        return {
          title: typeof row.title === "string" ? row.title : "",
          description: typeof row.description === "string" ? row.description : "",
          icon: typeof row.icon === "string" ? row.icon : "",
          points: Array.isArray(row.points)
            ? row.points.map((point) =>
                isRecord(point) && typeof point.label === "string"
                  ? point.label
                  : ""
              )
            : [],
        };
      })
    : [];

  return {
    ...card,
    detailReady: Boolean(service.detailReady),
    heroTitle:
      (typeof service.heroTitle === "string" && service.heroTitle) || title,
    heroDescription:
      (typeof service.heroDescription === "string" && service.heroDescription) ||
      card.excerpt,
    overviewTitle:
      (typeof service.overviewTitle === "string" && service.overviewTitle) ||
      `Complete ${title} Support - From Specification to Installation`,
    overviewDescription:
      (typeof service.overviewDescription === "string" &&
        service.overviewDescription) ||
      "Our team supports the full project cycle with site assessment, product selection, technical submittals, preparation, installation, and documented handover.",
    overviewImage: overview.url,
    guideTitle:
      (typeof service.guideTitle === "string" && service.guideTitle) ||
      `The ${title} Guide`,
    guideDescription:
      (typeof service.guideDescription === "string" && service.guideDescription) ||
      "Every project has unique structural demands. We provide application-specific guidance to protect athletes, users, equipment, and the subfloor.",
    applications,
    showPerformanceMatrix: Boolean(service.showPerformanceMatrix),
    performanceTitle:
      typeof service.performanceTitle === "string" ? service.performanceTitle : "",
    performanceDescription:
      typeof service.performanceDescription === "string"
        ? service.performanceDescription
        : "",
    performanceLabels: columnLabels(service.performanceLabels, PERFORMANCE_COLUMN_LABELS),
    performanceRows: Array.isArray(service.performanceRows)
      ? service.performanceRows.map((row) => {
          const item = isRecord(row) ? row : {};
          return {
            useCase: typeof item.useCase === "string" ? item.useCase : "",
            recommended:
              typeof item.recommended === "string" ? item.recommended : "",
            forceReduction:
              typeof item.forceReduction === "string" ? item.forceReduction : "",
          };
        })
      : [],
    density:
      typeof service.density === "string" ? service.density : "",
    warranty:
      typeof service.warranty === "string" ? service.warranty : "",
    brandingTitle:
      typeof service.brandingTitle === "string" ? service.brandingTitle : "",
    brandingDescription:
      typeof service.brandingDescription === "string"
        ? service.brandingDescription
        : "",
    brandColorLabel:
      typeof service.brandColorLabel === "string" ? service.brandColorLabel : "",
    brandColors: readBrandColors(service.brandColors),
    showSpaceRequirements: Boolean(service.showSpaceRequirements),
    spaceTitle: typeof service.spaceTitle === "string" ? service.spaceTitle : "",
    spaceDescription:
      typeof service.spaceDescription === "string" ? service.spaceDescription : "",
    spaceLabels: columnLabels(service.spaceLabels, SPACE_COLUMN_LABELS),
    spaceRows: Array.isArray(service.spaceRows)
      ? service.spaceRows.map((row) => {
          const item = isRecord(row) ? row : {};
          return {
            useCase: typeof item.useCase === "string" ? item.useCase : "",
            recommended:
              typeof item.recommended === "string" ? item.recommended : "",
            impact: typeof item.impact === "string" ? item.impact : "",
            slip: typeof item.slip === "string" ? item.slip : "",
            acoustic: typeof item.acoustic === "string" ? item.acoustic : "",
            maintenance:
              typeof item.maintenance === "string" ? item.maintenance : "",
          };
        })
      : [],
    showProcess: service.showProcess !== false,
    processTitle:
      typeof service.processTitle === "string"
        ? service.processTitle
        : DEFAULT_PROCESS_TITLE,
    processDescription:
      typeof service.processDescription === "string"
        ? service.processDescription
        : DEFAULT_PROCESS_DESCRIPTION,
    processSteps: readProcessSteps(service.processSteps),
    faqIntro: readFaqIntro(service.faqIntro),
    faqs: readFaqs(service.faqs),
    caseStudiesTitle:
      typeof service.caseStudiesTitle === "string" ? service.caseStudiesTitle : "",
    caseStudiesDescription:
      typeof service.caseStudiesDescription === "string"
        ? service.caseStudiesDescription
        : "",
    projectsTitle:
      typeof service.projectsTitle === "string" ? service.projectsTitle : "",
    projectsDescription:
      typeof service.projectsDescription === "string"
        ? service.projectsDescription
        : "",
    related,
    siblings,
    seoTitle:
      (typeof service.seoTitle === "string" && service.seoTitle) || title,
    seoDescription:
      (typeof service.seoDescription === "string" && service.seoDescription) ||
      card.excerpt,
  };
}

export async function getServices(limit = 100): Promise<ServiceCard[]> {
  try {
    const { Service } = await getModels();
    const docs = (await Service.find(published)
      .sort({ sortOrder: 1 })
      .limit(limit)
      .lean()) as LeanDoc[];

    if (docs.length === 0) return getArabiaServiceCards(limit);

    const [media, parents] = await Promise.all([
      loadMediaMap(collectMediaIds(docs)),
      loadParents(docs.map((doc) => toId(doc.parent))),
    ]);

    return docs.map((doc) => toServiceCard(doc, media, parents));
  } catch {
    return getArabiaServiceCards(limit);
  }
}

export async function getServiceGroups(): Promise<ServiceGroup[]> {
  try {
    const { MainService, Service } = await getModels();
    const [mains, subs] = await Promise.all([
      MainService.find(published).sort({ sortOrder: 1, title: 1 }).limit(50).lean(),
      Service.find(published).sort({ sortOrder: 1 }).limit(200).lean(),
    ]);

    const [media, parents] = await Promise.all([
      loadMediaMap(collectMediaIds(subs)),
      loadParents(subs.map((doc) => toId(doc.parent))),
    ]);

    const childrenByParent = new Map<string, ServiceCard[]>();
    for (const sub of subs) {
      const card = toServiceCard(sub, media, parents);
      if (!card.parentId) continue;
      const list = childrenByParent.get(card.parentId) ?? [];
      list.push(card);
      childrenByParent.set(card.parentId, list);
    }

    const groups = mains
      .map((main) => ({
        id: toId(main._id),
        slug: typeof main.slug === "string" ? main.slug : "",
        title: typeof main.title === "string" ? main.title : "",
        sortOrder: sortOrder(main.sortOrder),
        children: childrenByParent.get(toId(main._id)) ?? [],
      }))
      .filter((group) => group.children.length > 0);

    return groups.length > 0 ? groups : getArabiaServiceGroups();
  } catch {
    return getArabiaServiceGroups();
  }
}

export async function getServiceBySlug(
  slug: string
): Promise<ServiceDetailView | null> {
  if (!slug) return null;

  try {
    const { Service } = await getModels();
    const service = (await Service.findOne({ ...published, slug }).lean()) as
      | LeanDoc
      | null;
    if (!service) return getArabiaServiceBySlug(slug);

    const relatedIds = Array.isArray(service.relatedServices)
      ? service.relatedServices.map((item) => toId(item)).filter(isObjectId)
      : [];
    const parentId = toId(service.parent);

    const [relatedDocs, siblingDocs] = await Promise.all([
      relatedIds.length
        ? Service.find({
            ...published,
            _id: { $in: relatedIds.map(asObjectId) },
          }).lean()
        : Promise.resolve([] as LeanDoc[]),
      parentId && isObjectId(parentId)
        ? Service.find({
            ...published,
            parent: asObjectId(parentId),
            slug: { $ne: slug },
          })
            .sort({ sortOrder: 1 })
            .limit(12)
            .lean()
        : Promise.resolve([] as LeanDoc[]),
    ]);

    const relatedById = new Map(relatedDocs.map((doc) => [toId(doc._id), doc]));
    const orderedRelated = relatedIds
      .map((id) => relatedById.get(id))
      .filter((doc): doc is LeanDoc => Boolean(doc))
      .slice(0, 3);

    const allDocs = [service, ...orderedRelated, ...siblingDocs];
    const [media, parents] = await Promise.all([
      loadMediaMap(collectMediaIds(allDocs)),
      loadParents(allDocs.map((doc) => toId(doc.parent))),
    ]);

    const related = orderedRelated.map((doc) => toServiceCard(doc, media, parents));
    const siblings = siblingDocs.map((doc) => toServiceCard(doc, media, parents));

    return toDetailView(service, media, parents, related, siblings);
  } catch {
    return getArabiaServiceBySlug(slug);
  }
}

export async function getServiceSlugs(): Promise<string[]> {
  try {
    const { Service } = await getModels();
    const docs = await Service.find(published)
      .select("slug")
      .limit(200)
      .lean();

    const slugs = docs
      .map((doc) => (typeof doc.slug === "string" ? doc.slug : ""))
      .filter(Boolean);

    return slugs.length > 0 ? slugs : getArabiaServiceSlugs();
  } catch {
    return getArabiaServiceSlugs();
  }
}

export async function getServiceMegaMenu(): Promise<MegaMenuColumn[]> {
  try {
    const { MainService, Service } = await getModels();
    const [mains, subs] = await Promise.all([
      MainService.find({ ...published, showInMegaMenu: true })
        .sort({ sortOrder: 1, title: 1 })
        .limit(50)
        .select("title")
        .lean(),
      Service.find({ ...published, showInMegaMenu: true })
        .sort({ sortOrder: 1 })
        .limit(200)
        .select("title slug parent sortOrder")
        .lean(),
    ]);

    const linksByParent = new Map<string, { label: string; href: string }[]>();
    for (const sub of subs) {
      const parentId = toId(sub.parent);
      const slug = typeof sub.slug === "string" ? sub.slug : "";
      if (!parentId || !slug) continue;
      const list = linksByParent.get(parentId) ?? [];
      list.push({
        label: typeof sub.title === "string" ? sub.title : "",
        href: `/services/${slug}`,
      });
      linksByParent.set(parentId, list);
    }

    const columns = mains
      .map((main) => ({
        title: typeof main.title === "string" ? main.title : "",
        links: linksByParent.get(toId(main._id)) ?? [],
      }))
      .filter((column) => column.links.length > 0);

    return columns.length > 0 ? columns : getArabiaServiceMegaMenu();
  } catch {
    return getArabiaServiceMegaMenu();
  }
}

export async function getServiceSearchIndex(): Promise<SearchEntry[]> {
  const [groups, megaMenu] = await Promise.all([
    getServiceGroups(),
    getServiceMegaMenu(),
  ]);

  const fromGroups = groups.flatMap((group) =>
    group.children.map((service) => ({
      label: service.title,
      href: service.href,
      group: group.title,
    }))
  );

  if (fromGroups.length > 0) return fromGroups;

  return megaMenu.flatMap((column) =>
    column.links.map((link) => ({
      label: link.label,
      href: link.href,
      group: column.title,
    }))
  );
}
