import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  FileCheck2,
  ShieldCheck,
  Star,
  Users,
  HardHat,
  Repeat,
  Headset,
  type LucideIcon,
} from "lucide-react";

export const reviewsHero = {
  image: "/images/profile/modular-offices-parking.jpg",
  title: "What Our Clients Say About Us",
  description:
    "Real feedback from businesses and project teams who trusted us for modular, portable and steel solutions.",
};

type HeroMetric = {
  kind: "rating" | "stat" | "verified";
  value: string;
  label: string;
};

export const heroMetrics: HeroMetric[] = [
  {
    kind: "stat",
    value: "150+",
    label: "Completed Projects",
  },
  {
    kind: "stat",
    value: "Riyadh",
    label: "Saudi Focus",
  },
  {
    kind: "stat",
    value: "98%",
    label: "Client Satisfaction Rate",
  },
];

export type TrustMetric = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
};

export const trustMetrics: TrustMetric[] = [
  {
    label: "Average Client Rating",
    value: "4.8",
    note: "Based on verified client reviews",
    icon: Star,
  },
  {
    label: "Industries Served",
    value: "6+",
    note: "Construction to events and institutions",
    icon: Building2,
  },
  {
    label: "Site Teams",
    value: "40+",
    note: "Trained professionals on every project",
    icon: HardHat,
  },
  {
    label: "Returning Clients",
    value: "72%",
    note: "Clients who came back for more",
    icon: Users, // Or use `Repeat`
  },
  {
    label: "Safety Focus",
    value: "100%",
    note: "Planning aligned to site and programme needs",
    icon: ShieldCheck,
  },
  {
    label: "Warranty Support",
    value: "Project based",
    note: "Coverage confirmed in project documents",
    icon: BadgeCheck,
  },
  {
    label: "Quality Focus",
    value: "Controlled fab",
    note: "Dependable fabrication and coordination",
    icon: Award,
  },
  {
    label: "After Sales Support",
    value: "WhatsApp",
    note: "Help is available whenever you need it",
    icon: Headset,
  },
];

export type WhyChooseItem = {
  title: string;
  subtitle: string;
};

export const whyChooseIntro = {
  title: "Why Clients Trust Mahraj Arabia",
  description: "Reliable modular and steel solutions, professional service, and scope built around your needs.",
};

export const whyChooseItems: WhyChooseItem[] = [
  { title: "Practical Design", subtitle: "Layouts shaped for daily use" },
  { title: "Professional Installation", subtitle: "Coordinated site delivery" },
  { title: "Expert Guidance", subtitle: "Clear project advice" },
  { title: "Site Assessment ", subtitle: "Thorough site evaluation" },
  { title: "Clear Process", subtitle: "Simple project planning" },
  { title: "Reliable Aftercare", subtitle: "Ongoing support" },
  { title: "Versatile Solutions", subtitle: "Modular and steel options" },
  { title: "Saudi Experience", subtitle: "Riyadh project focus"},
];

export type IndustryReview = {
  industry: string;
  name: string;
  rating: string;
  quote: string;
  projectImage: string;
  extraViews: number;
};

export const industryReviewFilters = [
  "Construction",
  "Industrial",
  "Commercial",
  "Events",
  "Infrastructure",
  "Institutional",
  "Sites",
];

