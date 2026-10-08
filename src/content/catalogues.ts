import {
  BadgeCheck,
  Droplets,
  Ear,
  Paintbrush,
  Shield,
  Sparkles,
} from "lucide-react";

export const cataloguePage = {
  hero: {
    image: "/images/profile/steel-and-modular-collage.jpg",
    title: "Modular spaces. Steel built.",
    description:
      "Modular, portable, fencing and steel solutions for construction, events and industrial sites across Saudi Arabia.",
    searchPlaceholder: "Find a solution by name…",
    breadcrumb: "Catalogues",
  },

  filterDropdowns: [
    { label: "Solution Types", placeholder: "All Types" },
    { label: "Industry", placeholder: "All Industries" },
    { label: "Applications", placeholder: "All Applications" },
  ],

  topics: [
    // {
    //   title: "All Collections",
    //   image: "/images/profile/porta-cabin-site-office.png",
    // },
    {
      title: "Gyms",
      image: "/images/catalogue/Gyms.png",
    },
    {
      title: "Schools",
      image: "/images/catalogue/Schools.png",
    },
    {
      title: "Hospitals",
      image: "/images/profile/steel-structure-frame.jpg",
    },
    {
      title: "Offices",
      image: "/images/catalogue/Offices.png",
    },
    {
      title: "Hotels",
      image: "/images/catalogue/Hotels.png",
    },
    {
      title: "Events",
      image: "/images/catalogue/Events.png",
    },
    {
      title: "Sports",
      image: "/images/catalogue/Sports.png",
    },
    {
      title: "Homes",
      image: "/images/catalogue/Homes.png",
    },
    {
      title: "Stables",
      image: "/images/catalogue/Stables.png",
    },
    {
      title: "Retail Stores",
      image: "/images/catalogue/Retail Stores.png",
    },
  ],

  featured: {
    badge: "Featured Collection",
    title: "Portable & Modular Site Solutions",
    excerpt:
      "Browse porta cabins, modular offices and site facilities planned around programme, access and utilities.",
    image: "/images/profile/porta-cabin-site-office.png",
    author: "By Mahraj Arabia Team",
    authorAvatar: "/images/avatar.jpg",
  },

  explore: {
    title: "Explore Our Solution Collections",
    collections: [
      {
        title: "Porta Cabins & Site Offices",
        description:
          "Site-ready offices, security cabins, accommodation and storage for active project sites.",
        image: "/images/profile/porta-cabin-site-office.png",
        tags: ["Construction", "Industrial", "Infrastructure", "Sites"],
      },
      {
        title: "Modular Offices",
        description:
          "Professional modular workplaces with flexible layouts and integrated services.",
        image: "/images/profile/modular-meeting-room.png",
        tags: ["Commercial", "Institutional", "Offices", "Teams"],
      },
      {
        title: "Parking Shades",
        description:
          "Engineered shade structures for vehicles, compounds and high-use outdoor areas.",
        image: "/images/profile/car-parking-shades.jpg",
        tags: ["Commercial", "Industrial", "Parking", "Compounds"],
      },
      {
        title: "Steel Structures",
        description:
          "Frames, sheds, platforms and custom steel fabrication for Saudi project requirements.",
        image: "/images/profile/steel-structure-frame.jpg",
        tags: ["Industrial", "Infrastructure", "Fabrication", "Steel"],
      },
      {
        title: "Police Barrier",
        description:
          "Heavy-duty steel police barriers for road closures, government events and perimeter control.",
        image: "/images/profile/site-compound-fencing.jpg",
        tags: ["Events", "Security", "Perimeter", "Traffic"],
      },
      {
        title: "Heras Fence",
        description:
          "Temporary Heras fencing panels for construction sites and event perimeters.",
        image: "/images/profile/site-compound-fencing.jpg",
        tags: ["Construction", "Events", "Temporary", "Sites"],
      },
      {
        title: "Corrugated Fence",
        description:
          "Corrugated steel sheet fencing for construction hoarding and event boundaries.",
        image: "/images/profile/steel-structure-frame.jpg",
        tags: ["Hoarding", "Privacy", "Construction", "Events"],
      },
    ],
  },

  matters: {
    title: "Find the Right Solution for Your Priorities",
    cards: [
      {
        icon: Shield,
        title: "Durability",
        description: "Structures built for site conditions, heavy use and long service life.",
      },
      {
        icon: BadgeCheck,
        title: "Safety",
        description: "Practical layouts and finishes planned around access and safe operation.",
      },
      {
        icon: Paintbrush,
        title: "Easy Upkeep",
        description: "Finishes and systems chosen to keep cleaning and maintenance straightforward.",
      },
      {
        icon: Droplets,
        title: "Weather Ready",
        description: "Portable and steel solutions prepared for outdoor and harsh site exposure.",
      },
      {
        icon: Sparkles,
        title: "Clear Presentation",
        description: "Professional looks for offices, visitor spaces and client-facing compounds.",
      },
      {
        icon: Ear,
        title: "Programme Fit",
        description: "Fabrication and delivery sequenced around your project timeline.",
      },
    ],
  },

  industry: {
    title: "Find solutions for your industry",
    cards: [
      {
        title: "Construction Sites",
        description: "Portable offices, cabins and utilities for active programmes.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Industrial Facilities",
        description: "Steel structures and modular spaces for operational compounds.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Commercial Campuses",
        description: "Parking shades, modular offices and visitor facilities.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Events & Temporary Use",
        description: "Tents and temporary structures planned around schedule and access.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Infrastructure",
        description: "Site facilities and steel work for corridor and utility projects.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Institutional Campuses",
        description: "Modular workplaces and purpose-built portable environments.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
    ],
  },

  resources: {
    title: "Catalogue & Technical Resource Center",
    cards: [
      {
        title: "Solutions Overview",
        description: "Core modular, portable and steel capability summary",
        fileInfo: "PDF overview",
      },
      {
        title: "Porta Cabin Range",
        description: "Layouts, finishes and typical site configurations",
        fileInfo: "PDF catalogue",
      },
      {
        title: "Parking Shade Guide",
        description: "Span, foundations and finish options",
        fileInfo: "PDF guide",
      },
      {
        title: "Steel Fabrication Notes",
        description: "Frames, platforms and custom steel scopes",
        fileInfo: "PDF notes",
      },
      {
        title: "Quotation Checklist",
        description: "What to prepare for a clear modular/steel proposal",
        fileInfo: "PDF checklist",
      },
      {
        title: "Installation Brief",
        description: "Access, logistics and site readiness guidance",
        fileInfo: "PDF brief",
      },
    ],
  },

  realProjects: {
    title: "See Our Solutions in Real Projects",
    cards: [
      {
        title: "Site Offices",
        description: "Portable facilities coordinated around active programmes.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Modular Workplaces",
        description: "Flexible offices and meeting rooms for teams on site.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Parking Shades",
        description: "Engineered shade structures for compounds and campuses.",
        image: "/images/catalogue/Sports.png",
      },
      {
        title: "Steel Frames",
        description: "Fabricated structures planned for industrial use.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Event Structures",
        description: "Temporary tents and facilities for short-term programmes.",
        image: "/images/profile/porta-cabin-site-office.png",
      },
      {
        title: "Custom Modular",
        description: "Purpose-built modular environments for specialised briefs.",
        image: "/images/catalogue/Sports.png",
      },
    ],
  },

  testimonial: {
    image: "/images/catalogue/Everything You Need, All in One Place.png",
    title: "Everything You Need, All in One Place",
    review:
      "Skip the long search. Our catalogues give you solution options, sizing guidance and technical notes so you can specify modular, portable or steel work with confidence.",
    author: "Alex Catonni, Project Manager",
    metrics: [
      { label: "Solution families", value: "8+" },
      { label: "Finish options", value: "40+" },
      { label: "Technical sheets", value: "20+" },
      { label: "Industry sectors covered", value: "6+" },
    ],
  },

  sizingGuide: {
    title: "Solution Sizing Guide",
    columns: ["Use Case", "Typical Scope", "Key Factor", "Recommended", "Lead Focus"],
    rows: [
      {
        cells: ["Site Office", "Single cabin / twin unit", "Access & power", "Standard porta cabin", "Programme"],
      },
      {
        cells: ["Modular Workplace", "Multi-room layout", "Occupancy", "Modular office suite", "Services"],
      },
      {
        cells: ["Parking Shade", "Bay rows / canopy", "Span & foundations", "Engineered shade", "Wind load"],
      },
      {
        cells: [
          "Steel Structure",
          "Frame / shed / platform",
          "Load & span",
          "Custom fabrication",
          "Drawings",
        ],
      },
    ],
  },

  ctaPanels: {
    help: {
      title: "Not Sure Which Solution to Pick?",
      description:
        "Tell us about your site, timeline and budget. Our team will suggest a practical modular, portable or steel scope.",
    },
    subscribe: {
      title: "Stay Ahead with Project News",
      description:
        "Be the first to see new solution ranges, project ideas and helpful planning guides, sent straight to your email.",
      placeholder: "Your email address",
    },
  },

  faqIntro:
    "Find quick answers about our catalogues, downloads, modular solutions and support. If you cannot find what you need, our team is happy to help.",
  faqs: [
    {
      question: "Are the catalogues free?",
      answer:
        "Yes. Our catalogues and technical sheets are free to view and download.",
    },
    {
      question: "Can I get printed catalogues or physical samples?",
      answer:
        "Yes, samples and printed packs are available on request. Share your project brief and our team will arrange them.",
    },
    {
      question: "Are your catalogues updated regularly?",
      answer:
        "Yes. We update catalogues when solution ranges, finishes or technical details change. Check the file date for the latest version.",
    },
    {
      question: "Do you provide technical data sheets and certifications?",
      answer:
        "Yes. You can find data sheets and quality documents in the catalogues section. If you need a specific document for a tender or approval, contact us and we will send it."
    },
    {
      question: "How do I get a price for my project?",
      answer:
        'Click "Get a Consultation" and tell us your location, quantity or dimensions, intended use and target timeframe. We will reply with a clear scope and timeline.'
    },
  ],
};
