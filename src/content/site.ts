export const site = {
  name: "MahrajArabia",
  shortName: "Mahraj Arabia",
  tagline: "Modular, portable & steel solutions",
  description:
    "Practical modular buildings, portable facilities and custom steel fabrication for projects across Saudi Arabia.",
  url: "https://m-arabia.vercel.app",
  phone: "+966 55 434 6336",
  phoneHref: "tel:+966554346336",
  email: "info@mahrajarabia.com",
  salesEmail: "info@mahrajarabia.com",
  whatsapp: "https://wa.me/966554346336",
  address: {
    line1: "Office No 9, 1st Floor",
    line2: "5207, Al Malqa, Riyadh",
    line3: "Saudi Arabia",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Office+No+9+1st+Floor+5207+Al+Malqa+Riyadh",
  },
  social: [
    { label: "WhatsApp", href: "https://wa.me/966554346336" },
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
  { label: "Industries", href: "/industries" },
  { label: "Insights", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
