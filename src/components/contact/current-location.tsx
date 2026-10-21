import { Section } from "@/components/layout/section";
import { currentLocation } from "@/content/contact";

export function CurrentLocation() {
  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Visit us
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {currentLocation.title}
        </h2>
      </div>

      <div className="mt-10 overflow-hidden border border-border">
        <iframe
          title="Mahraj Arabia Riyadh office location"
          src={currentLocation.embedUrl}
          className="aspect-[16/7] w-full border-0 sm:aspect-[16/6]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </Section>
  );
}
