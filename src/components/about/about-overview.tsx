import { Target } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { aboutOverview, aboutPartners } from "@/content/about";

export function AboutPartners() {
  return (
    <Section spacing="compact">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {aboutPartners.map((partner) => (
          <li
            key={partner}
            className="flex h-14 items-center justify-center rounded border border-border px-4 text-center text-sm font-black italic tracking-tight text-ink/80"
          >
            {partner}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AboutOverview() {
  return (
    <Section tone="alt">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Media
          src={aboutOverview.image}
          alt="Mahraj Arabia modular project installation"
          className="aspect-[4/3] rounded-md"
          sizes="(min-width: 1024px) 46vw, 90vw"
        />

        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {aboutOverview.title}
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2">
            {aboutOverview.steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-medium leading-relaxed text-ink">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-md border border-border border-s-4 border-s-brand bg-background p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand">
              <Target className="size-4" />
              Our Promise
            </p>
            <p className="mt-3 text-sm leading-relaxed text-body">
              {aboutOverview.objective}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
