import { MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";

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
  image: "/images/contact/contact-hero.png",
  deviceImage: null,
  title: "Let’s discuss your requirement.",
};

export const contactIntro = {
  title: "Call, visit or send your project brief through WhatsApp.",
  description:
    "Review your prepared message before sending it in WhatsApp, or speak with our team directly.",
};

export const contactChannels: ContactChannel[] = [
  {
    title: "WhatsApp",
    description: "Share drawings, references and your project brief.",
    action: "Start Chat",
    href: site.whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    title: "Call",
    description: "Speak with our team.",
    action: site.phone,
    href: site.phoneHref,
    icon: Phone,
  },
  {
    title: "Visit",
    description: "Office No 9, 1st Floor, 5207, Al Malqa, Riyadh.",
    action: "Get directions",
    href: site.address.mapsHref,
    icon: MapPin,
    external: true,
  },
];

export const currentLocation = {
  title: "Riyadh Office",
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.4!2d46.64!3d24.79!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ3JzI0LjAiTiA0NsKwMzgnMjQuMCJF!5e0!3m2!1sen!2ssa!4v1700000000000!5m2!1sen!2ssa",
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
  email: string;
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
    email: site.email,
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
