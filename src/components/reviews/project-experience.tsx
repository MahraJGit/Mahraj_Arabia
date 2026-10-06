import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import {
  projectExperienceIntro,
  projectExperienceSteps,
} from "@/content/reviews";

export function ProjectExperience() {
  return (
    <Section tone="alt">
      <SectionHeading align="center" title={projectExperienceIntro.title} />

      <ul className="mt-12 grid gap-10 sm:grid-cols-2">
        {projectExperienceSteps.map((step) => (
          <li key={step.number} className="flex gap-5">
            <span
              aria-hidden
              className="font-heading text-5xl font-bold leading-none sm:text-6xl"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 15%, white) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {step.number}
            </span>
            <div className="pt-1">
              <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
