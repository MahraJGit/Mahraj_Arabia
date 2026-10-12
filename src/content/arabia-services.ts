import type { ServiceCaseStudy, ServiceDetailView } from "@/lib/public/services";
import { emptyLexicalDoc } from "@/lib/cms/lexical";

const SHARED_FAQS = [
  {
    question: "Can the solution be customized?",
    answer:
      "Yes. Dimensions, layout, finishes and services can be reviewed around the intended use and site.",
  },
  {
    question: "What is needed for a quotation?",
    answer:
      "Share the location, quantity or dimensions, intended use and target timeframe. Drawings can follow in WhatsApp.",
  },
  {
    question: "Can delivery and installation be included?",
    answer: "Yes, subject to site access, logistics and the agreed scope.",
  },
] as const;

type ArabiaHighlight = {
  title: string;
  description: string;
  icon: string;
  points: string[];
};

type ArabiaServiceInput = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  highlightsTitle?: string;
  highlightsDescription?: string;
  highlights?: ArabiaHighlight[];
  caseStudiesTitle?: string;
  caseStudiesDescription?: string;
  caseStudies?: ServiceCaseStudy[];
};

function buildService(input: ArabiaServiceInput): ServiceDetailView {
  const href = `/services/${input.slug}`;
  const highlights = input.highlights ?? [];

  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    image: input.image,
    imageAlt: input.title,
    href,
    parentId: null,
    parentTitle: null,
    content: emptyLexicalDoc(),
    tags: [],
    faqs: SHARED_FAQS.map((faq) => ({ ...faq })),
    focusKeyword: "",
    related: [],
    siblings: [],
    seoTitle: `${input.title} in Riyadh`,
    seoDescription: input.excerpt,
    detailReady: true,
    heroTitle: input.title,
    heroDescription: input.excerpt,
    overviewTitle: "",
    overviewDescription: "",
    overviewImage: input.image,
    guideTitle: input.highlightsTitle || (highlights.length ? "Key highlights" : ""),
    guideDescription: input.highlightsDescription || "",
    applications: highlights,
    caseStudiesTitle:
      input.caseStudiesTitle || (input.caseStudies?.length ? "Case studies" : ""),
    caseStudiesDescription: input.caseStudiesDescription || "",
    caseStudies: input.caseStudies ?? [],
    showProcess: false,
    processTitle: "",
    processDescription: "",
    processSteps: [],
    faqIntro: "",
  };
}

