import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { whyChooseIntro, whyChooseItems } from "@/content/reviews";
import { cardGridClass, cardGridItemClass, cn } from "@/lib/utils";

export function WhyClientsChoose() {
  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Client confidence
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {whyChooseIntro.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          {whyChooseIntro.description}
        </p>
      </div>

      <ul className={`mt-10 ${cardGridClass} sm:grid-cols-2 lg:grid-cols-4`}>
        {whyChooseItems.map((item, index) => (
          <li
            key={`${item.subtitle}-${index}`}
            className={cn(
              cardGridItemClass,
              "group min-h-44 p-6 transition-colors hover:bg-brand"
            )}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand transition-colors group-hover:text-white/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-5 text-sm font-semibold text-ink transition-colors group-hover:text-white">
              {item.title}
            </p>
            <p className="mt-2 text-xs text-body transition-colors group-hover:text-white/80">
              {item.subtitle}
            </p>
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
