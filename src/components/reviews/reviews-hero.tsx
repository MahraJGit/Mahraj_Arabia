import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

import { ProfileHero } from "@/components/layout/profile-hero";
import { Button } from "@/components/ui/button";
import { heroMetrics, reviewsHero } from "@/content/reviews";

export function ReviewsHero() {
  return (
    <ProfileHero
      title={reviewsHero.title}
      description={reviewsHero.description}
      image={reviewsHero.image}
      breadcrumb={[{ label: "Reviews" }]}
      eyebrow="Client reviews"
      actions={
        <Button asChild variant="brand" size="xl">
          <Link href="/contact#quote-form">Request a Quote</Link>
        </Button>
      }
      footer={
        <ul className="flex flex-wrap gap-3">
          {heroMetrics.map((metric) => (
            <li
              key={metric.label}
              className="flex min-w-[9rem] flex-col items-start justify-between border border-border bg-background px-4 py-3"
            >
              {metric.kind === "rating" ? (
                <span className="flex gap-0.5" aria-label={`${metric.value} stars`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </span>
              ) : metric.kind === "verified" ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <BadgeCheck className="size-4 text-brand" />
                  {metric.value}
                </span>
              ) : (
                <p className="font-heading text-2xl font-semibold text-ink">
                  {metric.value}
                </p>
              )}
              <p className="mt-1.5 text-xs text-body">{metric.label}</p>
            </li>
          ))}
        </ul>
      }
    />
  );
}
