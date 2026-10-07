import {
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
  image: "/images/profile/portable-cabins-skyline.jpg",
  title: "Modular spaces. Steel built.",
  description:
    "Mahraj Arabia brings practical planning, fabrication and site coordination together for modular, portable, fencing and steel solutions across Saudi Arabia.",
};

export const aboutPartners = [
  "NEOM",
  "Red Sea Global",
  "Diriyah",
  "ROSHN",
  "Saudi Aramco",
  "SABIC",
];

export type AboutIndustry = {
  title: string;
  image: string;
  size: "small" | "large" | "wide";
};

export const aboutIndustries: AboutIndustry[] = [
  {
    title: "Porta Cabins & Site Offices",
    image: "/images/profile/porta-cabin-site-office.png",
    size: "small",
  },
  {
    title: "Modular Offices & Meeting Rooms",
    image: "/images/profile/modular-meeting-room.png",
    size: "large",
  },
  {
    title: "Ablution & Sanitary Units",
    image: "/images/profile/ablution-sanitary-units.png",
    size: "small",
  },
  {
    title: "Car Parking Shades",
    image: "/images/profile/car-parking-shades.jpg",
    size: "wide",
  },
  {
    title: "Steel Structures & Fabrication",
    image: "/images/profile/steel-structure-frame.jpg",
    size: "small",
  },
  {
    title: "Customized Modular Solutions",
    image: "/images/profile/modular-office-complex.jpg",
    size: "small",
  },
  {
    title: "Police Barrier",
    image: "/images/profile/site-compound-fencing.jpg",
    size: "small",
  },
  {
    title: "Heras Fence",
    image: "/images/profile/site-compound-fencing.jpg",
    size: "small",
  },
  {
    title: "Corrugated Fence",
    image: "/images/profile/steel-structure-frame.jpg",
    size: "wide",
  },
];

export const aboutAudiences = [
  {
    title: "Built for teams who need clarity early",
    description:
      "Layouts shaped around everyday operation. We consider how people will use the space before drawings and fabrication begin.",
    image: "/images/profile/modular-crane-install.png",
    imageSide: "start" as const,
  },
  {
    title: "Delivery that keeps the programme moving",
    description:
      "Defined fabrication, logistics and installation planning—so temporary or permanent solutions arrive ready for site use.",
    image: "/images/profile/container-office-sunset.jpg",
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
  image: "/images/profile/steel-plant-yard.jpg",
  title: "Ready to discuss your requirement?",
  description:
    "Call, visit or send your project brief through WhatsApp. Our team is ready to help from first idea to a site-ready solution.",
};
