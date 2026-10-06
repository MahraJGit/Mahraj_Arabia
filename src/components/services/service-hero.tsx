import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/reveal";
import { Media } from "@/components/media";
import { Button } from "@/components/ui/button";
import type { ServiceDetailView } from "@/lib/public/services";

export function ServiceHero({ service }: { service: ServiceDetailView }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
      />
      <Media
        src={service.image}
        alt=""
        className="absolute inset-0 -z-10 size-full"
        sizes="100vw"
        priority
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/20"
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
              <Link
                href="/services"
                className="transition-colors hover:text-white"
              >
                Services
              </Link>
            </li>
            {service.parentTitle ? (
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" />
                <Link
                  href="/services"
                  className="transition-colors hover:text-white"
                >
                  {service.parentTitle}
                </Link>
              </li>
            ) : null}
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" />
              <span className="text-white">{service.title}</span>
            </li>
          </ol>
        </nav>

        <FadeIn className="mt-10 max-w-2xl">
          <h1 className="font-heading text-4xl font-semibold leading-[1.12] text-white sm:text-5xl">
            {service.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
            {service.heroDescription}
          </p>
          <Button asChild variant="brand" size="xl" className="mt-8">
            <Link href="/contact#quote-form">Request a Quote</Link>
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}
