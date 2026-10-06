import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ChevronRight, Star } from "lucide-react";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { heroMetrics, reviewsHero } from "@/content/reviews";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function ReviewsHero() {
  const showImage = hasPublicAsset(reviewsHero.image);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
      />
      {showImage ? (
        <Image
          src={reviewsHero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-top"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/25"
      />

      <Container className="flex min-h-[30rem] flex-col justify-center py-20 lg:min-h-[34rem] lg:py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/75">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" />
              <span className="text-white">Reviews</span>
            </li>
          </ol>
        </nav>

        <FadeIn className="mt-8 max-w-2xl">
          <h1 className="font-heading text-4xl font-semibold leading-[1.12] text-white sm:text-5xl">
            {reviewsHero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
            {reviewsHero.description}
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {heroMetrics.map((metric) => (
              <li
                key={metric.label}
                className="min-w-[9.5rem] rounded-md border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-sm flex flex-col items-center justify-between"
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
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <BadgeCheck className="size-4" />
                    {metric.value}
                  </span>
                ) : (
                  <p className="font-heading text-2xl font-semibold text-white">
                    {metric.value}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-white/70">{metric.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link href="/contact#quote-form">Request a Quote</Link>
            </Button>
            {/* <Button
              asChild
              size="xl"
              className="border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <a href="#solution-feedback">View Our Projects</a>
            </Button> */}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
