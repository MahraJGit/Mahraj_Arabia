import { CoreServices } from "@/components/home/core-services";
import { SolutionCategories } from "@/components/home/solution-categories";
import { Hero } from "@/components/home/hero";
import { IndustriesGrid } from "@/components/home/industries-grid";
import { ProfileClosing } from "@/components/home/profile-closing";
import { ProfileToc } from "@/components/home/profile-toc";
import { RegionalPowerhouse } from "@/components/home/regional-powerhouse";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { TechnicalInsights } from "@/components/home/technical-insights";

export default function Home() {
  return (
    <>
      <Hero />
      <ProfileToc />
      <SolutionCategories />
      <IndustriesGrid />
      <CoreServices />
      <RegionalPowerhouse />
      <TechnicalInsights />
      <ProfileClosing />
      <TechnicalFaqForm />
    </>
  );
}
