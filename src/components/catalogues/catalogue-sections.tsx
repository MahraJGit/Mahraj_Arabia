import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  ArrowRight,
  Download,
  FileText,
  Mail,
  MessageSquareText,
  Star,
} from "lucide-react";

import { Media } from "@/components/media";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { Section } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { TopicScroller } from "@/components/catalogues/topic-scroller";
import { cataloguePage } from "@/content/catalogues";
import { cardGridClass, cardGridItemClass, cn } from "@/lib/utils";

function hasPublicAsset(src: string) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

function matchesQuery(query: string | undefined, fields: Array<string | undefined>) {
  const term = query?.trim().toLowerCase();
  if (!term) return true;
  return fields.some((field) => field?.toLowerCase().includes(term));
}

export function hasCatalogueResults(query?: string) {
  const term = query?.trim();
  if (!term) return true;

  const featured = cataloguePage.featured;
  if (
    matchesQuery(term, [featured.title, featured.excerpt, featured.badge, featured.author])
  ) {
    return true;
  }

  if (
    cataloguePage.explore.collections.some((item) =>
      matchesQuery(term, [item.title, item.description, ...item.tags])
    )
  ) {
    return true;
  }

  if (
    cataloguePage.resources.cards.some((item) =>
      matchesQuery(term, [item.title, item.description, item.fileInfo])
    )
  ) {
    return true;
  }

  return cataloguePage.realProjects.cards.some((item) =>
    matchesQuery(term, [item.title, item.description])
  );
}

export function CatalogueSearchResults({ query }: { query?: string }) {
  const term = query?.trim();
  if (!term) return null;

  return (
    <Section id="catalogue-results" spacing="compact">
      {hasCatalogueResults(term) ? (
        <p className="text-sm text-body">
          Results for <span className="font-semibold text-ink">“{term}”</span>
        </p>
      ) : (
        <div className="text-center">
          <p className="text-base text-ink">No catalogues match “{term}”.</p>
          <Button asChild variant="brandOutline" size="lg" className="mt-4">
            <Link href="/catalogues">Clear search</Link>
          </Button>
        </div>
      )}
    </Section>
  );
}

/* ─── Topic filter row ─── */
export function TopicFilters() {
  return (
    <Section spacing="compact">
      <TopicScroller>
        {cataloguePage.topics.map((topic) => (
          <li key={topic.title} className="shrink-0 first:ml-auto last:mr-auto">
            <button
              type="button"
              className="group flex w-32 flex-col overflow-hidden rounded-lg sm:w-36"
            >
              <Media
                src={topic.image}
                alt={topic.title}
                className="aspect-[3/4] w-full rounded-lg transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 640px) 144px, 128px"
              />
              <span className="mt-2.5 text-start text-sm font-semibold">{topic.title}</span>
            </button>
          </li>
        ))}
      </TopicScroller>
    </Section>
  );
}

/* ─── Featured collection ─── */

