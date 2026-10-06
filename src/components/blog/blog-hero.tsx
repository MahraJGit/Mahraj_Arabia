import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { BlogSearchForm } from "@/components/blog/blog-search-form";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/reveal";
import { blogPage } from "@/content/blog";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function BlogHero({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  const showImage = hasPublicAsset(blogPage.hero.image);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
      />
      {showImage ? (
        <Image
          src={blogPage.hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/25"
      />

      <Container className="flex min-h-[28rem] flex-col justify-center py-16 lg:min-h-[32rem] lg:py-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/75">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" />
              <span className="text-white">Blogs</span>
            </li>
          </ol>
        </nav>

        <FadeIn className="mx-auto mt-8 max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-semibold leading-[1.12] text-white sm:text-5xl">
            {blogPage.hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/75 md:text-base">
            {blogPage.hero.description}
          </p>
        </FadeIn>

        <BlogSearchForm query={query} category={category} />
      </Container>
    </section>
  );
}