export const industryReviews: IndustryReview[] = [
  {
    industry: "Construction",
    name: "Faisal Al-Harbi",
    rating: "4.9",
    quote:
      "We needed site offices that matched our programme. Delivery and installation stayed coordinated without slowing the main works.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Construction",
    name: "Khalid Al-Thani",
    rating: "5.0",
    quote:
      "We compared three vendors before choosing Mahraj Arabia. Pricing was clear, and we never felt pushed into extras we did not need.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Construction",
    name: "Ahmed Al-Kuwari",
    rating: "4.8",
    quote:
      "Our previous cabins wore out quickly. These porta cabins are still holding up well despite heavy daily site traffic.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 2,
  },
  {
    industry: "Construction",
    name: "Nasser Al Rashid",
    rating: "5.0",
    quote:
      "The installation team arrived on time every day and left the compound tidy. That level of care honestly surprised us.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 2,
  },
  {
    industry: "Construction",
    name: "Saeed Al-Mazrouei",
    rating: "4.9",
    quote:
      "We had plenty of questions before deciding, and the team answered every one without rushing the brief.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Industrial",
    name: "Abdulrahman Al-Qahtani",
    rating: "4.9",
    quote:
      "Hundreds of staff use these facilities every day, and after months of operation the modular units still look well maintained.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 1,
  },
  {
    industry: "Industrial",
    name: "Sara Al-Khalifa",
    rating: "5.0",
    quote:
      "Timing could not have been better. They completed installation during our planned shutdown window with no disruption to operations.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 1,
  },
  {
    industry: "Industrial",
    name: "Rashid Al-Hajri",
    rating: "4.8",
    quote:
      "We were coordinating multiple compounds at once, but the team kept drawings, fabrication and delivery organised.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 1,
  },
  {
    industry: "Industrial",
    name: "Noor Al-Marri",
    rating: "5.0",
    quote:
      "They did not push the most expensive option. They understood our budget and gave practical steel and modular choices.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 1,
  },
  {
    industry: "Industrial",
    name: "Yousef Al-Mutairi",
    rating: "4.8",
    quote:
      "The new modular offices made the compound feel more professional, and the teams settled in quickly.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 1,
  },
  {
    industry: "Commercial",
    name: "Layla Al-Dosari",
    rating: "5.0",
    quote:
      "Our parking shades needed to look clean and still handle heavy daily use. The finished canopy did both.",
    projectImage: "/images/profile/car-parking-shades.jpg",
    extraViews: 2,
  },
  {
    industry: "Commercial",
    name: "Omar Al-Harthy",
    rating: "4.9",
    quote:
      "Our campus stays busy around the clock. The team managed installation smoothly without affecting visitors.",
    projectImage: "/images/profile/car-parking-shades.jpg",
    extraViews: 2,
  },
  {
    industry: "Commercial",
    name: "Hessa Al-Sulaiti",
    rating: "4.8",
    quote:
      "We got a practical scope that looks professional and works for everyday operations—no unnecessary complexity.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Commercial",
    name: "Tariq Al-Naimi",
    rating: "5.0",
    quote:
      "We wanted the office compound to feel modern and welcoming. The modular fit-out gave us exactly that.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Commercial",
    name: "Maha Al-Kaabi",
    rating: "4.9",
    quote:
      "Foot traffic is high every day, but the facilities still look sharp months later. We have not seen premature wear.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 2,
  },
  {
    industry: "Events",
    name: "Bader Al-Shammari",
    rating: "5.0",
    quote:
      "Our exhibition deadline was extremely tight, but the temporary structures arrived and were installed on schedule.",
    projectImage: "/images/profile/event-tent-luxury.jpg",
    extraViews: 1,
  },
  {
    industry: "Events",
    name: "Noura Al-Ansari",
    rating: "4.9",
    quote:
      "The temporary setup pulled the whole venue together. It looked clean, felt professional and took pressure off our team.",
    projectImage: "/images/profile/event-tent-luxury.jpg",
    extraViews: 1,
  },
  {
    industry: "Events",
    name: "Hamad Al-Jaber",
    rating: "4.8",
    quote:
      "Event deadlines can be stressful, but the installation team stayed focused and kept everything moving.",
    projectImage: "/images/profile/event-tent-luxury.jpg",
    extraViews: 1,
  },
  {
    industry: "Events",
    name: "Reem Al-Mansouri",
    rating: "5.0",
    quote:
      "We only needed a temporary structure, but the finished look felt much more premium than we expected.",
    projectImage: "/images/profile/event-tent-luxury.jpg",
    extraViews: 1,
  },
  {
    industry: "Events",
    name: "Sultan Al-Otaibi",
    rating: "4.9",
    quote:
      "They worked around our rehearsal schedule and avoided conflicts with other contractors on site.",
    projectImage: "/images/catalogue/Sports.png",
    extraViews: 1,
  },
  {
    industry: "Infrastructure",
    name: "Ibrahim Al-Ghamdi",
    rating: "4.9",
    quote:
      "We thought fabrication and delivery would disrupt the corridor works, but the programme stayed clear and well managed.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 2,
  },
  {
    industry: "Infrastructure",
    name: "Fatima Al-Shehri",
    rating: "5.0",
    quote:
      "Matching new site facilities with existing compound standards was a concern. The team got finishes and layout right.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Infrastructure",
    name: "Majed Al-Qahtani",
    rating: "4.8",
    quote:
      "Everything was planned properly from the beginning. It never felt like the installation was rushed into the schedule.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 2,
  },
  {
    industry: "Infrastructure",
    name: "Aisha Al-Harbi",
    rating: "5.0",
    quote:
      "We wanted the space to feel practical and welcoming for site teams. The finished modular offices delivered that.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Infrastructure",
    name: "Waleed Al-Zahrani",
    rating: "4.9",
    quote:
      "Guests and inspectors walk through this compound daily, and the facilities still look fresh and organised.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 2,
  },
  {
    industry: "Institutional",
    name: "Dana Al-Mutawa",
    rating: "5.0",
    quote:
      "Training sessions continued during installation, and the team worked around our timetable without conflicts.",
    projectImage: "/images/projects/al-noor-specialist-hospital.jpg",
    extraViews: 1,
  },
  {
    industry: "Institutional",
    name: "Khalifa Al-Mansoori",
    rating: "4.8",
    quote:
      "Clear drawings, dependable fabrication and tidy handover—exactly what we needed for a campus environment.",
    projectImage: "/images/projects/al-noor-specialist-hospital.jpg",
    extraViews: 1,
  },
  {
    industry: "Institutional",
    name: "Hind Al-Ali",
    rating: "4.9",
    quote:
      "We appreciated honest recommendations on modular layouts instead of a one-size-fits-all package.",
    projectImage: "/images/profile/porta-cabin-site-office.png",
    extraViews: 1,
  },
  {
    industry: "Sites",
    name: "Saad Al-Rashidi",
    rating: "5.0",
    quote:
      "From brief to installation, communication stayed clear. Our site coordinators always knew what was arriving next.",
    projectImage: "/images/profile/steel-fabrication-workshop.jpg",
    extraViews: 2,
  },
  {
    industry: "Sites",
    name: "Lina Al-Farsi",
    rating: "4.9",
    quote:
      "The portable facilities arrived ready for use, and the installation team coordinated cleanly with our HSE requirements.",
    projectImage: "/images/profile/modular-office-complex.jpg",
    extraViews: 2,
  },
];

