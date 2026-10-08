import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
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
  const multiOffice = regionalOffices.length > 1;

  return (
    <Section tone="alt">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Regional presence
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {regionalOfficesIntro.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          {regionalOfficesIntro.description}
        </p>
      </div>

      <div className="mt-12 grid items-stretch overflow-hidden border border-border lg:grid-cols-2">
        <div className="relative min-h-[18rem] overflow-hidden bg-surface-alt sm:min-h-[22rem] lg:min-h-full">
          <Media
            src="/images/gcc-map.jpg"
            alt="GCC regional offices map"
            className="absolute inset-0 size-full grayscale"
            sizes="(min-width: 1024px) 50vw, 90vw"
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

        <div
          className={cn(
            "grid border-t border-border lg:border-t-0 lg:border-l",
            multiOffice && "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
          )}
        >
          {regionalOffices.map((office) => (
            <article
              key={office.slug}
              className={cn(
                "flex h-full min-h-full flex-col p-6 text-white sm:p-8",
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
                {office.emails.map((email) => (
                  <li key={email} className="flex gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0" />
                    <a
                      href={`mailto:${email}`}
                      className="transition-opacity hover:opacity-80"
                    >
                      {email}
                    </a>
                  </li>
                ))}
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
