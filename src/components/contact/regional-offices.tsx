import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { regionalOffices, regionalOfficesIntro } from "@/content/contact";
import { cn } from "@/lib/utils";

const officeToneClass = {
  brand: "bg-brand-dark",
  navy: "bg-[#1a2744]",
} as const;

const buttonTextClass = {
  brand: "text-brand-dark",
  navy: "text-[#1a2744]",
} as const;

export function RegionalOffices() {
  return (
    <Section tone="alt">
      <SectionHeading
        align="center"
        title={regionalOfficesIntro.title}
        description={regionalOfficesIntro.description}
      />

      <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-md border border-border bg-background">
          <Media
            src="/images/gcc-map.jpg"
            alt="GCC regional offices map"
            className="aspect-[4/5] grayscale sm:aspect-[16/11] lg:aspect-auto lg:min-h-[28rem]"
            sizes="(min-width: 1024px) 45vw, 90vw"
          />

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20"
          />

          <div className="absolute start-[34%] top-[42%] flex flex-col items-center">
            <span className="relative flex size-8 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/30" />
              <span className="relative inline-flex size-3 rounded-full bg-brand ring-4 ring-brand/25" />
            </span>
            <span className="mt-1 rounded bg-white/90 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-ink">
              KSA
            </span>
          </div>

          <div className="absolute end-[24%] top-[58%] flex flex-col items-center">
            <span className="relative flex size-8 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400/30" />
              <span className="relative inline-flex size-3 rounded-full bg-sky-500 ring-4 ring-sky-400/25" />
            </span>
            <span className="mt-1 rounded bg-white/90 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-ink">
              UAE
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {regionalOffices.map((office) => (
            <article
              key={office.slug}
              className={cn(
                "flex min-h-full flex-col rounded-md p-6 text-white",
                officeToneClass[office.tone]
              )}
            >
              <h3 className="text-lg font-semibold uppercase tracking-[0.04em] text-white">
                {office.title}
              </h3>

              <ul className="mt-5 flex-1 space-y-4 text-sm leading-relaxed text-white/90">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>{office.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0" />
                  <a href={office.phoneHref} className="transition-opacity hover:opacity-80">
                    {office.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  <a
                    href={`mailto:${office.email}`}
                    className="transition-opacity hover:opacity-80"
                  >
                    {office.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0" />
                  <span>{office.hours}</span>
                </li>
              </ul>

              <Button
                asChild
                variant="inverse"
                size="lg"
                className={cn(
                  "mt-6 w-full text-xs font-semibold uppercase tracking-[0.14em]",
                  buttonTextClass[office.tone]
                )}
              >
                <a
                  href={office.mapsHref}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Get Directions
                </a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