export function FeaturedCollection({ query }: { query?: string }) {
  const featured = cataloguePage.featured;
  if (!matchesQuery(query, [featured.title, featured.excerpt, featured.badge, featured.author])) {
    return null;
  }

  return (
    <Section>
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[18rem] overflow-hidden lg:min-h-[26rem]">
          <Media
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 size-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <span className="absolute start-4 top-4 bg-brand px-3 py-1 text-xs font-semibold text-white">
            {featured.badge}
          </span>
        </div>

        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Featured catalogue
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {featured.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-body">
            {featured.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="size-10 overflow-hidden bg-surface-alt">
              <Media
                src={featured.authorAvatar}
                alt="Author"
                className="size-full"
                sizes="40px"
              />
            </div>
            <span className="text-sm font-medium text-ink">
              {featured.author}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="xl">
              <Link href="/catalogues">View collection</Link>
            </Button>
            <Button asChild variant="brandOutline" size="xl">
              <Link href="/catalogues">
                <Download className="size-4" />
                Download catalogue
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Explore collections ─── */

export function ExploreCollections({ query }: { query?: string }) {
  const collections = cataloguePage.explore.collections.filter((item) =>
    matchesQuery(query, [item.title, item.description, ...item.tags])
  );
  if (collections.length === 0) return null;

  return (
    <Section id="collections" tone="alt" className="scroll-mt-28">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Collections
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {cataloguePage.explore.title}
        </h2>
      </div>
      <Stagger className={`mt-10 ${cardGridClass} sm:grid-cols-2 lg:grid-cols-4`}>
        {collections.map((col, index) => (
          <StaggerItem
            key={col.title}
            className={cn("overflow-hidden", cardGridItemClass)}
          >
            <div className="relative">
              <Media
                src={col.image}
                alt={col.title}
                className="aspect-[5/4]"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold">{col.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {col.description}
              </p>

              <p className="mt-4 text-xs font-semibold text-ink">Best for</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {col.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border px-2 py-0.5 text-[0.6875rem] text-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href="/catalogues"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-brand"
              >
                Explore collection
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10">
        <Button asChild variant="brand" size="xl">
          <Link href="/catalogues">View all collections</Link>
        </Button>
      </div>
    </Section>
  );
}

/* ─── Choose by what matters ─── */

export function ChooseByMatters() {
  const cards = cataloguePage.matters.cards;
  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Selection criteria
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {cataloguePage.matters.title}
        </h2>
      </div>
      <ul className={`mt-10 ${cardGridClass} sm:grid-cols-2 lg:grid-cols-3`}>
        {cards.map((card, index) => (
          <li
            key={card.title}
            className={cn(
              cardGridItemClass,
              "group flex flex-col px-5 py-8 transition-colors hover:bg-brand"
            )}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand transition-colors group-hover:text-white/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-5 flex size-10 items-center justify-center bg-brand/10 text-brand transition-colors group-hover:bg-white/15 group-hover:text-white">
              <card.icon className="size-5" />
            </span>
            <p className="mt-5 text-sm font-semibold text-ink transition-colors group-hover:text-white">
              {card.title}
            </p>
            <p className="mt-2 text-xs text-body transition-colors group-hover:text-white/80">
              {card.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ─── Industry grid (shared for industry + real projects) ─── */

function IndustryGrid({
  title,
  cards,
  ctaLabel,
  eyebrow = "Browse",
}: {
  title: string;
  cards: { title: string; description: string; image: string }[];
  ctaLabel: string;
  eyebrow?: string;
}) {
  return (
    <Section tone="alt">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      <ul className={`mt-10 ${cardGridClass} sm:grid-cols-2 lg:grid-cols-3`}>
        {cards.map((card, i) => (
          <li
            key={`${card.title}-${i}`}
            className={cn("overflow-hidden", cardGridItemClass)}
          >
            <Media
              src={card.image}
              alt={card.title}
              className="aspect-[16/10]"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            />
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-body">{card.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                Explore further
                <ArrowRight className="size-3.5" />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <Button asChild variant="brand" size="xl">
          <Link href="/catalogues">{ctaLabel}</Link>
        </Button>
      </div>
    </Section>
  );
}

export function FindByIndustry({ query }: { query?: string }) {
  const cards = cataloguePage.industry.cards.filter((item) =>
    matchesQuery(query, [item.title, item.description])
  );
  if (cards.length === 0) return null;

  return (
    <IndustryGrid
      title={cataloguePage.industry.title}
      cards={cards}
      ctaLabel="View all collections"
    />
  );
}

export function RealProjects({ query }: { query?: string }) {
  const cards = cataloguePage.realProjects.cards.filter((item) =>
    matchesQuery(query, [item.title, item.description])
  );
  if (cards.length === 0) return null;

  return (
    <IndustryGrid
      title={cataloguePage.realProjects.title}
      cards={cards}
      ctaLabel="View all collections"
    />
  );
}

/* ─── Testimonial band ─── */

export function TestimonialBand() {
  const t = cataloguePage.testimonial;
  const showImage = hasPublicAsset(t.image);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
      />
      {showImage ? (
        <Image
          src={t.image}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-black/70"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t.title}</h2>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">{t.review}</p>
          <p className="mt-3 text-sm font-medium text-white/60">-{t.author}</p>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:max-w-sm">
            {t.metrics.map((m, i) => (
              <li
                key={`${m.label}-${i}`}
                className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <FileText className="size-5 text-white/60" />
                <div>
                  <p className="text-sm font-bold text-white">{m.value}</p>
                  <p className="text-[0.6875rem] text-white/60">{m.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─── Sizing guide table ─── */

export function SizingGuide() {
  const sg = cataloguePage.sizingGuide;
  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Reference
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {sg.title}
        </h2>
      </div>
      <div className="mt-10 overflow-x-auto border border-border">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-alt">
              {sg.columns.map((col, i) => (
                <th
                  key={`${col}-${i}`}
                  className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-body"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sg.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border last:border-b-0">
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-4 font-medium ${
                      ci === sg.columns.length - 1
                        ? "text-brand"
                        : "text-ink"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <Button asChild variant="brandOutline" size="xl">
          <Link href="/contact#get-in-touch">Talk to our team</Link>
        </Button>
      </div>
    </Section>
  );
}

/* ─── CTA panels (Need Help + Subscribe) ─── */

export function CatalogueCta() {
  return (
    <section>
      <div className="grid md:grid-cols-2">
        <div className="bg-brand px-8 py-10 text-white lg:px-12 lg:py-12">
          <span className="flex size-12 items-center justify-center rounded bg-white text-brand">
            <MessageSquareText className="size-7" />
          </span>
          <h3 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {cataloguePage.ctaPanels.help.title}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
            {cataloguePage.ctaPanels.help.description}
          </p>
          <Button asChild variant="inverse" size="xl" className="mt-6">
            <Link href="/contact#quote-form">
              Talk to an Expert
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="bg-charcoal px-8 py-10 text-white lg:px-12 lg:py-12">
          <span className="flex size-12 items-center justify-center rounded bg-white text-brand">
            <Mail className="size-7" />
          </span>
          <h3 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {cataloguePage.ctaPanels.subscribe.title}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            {cataloguePage.ctaPanels.subscribe.description}
          </p>
          <SubscribeForm
            placeholder={cataloguePage.ctaPanels.subscribe.placeholder}
            className="mt-6"
          />
        </div>
      </div>
    </section>
  );
}
