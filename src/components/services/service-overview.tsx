import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { solutionStories } from "@/content/solution-stories";
import { highlightIcon } from "@/lib/services/highlight-icons";
import type {
  ServiceCard,
  ServiceDetailView,
} from "@/lib/public/services";

export function ExploreServices({
  related,
}: {
  service: ServiceDetailView;
  related: ServiceCard[];
}) {
  return (
    <Section tone="alt">
      <SectionHeading
        eyebrow="Our solutions"
        align="center"
        title="Explore Our Solutions"
      />

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {related.map((item) => (
          <li
            key={item.slug}
            className="overflow-hidden rounded-md border border-border bg-background"
          >
            <Media
              src={item.image}
              alt={item.imageAlt}
              className="aspect-16/10"
              sizes="(min-width: 768px) 30vw, 90vw"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-body">
                {item.excerpt}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                Explore Solution
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="brandOutline" size="xl">
          <Link href="/services">View all solutions</Link>
        </Button>
      </div>
    </Section>
  );
}

export function ServiceOverview({ service }: { service: ServiceDetailView }) {
  const story = solutionStories.find(
    (item) => item.href === `/services/${service.slug}`
  );
  const title = story?.title ?? service.overviewTitle;
  const description = story?.description ?? service.overviewDescription;
  const points =
    story?.points ?? service.applications[0]?.points.slice(0, 3) ?? [];
  const cta = story?.cta ?? "Request a quotation";

  if (!title && !description) return null;

  return (
    <section className="border-y border-border bg-background">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:order-1 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {service.title}
          </p>
          <h2 className="mt-3 max-w-md font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-md text-base leading-relaxed text-body">
              {description}
            </p>
          ) : null}

          {points.length > 0 ? (
            <ul className="mt-7 max-w-md space-y-3 border-t border-border pt-7">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm leading-snug text-ink sm:text-[0.9375rem]"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8">
            <Button asChild variant="brand" size="lg">
              <Link href="/contact#quote-form">
                {cta}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[18rem] bg-surface-alt sm:min-h-[22rem] lg:order-2 lg:min-h-[28rem]">
          <Media
            src={story?.image || service.overviewImage || service.image}
            alt={service.title}
            className="absolute inset-0 size-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

export function ServiceGuide({ service }: { service: ServiceDetailView }) {
  return (
    <Section>
      <SectionHeading
        align="center"
        title={service.guideTitle}
        description={service.guideDescription}
      />

      <ul className="mt-10 grid overflow-hidden rounded-md border border-border md:grid-cols-3">
        {service.applications.map((application, index) => {
          const Icon = highlightIcon(application.icon, index);

          return (
            <li
              key={application.title}
              className="group border-b border-border bg-surface-alt p-7 transition-colors last:border-b-0 hover:bg-brand hover:text-white md:border-b-0 md:border-e md:last:border-e-0"
            >
              <Icon className="size-6 text-brand transition-colors group-hover:text-white" />
              <h3 className="mt-5 text-lg font-semibold text-ink transition-colors group-hover:text-white">
                {application.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-body transition-colors group-hover:text-white/75">
                {application.description}
              </p>
              <ul className="mt-5 space-y-2 text-xs text-body transition-colors group-hover:text-white/75">
                {application.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-brand group-hover:bg-white" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
