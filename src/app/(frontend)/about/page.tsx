import type { Metadata } from "next";

import { AboutCta, AboutFaq } from "@/components/about/about-closing";
import {
  AboutCompliance,
  AboutObjectives,
} from "@/components/about/about-delivery";
import { AboutHero } from "@/components/about/about-hero";
import {
  AboutAudiences,
  AboutIndustries,
} from "@/components/about/about-industries";
import {
  AboutOverview,
  AboutPartners,
} from "@/components/about/about-overview";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Practical planning, fabrication and site coordination for modular, portable and steel solutions in Riyadh.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutPartners />
      <AboutOverview />
      <AboutIndustries />
      <AboutAudiences />
      <AboutObjectives />
      <AboutCompliance />
      <AboutFaq />
      <AboutCta />
    </>
  );
}
