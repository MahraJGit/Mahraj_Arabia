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

export function ProfileHero({
  title,
  description,
  image,
  breadcrumb,
  eyebrow,
  actions,
  footer,
  compact = false,
}: {
  title: string;
  description?: string;
  image?: string;
  breadcrumb?: ProfileBreadcrumb[];
  eyebrow?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
}) {
  const showImage = Boolean(image && hasPublicAsset(image));

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div
        className={cn(
          "grid",
          showImage ? "lg:grid-cols-2" : "",
          compact ? "min-h-[22rem]" : "min-h-[min(72vh,40rem)]"
        )}
      >
        <div
          className={cn(
            "relative flex flex-col justify-center bg-surface-alt px-4 py-14 sm:px-6 lg:px-8",
            !showImage && "mx-auto w-full max-w-site"
          )}
        >
          <FadeIn className="relative z-10 max-w-xl">
            {breadcrumb?.length ? (
              <nav aria-label="Breadcrumb" className="mb-6">
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
                "font-heading font-semibold leading-[1.1] tracking-tight text-ink",
                eyebrow ? "mt-3" : "",
                compact
                  ? "text-3xl sm:text-4xl"
                  : "text-4xl sm:text-5xl lg:text-[3.25rem]"
              )}
            >
              {title}
            </h1>

            {description ? (
              <p className="mt-5 max-w-md text-base leading-relaxed text-body">
                {description}
              </p>
            ) : null}

            {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
            {footer ? <div className="mt-8">{footer}</div> : null}
          </FadeIn>
        </div>

        {showImage && image ? (
          <div className={cn("relative min-h-[16rem]", compact ? "lg:min-h-full" : "lg:min-h-full")}>
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black/5"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
