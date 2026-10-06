import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
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
          <Link href="/services">View all categories</Link>
        </Button>
      </div>
    </Section>
  );
}

export function ServiceOverview({ service }: { service: ServiceDetailView }) {
  return (
    <Section tone="alt">
      <div className="grid items-center gap-10 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Media
          src={service.overviewImage}
          alt={`${service.title} installation`}
          className="aspect-4/3 rounded-md"
          sizes="20rem"
        />
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {service.overviewTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-body sm:text-base">
            {service.overviewDescription}
          </p>
          <Button asChild variant="brand" size="xl" className="mt-7">
            <Link href="/contact#get-in-touch">View Installation</Link>
          </Button>
        </div>
      </div>
    </Section>
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
