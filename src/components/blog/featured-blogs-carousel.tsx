"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeaturedArticle = {
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
  author: string;
  authorImage?: string;
  authorImageAlt?: string;
  href: string;
};

function isManagedAsset(src: string) {
  return /^https?:\/\//.test(src) || src.startsWith("/api/");
}

function isValidImageSrc(src: string) {
  return Boolean(src?.startsWith("/") || /^https?:\/\//.test(src));
}

export function FeaturedBlogsCarousel({
  articles,
}: {
  articles: FeaturedArticle[];
}) {
  const [index, setIndex] = useState(0);
  const safeArticles = articles.filter((article) =>
    isValidImageSrc(article.image)
  );

  if (safeArticles.length === 0) return null;

  const current = safeArticles[index % safeArticles.length];

  function prev() {
    setIndex((value) => (value - 1 + safeArticles.length) % safeArticles.length);
  }

  function next() {
    setIndex((value) => (value + 1) % safeArticles.length);
  }

  return (
    <>
      <article className="mt-10 grid items-center gap-7 rounded-md border border-border bg-background p-5 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
        <Link
          href={current.href}
          className="relative block overflow-hidden rounded-md"
          aria-label={current.title}
        >
          {isManagedAsset(current.image) ? (
            // Plain img for S3 — avoids Next Image optimizer issues.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.image}
              alt=""
              className="aspect-[16/10] h-auto w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <Image
              src={current.image}
              alt=""
              width={1280}
              height={800}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 45vw, 90vw"
            />
          )}
          <span className="absolute start-3 top-3 rounded bg-brand px-3 py-1 text-xs font-semibold text-white">
            Featured Blog
          </span>
          <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 text-[0.6875rem] text-white/90">
            {current.readTime ? (
              <span className="inline-flex items-center gap-1.5 rounded bg-black/55 px-2 py-1">
                <Clock className="size-3.5 shrink-0" aria-hidden />
                {current.readTime}
              </span>
            ) : null}
            {current.date ? (
              <span className="inline-flex items-center gap-1.5 rounded bg-black/55 px-2 py-1">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                {current.date}
              </span>
            ) : null}
          </div>
        </Link>

        <div>
          <Link href={current.href} className="block transition-colors hover:text-brand">
            <h3 className="text-3xl font-semibold leading-tight">{current.title}</h3>
          </Link>
          <p className="mt-4 text-base leading-relaxed text-body">{current.excerpt}</p>
          {current.author ? (
            <div className="mt-5 flex items-center gap-3">
              {current.authorImage && isValidImageSrc(current.authorImage) ? (
                isManagedAsset(current.authorImage) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.authorImage}
                    alt={current.authorImageAlt || current.author}
                    className="size-10 shrink-0 rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Image
                    src={current.authorImage}
                    alt={current.authorImageAlt || current.author}
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                )
              ) : null}
              <p className="text-sm font-semibold text-ink">{current.author}</p>
            </div>
          ) : null}
          <Button asChild variant="brand" size="xl" className="mt-5">
            <Link href={current.href}>Read More</Link>
          </Button>
        </div>
      </article>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          className="inline-flex size-8 items-center justify-center rounded-full border border-border text-body transition-colors hover:border-brand hover:text-brand"
          aria-label="Previous featured blog"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex gap-2">
          {safeArticles.map((article, dotIndex) => (
            <button
              key={article.title}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to featured blog ${dotIndex + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                dotIndex === index % safeArticles.length
                  ? "w-8 bg-brand"
                  : "w-6 bg-border hover:bg-brand/50"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="inline-flex size-8 items-center justify-center rounded-full border border-border text-body transition-colors hover:border-brand hover:text-brand"
          aria-label="Next featured blog"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </>
  );
}
