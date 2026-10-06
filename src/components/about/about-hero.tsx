import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { aboutHero } from "@/content/about";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function AboutHero() {
  const showImage = hasPublicAsset(aboutHero.image);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
      />
      {showImage ? (
        <Image
          src={aboutHero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/20"
      />

      <Container className="flex min-h-[30rem] flex-col justify-center py-20 lg:min-h-[34rem] lg:py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-white/75">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" />
              <span className="text-white">About Us</span>
            </li>
          </ol>
        </nav>

        <FadeIn className="mt-10 max-w-2xl">
          <h1 className="font-heading text-4xl font-semibold leading-[1.12] text-white sm:text-5xl">
            {aboutHero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
            {aboutHero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link href="/contact#quote-form">Request a Quote</Link>
            </Button>
            <Button
              asChild
              size="xl"
              className="border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
