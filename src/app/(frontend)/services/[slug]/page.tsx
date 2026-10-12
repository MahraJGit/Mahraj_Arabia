import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticleBody } from "@/components/blog/blog-article";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { Section } from "@/components/layout/section";
import { ServiceHero } from "@/components/services/service-hero";
import {
  ExploreServices,
  ServiceCaseStudies,
  ServiceGuide,
} from "@/components/services/service-overview";
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
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.excerpt,
    keywords: service.focusKeyword || undefined,
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const faqJsonLd =
    service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <ServiceHero service={service} />

      <ServiceGuide service={service} />

      <ServiceCaseStudies service={service} />

      <Section>
        <article className="w-full rounded-md border border-border bg-background p-6 sm:p-8 lg:p-10">
          {service.tags.length > 0 ? (
            <ul className="mb-6 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-body"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <BlogArticleBody data={service.content} mediaById={{}} fullWidth />
        </article>
      </Section>

      {service.related.length > 0 ? (
        <ExploreServices service={service} related={service.related} />
      ) : null}

      {service.faqs.length > 0 ? (
        <TechnicalFaqForm
          formIdPrefix={`service-${service.slug}`}
          faqs={service.faqs}
          faqIntro={service.faqIntro || "Planning your project."}
        />
      ) : null}
    </>
  );
}
