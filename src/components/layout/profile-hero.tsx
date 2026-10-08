import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export type ProfileBreadcrumb = { label: string; href?: string };

/** Shared height shell for every page hero. */
const heroShellClass =
  "min-h-[var(--hero-min-h)] sm:min-h-[var(--hero-min-h-sm)] lg:min-h-[var(--hero-min-h-lg)]";

export function ProfileHero({
  title,
  description,
  image,
  breadcrumb,
  eyebrow,
  actions,
  footer,
}: {
  title: string;
  description?: string;
  image?: string;
  breadcrumb?: ProfileBreadcrumb[];
  eyebrow?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  /** @deprecated Kept for call-site compatibility; height is unified. */
  compact?: boolean;
}) {
  const showImage = Boolean(image && hasPublicAsset(image));

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div
        className={cn(
          "grid items-stretch",
          heroShellClass,
          showImage
            ? "grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1"
            : ""
        )}
      >
        {showImage && image ? (
          <div
            className={cn(
              "relative order-1 w-full overflow-hidden bg-surface-alt",
              "h-[var(--hero-media-h)] sm:h-[var(--hero-media-h-sm)]",
              "lg:order-2 lg:h-auto lg:min-h-full"
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        ) : null}

        <div
          className={cn(
            "relative order-2 flex flex-col justify-center bg-surface-alt",
            "px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14",
            showImage && "lg:order-1",
            !showImage && "mx-auto w-full max-w-site"
          )}
        >
          <FadeIn className="relative z-10 w-full max-w-xl">
            {breadcrumb?.length ? (
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex flex-wrap items-center gap-1.5 text-xs text-body">
                  <li>
                    <Link href="/" className="transition-colors hover:text-brand">
                      Home
                    </Link>
                  </li>
                  {breadcrumb.map((crumb) => (
                    <li key={crumb.label} className="flex items-center gap-1.5">
                      <ChevronRight className="size-3.5" />
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="transition-colors hover:text-brand"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-ink">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {eyebrow}
              </p>
            ) : null}

            <h1
              className={cn(
                "font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]",
                eyebrow && "mt-3"
              )}
            >
              {title}
            </h1>

            {description ? (
              <p className="mt-4 max-w-md text-base leading-relaxed text-body">
                {description}
              </p>
            ) : null}

            {actions ? (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">{actions}</div>
            ) : null}
            {footer ? <div className="mt-7">{footer}</div> : null}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
