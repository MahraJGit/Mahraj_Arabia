"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import type { IndustryReview } from "@/content/reviews";
import { cn } from "@/lib/utils";

export function IndustryReviewsCarousel({
  filters,
  reviews,
  media,
}: {
  filters: string[];
  reviews: IndustryReview[];
  media: Record<string, ReactNode>;
}) {
  const [filter, setFilter] = useState(filters[0]);
  const [index, setIndex] = useState(0);

  const filtered = useMemo(
    () => reviews.filter((review) => review.industry === filter),
    [filter, reviews]
  );

  const review = filtered[index] ?? filtered[0] ?? reviews[0];

  function changeFilter(next: string) {
    setFilter(next);
    setIndex(0);
  }

  function step(direction: 1 | -1) {
    if (filtered.length === 0) return;
    setIndex(
      (current) => (current + direction + filtered.length) % filtered.length
    );
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => changeFilter(item)}
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

      <article className="mt-10 rounded-md border border-border bg-background p-6 shadow-sm lg:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-[11rem_minmax(0,1fr)_16rem]">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-brand/10 text-xl font-semibold text-brand">
              {review.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <h3 className="mt-4 text-base font-semibold text-ink">
              {review.name}
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink">
              <Star className="size-4 fill-brand text-brand" />
              {review.rating}
            </p>
          </div>

          <blockquote className="relative text-sm leading-relaxed text-body sm:text-base">
            <span
              aria-hidden
              className="absolute -start-1 -top-3 font-heading text-5xl leading-none text-brand"
            >
              &ldquo;
            </span>
            <p className="px-4 pt-4">{review.quote}</p>
            <span
              aria-hidden
              className="absolute -bottom-4 end-0 font-heading text-5xl leading-none text-brand"
            >
              &rdquo;
            </span>
          </blockquote>

          <div className="relative overflow-hidden rounded-md">
            {media[review.industry]}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs font-medium text-white">
              +{review.extraViews} more view all
            </span>
          </div>
        </div>
      </article>

      <div className="mt-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark"
          aria-label="Previous review"
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark"
          aria-label="Next review"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </>
  );
}
