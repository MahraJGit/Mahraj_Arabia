import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { reviewsCta } from "@/content/reviews";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function ReviewsCta() {
  const showImage = hasPublicAsset(reviewsCta.image);

  return (
    <Section>
      <div className="relative isolate overflow-hidden rounded-md">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-brand-dark"
        />
        {showImage ? (
          <Image
            src={reviewsCta.image}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-brand-dark/80"
        />

        <div className="flex flex-col items-center px-6 py-16 text-center sm:px-10 lg:py-20">
          <h2 className="max-w-xl font-heading text-3xl font-semibold text-white sm:text-4xl">
            {reviewsCta.title}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            {reviewsCta.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="inverse" size="xl">
              <Link href="/contact#quote-form">Contact Us</Link>
            </Button>
            {/* <Button asChild variant="inverseOutline" size="xl">
              <Link href="/contact#get-in-touch">Contact us</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </Section>
  );
}
