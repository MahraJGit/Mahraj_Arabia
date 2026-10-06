import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { aboutAudiences, aboutIndustries } from "@/content/about";
import { cn } from "@/lib/utils";

const industrySpanClass = {
  small: "sm:col-span-1 sm:row-span-1",
  large: "sm:col-span-2 sm:row-span-2 lg:col-span-3",
  wide: "sm:col-span-2",
} as const;

export function AboutIndustries() {
  return (
    <Section>
      <SectionHeading align="center" title="Industries we Serve" />

      <Stagger className="mt-10 grid auto-rows-36 grid-flow-row-dense grid-cols-1 gap-4 sm:auto-rows-40 sm:grid-cols-2 lg:auto-rows-46 lg:grid-cols-4">
        {aboutIndustries.map((industry) => (
          <StaggerItem
            key={industry.title}
            className={cn("min-w-0", industrySpanClass[industry.size])}
          >
            <Link
              href="/services"
              className="group relative flex size-full overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/50"
            >
              <Media
                src={industry.image}
                alt={industry.title}
                className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 48vw, 90vw"
              />

              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              />

              <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-4 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="min-w-0">
                  <span className="block truncate font-heading text-sm font-semibold text-white sm:text-base">
                    {industry.title}
                  </span>
                  <span className="mt-1 block text-xs text-white/80">
                    Explore Solutions
                  </span>
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded bg-white text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <ArrowRight className="size-3.5" />
                </span>
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export function AboutAudiences() {
  return (
    <section>
      {aboutAudiences.map((audience, index) => (
        <Section
          key={audience.title}
          tone={index % 2 === 0 ? "default" : "alt"}
          spacing="compact"
        >
          <div
            className={cn(
              "grid items-center gap-8 md:grid-cols-[14rem_minmax(0,1fr)]",
              audience.imageSide === "end" &&
                "md:grid-cols-[minmax(0,1fr)_14rem]"
            )}
          >
            {audience.imageSide === "start" ? (
              <Media
                src={audience.image}
                alt={audience.title}
                className="aspect-[4/3] rounded-md"
                sizes="14rem"
              />
            ) : null}
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">
                {audience.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-body">
                {audience.description}
              </p>
            </div>
            {audience.imageSide === "end" ? (
              <Media
                src={audience.image}
                alt={audience.title}
                className="aspect-[4/3] rounded-md"
                sizes="14rem"
              />
            ) : null}
          </div>
        </Section>
      ))}
    </section>
  );
}
