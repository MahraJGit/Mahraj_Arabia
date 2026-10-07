import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export function ProfileClosingCta({
  title = "Ready to discuss your requirement?",
  description = "Share your project brief and we will help define a practical modular, portable, fencing or steel solution for your site.",
  primaryHref = "/contact#quote-form",
  primaryLabel = "Request a quotation",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <section data-section="" className="overflow-hidden bg-background">
      <div className="grid lg:grid-cols-2">
        <div className="relative flex items-center bg-surface-alt px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <FadeIn className="relative z-10 max-w-md">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-ink">
              Mahraj Arabia
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body">{description}</p>
          </FadeIn>
        </div>

        <div className="flex flex-col justify-center bg-brand px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Connect with sales
            </p>
            <a
              href={site.phoneHref}
              className="mt-4 font-heading text-3xl font-semibold tracking-tight transition-opacity hover:opacity-90 sm:text-4xl"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 text-base text-white/90 transition-opacity hover:opacity-80"
            >
              {site.email}
            </a>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/80">
              {site.address.line1}, {site.address.line2}, {site.address.line3}
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="xl"
                className="bg-white text-brand hover:bg-white/90"
              >
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
