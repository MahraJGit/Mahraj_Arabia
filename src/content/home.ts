import {
  Building2,
  Factory,
  HardHat,
  Landmark,
  Layers,
  Package,
  PartyPopper,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const heroImage = "/images/profile/modular-office-complex.jpg";
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
    image: "/images/profile/porta-cabin-site-office.png",
  },
  {
    slug: "modular-offices-meeting-rooms",
    title: "Modular Offices & Meeting Rooms",
    location: "Riyadh, KSA",
    application: "Commercial",
    product: "Flexible modular workplaces",
    image: "/images/profile/modular-meeting-room.png",
  },
  {
    slug: "ablution-sanitary-units",
    title: "Ablution & Sanitary Units",
    location: "Riyadh, KSA",
    application: "Construction",
    product: "Portable welfare facilities",
    image: "/images/profile/ablution-sanitary-units.png",
  },
  {
    slug: "car-parking-shades",
    title: "Car Parking Shades",
    location: "Riyadh, KSA",
    application: "Commercial",
    product: "Engineered shade structures",
    image: "/images/profile/car-parking-shades.jpg",
  },
  {
    slug: "event-tents-temporary-structures",
    title: "Event Tents & Temporary Structures",
    location: "Riyadh, KSA",
    application: "Events",
    product: "Temporary event infrastructure",
    image: "/images/profile/event-tent-luxury.jpg",
  },
  {
    slug: "steel-structures-fabrication",
    title: "Steel Structures & Fabrication Works",
    location: "Riyadh, KSA",
    application: "Industrial",
    product: "Structural steelwork",
    image: "/images/profile/steel-structure-frame.jpg",
  },
  {
    slug: "custom-steel-fabrication",
    title: "Custom Steel Fabrication",
    location: "Riyadh, KSA",
    application: "Industrial",
    product: "Made-to-order steel components",
    image: "/images/profile/steel-fabrication-workshop.jpg",
  },
  {
    slug: "customized-modular-solutions",
    title: "Customized Modular Solutions",
    location: "Riyadh, KSA",
    application: "Institutional",
    product: "Purpose-built modular environments",
    image: "/images/profile/modular-office-complex.jpg",
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
    image: "/images/profile/porta-cabin-site-office.png",
  },
  {
    slug: "police-barriers-for-events-and-road-control",
    title: "Police Barriers for Events and Road Control",
    image: "/images/profile/site-compound-fencing.jpg",
  },
  {
    slug: "heras-fence-vs-corrugated-fence",
    title: "Heras Fence vs Corrugated Fence: Which Fits Your Site?",
    image: "/images/profile/steel-structure-frame.jpg",
  },
  {
    slug: "from-brief-to-installation-mahraj-arabia",
    title: "From Brief to Installation: How Mahraj Arabia Delivers",
    image: "/images/profile/modular-crane-install.png",
  },
  {
    slug: "steel-structures-for-saudi-project-sites",
    title: "Steel Structures for Saudi Project Sites",
    image: "/images/profile/steel-plant-yard.jpg",
  },
  {
    slug: "temporary-site-facilities-for-construction",
    title: "Temporary Site Facilities for Construction Programmes",
    image: "/images/profile/portable-cabins-skyline.jpg",
  },
];

export const profileToc = [
  { label: "Introduction", href: "/about" },
  { label: "Our solutions", href: "/#solutions" },
  { label: "Project settings", href: "/#project-settings" },
  { label: "Working process", href: "/#working-process" },
  { label: "Regional footprint", href: "/#regional" },
  { label: "Blogs", href: "/#blogs" },
  { label: "Contact", href: "/contact" },
];

export const regions = [
  "Riyadh",
  "Saudi Arabia",
];

export const faqs = [
  {
    question: "What makes Mahraj Arabia different?",
    answer:
      "We provide modular, portable, fencing and steel solutions with one clear route from requirement to installation, focused on clear design, dependable fabrication and coordinated delivery across Saudi projects.",
  },
  {
    question: "Do you offer free consultations?",
    answer:
      "Yes. Share your use, size, location and schedule and we will help define a practical scope before quotation.",
  },
  {
    question: "Can solutions be customized?",
    answer:
      "Yes. Dimensions, layout, finishes, fencing quantities and services can be reviewed around the intended use and site conditions.",
  },
  {
    question: "Do you supply fencing and barriers?",
    answer:
      "Yes. Mahraj Arabia supplies Police Barriers, Heras Fence and Corrugated Fence for construction sites, events and perimeter control.",
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
      "Use the contact form, call +966 56 602 1891 or +971 50 882 2414, or message us on WhatsApp with your project brief.",
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
  "Police Barrier",
  "Heras Fence",
  "Corrugated Fence",
];
