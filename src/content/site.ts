export const site = {
  name: "MahrajArabia",
  shortName: "Mahraj Arabia",
  tagline: "Modular spaces. Steel built.",
  description:
    "Modular, portable, fencing and steel solutions for construction, events and industrial sites across Saudi Arabia.",
  url: "https://m-arabia.vercel.app",
  phone: "+966 56 602 1891",
  phoneHref: "tel:+966566021891",
  phones: [
    { label: "KSA", number: "+966 56 602 1891", href: "tel:+966566021891", whatsapp: "https://wa.me/966566021891" },
    { label: "UAE", number: "+971 50 882 2414", href: "tel:+971508822414", whatsapp: "https://wa.me/971508822414" },
  ],
  email: "Waseem@mahraj.com",
  salesEmail: "KSAevents@mahraj.com",
  emails: ["Waseem@mahraj.com", "KSAevents@mahraj.com"],
  whatsapp: "https://wa.me/966566021891",
  address: {
    line1: "Building 5207, Street 392",
    line2: "Al Malqa District, Riyadh 13525",
    line3: "Saudi Arabia",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Building+5207%2C+Street+392%2C+Al+Malqa+District%2C+Riyadh+13525%2C+Saudi+Arabia",
  },
  social: [
    { label: "Instagram", href: "https://www.instagram.com/mahrajarabia" },
    { label: "Facebook", href: "https://www.facebook.com/mahrajarabia" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/mahrajarabia" },
  ],
} as const;

export type NavLink = {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
};

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasMegaMenu: true },
  { label: "Projects", href: "/projects" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blogs", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
