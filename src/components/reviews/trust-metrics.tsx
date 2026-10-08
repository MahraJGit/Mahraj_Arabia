import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { trustMetrics } from "@/content/reviews";
import { cardGridClass, cardGridItemClass, cn } from "@/lib/utils";

export function TrustMetrics() {
  return (
    <Section tone="alt">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Proof points
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Numbers that speak for themselves.
        </h2>
      </div>

      <ul className={`mt-10 ${cardGridClass} sm:grid-cols-2 lg:grid-cols-4`}>
        {trustMetrics.map(({ label, value, note, icon: Icon }, index) => (
          <li
            key={`${label}-${value}`}
            className={cn(cardGridItemClass, "flex flex-col px-5 py-8")}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-5 flex size-10 items-center justify-center bg-brand/10 text-brand">
              <Icon className="size-5" />
            </span>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-body">
              {label}
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-ink">
              {value}
            </p>
            <p className="mt-3 text-[0.6875rem] text-body">{note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Button asChild variant="brandOutline" size="xl">
          <a href="#industry-reviews">Read our reviews</a>
        </Button>
      </div>
    </Section>
  );
}
