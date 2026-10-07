import type { Metadata } from "next";
import Link from "next/link";

import { Media } from "@/components/media";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/layout/page-hero";
import { ProfileClosingCta } from "@/components/layout/profile-closing-cta";
import { Section } from "@/components/layout/section";
import { projects } from "@/content/home";

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
        <Stagger className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <StaggerItem key={project.slug} className="bg-background">
              <Link href={`/projects/${project.slug}`} className="group block">
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
                  <h2 className="mt-3 text-xl font-semibold tracking-tight transition-colors group-hover:text-brand">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm text-body">
                    {project.application} · {project.product}
                  </p>
                </div>
              </Link>
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
