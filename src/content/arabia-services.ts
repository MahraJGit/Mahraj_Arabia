import type { ServiceDetailView } from "@/lib/public/services";

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
    answer:
      "Yes, subject to site access, logistics and the agreed scope.",
  },
] as const;

const PROCESS_STEPS = [
  { label: "Understand" },
  { label: "Configure" },
  { label: "Fabricate" },
  { label: "Install" },
] as const;

type ArabiaServiceInput = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  heroTitle: string;
  heroDescription: string;
  applications: {
    title: string;
    description: string;
    icon: string;
    points: string[];
  }[];
};

function buildService(input: ArabiaServiceInput): ServiceDetailView {
  const href = `/services/${input.slug}`;

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
    detailReady: true,
    heroTitle: input.heroTitle,
    heroDescription: input.heroDescription,
    overviewTitle: `${input.title}: planned around your brief`,
    overviewDescription:
      "Clear design, dependable fabrication and coordinated delivery from first requirement through site handover.",
    overviewImage: input.image,
    guideTitle: `The ${input.title} Guide`,
    guideDescription:
      "Practical options shaped around how the solution will be used on site.",
    applications: input.applications,
    showPerformanceMatrix: false,
    performanceTitle: "",
    performanceDescription: "",
    performanceLabels: [],
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
    spaceLabels: [],
    spaceRows: [],
    showProcess: true,
    processTitle: "From requirements to installation.",
    processDescription:
      "Our experienced team develops practical designs, delivers quality fabrication and coordinates reliable installation tailored to each project.",
    processSteps: [...PROCESS_STEPS],
    faqIntro: "Planning your project.",
    faqs: SHARED_FAQS.map((faq) => ({ ...faq })),
    caseStudiesTitle: "",
    caseStudiesDescription: "",
    projectsTitle: "",
    projectsDescription: "",
    related: [],
    siblings: [],
    seoTitle: `${input.title} in Riyadh`,
    seoDescription: input.excerpt,
  };
}

