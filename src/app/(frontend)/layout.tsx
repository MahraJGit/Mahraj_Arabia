import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import { HashScroll } from "@/components/layout/hash-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/content/site";
import { getServiceMegaMenu } from "@/lib/public/services";
import "../globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Modular, Portable & Steel Solutions in Riyadh`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Mahraj Arabia",
    "modular buildings Saudi Arabia",
    "porta cabins Riyadh",
    "parking shades",
    "steel fabrication Riyadh",
    "portable site offices",
    "custom steel structures",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const megaMenu = await getServiceMegaMenu();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background text-body"
        suppressHydrationWarning
      >
        <JsonLd />
        <HashScroll />
        <SiteHeader megaMenu={megaMenu} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
