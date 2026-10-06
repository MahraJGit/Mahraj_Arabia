import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Outfit } from "next/font/google";

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
  title: {
    default: "Mahraj Arabia CMS",
    template: "%s · Mahraj Arabia CMS",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f6f7f8] font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
