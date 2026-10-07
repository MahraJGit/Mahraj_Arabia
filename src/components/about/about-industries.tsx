import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
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
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Project settings
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Industries we serve.
        </h2>
      </div>

      <Stagger className="mt-10 grid auto-rows-36 grid-flow-row-dense grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:auto-rows-40 sm:grid-cols-2 lg:auto-rows-46 lg:grid-cols-4">
        {aboutIndustries.map((industry) => (
          <StaggerItem
            key={industry.title}
            className={cn("min-w-0 bg-background", industrySpanClass[industry.size])}
          >
            <Link
              href="/industries"
              className="group relative flex size-full overflow-hidden focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/50"
            >
              <Media
                src={industry.image}
                alt={industry.title}
                className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 48vw, 90vw"
              />

              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
              />

              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                <span className="min-w-0">
                  <span className="block truncate font-heading text-sm font-semibold text-white sm:text-base">
                    {industry.title}
                  </span>
                  <span className="mt-1 block text-xs text-white/80">
                    Explore settings
                  </span>
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center bg-white text-brand transition-colors group-hover:bg-brand group-hover:text-white">
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
      {aboutAudiences.map((audience, index) => {
        const imageRight = audience.imageSide === "end" || index % 2 === 0;

        return (
          <div key={audience.title} className="border-b border-border last:border-b-0">
            <div className="grid lg:grid-cols-2">
              <div
                className={cn(
                  "relative min-h-[18rem] bg-surface-alt sm:min-h-[22rem] lg:min-h-[28rem]",
                  imageRight ? "lg:order-2" : "lg:order-1"
                )}
              >
                <Media
                  src={audience.image}
                  alt={audience.title}
                  className="absolute inset-0 size-full"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div
                className={cn(
                  "flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16",
                  imageRight ? "lg:order-1" : "lg:order-2"
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Who we support
                </p>
                <h2 className="mt-3 max-w-md font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                  {audience.title}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-body">
                  {audience.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
