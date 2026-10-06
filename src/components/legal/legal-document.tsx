import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";

import { ArticleToc, BackToTop } from "@/components/layout/article-toc";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import type { LegalDocument } from "@/content/legal";

export function LegalKeyPoints({ doc }: { doc: LegalDocument }) {
  return (
    <Section>
      <SectionHeading
        align="center"
        eyebrow="At a glance"
        title={doc.keyPointsTitle}
        description={doc.keyPointsDescription}
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {doc.keyPoints.map((point) => (
          <li
            key={point.title}
            className="group flex h-full flex-col rounded-md border border-border bg-background p-6 transition-colors hover:border-brand hover:bg-brand"
          >
            <span className="flex size-12 items-center justify-center rounded-md bg-brand text-white transition-colors group-hover:bg-white group-hover:text-brand">
              <point.icon className="size-6" />
            </span>
            <h3 className="mt-5 text-base font-semibold text-ink transition-colors group-hover:text-white">
              {point.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body transition-colors group-hover:text-white/80">
              {point.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function LegalBody({ doc }: { doc: LegalDocument }) {
  const tocItems = doc.sections.map((section) => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <Section tone="alt">
      <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-12">
        <aside className="lg:sticky lg:top-28">
          <ArticleToc items={tocItems} />

          <div className="mt-8 hidden rounded-md border border-border bg-background p-5 lg:block">
            <p className="text-sm font-semibold text-ink">Related document</p>
            <Link
              href={doc.related.href}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              {doc.related.label}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </aside>

        <article className="rounded-md border border-border bg-background p-6 sm:p-8 lg:p-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-body">
            Last updated {doc.lastUpdated}
          </p>
          <p className="border-s-2 border-brand ps-5 text-base leading-relaxed text-body">
            {doc.intro}
          </p>

          <div className="mt-2 divide-y divide-border">
            {doc.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 py-8"
              >
                <h2 className="group flex items-baseline gap-3 text-xl font-semibold sm:text-2xl">
                  <span className="text-base font-semibold tabular-nums text-brand sm:text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                  <a
                    href={`#${section.id}`}
                    aria-label={`Link to ${section.title}`}
                    className="opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <Link2 className="size-4 text-brand" />
                  </a>
                </h2>

                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 max-w-[68ch] text-sm leading-relaxed text-body sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-2.5 rounded-md bg-surface-alt p-5">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm leading-relaxed text-body sm:text-base"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="rounded-md border border-border bg-surface-alt px-5 py-4 text-sm text-body lg:hidden">
            Also read{" "}
            <Link href={doc.related.href} className="font-semibold text-brand">
              {doc.related.label}
            </Link>
          </div>
        </article>
      </div>

      <BackToTop />
    </Section>
  );
}

export function LegalCta({ doc }: { doc: LegalDocument }) {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid overflow-hidden rounded-md md:grid-cols-2">
          <div className="bg-brand px-8 py-10 text-white lg:px-12 lg:py-12">
            <h2 className="text-3xl font-semibold leading-tight text-white">
              {doc.cta.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {doc.cta.description}
            </p>
            <Button asChild variant="inverse" size="xl" className="mt-6">
              <Link href="/contact#get-in-touch">
                Contact Us
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          {/* <div className="bg-charcoal px-8 py-10 text-white lg:px-12 lg:py-12">
            <h2 className="text-3xl font-semibold leading-tight text-white">
              Looking for catalogues instead?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Browse collections, technical resources, and downloadable product
              documentation from the catalogues library.
            </p>
            <Button asChild variant="brand" size="xl" className="mt-6">
              <Link href="/catalogues">
                View Catalogues
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div> */}
        </div>
      </Container>
    </section>
  );
}
