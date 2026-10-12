import {
  Building2,
  FileCheck2,
  Handshake,
  Ruler,
  Truck,
} from "lucide-react";

import { Section } from "@/components/layout/section";
import type { ServiceDetailView } from "@/lib/public/services";

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
