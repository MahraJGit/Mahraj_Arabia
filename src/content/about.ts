import {
  Building2,
  ClipboardCheck,
  FileCheck2,
  Handshake,
  Layers,
  Ruler,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const aboutHero = {
  image: "/images/about/about-hero.png",
  title: "Built around real-world project needs.",
  description:
    "We bring practical planning, fabrication and site coordination together.",
};

export const aboutPartners = [
  "NEOM",
  "Red Sea Global",
  "Diriyah",
  "ROSHN",
  "Saudi Aramco",
  "SABIC",
];

export const aboutOverview = {
  image: "/images/advantage-installation.png",
  title: "From first idea to a site-ready solution.",
  steps: [
    "Practical design",
    "Flexible thinking",
    "Clear coordination",
    "Dependable delivery",
  ],
  objective:
    "MahrajArabia supports construction, industrial, commercial and event clients with portable buildings, modular spaces and fabricated steelwork. Our work begins with how the solution will be used—people, access, utilities, movement, maintenance and programme—before shaping the scope.",
};

export type AboutIndustry = {
  title: string;
  image: string;
  size: "small" | "large" | "wide";
};

export const aboutIndustries: AboutIndustry[] = [
  {
    title: "Porta Cabins & Site Offices",
    image: "/images/projects/global-tech-hq.jpg",
    size: "small",
  },
  {
    title: "Modular Offices & Meeting Rooms",
    image: "/images/services/office-carpet-flooring.jpg",
    size: "large",
  },
  {
    title: "Ablution & Sanitary Units",
    image: "/images/advantage-installation.jpg",
    size: "small",
  },
  {
    title: "Car Parking Shades",
    image: "/images/services/landscaping-outdoor-industry.png",
    size: "wide",
  },
  {
    title: "Steel Structures & Fabrication",
    image: "/images/advantage-installation.png",
    size: "small",
  },
  {
    title: "Customized Modular Solutions",
    image: "/images/services/commercial-vinyl&LVT.png",
    size: "small",
  },
];

export const aboutAudiences = [
  {
    title: "Built for teams who need clarity early",
    description:
      "Layouts shaped around everyday operation. We consider how people will use the space before drawings and fabrication begin.",
    image: "/images/advantage-installation.jpg",
    imageSide: "start" as const,
  },
  {
    title: "Delivery that keeps the programme moving",
    description:
      "Defined fabrication, logistics and installation planning—so temporary or permanent solutions arrive ready for site use.",
    image: "/images/projects/global-tech-hq.jpg",
    imageSide: "end" as const,
  },
];

export type Objective = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const aboutObjectives: Objective[] = [
  {
    title: "Practical design",
    description:
      "Layouts shaped around everyday operation, access and maintenance.",
    icon: Users,
  },
  {
    title: "Flexible thinking",
    description:
      "Standard products adapted when the project calls for more.",
    icon: FileCheck2,
  },
  {
    title: "Clear coordination",
    description:
      "Defined fabrication, logistics and installation planning.",
    icon: Ruler,
  },
  {
    title: "Dependable delivery",
    description: "A focused route through handover.",
    icon: Truck,
  },
  {
    title: "Controlled fabrication",
    description:
      "Modular units and steelwork built with controlled workmanship.",
    icon: Wrench,
  },
  {
    title: "Integrated services",
    description:
      "Electrical, HVAC, plumbing and finish preparation where required.",
    icon: Layers,
  },
  {
    title: "Site-ready coordination",
    description:
      "We stay aligned with your programme so delivery fits the timeline.",
    icon: Handshake,
  },
  {
    title: "Clear handover",
    description:
      "Scope, logistics and installation completed with a practical handover.",
    icon: ClipboardCheck,
  },
];

export const commercialProcess = [
  { number: "01", label: "Consult the requirement", icon: Building2 },
  { number: "02", label: "Plan layout and services", icon: Ruler },
  { number: "03", label: "Fabricate the approved scope", icon: FileCheck2 },
  { number: "04", label: "Coordinate delivery", icon: Handshake },
  { number: "05", label: "Install and hand over", icon: Truck },
];

export const aboutCompliance = [
  { title: "Project-specific planning", icon: ShieldCheck },
  { title: "Controlled fabrication quality", icon: FileCheck2 },
  { title: "Coordinated site delivery", icon: Truck },
];

export const aboutFaqIntro =
  "Answers to what clients most often ask about modular, portable and steel solutions in Riyadh.";

export const aboutFaqs = [
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
  {
    question: "Do you support construction and industrial sites?",
    answer:
      "Yes. We support construction, industrial, commercial and event clients with portable buildings, modular spaces and fabricated steelwork.",
  },
  {
    question: "Where are you based?",
    answer:
      "Our office is at Office No 9, 1st Floor, 5207, Al Malqa, Riyadh. Call or WhatsApp +966 55 434 6336.",
  },
  {
    question: "What should we prepare before discussing a project?",
    answer:
      "A short brief covering use, size, location, utilities and programme helps us shape a clearer scope from the start.",
  },
];

export const aboutCta = {
  image: "/images/advantage-installation.jpg",
  title: "Ready to discuss your requirement?",
  description:
    "Call, visit or send your project brief through WhatsApp. Our team is ready to help from first idea to a site-ready solution.",
};
