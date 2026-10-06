import { MapPin } from "lucide-react";

import { HomeCarousel } from "@/components/home/home-carousel";
import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { regions, trustPartnerLogos } from "@/content/home";

export function RegionalPowerhouse() {
  return (
    <Section tone="alt">
      <div className="rounded-md border border-border bg-background p-8 lg:p-12">
        <HomeCarousel
          controlsPlacement="before"
          controlStyle="squares"
          prevLabel="Previous partners"
          nextLabel="Next partners"
          gapClassName="gap-3"
          itemClassName="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2.25rem)/4)]"
          className="border-t border-border pt-8"
          heading={
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Based in Riyadh
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Built for Saudi Projects
              </h2>
            </div>
          }
          middle={
            <div className="mb-10 grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-body">
                  Where We Operate:
                </h3>
                <ul className="mt-4 space-y-3">
                  {regions.map((region) => (
                    <li key={region} className="flex items-center gap-3 text-sm">
                      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                      {region}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-body">
                  Regional Footprint
                </h3>
                <div className="relative overflow-hidden rounded-md border border-border">
                  <Media
                    src="/images/gcc-map.jpg"
                    alt="GCC coverage map"
                    className="aspect-[16/10] grayscale"
                    sizes="(min-width: 1024px) 45vw, 90vw"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-b from-white via-white/75 to-white/15"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <p className="flex flex-col items-center gap-2 rounded-md border border-border bg-background/95 px-6 py-4 text-center text-sm font-semibold shadow-sm">
                      <MapPin className="size-5 text-brand" />
                      Serving projects across Saudi Arabia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          {trustPartnerLogos.map((logo) => (
            <div
              key={logo}
              className="flex h-14 items-center justify-center rounded border border-border bg-background px-4 text-center text-sm font-black italic tracking-tight text-ink/85 sm:text-lg"
            >
              {logo}
            </div>
          ))}
        </HomeCarousel>
      </div>
    </Section>
  );
}
