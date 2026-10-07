import { Section } from "@/components/layout/section";
import { aboutCompliance, aboutObjectives } from "@/content/about";

export function AboutObjectives() {
  return (
    <Section tone="alt">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Why Mahraj Arabia
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Why clients choose Mahraj Arabia.
        </h2>
      </div>
      <ul className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {aboutObjectives.map(({ title, description, icon: Icon }) => (
          <li
            key={title}
            className="group min-h-56 bg-background p-7 transition-colors hover:bg-brand hover:text-white"
          >
            <span className="flex size-9 items-center justify-center bg-brand/10 text-brand transition-colors group-hover:bg-white/15 group-hover:text-white">
              <Icon className="size-4" />
            </span>
            <h3 className="mt-5 text-base font-semibold text-ink transition-colors group-hover:text-white">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-body transition-colors group-hover:text-white">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AboutCompliance() {
  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Quality
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Excellence starts with your requirements.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          Every solution is backed by practical planning and controlled
          fabrication—from design through handover.
        </p>
      </div>

      <ul className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {aboutCompliance.map(({ title, icon: Icon }, index) => (
          <li key={title} className="bg-background p-6">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-4 flex size-9 items-center justify-center bg-brand/10 text-brand">
              <Icon className="size-4" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
          </li>
        ))}
      </ul>
    </Section>
  );
}