const arabiaServiceInputs: ArabiaServiceInput[] = [
  {
    id: "porta-cabins-site-offices",
    slug: "porta-cabins-site-offices",
    title: "Porta Cabins & Site Offices",
    excerpt:
      "Site-ready offices, security cabins, accommodation and storage spaces.",
    image: "/images/profile/porta-cabin-site-office.png",
    heroTitle: "Site-ready offices, security cabins, accommodation and storage spaces.",
    heroDescription:
      "Portable site facilities planned around access, utilities and your project programme.",
    applications: [
      {
        title: "Where this solution works",
        description: "Practical portable buildings for active project sites.",
        icon: "home",
        points: [
          "Project site offices",
          "Security and gate cabins",
          "Storage and utility rooms",
          "Staff accommodation",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Layouts and services shaped to the intended use.",
        icon: "layers",
        points: [
          "Single or multi-room layouts",
          "Insulated wall and roof panels",
          "Electrical, HVAC and lighting preparation",
          "Tailored finishes and storage",
        ],
      },
    ],
  },
  {
    id: "modular-offices-meeting-rooms",
    slug: "modular-offices-meeting-rooms",
    title: "Modular Offices & Meeting Rooms",
    excerpt:
      "Professional modular workplaces with flexible layouts and integrated services.",
    image: "/images/profile/modular-meeting-room.png",
    heroTitle: "Professional modular workplaces with flexible layouts and integrated services.",
    heroDescription:
      "Modular offices and meeting rooms configured for teams, visitors and daily operations.",
    applications: [
      {
        title: "Where this solution works",
        description: "Workplaces that need speed without compromising usability.",
        icon: "users",
        points: [
          "Executive offices",
          "Project management suites",
          "Meeting and training rooms",
          "Reception areas",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Flexible layouts with integrated services.",
        icon: "sparkles",
        points: [
          "Open-plan and private layouts",
          "Glazed or solid partitions",
          "Acoustic and finish upgrades",
          "Data, electrical and HVAC integration",
        ],
      },
    ],
  },
  {
    id: "ablution-sanitary-units",
    slug: "ablution-sanitary-units",
    title: "Ablution & Sanitary Units",
    excerpt: "Robust portable washroom, toilet and shower facilities.",
    image: "/images/profile/ablution-sanitary-units.png",
    heroTitle: "Robust portable washroom, toilet and shower facilities.",
    heroDescription:
      "Welfare units planned for construction, events and remote-site operations.",
    applications: [
      {
        title: "Where this solution works",
        description: "Sanitary facilities where permanent buildings are not available.",
        icon: "shield",
        points: [
          "Construction welfare facilities",
          "Worker accommodation",
          "Event washroom blocks",
          "Remote-site sanitary units",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Layouts prepared for hygiene, durability and site services.",
        icon: "wrench",
        points: [
          "Toilet, shower or combined layouts",
          "Separate access arrangements",
          "Water-resistant internal finishes",
          "Plumbing and ventilation preparation",
        ],
      },
    ],
  },
  {
    id: "car-parking-shades",
    slug: "car-parking-shades",
    title: "Car Parking Shades",
    excerpt:
      "Engineered shade structures for commercial, residential and industrial parking.",
    image: "/images/profile/car-parking-shades.jpg",
    heroTitle:
      "Engineered shade structures for commercial, residential and industrial parking.",
    heroDescription:
      "Parking shade systems planned around span, access and site conditions.",
    applications: [
      {
        title: "Where this solution works",
        description: "Shade coverage for everyday parking and staff facilities.",
        icon: "award",
        points: [
          "Office and commercial parking",
          "Residential developments",
          "Industrial staff parking",
          "Schools and public facilities",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Structural and visual options matched to the site.",
        icon: "layers",
        points: [
          "Single or double-row layouts",
          "Cantilever or supported systems",
          "Fabric or metal roof concepts",
          "Powder-coated steel finishes",
        ],
      },
    ],
  },
  {
    id: "event-tents-temporary-structures",
    slug: "event-tents-temporary-structures",
    title: "Event Tents & Temporary Structures",
    excerpt:
      "Adaptable temporary spaces for events, hospitality and operations.",
    image: "/images/profile/event-tent-luxury.jpg",
    heroTitle: "Adaptable temporary spaces for events, hospitality and operations.",
    heroDescription:
      "Temporary structures coordinated around programme, access and guest flow.",
    applications: [
      {
        title: "Where this solution works",
        description: "Short-term spaces that still need to feel intentional.",
        icon: "zap",
        points: [
          "Corporate events",
          "Exhibitions and activations",
          "Temporary hospitality",
          "Operational shelters",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Layouts and elevations adapted to the occasion.",
        icon: "check",
        points: [
          "Clear-span layouts",
          "Flooring and access systems",
          "Open, glazed or enclosed elevations",
          "Lighting and climate coordination",
        ],
      },
    ],
  },
  {
    id: "steel-structures-fabrication",
    slug: "steel-structures-fabrication",
    title: "Steel Structures & Fabrication Works",
    excerpt:
      "Structural frames, sheds, platforms, canopies and supporting steelwork.",
    image: "/images/profile/steel-structure-frame.jpg",
    heroTitle: "Structural frames, sheds, platforms, canopies and supporting steelwork.",
    heroDescription:
      "Steel structures fabricated and coordinated for industrial and commercial sites.",
    applications: [
      {
        title: "Where this solution works",
        description: "Supporting steelwork for operational and covered spaces.",
        icon: "wrench",
        points: [
          "Warehouses and sheds",
          "Platforms and access structures",
          "Canopies and support frames",
          "Utility structures",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Fabrication options matched to structural requirements.",
        icon: "layers",
        points: [
          "Primary and secondary steel",
          "Roofing and cladding coordination",
          "Bolted or welded assemblies",
          "Protective coating options",
        ],
      },
    ],
  },
  {
    id: "custom-steel-fabrication",
    slug: "custom-steel-fabrication",
    title: "Custom Steel Fabrication",
    excerpt:
      "Made-to-order steel components for architectural and industrial applications.",
    image: "/images/profile/steel-fabrication-workshop.jpg",
    heroTitle:
      "Made-to-order steel components for architectural and industrial applications.",
    heroDescription:
      "Custom steelwork produced to drawings, references and site requirements.",
    applications: [
      {
        title: "Where this solution works",
        description: "Components that need precise fabrication and finish.",
        icon: "activity",
        points: [
          "Support assemblies",
          "Equipment bases",
          "Stairs and rails",
          "Architectural metal features",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Workshop processes aligned to the specified scope.",
        icon: "sparkles",
        points: [
          "Cutting, forming and welding",
          "Drilled and bolted connections",
          "Surface preparation and coatings",
          "Prototype or repeat fabrication",
        ],
      },
    ],
  },
  {
    id: "customized-modular-solutions",
    slug: "customized-modular-solutions",
    title: "Customized Modular Solutions",
    excerpt:
      "Purpose-built modular environments with tailored layouts, finishes and utilities.",
    image: "/images/profile/modular-office-complex.jpg",
    heroTitle:
      "Purpose-built modular environments with tailored layouts, finishes and utilities.",
    heroDescription:
      "Modular solutions developed when standard units need more specific configuration.",
    applications: [
      {
        title: "Where this solution works",
        description: "Specialist spaces that still benefit from modular delivery.",
        icon: "home",
        points: [
          "Operations facilities",
          "Specialist accommodation",
          "Multi-room complexes",
          "Commercial spaces",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Custom scope shaped around use, finish and utilities.",
        icon: "layers",
        points: [
          "Single or multi-storey concepts",
          "Custom façades and sun control",
          "Integrated service zones",
          "Specialized room layouts",
        ],
      },
    ],
  },
  {
    id: "police-barrier",
    slug: "police-barrier",
    title: "Police Barrier",
    excerpt:
      "Heavy-duty steel police barriers for road closures, government events and perimeter control.",
    image: "/images/profile/site-compound-fencing.jpg",
    heroTitle:
      "Heavy-duty steel police barriers for road closures, government events and perimeter control.",
    heroDescription:
      "Crowd-control and perimeter barriers planned for rapid deployment across Saudi project and event sites.",
    applications: [
      {
        title: "Where this solution works",
        description: "Reliable barrier systems for controlled access and public safety.",
        icon: "home",
        points: [
          "Road closures and traffic management",
          "Government and civic events",
          "Perimeter and crowd control",
          "Temporary site boundaries",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Quantities, finishes and logistics shaped to the deployment.",
        icon: "layers",
        points: [
          "Interlocking barrier sections",
          "Heavy-duty steel construction",
          "Fast install and relocation",
          "Purchase or project supply options",
        ],
      },
    ],
  },
  {
    id: "heras-fence",
    slug: "heras-fence",
    title: "Heras Fence",
    excerpt:
      "Temporary Heras fencing panels for construction sites and event perimeters.",
    image: "/images/profile/site-compound-fencing.jpg",
    heroTitle:
      "Temporary Heras fencing panels for construction sites and event perimeters.",
    heroDescription:
      "Mesh panel fencing for secure, relocatable boundaries on active sites and events.",
    applications: [
      {
        title: "Where this solution works",
        description: "Practical temporary fencing for secure site and event control.",
        icon: "home",
        points: [
          "Construction site perimeters",
          "Event and exhibition boundaries",
          "Temporary compound fencing",
          "Rapid redeployment across phases",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Panel counts, gates and accessories matched to site access.",
        icon: "layers",
        points: [
          "Galvanized mesh panels",
          "Stable base and clamp systems",
          "Pedestrian and vehicle gates",
          "Hire or supply programmes",
        ],
      },
    ],
  },
  {
    id: "corrugated-fence",
    slug: "corrugated-fence",
    title: "Corrugated Fence",
    excerpt:
      "Corrugated steel sheet fencing for construction hoarding and event boundaries.",
    image: "/images/profile/steel-structure-frame.jpg",
    heroTitle:
      "Corrugated steel sheet fencing for construction hoarding and event boundaries.",
    heroDescription:
      "Solid corrugated fencing for privacy, site security and branded hoarding applications.",
    applications: [
      {
        title: "Where this solution works",
        description: "Solid boundary fencing where privacy and presentation matter.",
        icon: "home",
        points: [
          "Construction hoarding",
          "Event and site boundaries",
          "Privacy screening",
          "Branded perimeter cladding",
        ],
      },
      {
        title: "Planned around your brief",
        description: "Height, finish and access details shaped to the project.",
        icon: "layers",
        points: [
          "Corrugated steel sheet panels",
          "Durable site-ready frames",
          "Optional branding surfaces",
          "Coordinated delivery and install",
        ],
      },
    ],
  },
];

export const arabiaServices: ServiceDetailView[] = arabiaServiceInputs.map(
  buildService
);

export function getArabiaServiceCards(limit = 100) {
  return arabiaServices.slice(0, limit).map(
    ({
      id,
      slug,
      title,
      excerpt,
      image,
      imageAlt,
      href,
      parentId,
      parentTitle,
    }) => ({
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

  return {
    ...service,
    related,
    siblings: [],
  };
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
