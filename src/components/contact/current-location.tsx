import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { currentLocation } from "@/content/contact";

export function CurrentLocation() {
  return (
    <Section>
      <SectionHeading align="center" title={currentLocation.title} />

      <div className="mt-10 overflow-hidden rounded-md border border-border shadow-sm">
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
