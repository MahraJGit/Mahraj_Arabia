import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/reveal";

export function PageHero({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <section className="border-b border-border bg-surface-alt">
      <Container className="py-14 lg:py-20">
        {breadcrumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-body">
              <li>
                <Link href="/" className="transition-colors hover:text-brand">
                  Home
                </Link>
              </li>
              {breadcrumb.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" />
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-brand"
                  >
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <FadeIn>
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-body">
              {description}
            </p>
          ) : null}
        </FadeIn>
      </Container>
    </section>
  );
}
