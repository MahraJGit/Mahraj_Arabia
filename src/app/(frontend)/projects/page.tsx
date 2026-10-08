import type { Metadata } from "next";

import { Media } from "@/components/media";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { Section } from "@/components/layout/section";
import { projects } from "@/content/home";
import { cardGridClass, cardGridItemClass } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Capability galleries for modular, portable, fencing and steel solutions delivered for projects in Riyadh.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="From concept to completion."
        description="A selection of modular, portable, fencing and steel capabilities planned for construction, industrial, commercial and event sites."
        image="/images/projects/global-tech-hq.jpg"
        eyebrow="Projects"
        breadcrumb={[{ label: "Projects", href: "/projects" }]}
      />
      <Section>
        <Stagger className={`${cardGridClass} md:grid-cols-2 lg:grid-cols-3`}>
          {projects.map((project, index) => (
            <StaggerItem key={project.slug} className={cardGridItemClass}>
              <div className="block">
                <Media
                  src={project.image}
                  alt={project.title}
                  className="aspect-[16/10]"
                  sizes="(min-width: 768px) 30vw, 90vw"
                />
                <div className="px-5 py-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                    {String(index + 1).padStart(2, "0")} · {project.location}
                  </span>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm text-body">
                    {project.application} · {project.product}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
      <ProfileClosingCta
        title="Have a similar project brief?"
        description="Share location, use and timeline—Mahraj Arabia will help shape a practical capability package."
      />
    </>
  );
}
