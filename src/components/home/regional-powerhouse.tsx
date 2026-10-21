import { HomeCarousel } from "@/components/home/home-carousel";
import { Section } from "@/components/layout/section";
import { currentLocation } from "@/content/contact";
import { regions, trustPartnerLogos } from "@/content/home";
import { site } from "@/content/site";

export function RegionalPowerhouse() {
  return (
    <Section id="regional" tone="alt">
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
                Based in Dubai
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Infrastructure that supports the work
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
                <div className="overflow-hidden rounded-md border border-border">
                  <iframe
                    title="Mahraj Arabia Riyadh office location"
                    src={currentLocation.embedUrl}
                    className="aspect-[16/10] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <a
                    href={site.address.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 border-t border-border bg-background px-4 py-3 text-sm transition-colors hover:bg-muted/40"
                  >
                    <span>
                      <span className="font-semibold text-ink">{currentLocation.title}</span>
                      <span className="mt-0.5 block text-xs text-body">
                        {site.address.line1}, {site.address.line2}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                      Directions
                    </span>
                  </a>
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
