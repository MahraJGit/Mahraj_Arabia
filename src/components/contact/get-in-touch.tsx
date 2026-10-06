import { Section } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { contactChannels, contactIntro } from "@/content/contact";

export function GetInTouch() {
  return (
    <Section
      id="get-in-touch"
      tone="alt"
      spacing="compact"
      className="relative z-0 scroll-mt-28 pt-24 sm:pt-28 lg:pt-32"
    >
      <SectionHeading
        align="center"
        title={contactIntro.title}
        description={contactIntro.description}
      />

      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {contactChannels.map(
          ({ title, description, action, href, icon: Icon, external, note }) => (
            <StaggerItem key={title}>
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="flex h-full flex-col items-center rounded-md border border-border bg-background px-5 py-8 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
                  {description}
                </p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {action}
                </span>
                {note ? (
                  <span className="mt-3 text-[0.6875rem] leading-relaxed text-body">
                    {note}
                  </span>
                ) : null}
              </a>
            </StaggerItem>
          )
        )}
      </Stagger>
    </Section>
  );
}
