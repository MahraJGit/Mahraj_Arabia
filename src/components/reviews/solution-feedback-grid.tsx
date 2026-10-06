"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SolutionProject } from "@/content/reviews";
import { cn } from "@/lib/utils";

export function SolutionFeedbackGrid({
  filters,
  projects,
  media,
}: {
  filters: string[];
  projects: SolutionProject[];
  media: Record<string, ReactNode>;
}) {
  const [filter, setFilter] = useState(filters[0]);

  const filtered = useMemo(() => {
    const matches = projects.filter((project) => project.category === filter);
    return matches.length > 0 ? matches : projects.slice(0, 3);
  }, [filter, projects]);

  return (
    <>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              filter === item
                ? "border-brand bg-brand text-white"
                : "border-border bg-background text-ink hover:border-brand hover:text-brand"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <li
            key={project.slug}
            className="overflow-hidden rounded-md border border-border bg-background"
          >
            {media[project.slug]}
            <div className="p-5">
              <h3 className="text-base font-semibold text-ink">
                Project: {project.title}
              </h3>
              <p className="mt-1 text-sm text-body">
                Location: {project.location}
              </p>
              <span
                className="mt-3 flex gap-0.5"
                aria-label={`${project.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "size-3.5",
                      index < project.rating
                        ? "fill-brand text-brand"
                        : "text-border"
                    )}
                  />
                ))}
              </span>
              <Button asChild variant="brand" size="lg" className="mt-5 w-full">
                <Link href={`/projects/${project.slug}`}>
                  View Project Details
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