const arabiaServiceInputs: ArabiaServiceInput[] = [
  {
    id: "porta-cabins-site-offices",
    slug: "porta-cabins-site-offices",
    title: "Porta Cabins & Site Offices",
    excerpt: "Site ready offices, security cabins, accommodation and storage spaces.",
    image: "/images/profile/porta-cabin-site-office.png",
    highlightsTitle: "Key highlights",
    highlightsDescription:
      "Practical advantages for site offices, welfare units and temporary workplace setups.",
    highlights: [
      {
        title: "Site-ready delivery",
        description:
          "Units arrive prepared for rapid placement with clear access and utility connection points.",
        icon: "zap",
        points: ["Fast mobilisation", "Clear site access planning", "Ready for temporary power"],
      },
      {
        title: "Flexible layouts",
        description:
          "Configure offices, meeting rooms, security cabins and storage to match your site programme.",
        icon: "layers",
        points: ["Single or linked units", "Multiple room options", "Scalable as works grow"],
      },
      {
        title: "Built for site conditions",
        description:
          "Robust construction suited to Saudi project environments and everyday site use.",
        icon: "shield",
        points: ["Durable finishes", "Secure entry options", "Low-maintenance operation"],
      },
    ],
    caseStudiesTitle: "From concept to completion",
    caseStudiesDescription:
      "Examples of how porta cabins and site offices support real project requirements.",
    caseStudies: [
      {
        title: "Porta Cabins & Site Offices",
        imageUrl: "/images/projects/porta-cabins-site-offices.jpg",
        imageAlt: "Porta cabins and site offices",
        meta: "Site ready portable facilities",
        badge: "Capability",
        price: "Quote on request",
      },
      {
        title: "Ablution & Sanitary Units",
        imageUrl: "/images/projects/ablution-sanitary-units.jpg",
        imageAlt: "Ablution and sanitary units",
        meta: "Portable welfare facilities",
        badge: "Capability",
        price: "Quote on request",
      },
      {
        title: "Customized Modular Solutions",
        imageUrl: "/images/projects/customized-modular-solutions.jpg",
        imageAlt: "Customized modular solutions",
        meta: "Purpose built modular environments",
        badge: "Project",
        price: "Quote on request",
      },
    ],
  },
  {
    id: "modular-offices-meeting-rooms",
    slug: "modular-offices-meeting-rooms",
    title: "Modular Offices & Meeting Rooms",
    excerpt: "Professional modular workplaces with flexible layouts and integrated services.",
    image: "/images/profile/modular-meeting-room.png",
    highlightsTitle: "Key highlights",
    highlightsDescription:
      "Professional modular workplaces designed for flexible commercial and site use.",
    highlights: [
      {
        title: "Professional workplaces",
        description:
          "Create focused office and meeting environments without committing to permanent build-out.",
        icon: "home",
        points: ["Meeting-ready rooms", "Clean finishes", "Quiet working zones"],
      },
      {
        title: "Adaptable floor plans",
        description:
          "Adjust layouts as teams, visitors and project phases change over time.",
        icon: "layers",
        points: ["Open or partitioned plans", "Expandable modules", "Reusable across sites"],
      },
      {
        title: "Integrated services",
        description:
          "Plan lighting, cooling, furniture and access around how the space will actually be used.",
        icon: "wrench",
        points: ["Utility coordination", "Comfort-focused fit-out", "Practical access routes"],
      },
    ],
    caseStudiesTitle: "From concept to completion",
    caseStudiesDescription:
      "Modular office and meeting room setups shaped around day-to-day operations.",
    caseStudies: [
      {
        title: "Modular Offices & Meeting Rooms",
        imageUrl: "/images/projects/modular-offices-meeting-rooms.jpg",
        imageAlt: "Modular offices and meeting rooms",
        meta: "Flexible modular workplaces",
        badge: "Capability",
        price: "Quote on request",
      },
      {
        title: "Customized Modular Solutions",
        imageUrl: "/images/projects/customized-modular-solutions.jpg",
        imageAlt: "Customized modular solutions",
        meta: "Purpose built modular environments",
        badge: "Project",
        price: "Quote on request",
      },
      {
        title: "Porta Cabins & Site Offices",
        imageUrl: "/images/projects/porta-cabins-site-offices.jpg",
        imageAlt: "Porta cabins and site offices",
        meta: "Site ready portable facilities",
        badge: "Capability",
        price: "Quote on request",
      },
    ],
  },
  {
    id: "ablution-sanitary-units",
    slug: "ablution-sanitary-units",
    title: "Ablution & Sanitary Units",
    excerpt: "Robust portable washroom, toilet and shower facilities.",
    image: "/images/profile/ablution-sanitary-units.png",
  },
  {
    id: "car-parking-shades",
    slug: "car-parking-shades",
    title: "Car Parking Shades",
    excerpt: "Engineered shade structures for commercial, residential and industrial parking.",
    image: "/images/profile/car-parking-shades.jpg",
    highlightsTitle: "Key highlights",
    highlightsDescription:
      "Engineered shade structures for commercial, residential and industrial parking.",
    highlights: [
      {
        title: "Engineered shade",
        description:
          "Design shade coverage around parking density, vehicle types and site constraints.",
        icon: "award",
        points: ["Span options", "Durable framing", "Weather-minded detailing"],
      },
      {
        title: "Practical installation",
        description:
          "Coordinate foundations, access and sequencing so parking areas stay usable during works.",
        icon: "wrench",
        points: ["Clear installation plan", "Minimal disruption", "Site-ready components"],
      },
      {
        title: "Long-term value",
        description:
          "Protect vehicles and improve comfort while keeping maintenance straightforward.",
        icon: "check",
        points: ["UV protection", "Low upkeep finishes", "Commercial and residential use"],
      },
    ],
    caseStudiesTitle: "From concept to completion",
    caseStudiesDescription:
      "Shade and structure examples that support parking and outdoor coverage needs.",
    caseStudies: [
      {
        title: "Car Parking Shades",
        imageUrl: "/images/projects/car-parking-shades.jpg",
        imageAlt: "Car parking shades",
        meta: "Engineered shade structures",
        badge: "Capability",
        price: "Quote on request",
      },
      {
        title: "Steel Structures & Fabrication",
        imageUrl: "/images/projects/steel-structures-fabrication-works.jpg",
        imageAlt: "Steel structures and fabrication",
        meta: "Frames, sheds and platforms",
        badge: "Capability",
        price: "Quote on request",
      },
      {
        title: "Custom Steel Fabrication",
        imageUrl: "/images/projects/custom-steel-fabrication.jpg",
        imageAlt: "Custom steel fabrication",
        meta: "Made to order steel components",
        badge: "Project",
        price: "Quote on request",
      },
    ],
  },
  {
    id: "event-tents-temporary-structures",
    slug: "event-tents-temporary-structures",
    title: "Event Tents & Temporary Structures",
    excerpt: "Temporary covered spaces for events, compounds and site operations.",
    image: "/images/profile/event-tent-luxury.jpg",
  },
  {
    id: "steel-structures-fabrication",
    slug: "steel-structures-fabrication",
    title: "Steel Structures & Fabrication",
    excerpt: "Fabricated steel frames and structures planned for Saudi project conditions.",
    image: "/images/profile/steel-structure-frame.jpg",
  },
  {
    id: "custom-steel-fabrication",
    slug: "custom-steel-fabrication",
    title: "Custom Steel Fabrication",
    excerpt: "Made to order steel components for architectural and industrial applications.",
    image: "/images/profile/steel-fabrication-workshop.jpg",
  },
  {
    id: "customized-modular-solutions",
    slug: "customized-modular-solutions",
    title: "Customized Modular Solutions",
    excerpt: "Purpose built modular environments with tailored layouts, finishes and utilities.",
    image: "/images/profile/modular-office-complex.jpg",
  },
  {
    id: "police-barrier",
    slug: "police-barrier",
    title: "Police Barrier",
    excerpt: "Heavy duty steel police barriers for road closures, government events and perimeter control.",
    image: "/images/profile/site-compound-fencing.jpg",
  },
  {
    id: "heras-fence",
    slug: "heras-fence",
    title: "Heras Fence",
    excerpt: "Temporary mesh panel fencing for construction sites and controlled access areas.",
    image: "/images/profile/site-compound-fencing.jpg",
  },
  {
    id: "corrugated-fence",
    slug: "corrugated-fence",
    title: "Corrugated Fence",
    excerpt: "Solid corrugated steel fencing for privacy, dust control and site hoarding.",
    image: "/images/profile/steel-structure-frame.jpg",
  },
];

export const arabiaServices: ServiceDetailView[] = arabiaServiceInputs.map(buildService);

export function getArabiaServiceCards(limit = 100) {
  return arabiaServices.slice(0, limit).map(
    ({ id, slug, title, excerpt, image, imageAlt, href, parentId, parentTitle }) => ({
      id,
      slug,
      title,
      excerpt,
      image,
      imageAlt,
      href,
      parentId,
      parentTitle,
    })
  );
}

export function getArabiaServiceBySlug(slug: string) {
  const service = arabiaServices.find((item) => item.slug === slug);
  if (!service) return null;
  const related = getArabiaServiceCards()
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
  return { ...service, related, siblings: related };
}

export function getArabiaServiceGroups() {
  return [
    {
      id: "our-solutions",
      slug: "our-solutions",
      title: "Our solutions",
      sortOrder: 0,
      children: getArabiaServiceCards(),
    },
  ];
}

export function getArabiaServiceMegaMenu() {
  return [
    {
      title: "Our solutions",
      href: "/services",
      links: getArabiaServiceCards().map((service) => ({
        label: service.title,
        href: service.href,
      })),
    },
  ];
}

export function getArabiaServiceSlugs() {
  return arabiaServices.map((service) => service.slug);
}
