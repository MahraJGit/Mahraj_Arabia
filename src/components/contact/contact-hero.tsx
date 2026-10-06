import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/reveal";
import { contactHero } from "@/content/contact";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function ContactHero() {
  const showHeroImage = hasPublicAsset(contactHero.image);
  // const showDevice = hasPublicAsset(contactHero.deviceImage);

  return (
    <section className="relative bg-ink">
      {/* Background is clipped on its own so the device can overflow the hero. */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
        />

        {showHeroImage ? (
          <Image
            src={contactHero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />
        ) : null}

        
      </div>

      <Container className="relative z-10 flex min-h-[26rem] flex-col pb-40 pt-20 lg:min-h-[30rem] lg:pb-44 lg:pt-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/75">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" />
              <span className="text-white">Contact Us</span>
            </li>
          </ol>
        </nav>

        <FadeIn>
          <h1 className="mt-10 max-w-[34rem] font-heading text-3xl font-semibold leading-[1.15] text-white sm:text-4xl lg:max-w-[38rem] lg:text-[2.5rem]">
            {contactHero.title}
          </h1>
        </FadeIn>

        {/* {showDevice ? (
          <div className="pointer-events-none absolute -bottom-[100px] start-0 z-20 h-[150px] w-[310px] sm:h-[175px] sm:w-[360px] lg:h-[205px] lg:w-[424px]">
            <Image
              src={contactHero.deviceImage}
              alt="Project planning device"
              width={424}
              height={205}
              priority
              className="h-full w-full object-contain object-left mix-blend-screen"
            />
          </div>
        ) : null} */}
      </Container>
    </section>
  );
}
