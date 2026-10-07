import { Section } from "@/components/layout/section";
import {
  projectExperienceIntro,
  projectExperienceSteps,
} from "@/content/reviews";

export function ProjectExperience() {
  return (
    <Section tone="alt">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Delivery path
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {projectExperienceIntro.title}
        </h2>
      </div>

      <ol className="mt-12 grid gap-0 border-y border-border sm:grid-cols-2">
        {projectExperienceSteps.map((step) => (
          <li
            key={step.number}
            className="border-border px-1 py-8 sm:border-e sm:px-6 sm:odd:border-e sm:[&:nth-child(2n)]:border-e-0"
          >
            <p className="font-heading text-5xl font-semibold tracking-tight text-brand/20">
              {step.number}
            </p>
            <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
