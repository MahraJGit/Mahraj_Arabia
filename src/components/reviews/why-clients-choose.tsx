import { Star } from "lucide-react";

import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { whyChooseIntro, whyChooseItems } from "@/content/reviews";

function WhyCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="group flex h-full flex-col items-center rounded-md border border-border bg-background px-5 py-8 text-center transition-colors hover:border-brand hover:bg-brand">
      <Star className="size-8 fill-brand text-brand transition-colors group-hover:fill-white group-hover:text-white" />
      <p className="mt-4 text-sm font-semibold text-ink transition-colors group-hover:text-white">
        {title}
      </p>
      <p className="mt-1 text-xs text-body transition-colors group-hover:text-white/80">
        {subtitle}
      </p>
    </div>
  );
}

export function WhyClientsChoose() {
  const topRow = whyChooseItems.slice(0, 4);
  const bottomRow = whyChooseItems.slice(4);

  return (
    <Section>
      <SectionHeading
        align="center"
        title={whyChooseIntro.title}
        description={whyChooseIntro.description}
      />

      <div className="mt-10 space-y-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topRow.map((item, index) => (
            <li key={`${item.subtitle}-${index}`}>
              <WhyCard title={item.title} subtitle={item.subtitle} />
            </li>
          ))}
        </ul>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bottomRow.map((item, index) => (
            <li key={`${item.subtitle}-${index + 4}`}>
              <WhyCard title={item.title} subtitle={item.subtitle} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="brandOutline" size="xl">
          <a href="#industry-reviews">Read our Reviews</a>
        </Button>
      </div>
    </Section>
  );
}
