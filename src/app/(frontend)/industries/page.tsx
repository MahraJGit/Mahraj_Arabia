import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { industries } from "@/content/home";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Modular, portable and steel solutions for construction, industrial, commercial, events, infrastructure and institutional projects.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        title="Industries We Serve"
        description="Flexible solutions for temporary, permanent and evolving operational needs across demanding environments."
      />
      <Section>
        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {industries.map(({ slug, label, icon: Icon }) => (
            <StaggerItem key={slug}>
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-md border border-border bg-background px-4 py-7 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-sm motion-reduce:hover:translate-y-0">
                <Icon className="size-6 text-brand" />
                <span className="text-sm font-medium text-ink">{label}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
