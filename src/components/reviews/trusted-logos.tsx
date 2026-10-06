import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { trustedByIntro, trustedByLogos } from "@/content/reviews";

export function TrustedLogos() {
  return (
    <Section>
      <SectionHeading align="center" title={trustedByIntro} />

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {trustedByLogos.map((logo) => (
          <li
            key={logo}
            className="flex h-16 items-center justify-center rounded-md border border-border bg-background px-4 text-center text-sm font-black italic tracking-tight text-ink/80"
          >
            {logo}
          </li>
        ))}
      </ul>
    </Section>
  );
}
