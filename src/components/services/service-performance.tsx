import { Scissors } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { featuredCaseStudies, projects } from "@/content/home";
import type { ServiceDetailView } from "@/lib/public/services";

export function PerformanceMatrix({ service }: { service: ServiceDetailView }) {
  const title = service.performanceTitle.trim();
  const description = service.performanceDescription.trim();

  return (
    <Section>
      {title ? (
        <SectionHeading align="center" title={title} description={description || undefined} />
      ) : description ? (
        <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-body">
          {description}
        </p>
      ) : null}

      <div
        className={`grid gap-8 ${
          title || description ? "mt-10" : ""
        } ${
          service.brandingTitle || service.brandingDescription ? "lg:grid-cols-2" : ""
        }`}
      >
        <div>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[32rem] text-start text-sm">
              <thead className="bg-surface-alt text-xs uppercase tracking-[0.1em] text-body">
                <tr>
                  {service.performanceLabels.map((label, index) => (
                    <th key={index} className="px-5 py-4 text-start font-semibold">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {service.performanceRows.map((row, index) => (
                  <tr
                    key={row.useCase}
                    className={index % 2 === 0 ? "bg-background" : "bg-surface-alt"}
                  >
                    <th className="px-5 py-4 text-start font-semibold text-ink">
                      {row.useCase}
                    </th>
                    <td className="px-5 py-4 text-body">{row.recommended}</td>
                    <td className="px-5 py-4 font-medium text-brand">
                      {row.forceReduction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {service.density || service.warranty ? (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {service.density ? (
                <div className="rounded-md bg-surface-alt p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-body">Density</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{service.density}</p>
                </div>
              ) : null}
              {service.warranty ? (
                <div className="rounded-md bg-surface-alt p-5">
                  <p className="text-xs uppercase tracking-[0.12em] text-body">Warranty</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{service.warranty}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {service.brandingTitle || service.brandingDescription ? (
        <div className="rounded-md bg-surface-alt p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h3 className="text-2xl font-semibold text-ink">
                {service.brandingTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-body">
                {service.brandingDescription}
              </p>
              {service.brandColors.length ? (
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                  {service.brandColorLabel.trim() ? (
                    <p className="text-sm font-semibold text-ink">
                      {service.brandColorLabel}
                    </p>
                  ) : null}
                  <ul
                    className="flex flex-wrap items-center gap-3"
                    aria-label={service.brandColorLabel.trim() || "Available colours"}
                  >
                    {service.brandColors.map((color, index) => (
                      <li key={`${color.hex}-${index}`}>
                        <span
                          className={`block size-9 rounded-full ${
                            color.selected
                              ? "ring-2 ring-brand ring-offset-2 ring-offset-surface-alt"
                              : "border border-black/10"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <Scissors className="size-12 shrink-0 text-ink" />
          </div>
        </div>
        ) : null}
      </div>
    </Section>
  );
}

export function ServiceCaseStudies({
  service,
}: {
  service: ServiceDetailView;
}) {
  const title = service.caseStudiesTitle.trim();
  const description = service.caseStudiesDescription.trim();
  if (!title && !description) return null;

  return (
    <Section tone="alt">
      {title ? (
        <SectionHeading title={title} description={description || undefined} />
      ) : (
        <p className="max-w-2xl text-base leading-relaxed text-body">{description}</p>
      )}

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {featuredCaseStudies.map((study, index) => {
          const project = projects[index];

          return (
            <li
              key={study.slug}
              className="overflow-hidden rounded-md border border-border bg-background"
            >
              <Media
                src={project.image}
                alt={study.title}
                className="aspect-4/3"
                sizes="(min-width: 768px) 30vw, 90vw"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-ink">{study.title}</h3>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="font-heading text-lg font-semibold text-ink">
                    {study.price}
                  </p>
                  <p className="text-xs text-body">{study.meta}</p>
                </div>
                {/* View detail CTA removed at client request.
                <Button asChild variant="brand" size="lg" className="mt-5 w-full">
                  <Link href={`/projects/${project.slug}`}>
                    View Project Details
                  </Link>
                </Button>
                */}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
