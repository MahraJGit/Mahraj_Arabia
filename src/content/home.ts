import {
  Building2,
  Factory,
  HardHat,
  Headphones,
  Landmark,
  Layers,
  Package,
  PartyPopper,
  SearchCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const heroImage = "/images/about/about-hero.png";
export const heroVideo = "/videos/hero/hero-video.mp4";

export const heroHighlights = [
  { icon: Package, label: "Supply" },
  { icon: Wrench, label: "Fabricate" },
  { icon: Truck, label: "Deliver" },
  { icon: HardHat, label: "Install" },
];

export type Industry = {
  slug: string;
  label: string;
  icon: LucideIcon;
};

export const industries: Industry[] = [
  { slug: "construction", label: "Construction", icon: HardHat },
  { slug: "industrial", label: "Industrial", icon: Factory },
  { slug: "commercial", label: "Commercial", icon: Building2 },
  { slug: "events", label: "Events", icon: PartyPopper },
  { slug: "infrastructure", label: "Infrastructure", icon: Landmark },
  { slug: "institutional", label: "Institutional", icon: Layers },
];

export const homeIndustriesCompact = industries;

export type CoreService = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

export const coreServices: CoreService[] = [
  {
    title: "Consult",
    subtitle: "Define use, size, location and schedule.",
    icon: Headphones,
  },
  {
    title: "Plan",
    subtitle: "Coordinate layout, materials and services.",
    icon: SearchCheck,
  },
  {
    title: "Fabricate",
    subtitle: "Build the approved scope with controlled workmanship.",
    icon: Wrench,
  },
  {
    title: "Deliver & Install",
    subtitle: "Coordinate logistics, site work and handover.",
    icon: Truck,
  },
];

export const advantages = [
  {
    title: "Practical design",
    description:
      "Layouts shaped around everyday operation, access, utilities and maintenance.",
  },
  {
    title: "Dependable fabrication",
    description:
      "Controlled workmanship for modular units, portable facilities and steel structures.",
  },
  {
    title: "Coordinated delivery",
    description:
      "Clear logistics and installation planning aligned to your project timeline.",
  },
];

export type Project = {
  slug: string;
  title: string;
  location: string;
  application: string;
  product: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "porta-cabins-site-offices",
    title: "Porta Cabins & Site Offices",
    location: "Riyadh, KSA",
    application: "Construction",
    product: "Site-ready portable facilities",
    image: "/images/projects/global-tech-hq.jpg",
  },
  {
    slug: "modular-offices-meeting-rooms",
    title: "Modular Offices & Meeting Rooms",
    location: "Riyadh, KSA",
    application: "Commercial",
    product: "Flexible modular workplaces",
    image: "/images/services/office-carpet-flooring.jpg",
  },
  {
    slug: "ablution-sanitary-units",
    title: "Ablution & Sanitary Units",
    location: "Riyadh, KSA",
    application: "Construction",
    product: "Portable welfare facilities",
    image: "/images/advantage-installation.jpg",
  },
  {
    slug: "car-parking-shades",
    title: "Car Parking Shades",
    location: "Riyadh, KSA",
    application: "Commercial",
    product: "Engineered shade structures",
    image: "/images/services/landscaping-outdoor-industry.png",
  },
  {
    slug: "event-tents-temporary-structures",
    title: "Event Tents & Temporary Structures",
    location: "Riyadh, KSA",
    application: "Events",
    product: "Temporary event infrastructure",
    image: "/images/services/events-exhibition-industry.png",
  },
  {
    slug: "steel-structures-fabrication",
    title: "Steel Structures & Fabrication Works",
    location: "Riyadh, KSA",
    application: "Industrial",
    product: "Structural steelwork",
    image: "/images/advantage-installation.png",
  },
  {
    slug: "custom-steel-fabrication",
    title: "Custom Steel Fabrication",
    location: "Riyadh, KSA",
    application: "Industrial",
    product: "Made-to-order steel components",
    image: "/images/services/homogeneous-flooring.jpg",
  },
  {
    slug: "customized-modular-solutions",
    title: "Customized Modular Solutions",
    location: "Riyadh, KSA",
    application: "Institutional",
    product: "Purpose-built modular environments",
    image: "/images/services/commercial-vinyl&LVT.png",
  },
];

export const featuredCaseStudies = [
  {
    slug: "porta-cabins-site-offices",
    title: "Porta Cabins & Site Offices",
    price: "Quote on request",
    meta: "Site-ready portable facilities",
    badge: "Capability",
  },
  {
    slug: "car-parking-shades",
    title: "Car Parking Shades",
    price: "Quote on request",
    meta: "Engineered shade structures",
    badge: "Capability",
  },
  {
    slug: "steel-structures-fabrication",
    title: "Steel Structures & Fabrication",
    price: "Quote on request",
    meta: "Frames, sheds and platforms",
    badge: "Capability",
  },
] as const;

export const trustPartnerLogos = [
  "NEOM",
  "Red Sea Global",
  "Diriyah",
  "ROSHN",
  "Saudi Aramco",
  "SABIC",
  "Maaden",
  "STC",
];

export const blogHighlights = [
  {
    slug: "how-to-plan-a-portable-site-office",
    title: "How to Plan a Portable Site Office",
    image: "/images/projects/global-tech-hq.jpg",
  },
  {
    slug: "modular-building-quotation-checklist",
    title: "Modular Building Quotation Checklist",
    image: "/images/advantage-installation.jpg",
  },
  {
    slug: "choosing-a-parking-shade-system",
    title: "Choosing a Parking Shade System",
    image: "/images/services/landscaping-outdoor-industry.png",
  },
];

export const regions = [
  "Riyadh",
  "Saudi Arabia",
];

export const faqs = [
  {
    question: "What makes Mahraj Arabia different?",
    answer:
      "We provide modular, portable and steel solutions with one clear route from requirement to installation—focused on clear design, dependable fabrication and coordinated delivery.",
  },
  {
    question: "Do you offer free consultations?",
    answer:
      "Yes. Share your use, size, location and schedule and we will help define a practical scope before quotation.",
  },
  {
    question: "Can solutions be customized?",
    answer:
      "Yes. Dimensions, layout, finishes and services can be reviewed around the intended use and site conditions.",
  },
  {
    question: "What do you need for a quotation?",
    answer:
      "Share the location, quantity or dimensions, intended use and target timeframe. Drawings and references can follow on WhatsApp.",
  },
  {
    question: "Do you deliver and install in Riyadh?",
    answer:
      "Yes. Delivery and installation can be included subject to site access, logistics and the agreed scope.",
  },
  {
    question: "How do I request a quote?",
    answer:
      "Use the contact form, call +966 55 434 6336, or message us on WhatsApp with your project brief.",
  },
];

export const quoteSolutions = [
  "Porta Cabins & Site Offices",
  "Modular Offices & Meeting Rooms",
  "Ablution & Sanitary Units",
  "Car Parking Shades",
  "Event Tents & Temporary Structures",
  "Steel Structures & Fabrication Works",
  "Custom Steel Fabrication",
  "Customized Modular Solutions",
];
