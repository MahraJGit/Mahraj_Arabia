import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { heroHighlights, heroImage, heroVideo } from "@/content/home";

function hasPublicAsset(src: string) {
  if (!src) return false;
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function Hero() {
  const showVideo = hasPublicAsset(heroVideo);
  const showImage = hasPublicAsset(heroImage);

  return (
    <section className="relative isolate min-h-[var(--hero-min-h)] overflow-hidden border-b border-border bg-ink sm:min-h-[var(--hero-min-h-sm)] lg:min-h-[var(--hero-min-h-lg)]">
      {showImage ? (
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover object-center"
        />
      ) : null}

      {showVideo ? (
        <video
          className="absolute inset-0 z-0 size-full object-cover object-center motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={showImage ? heroImage : undefined}
          aria-hidden
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : null}

      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/20"
      />

      <Container className="relative z-20 flex min-h-[var(--hero-min-h)] flex-col justify-center py-12 sm:min-h-[var(--hero-min-h-sm)] sm:py-14 lg:min-h-[var(--hero-min-h-lg)] lg:py-16">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Built for Saudi projects
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold leading-[1.12] text-white sm:text-4xl lg:text-[2.75rem]">
            Modular spaces.{" "}
            <span className="text-brand">Steel built.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90">
            Modular, portable and steel solutions for construction, events, and
            industrial sites across Saudi Arabia.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link href="/contact#quote-form">
                Request a quotation
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="inverseOutline" size="xl">
              <Link href="/services">Explore solutions</Link>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-6 sm:gap-x-10">
            {heroHighlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                <Icon className="size-4 text-white" />
                {label}
              </li>
            ))}
          </ul>
        </FadeIn>
      </Container>
    </section>
  );
}
