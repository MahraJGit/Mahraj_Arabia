import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHero } from "@/components/layout/page-hero";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { ServiceHero } from "@/components/services/service-hero";
import {
  ExploreServices,
  ServiceGuide,
  ServiceOverview,
} from "@/components/services/service-overview";
import {
  PerformanceMatrix,
  ServiceCaseStudies,
} from "@/components/services/service-performance";
import { OngoingProjects, ServiceProcess, SpaceRequirements } from "@/components/services/service-support";
import {
  getServiceBySlug,
  getServiceSlugs,
} from "@/lib/public/services";

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return {};

  return {
    title: service.seoTitle,
    description: service.seoDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  if (service.detailReady) {
    return (
      <>
        <ServiceHero service={service} />
        {service.related.length > 0 ? (
          <ExploreServices service={service} related={service.related} />
        ) : null}
        {service.overviewTitle || service.overviewDescription ? (
          <ServiceOverview service={service} />
        ) : null}
        {service.applications.length > 0 || service.guideTitle || service.guideDescription ? (
          <ServiceGuide service={service} />
        ) : null}
        {service.showPerformanceMatrix && service.performanceRows.length > 0 ? (
          <PerformanceMatrix service={service} />
        ) : null}
        {service.caseStudiesTitle || service.caseStudiesDescription ? (
          <ServiceCaseStudies service={service} />
        ) : null}
        {service.showSpaceRequirements && service.spaceRows.length > 0 ? (
          <SpaceRequirements service={service} />
        ) : null}
        {service.projectsTitle || service.projectsDescription ? (
          <OngoingProjects service={service} />
        ) : null}
        {service.showProcess &&
        (service.processTitle || service.processDescription || service.processSteps.length > 0) ? (
          <ServiceProcess service={service} />
        ) : null}
        <TechnicalFaqForm
          formIdPrefix={`service-${service.slug}`}
          faqs={service.faqs}
          faqIntro={service.faqIntro}
        />
      </>
    );
  }

  return (
    <>
      <PageHero
        title={service.title}
        description={service.excerpt}
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />
      <ComingSoon note="More detail for this service is being prepared." />
    </>
  );
}
