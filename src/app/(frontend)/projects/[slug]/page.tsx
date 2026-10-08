import { redirect } from "next/navigation";

import { projects } from "@/content/home";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/** Detail pages are paused until fuller project data is ready. */
export default async function ProjectDetailPage() {
  redirect("/projects");
}
