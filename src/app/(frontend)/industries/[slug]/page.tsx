import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHero } from "@/components/layout/page-hero";
import { industries } from "@/content/home";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);

  if (!industry) return {};

  return {
    title: `${industry.label} Solutions`,
    description: `Modular, portable and steel solutions for ${industry.label.toLowerCase()} projects in Riyadh and across Saudi Arabia.`,
  };
}

export default async function IndustryDetailPage({
  params,
}: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);

  if (!industry) notFound();

  return (
    <>
      <PageHero
        title={`Solutions for ${industry.label}`}
        description={`Capabilities planned around the operational demands of ${industry.label.toLowerCase()} projects.`}
        breadcrumb={[
          { label: "Industries", href: "/industries" },
          { label: industry.label, href: `/industries/${industry.slug}` },
        ]}
        image="/images/advantage-installation.jpg"
        eyebrow="Project settings"
      />
      <ComingSoon note="Sector-specific guidance, recommended systems, and reference projects are being prepared for this industry." />
    </>
  );
}
