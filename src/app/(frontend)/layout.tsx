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
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "Oh8b9pGayDL5jHGQAcKAFjAwqM4RfA8CBwUjkc2Rxxc",
    other: {
      "msvalidate.01": "299FAE1AF622D46FAD10E7C7AA2E8DC4",
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/brand/mahraj-mark.png", type: "image/png" }],
    apple: [{ url: "/brand/mahraj-mark.png", type: "image/png" }],
    shortcut: ["/brand/mahraj-mark.png"],
  },
  openGraph: {
    title: `${site.name} | Modular, Portable & Steel Solutions in Riyadh`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_SA",
    type: "website",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: site.name,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Modular, Portable & Steel Solutions in Riyadh`,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
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
