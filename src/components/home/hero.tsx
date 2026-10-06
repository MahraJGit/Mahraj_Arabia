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
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function Hero() {
  const showVideo = hasPublicAsset(heroVideo);
  const showImage = hasPublicAsset(heroImage);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Always-on fallback so the banner never goes blank. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
      />

      {/* Still image sits under the video as poster / reduced-motion fallback. */}
      {showImage ? (
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
      ) : null}

      {showVideo ? (
        <video
          className="absolute inset-0 -z-10 size-full object-cover object-center motion-reduce:hidden"
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
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20"
      />

      <Container className="flex min-h-[34rem] flex-col justify-center py-20 lg:min-h-[38rem] lg:py-24">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Built for Saudi projects
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.12] text-white sm:text-5xl lg:text-[3.5rem]">
            Modular spaces.{" "}
            <span className="italic text-brand">Built to perform.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90">
            Porta cabins, modular facilities and steel fabrication—planned
            around your site, your team and your project timeline.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
        <ul className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/20 pt-6">
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
