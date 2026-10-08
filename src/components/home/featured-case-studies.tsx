import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { featuredCaseStudies, projects } from "@/content/home";

export function FeaturedCaseStudies() {
  const items = featuredCaseStudies.flatMap((item) => {
    const project = projects.find((entry) => entry.slug === item.slug);
    return project ? [{ ...item, project }] : [];
  });

  return (
    <Section tone="alt">
      <SectionHeading
        align="center"
        eyebrow="Case Studies"
        title="From concept to completion"
        description="See how our modular, portable, fencing and steel capabilities support real project requirements."
      />

      <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <StaggerItem
            key={item.slug}
            className="overflow-hidden rounded-md border border-border bg-background"
          >
            <div className="relative">
              <Media
                src={item.project.image}
                alt={item.title}
                className="aspect-[4/3]"
                sizes="(min-width: 768px) 30vw, 90vw"
              />
              <span className="absolute start-3 top-3 rounded-sm bg-brand-dark px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white">
                {item.badge}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold tracking-tight text-ink">
                {item.title}
              </h3>
              <div className="mt-3 flex items-end justify-between gap-3 text-sm">
                <p className="font-semibold text-ink">{item.price}</p>
                <p className="text-xs text-body">{item.meta}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