export const solutionFeedbackFilters = [
  "Porta Cabins",
  "Modular Offices",
  "Parking Shades",
  "Steel Structures",
  "Event Structures",
  "Custom Modular",
  "Site Facilities",
  "Police Barrier",
  "Heras Fence",
  "Corrugated Fence",
];

export type SolutionProject = {
  slug: string;
  title: string;
  location: string;
  category: string;
  image: string;
  rating: number;
};

export const solutionProjects: SolutionProject[] = [
  {
    slug: "porta-cabins-site-offices",
    title: "Porta Cabins and Site Offices",
    location: "Riyadh, KSA",
    category: "Porta Cabins",
    image: "/images/profile/porta-cabin-site-office.png",
    rating: 5,
  },
  {
    slug: "modular-offices-meeting-rooms",
    title: "Modular Offices and Meeting Rooms",
    location: "Riyadh, KSA",
    category: "Modular Offices",
    image: "/images/profile/porta-cabin-site-office.png",
    rating: 5,
  },
  {
    slug: "car-parking-shades",
    title: "Car Parking Shades",
    location: "Riyadh, KSA",
    category: "Parking Shades",
    image: "/images/profile/car-parking-shades.jpg",
    rating: 5,
  },
  {
    slug: "steel-structures-fabrication",
    title: "Steel Structures and Fabrication",
    location: "Riyadh, KSA",
    category: "Steel Structures",
    image: "/images/profile/steel-fabrication-workshop.jpg",
    rating: 4,
  },
  {
    slug: "event-tents-temporary-structures",
    title: "Event Tents and Temporary Structures",
    location: "Riyadh, KSA",
    category: "Event Structures",
    image: "/images/profile/event-tent-luxury.jpg",
    rating: 5,
  },
  {
    slug: "customized-modular-solutions",
    title: "Customized Modular Solutions",
    location: "Riyadh, KSA",
    category: "Custom Modular",
    image: "/images/profile/modular-office-complex.jpg",
    rating: 4,
  },
];

export const feedbackFormIntro = {
  title: "We'd Love to Hear From You",
  description: "Share your project details and experience, it helps us serve you and future clients better.",
};

export const trustedByIntro =
  "Trusted by Businesses, Consultants & Project Teams Across the GCC";

export const trustedByLogos = [
  "NEOM",
  "Aldar",
  "Emaar",
  "ADNOC",
  "SEHA",
  "Qatar Foundation",
];

export const projectExperienceIntro = {
  title: "The Journey Behind Every Great Review",
};

export const projectExperienceSteps = [
  {
    number: "01",
    title: "We Listen First",
    description:
      "Every project starts with real conversations about your space, budget, and goals, means no assumptions, no rushed pitches.",
  },
  {
    number: "02",
    title: "We Recommend Honestly",
    description:
      "Clients tell us they trust our advice because we explain trade-offs clearly instead of just pushing the priciest option.",
  },
  {
    number: "03",
    title: "We Deliver As Promised",
    description:
      "On-time delivery, clean job sites, and clear communication—the details our reviews mention again and again.",
  },
  {
    number: "04",
    title: "We Stay Available After",
    description:
      "Support doesn't end at handover. Many of our best reviews come from clients we've helped months later too.",
  },
];

export const reviewsFaqIntro =
  "Quick answers to the questions we hear most about modular solutions, steel fabrication, delivery, installation, and support.";

export const reviewsFaqs = [
  {
    question: "Can solutions be customized?",
    answer:
      "Yes. Dimensions, layout, finishes and services can be reviewed around the intended use and site.",
  },
  {
    question: "Can we review references before specifying?",
    answer:
      "Yes. Share your brief and we can discuss similar scopes, drawings and references—often quickly over WhatsApp.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Warranty coverage depends on product type and project scope. Our team confirms details during quotation and project documents.",
  },
  {
    question: "Can delivery and installation be included?",
    answer:
      "Yes, subject to site access, logistics and the agreed scope.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Getting a quote from Mahraj Arabia is simple—fill out our contact form, call, or message us on WhatsApp with your project brief.",
  },
];

export const reviewsCta = {
  image: "/images/profile/steel-fabrication-workshop.jpg",
  title: "Like What Our Clients Are Saying?",
  description: "Bring the same clarity, coordination and support to your next modular or steel project. Our team is ready to help you get started.",
};
