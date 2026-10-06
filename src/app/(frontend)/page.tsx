import { CoreServices } from "@/components/home/core-services";
import { FeaturedCaseStudies } from "@/components/home/featured-case-studies";
import { FlooringCategories } from "@/components/home/flooring-categories";
import { Hero } from "@/components/home/hero";
import { IndustriesGrid } from "@/components/home/industries-grid";
import { RegionalPowerhouse } from "@/components/home/regional-powerhouse";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { TechnicalInsights } from "@/components/home/technical-insights";

export default function Home() {
  return (
    <>
      <Hero />
      <FlooringCategories />
      <CoreServices />
      <FeaturedCaseStudies />
      <IndustriesGrid />
      <RegionalPowerhouse />
      <TechnicalInsights />
      <TechnicalFaqForm />
    </>
  );
}
