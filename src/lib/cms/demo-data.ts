import { DEMO_ADMIN, isDemoMode } from "@/lib/auth/demo";
import type { PublishStatus } from "@/lib/cms/types";
import { arabiaServices } from "@/content/arabia-services";

const now = new Date().toISOString();

export function getDemoOverviewData() {
  const services = arabiaServices;
  const published = services.filter((s) => s.detailReady).length;

  return {
    counts: {
      serviceGroups: { total: 1, published: 1 },
      services: {
        total: services.length,
        published,
        comingSoon: Math.max(0, services.length - published),
      },
      posts: { total: 5, published: 5, drafts: 0 },
      categories: { total: 3 },
      media: { total: 12 },
    },
    recent: [
      {
        id: "demo-post-1",
        title: "How to Plan a Portable Site Office",
        href: "/admin/blog/demo-post-1",
        status: "published" as PublishStatus,
        updatedAt: now,
      },
      {
        id: services[0]?.id ?? "demo-svc-1",
        title: services[0]?.title ?? "Porta Cabins & Site Offices",
        href: `/admin/services/${services[0]?.id ?? "demo-svc-1"}`,
        status: "published" as PublishStatus,
        updatedAt: now,
      },
      {
        id: "demo-post-2",
        title: "Modular Building Quotation Checklist",
        href: "/admin/blog/demo-post-2",
        status: "published" as PublishStatus,
        updatedAt: now,
      },
    ],
  };
}

export function getDemoServiceGroups() {
  return [
    {
      id: "demo-group-1",
      title: "Our Solutions",
      slug: "our-solutions",
      sortOrder: 0,
      showInMegaMenu: true,
      status: "published" as PublishStatus,
      serviceCount: arabiaServices.length,
      updatedAt: now,
    },
  ];
}

export function getDemoServiceGroup(id: string) {
  const group = getDemoServiceGroups().find((g) => g.id === id);
  if (!group) return null;
  return {
    id: group.id,
    title: group.title,
    slug: group.slug,
    menuDescription: "Modular, portable and steel solutions for Saudi projects.",
    sortOrder: group.sortOrder,
    showInMegaMenu: group.showInMegaMenu,
    status: group.status,
  };
}

export function getDemoServicesList() {
  return arabiaServices.map((service, index) => ({
    id: service.id,
    title: service.title,
    slug: service.slug,
    parentId: "demo-group-1",
    parentTitle: "Our Solutions",
    sortOrder: index,
    detailReady: service.detailReady,
    showInMegaMenu: true,
    status: "published" as PublishStatus,
    updatedAt: now,
  }));
}

export function getDemoService(id: string) {
  const service =
    arabiaServices.find((s) => s.id === id || s.slug === id) ?? null;
  if (!service) return null;

  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    parent: "demo-group-1",
    excerpt: service.excerpt,
    image: "",
    imageUrl: service.image,
    imageAlt: service.imageAlt,
    imageFilename: "",
    imageWidth: null as number | null,
    imageHeight: null as number | null,
    overviewImage: "",
    overviewImageUrl: service.overviewImage,
    relatedServices: [] as string[],
    sortOrder: arabiaServices.findIndex((s) => s.id === service.id),
    showInMegaMenu: true,
    detailReady: service.detailReady,
    heroTitle: service.heroTitle,
    heroDescription: service.heroDescription,
    overviewTitle: service.overviewTitle,
    overviewDescription: service.overviewDescription,
    guideTitle: service.guideTitle,
    guideDescription: service.guideDescription,
    applications: service.applications.map((app) => ({
      title: app.title,
      description: app.description,
      icon: app.icon,
      points: app.points.map((label) => ({ label })),
    })),
    showPerformanceMatrix: false,
    performanceTitle: "",
    performanceDescription: "",
    performanceLabels: [] as string[],
    performanceRows: [] as {
      useCase: string;
      recommended: string;
      forceReduction: string;
    }[],
    density: "",
    warranty: "",
    brandingTitle: "",
    brandingDescription: "",
    brandColorLabel: "",
    brandColors: [] as { hex: string; selected: boolean }[],
    showSpaceRequirements: false,
    spaceTitle: "",
    spaceDescription: "",
    spaceLabels: [] as string[],
    spaceRows: [] as {
      useCase: string;
      recommended: string;
      impact: string;
      slip: string;
      acoustic: string;
      maintenance: string;
    }[],
    showProcess: true,
    processTitle: service.processTitle,
    processDescription: service.processDescription,
    processSteps: service.processSteps.map((step) => ({ label: step.label })),
    faqIntro: service.faqIntro,
    faqs: service.faqs,
    caseStudiesTitle: "",
    caseStudiesDescription: "",
    projectsTitle: "",
    projectsDescription: "",
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    status: "published" as PublishStatus,
  };
}

