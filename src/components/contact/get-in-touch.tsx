import { Section } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { contactChannels, contactIntro } from "@/content/contact";
import { cardGridClass, cardGridItemClass } from "@/lib/utils";

export function GetInTouch() {
  return (
    <Section
      id="get-in-touch"
      tone="alt"
      spacing="compact"
      className="relative z-0 scroll-mt-28 pt-24 sm:pt-28 lg:pt-32"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Contact channels
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {contactIntro.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          {contactIntro.description}
        </p>
      </div>

      <Stagger className={`mt-10 ${cardGridClass} sm:grid-cols-2 xl:grid-cols-5`}>
        {contactChannels.map(
          (
            { title, description, action, href, icon: Icon, external, note },
            index
          ) => (
            <StaggerItem key={title} className={cardGridItemClass}>
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="group flex h-full flex-col px-5 py-8 transition-colors hover:bg-brand"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand transition-colors group-hover:text-white/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-5 flex size-10 items-center justify-center bg-brand/10 text-brand transition-colors group-hover:bg-white/15 group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink transition-colors group-hover:text-white">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body transition-colors group-hover:text-white/85">
                  {description}
                </p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand transition-colors group-hover:text-white">
                  {action}
                </span>
                {note ? (
                  <span className="mt-3 text-[0.6875rem] leading-relaxed text-body transition-colors group-hover:text-white/70">
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
