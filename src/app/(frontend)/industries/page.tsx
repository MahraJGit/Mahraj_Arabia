import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "@/components/layout/section";
import { industries } from "@/content/home";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Modular, portable, fencing and steel solutions for construction, industrial, commercial, events, infrastructure and institutional projects.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        title="Solutions across project settings."
        description="Flexible modular, fencing and steel solutions for temporary, permanent and evolving operational needs."
        image="/images/services/landscaping-outdoor-industry.png"
        eyebrow="Project settings"
        breadcrumb={[{ label: "Industries", href: "/industries" }]}
      />
      <Section>
        <Stagger className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {industries.map(({ slug, label, icon: Icon }, index) => (
            <StaggerItem key={slug} className="bg-background">
              <Link
                href={`/industries/${slug}`}
                className="flex h-full flex-col items-start justify-between gap-10 px-4 py-6 transition-colors hover:bg-surface-alt sm:px-5 sm:py-8"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <Icon className="size-6 text-brand" />
                  <span className="mt-4 block text-sm font-semibold text-ink">
                    {label}
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
      <ProfileClosingCta
        title="Tell us your project setting."
        description="Construction, events, industrial or commercial—share the brief and we will recommend a fitting Mahraj Arabia solution."
      />
    </>
  );
}