export function getDemoPosts() {
  return [
    {
      id: "demo-post-1",
      title: "How to Plan a Portable Site Office",
      slug: "how-to-plan-a-portable-site-office",
      categoryTitle: "Project Planning",
      author: "By Mahraj Arabia Team",
      featured: true,
      status: "published" as PublishStatus,
      publishedAt: "2026-05-14",
      updatedAt: now,
      coverUrl: "/images/projects/global-tech-hq.jpg",
    },
    {
      id: "demo-post-2",
      title: "Modular Building Quotation Checklist",
      slug: "modular-building-quotation-checklist",
      categoryTitle: "Quotations",
      author: "By Mahraj Arabia Team",
      featured: true,
      status: "published" as PublishStatus,
      publishedAt: "2026-06-02",
      updatedAt: now,
      coverUrl: "/images/advantage-installation.jpg",
    },
    {
      id: "demo-post-3",
      title: "Police Barriers for Events and Road Control",
      slug: "police-barriers-for-events-and-road-control",
      categoryTitle: "Fencing & Barriers",
      author: "By Mahraj Arabia Team",
      featured: true,
      status: "published" as PublishStatus,
      publishedAt: "2026-07-08",
      updatedAt: now,
      coverUrl: "/images/advantage-installation.jpg",
    },
    {
      id: "demo-post-4",
      title: "Heras Fence vs Corrugated Fence: Which Fits Your Site?",
      slug: "heras-fence-vs-corrugated-fence",
      categoryTitle: "Fencing & Barriers",
      author: "By Mahraj Arabia Team",
      featured: false,
      status: "published" as PublishStatus,
      publishedAt: "2026-07-22",
      updatedAt: now,
      coverUrl: "/images/services/landscaping-outdoor-industry.png",
    },
    {
      id: "demo-post-5",
      title: "From Brief to Installation: How Mahraj Arabia Delivers",
      slug: "from-brief-to-installation-mahraj-arabia",
      categoryTitle: "Project Planning",
      author: "By Mahraj Arabia Team",
      featured: false,
      status: "published" as PublishStatus,
      publishedAt: "2026-08-18",
      updatedAt: now,
      coverUrl: "/images/about/about-hero.png",
    },
  ];
}

export function getDemoPost(id: string) {
  const post = getDemoPosts().find((p) => p.id === id || p.slug === id);
  if (!post) return null;
  const categoryId =
    post.id === "demo-post-2"
      ? "demo-cat-2"
      : post.id === "demo-post-3" || post.id === "demo-post-4"
        ? "demo-cat-fencing"
        : "demo-cat-1";
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt:
      post.id === "demo-post-3"
        ? "When heavy-duty steel police barriers are the right choice for perimeter control in Saudi Arabia."
        : post.id === "demo-post-4"
          ? "A practical comparison of temporary mesh panels and corrugated steel hoarding for Saudi projects."
          : post.id === "demo-post-5"
            ? "Our working route from first requirement through fabrication, delivery and site handover."
            : post.title,
    content: null as unknown,
    coverImage: "",
    coverUrl: post.coverUrl,
    coverAlt: post.title,
    coverFilename: "",
    coverWidth: null as number | null,
    coverHeight: null as number | null,
    seoTitle: post.title,
    seoDescription: post.title,
    category: categoryId,
    author: post.author,
    authorImage: "",
    authorImageUrl: "",
    authorImageAlt: "",
    authorImageFilename: "",
    authorImageWidth: null as number | null,
    authorImageHeight: null as number | null,
    readTime: "5 min read",
    publishedAt: post.publishedAt,
    featured: post.featured,
    status: post.status,
    inlineMedia: {} as Record<
      string,
      {
        url: string;
        alt: string;
        filename: string;
        width: number | null;
        height: number | null;
      }
    >,
  };
}

export function getDemoCategories() {
  return [
    {
      id: "demo-cat-1",
      title: "Project Planning",
      slug: "project-planning",
      subtitle: "Briefs, logistics and installation",
      postCount: 2,
      updatedAt: now,
      imageUrl: "/images/advantage-installation.jpg",
    },
    {
      id: "demo-cat-2",
      title: "Quotations",
      slug: "quotations",
      subtitle: "What to prepare for a clear proposal",
      postCount: 1,
      updatedAt: now,
      imageUrl: "/images/projects/global-tech-hq.jpg",
    },
    {
      id: "demo-cat-fencing",
      title: "Fencing & Barriers",
      slug: "fencing-barriers",
      subtitle: "Police barriers, Heras and corrugated fencing",
      postCount: 2,
      updatedAt: now,
      imageUrl: "/images/services/landscaping-outdoor-industry.png",
    },
  ];
}

export function getDemoCategory(id: string) {
  const category = getDemoCategories().find((c) => c.id === id || c.slug === id);
  if (!category) return null;
  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    subtitle: category.subtitle,
    image: "",
    imageUrl: category.imageUrl,
    imageAlt: category.title,
    imageFilename: "",
    imageWidth: null as number | null,
    imageHeight: null as number | null,
  };
}

export function getDemoCategoryOptions() {
  return getDemoCategories().map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
  }));
}

export function getDemoUsers() {
  return [
    {
      id: DEMO_ADMIN.id,
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role,
      status: "active" as const,
      lockLabel: null as string | null,
      createdLabel: "1 Jan 2026",
    },
  ];
}

export function getDemoMedia() {
  return [
    {
      id: "demo-media-1",
      alt: "Mahraj Arabia modular facility",
      filename: "about-hero.png",
      mimeType: "image/png",
      filesize: 0,
      width: null as number | null,
      height: null as number | null,
      url: "/images/about/about-hero.png",
      thumbnailUrl: "/images/about/about-hero.png",
      createdAt: now,
    },
    {
      id: "demo-media-2",
      alt: "Fabrication and installation",
      filename: "advantage-installation.jpg",
      mimeType: "image/jpeg",
      filesize: 0,
      width: null as number | null,
      height: null as number | null,
      url: "/images/advantage-installation.jpg",
      thumbnailUrl: "/images/advantage-installation.jpg",
      createdAt: now,
    },
  ];
}

export function demoWriteBlockedMessage() {
  if (!isDemoMode()) return null;
  return "Demo mode: content is read-only until Supabase is connected.";
}
