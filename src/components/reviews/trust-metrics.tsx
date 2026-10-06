import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { trustMetrics } from "@/content/reviews";

export function TrustMetrics() {
  return (
    <Section tone="alt">
      <SectionHeading
        align="center"
        title="Numbers That Speak for Themselves"
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustMetrics.map(({ label, value, note, icon: Icon }) => (
          <li
            key={`${label}-${value}`}
            className="flex flex-col items-center rounded-md border border-border bg-background px-5 py-7 text-center"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Icon className="size-5" />
            </span>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-body">
              {label}
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-ink">
              {value}
            </p>
            <p className="mt-3 text-[0.6875rem] text-body">{note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="brandOutline" size="xl">
          <a href="#industry-reviews">Read our Reviews</a>
        </Button>
      </div>
    </Section>
  );
}
