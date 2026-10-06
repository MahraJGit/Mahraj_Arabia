import type { MetadataRoute } from "next";

import { arabiaServices } from "@/content/arabia-services";
import { industries, projects } from "@/content/home";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "/",
    "/services",
    "/projects",
    "/industries",
    "/about",
    "/contact",
    "/blog",
    "/catalogues",
    "/reviews",
    "/careers",
    "/privacy-policy",
    "/terms",
  ];

  const servicePaths = arabiaServices.map((service) => `/services/${service.slug}`);
  const projectPaths = projects.map((project) => `/projects/${project.slug}`);
  const industryPaths = industries.map((industry) => `/industries/${industry.slug}`);

  return [...staticPaths, ...servicePaths, ...projectPaths, ...industryPaths].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.7,
    })
  );
}
