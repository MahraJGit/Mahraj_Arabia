import type { MetadataRoute } from "next";

import { arabiaServices } from "@/content/arabia-services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "/",
    "/services",
    "/projects",
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

  return [...staticPaths, ...servicePaths].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.7,
    })
  );
}
