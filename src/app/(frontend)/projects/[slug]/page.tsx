import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHero } from "@/components/layout/page-hero";
import { projects } from "@/content/home";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) return {};

  return {
    title: project.title,
    description: `${project.application} capability in ${project.location} — ${project.product}.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <>
      <PageHero
        title={project.title}
        description={`${project.location} — Application: ${project.application} | Product: ${project.product}`}
        breadcrumb={[{ label: "Projects", href: "/projects" }]}
      />
      <ComingSoon note="Project photography, scope of works, and material schedule for this installation are being compiled." />
    </>
  );
}
