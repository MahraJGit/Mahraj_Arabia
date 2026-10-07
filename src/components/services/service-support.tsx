import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  FileCheck2,
  Handshake,
  Ruler,
  Truck,
  UserRound,
} from "lucide-react";

import { QuoteForm } from "@/components/home/quote-form";
import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/home";
import type { ServiceDetailView } from "@/lib/public/services";

const advisors = [
  { name: "Jerome Bell", role: "General Manager" },
  { name: "Darrell Steward", role: "Business Developer" },
  { name: "Robert Fox", role: "Technical Developer" },
];

export function ServiceAdvisory() {
  return (
    <Section>
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">Expert Advisory</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-body sm:text-base">
            Our technical team supports layout planning, specification guidance,
            fabrication options and installation recommendations for every
            project.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {advisors.map((advisor) => (
              <li
                key={advisor.name}
                className="overflow-hidden rounded-md bg-brand/10 text-center"
              >
                <span className="mx-auto mt-5 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <UserRound className="size-6" />
                </span>
                <div className="mt-4 bg-brand px-3 py-3 text-white">
                  <h3 className="text-sm font-semibold text-white">
                    {advisor.name}
                  </h3>
                  <p className="mt-1 text-[0.6875rem] text-white/80">
                    {advisor.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <QuoteForm />
      </div>
    </Section>
  );
}

export function SpaceRequirements({
  service,
}: {
  service: ServiceDetailView;
}) {
  const title = service.spaceTitle.trim();
  const description = service.spaceDescription.trim();

  return (
    <Section>
      {title ? (
        <SectionHeading align="center" title={title} description={description || undefined} />
      ) : description ? (
        <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-body">
          {description}
        </p>
      ) : null}

      <div className={`overflow-x-auto rounded-md border border-border ${title || description ? "mt-10" : ""}`}>
        <table className="w-full min-w-[48rem] text-sm">
          <thead className="bg-surface-alt text-xs uppercase tracking-[0.1em] text-body">
            <tr>
              {service.spaceLabels.map((heading, index) => (
                <th key={index} className="px-5 py-4 text-start font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {service.spaceRows.map((row, index) => {
              const cells = [
                row.useCase,
                row.recommended,
                row.impact,
                row.slip,
                row.acoustic,
                row.maintenance,
              ];

              return (
                <tr
                  key={row.useCase}
                  className={index % 2 === 0 ? "bg-background" : "bg-surface-alt"}
                >
                  {cells.map((cell, cellIndex) => (
                    <td
                      key={`${row.useCase}-${cell}`}
                      className={`px-5 py-4 ${
                        cellIndex === 0 ? "font-semibold text-ink" : "text-body"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export function TechnicalResources() {
  return (
    <>
      <Section tone="alt">
        <SectionHeading
          align="center"
          title="Architectural & Technical Resources"
        />
        <div className="mt-10 grid overflow-hidden rounded-md bg-background md:grid-cols-2">
          {["Download Data Sheet", "Specification & Sample Support"].map(
            (title, index) => (
              <div
                key={title}
                className="border-b border-border p-7 last:border-b-0 md:border-b-0 md:border-e md:last:border-e-0"
              >
                <h3 className="text-xl font-semibold text-ink">{title}</h3>
                <ul className="mt-5 space-y-3">
                  {[
                    "Technical data and test values",
                    "Installation and preparation guidance",
                    "Finish and colour references",
                    "Warranty and care information",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-body"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="mt-6"
                >
                  <Link href={index === 0 ? "/catalogues" : "/contact"}>
                    {index === 0 ? "Request Sample" : "View further info"}
                  </Link>
                </Button>
              </div>
            )
          )}
        </div>
      </Section>

      <Section tone="brand" spacing="compact">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-white">
              Site coordination & technical standards
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
              Access, utilities, foundation readiness and installation sequencing
              are planned as part of every modular, portable and steel delivery.
            </p>
          </div>
          <Media
            src="/images/profile/modular-crane-install.png"
            alt="Modular unit installation on site"
            className="aspect-16/7 rounded-md"
            sizes="(min-width: 768px) 45vw, 90vw"
          />
        </div>
      </Section>
    </>
  );
}

const processIcons = [Building2, Ruler, FileCheck2, Handshake, Truck];

const stepDescriptions: Record<string, string> = {
  Understand: "Clarify the purpose, site and project requirements.",
  Configure: "Shape a practical solution around the brief.",
  Fabricate: "Deliver quality fabrication for the agreed scope.",
  Install: "Coordinate reliable installation for the project.",
};

export function ServiceProcess({ service }: { service: ServiceDetailView }) {
  const title = service.processTitle.trim();
  const description = service.processDescription.trim();
  const steps = service.processSteps
    .map((step) => step.label.trim())
    .filter(Boolean);
  if (!title && !description && steps.length === 0) return null;

  return (
    <Section>
      <div className="max-w-3xl">
        {title ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              A connected process
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h2>
          </>
        ) : null}
        {description ? (
          <p
            className={`text-base leading-relaxed text-body ${title ? "mt-4" : ""}`}
          >
            {description}
          </p>
        ) : null}
      </div>

      {steps.length > 0 ? (
        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[2.75rem] end-0 start-0 hidden h-px bg-brand/70 lg:block"
          />
          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((label, index) => {
              const Icon = processIcons[index % processIcons.length];
              const detail = stepDescriptions[label];
              return (
                <li
                  key={`${label}-${index}`}
                  className="bg-surface-alt px-5 py-6"
                >
                  <p className="text-sm font-semibold tracking-wide text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 flex items-center gap-2 text-base font-semibold text-ink">
                    <Icon className="size-4 text-brand" />
                    {label}
                  </h3>
                  {detail ? (
                    <p className="mt-2 text-sm leading-relaxed text-body">
                      {detail}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </Section>
  );
}

export function OngoingProjects({ service }: { service: ServiceDetailView }) {
  const title = service.projectsTitle.trim();
  const description = service.projectsDescription.trim();
  if (!title && !description) return null;

  return (
    <Section tone="alt">
      {title ? (
        <SectionHeading
          align="center"
          title={title}
          description={description || undefined}
        />
      ) : (
        <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-body">
          {description}
        </p>
      )}
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {projects.map((project) => (
          <li
            key={project.slug}
            className="overflow-hidden rounded-md border border-border bg-background"
          >
            <Media
              src={project.image}
              alt={project.title}
              className="aspect-4/3"
              sizes="(min-width: 768px) 30vw, 90vw"
            />
            <div className="p-5">
              <h3 className="text-base font-semibold text-ink">
                Project: {project.title}
              </h3>
              {/* View detail CTA removed at client request.
              <Link
                href={`/projects/${project.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                View Detail
                <ArrowRight className="size-4" />
              </Link>
              */}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
