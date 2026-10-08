import { Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";

import { site } from "@/content/site";

export type ContactChannel = {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  note?: string;
};

export const contactHero = {
  image: "/images/profile/steel-plant-yard.jpg",
  deviceImage: null,
  title: "Let’s discuss your requirement.",
};

export const contactIntro = {
  title: "Call, visit or send your project brief through WhatsApp.",
  description:
    "Tell Mahraj Arabia about modular buildings, portable facilities, fencing, parking shades or steel fabrication. Review your prepared message before sending it in WhatsApp, or speak with our team directly.",
};

export const contactChannels: ContactChannel[] = [
  {
    title: "WhatsApp KSA",
    description: `Share your project brief with our Saudi team: ${site.phones[0].number}`,
    action: "Message KSA",
    href: site.phones[0].whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    title: "WhatsApp UAE",
    description: `Contact our UAE team: ${site.phones[1].number}`,
    action: "Message UAE",
    href: site.phones[1].whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    title: "Email Waseem",
    description: site.emails[0],
    action: "Send email",
    href: `mailto:${site.emails[0]}`,
    icon: Mail,
  },
  {
    title: "Email KSA Events",
    description: site.emails[1],
    action: "Send email",
    href: `mailto:${site.emails[1]}`,
    icon: Mail,
  },
  {
    title: "Visit",
    description: `${site.address.line1}, ${site.address.line2}, ${site.address.line3}.`,
    action: "Get directions",
    href: site.address.mapsHref,
    icon: MapPin,
    external: true,
  },
];

export const currentLocation = {
  title: "Riyadh Office",
  embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
    `${site.address.line1}, ${site.address.line2}, ${site.address.line3}`
  )}&output=embed`,
};

export const regionalOfficesIntro = {
  title: "Visit our Riyadh office",
  description:
    "Meet us in Al Malqa, or send your brief on WhatsApp for a faster start.",
};

export type RegionalOffice = {
  slug: string;
  title: string;
  tone: "brand" | "navy";
  address: string;
  phone: string;
  phoneHref: string;
  emails: readonly string[];
  hours: string;
  mapsHref: string;
};

export const regionalOffices: RegionalOffice[] = [
  {
    slug: "riyadh",
    title: "Riyadh Office",
    tone: "brand",
    address: `${site.address.line1}, ${site.address.line2}, ${site.address.line3}`,
    phone: site.phone,
    phoneHref: site.phoneHref,
    emails: site.emails,
    hours: "9:00am - 7:00pm",
    mapsHref: site.address.mapsHref,
  },
];

export const contactFaqIntro =
  "Got a question before reaching out? Here are quick answers on quotations, timelines, and how we work.";

export const contactFaqs = [
  {
    question: "How fast can I get a quote?",
    answer:
      "Share the location, quantity or dimensions, intended use and target timeframe. We usually respond quickly, and drawings can follow on WhatsApp.",
  },
  {
    question: "Do I need to visit your office to get started?",
    answer:
      "No. You can start by WhatsApp, phone or the enquiry form. A visit is helpful when you want to review details in person.",
  },
  {
    question: "Can delivery and installation be included?",
    answer:
      "Yes, subject to site access, logistics and the agreed scope.",
  },
  {
    question: "Can you handle urgent or fast turnaround projects?",
    answer:
      "In many cases, yes. Let us know your deadline early so we can confirm what is realistically possible.",
  },
  {
    question: "How do you calculate project cost?",
    answer:
      "Cost depends on size, specification, materials, logistics and installation scope. We provide a clear quotation after reviewing your brief.",
  },
];
