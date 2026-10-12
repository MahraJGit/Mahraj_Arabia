import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { aboutPromise } from "@/content/delivery-approach";
import { aboutPartners } from "@/content/about";
import { cardGridClass, cardGridItemClass } from "@/lib/utils";

const overviewCollage = {
  main: [
    {
      src: "/images/projects/customized-modular-solutions.jpg",
      alt: "Customized modular office building",
    },
    {
      src: "/images/projects/steel-structures-fabrication-works.jpg",
      alt: "Steel structure fabrication",
    },
  ],
  strip: [
    {
      src: "/images/projects/porta-cabins-site-offices.jpg",
      alt: "Porta cabin site office",
    },
    {
      src: "/images/projects/steel-structures-fabrication-works.jpg",
      alt: "Steel frame detail",
    },
    {
      src: "/images/projects/modular-offices-meeting-rooms.jpg",
      alt: "Modular meeting room",
    },
    {
      src: "/images/projects/custom-steel-fabrication.jpg",
      alt: "Custom steel fabrication",
    },
  ],
};

export function AboutPartners() {
  return (
    <Section spacing="compact">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Trusted by project teams
      </p>
      <ul className={`mt-6 ${cardGridClass} grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`}>
        {aboutPartners.map((partner) => (
          <li
            key={partner}
            className={`flex h-14 items-center justify-center px-4 text-center text-sm font-semibold tracking-tight text-ink/80 ${cardGridItemClass}`}
          >
            {partner}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function AboutOverviewCollage() {
  return (
    <div className="flex size-full min-h-[18rem] flex-col bg-surface-alt sm:min-h-[22rem] lg:min-h-[28rem]">
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 grid grid-cols-2 gap-px bg-white">
          {overviewCollage.main.map((image) => (
            <div key={image.src} className="relative overflow-hidden bg-surface-alt">
              <Media
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 size-full"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 -mt-px grid h-20 shrink-0 grid-cols-4 gap-px bg-white sm:h-24 lg:h-28">
        {overviewCollage.strip.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="relative overflow-hidden bg-surface-alt"
            style={{
              clipPath:
                index === 0
                  ? "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)"
                  : index === overviewCollage.strip.length - 1
                    ? "polygon(0 0, 100% 0, 100% 100%, 12px 100%)"
                    : "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
            }}
          >
            <Media
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 size-full"
              sizes="15vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutOverview() {
  return (
    <section className="border-b border-border">
      <div className="grid lg:grid-cols-2">
        <div className="relative overflow-hidden bg-surface-alt">
          <AboutOverviewCollage />
        </div>

        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            About Mahraj Arabia
          </p>
          <h2 className="mt-3 max-w-md font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            From first idea to a site ready solution.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-body">
            {aboutPromise}
          </p>

          <div className="mt-8 border-s-4 border-s-brand bg-surface-alt px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand">
              <Target className="size-4" />
              Our Promise
            </p>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Practical design, clear coordination and dependable delivery, shaped
              around how the solution will be used on site.
            </p>
          </div>

          <div className="mt-8">
            <Button asChild variant="brand" size="lg">
              <Link href="/#working-process">
                See how we deliver
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
