import Link from "next/link";

import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { projects } from "@/content/home";

export function RegionalProjects() {
  return (
    <Section>
      <h2 className="text-3xl font-semibold sm:text-4xl">Regional Projects</h2>

      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <Media
                src={project.image}
                alt={project.title}
                className="aspect-[4/3] rounded-md"
                sizes="(min-width: 768px) 30vw, 90vw"
              />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                {project.location}
              </p>
              <h3 className="mt-2 text-lg font-semibold transition-colors group-hover:text-brand">
                {project.title}
              </h3>
              <p className="mt-1.5 text-sm text-body">
                Application: {project.application} | Product: {project.product}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
