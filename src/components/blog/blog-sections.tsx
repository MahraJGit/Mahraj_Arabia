import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock,
  Star,
} from "lucide-react";

import { FeaturedBlogsCarousel } from "@/components/blog/featured-blogs-carousel";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { blogPage } from "@/content/blog";
import type { BlogCard, BlogCategory } from "@/lib/public/blog";
import { cn } from "@/lib/utils";

export function FeaturedBlogs({ posts }: { posts: BlogCard[] }) {
  if (posts.length === 0) return null;

  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Featured
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {blogPage.featured.title}
        </h2>
      </div>
      <FeaturedBlogsCarousel articles={posts} />
    </Section>
  );
}

export function ExploreByTopic({ categories }: { categories: BlogCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <Section tone="alt">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Topics
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Explore by topic.
        </h2>
      </div>
      <ul className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((topic) => {
          const hasArticles = topic.postCount > 0;
          const href = `/blog?category=${topic.slug}#latest-insights`;
          const countLabel =
            topic.postCount === 1
              ? "1 article"
              : `${topic.postCount} articles`;

          const content = (
            <>
              <Media
                src={topic.image}
                alt={topic.title}
                className="aspect-[6/5] transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                {topic.subtitle ? (
                  <p className="mt-1 text-xs text-white/75">{topic.subtitle}</p>
                ) : null}
                <p className="mt-2 text-xs font-medium text-white/70">
                  {hasArticles ? countLabel : "No articles yet"}
                </p>
                {hasArticles ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors group-hover:text-brand">
                    View articles
                    <ArrowRight className="size-4" />
                  </span>
                ) : null}
              </div>
            </>
          );

          return (
            <li
              key={topic.id}
              className={cn(
                "group relative overflow-hidden bg-background",
                !hasArticles && "opacity-80"
              )}
            >
              {hasArticles ? (
                <Link
                  href={href}
                  className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  aria-label={`View ${topic.postCount} ${topic.title} articles`}
                >
                  {content}
                </Link>
              ) : (
                <div className="block h-full" aria-disabled="true">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="brand" size="xl">
          <Link href="/blog#latest-insights">View all articles</Link>
        </Button>
      </div>
    </Section>
  );
}

function WorkingOnCard({ title }: { title: string }) {
  return (
    <div className="group flex h-full flex-col items-center rounded-md border border-border bg-background px-5 py-8 text-center transition-colors hover:border-brand hover:bg-brand">
      <Star className="size-8 fill-brand text-brand transition-colors group-hover:fill-white group-hover:text-white" />
      <p className="mt-4 text-sm font-semibold text-ink transition-colors group-hover:text-white">
        {title}
      </p>
      <p className="mt-1 text-xs text-body transition-colors group-hover:text-white/80">
        Consultation & Design
      </p>
    </div>
  );
}

export function WorkingOnSection() {
  const cards = blogPage.workingOn.cards;

  return (
    <Section tone="alt">
      <SectionHeading
        align="center"
        title={blogPage.workingOn.title}
        description={blogPage.workingOn.description}
      />
      <div className="mt-10 space-y-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.slice(0, 3).map((label) => (
            <li key={label}>
              <WorkingOnCard title={label} />
            </li>
          ))}
        </ul>
        <ul className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
          {cards.slice(3).map((label) => (
            <li key={label}>
              <WorkingOnCard title={label} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function BlogPostCard({ post }: { post: BlogCard }) {
  return (
    <article className="group h-full overflow-hidden bg-background">
      <Link href={post.href} className="block h-full">
        <div className="relative">
          <Media
            src={post.image}
            alt={post.imageAlt}
            className="aspect-[16/10] transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          />
          <span className="absolute start-3 top-3 bg-brand px-3 py-1 text-xs font-semibold text-white">
            {post.category}
          </span>
        </div>
        <div className="flex h-full flex-col p-5">
          <h3 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-body">
            {post.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-[0.6875rem] text-body">
            {post.readTime ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 shrink-0" aria-hidden />
                {post.readTime}
              </span>
            ) : null}
            {post.date ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                {post.date}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

function buildHref(params: {
  category?: string;
  q?: string;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `/blog?${query}#latest-insights` : "/blog#latest-insights";
}

export function LatestInsights({
  posts,
  categories,
  activeCategory,
  query,
  page,
  totalPages,
}: {
  posts: BlogCard[];
  categories: BlogCategory[];
  activeCategory?: string;
  query?: string;
  page: number;
  totalPages: number;
}) {
  const filtered = Boolean(activeCategory || query);

  return (
    <Section id="latest-insights">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Latest
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {blogPage.latestInsights.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-body">
          {blogPage.latestInsights.description}
        </p>
      </div>

      {categories.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-2">
          <li>
            <Link
              href={buildHref({ q: query })}
              className={cn(
                "inline-flex border px-4 py-2 text-sm font-medium transition-colors",
                activeCategory
                  ? "border-border text-body hover:border-brand hover:text-brand"
                  : "border-brand bg-brand text-white"
              )}
            >
              All
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={buildHref({ category: category.slug, q: query })}
                className={cn(
                  "inline-flex border px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory === category.slug
                    ? "border-brand bg-brand text-white"
                    : "border-border text-body hover:border-brand hover:text-brand"
                )}
              >
                {category.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {posts.length === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-border bg-surface-alt px-6 py-16 text-center">
          <p className="text-base font-semibold text-ink">No articles found</p>
          <p className="mt-2 text-sm text-body">
            {filtered
              ? "Try a different topic or search term."
              : "New technical guides are being published shortly."}
          </p>
          {filtered ? (
            <Button asChild variant="brand" size="lg" className="mt-6">
              <Link href="/blog">Clear filters</Link>
            </Button>
          ) : null}
        </div>
      ) : (
        <Stagger className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id} className="bg-background">
              <BlogPostCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {totalPages > 1 ? (
        <nav
          aria-label="Blog pagination"
          className="mt-8 flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Link
              key={number}
              href={buildHref({ category: activeCategory, q: query, page: number })}
              aria-current={number === page ? "page" : undefined}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                number === page
                  ? "border-brand bg-brand text-white"
                  : "border-border text-body hover:border-brand hover:text-brand"
              )}
            >
              {number}
            </Link>
          ))}
        </nav>
      ) : null}
    </Section>
  );
}

export function KnowledgeHubBand() {
  return (
    <Section tone="alt">
      <SectionHeading align="center" title={blogPage.knowledgeHub.title} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {blogPage.knowledgeHub.cards.map((card) => (
          <li
            key={card}
            className="relative overflow-hidden rounded-md border border-border bg-background p-5"
          >
            <span className="flex size-9 items-center justify-center rounded bg-brand/10 text-brand">
              <BookOpenText className="size-4" />
            </span>
            <h3 className="mt-4 text-xl font-semibold">{card}</h3>
            <p className="mt-2 text-sm text-body">Project description will go in here.</p>
            <span
              aria-hidden
              className="absolute -bottom-8 -end-8 size-24 rotate-45 bg-brand/25"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function LessonsAndCta() {
  return (
    <section className="overflow-hidden bg-background">
      <div className="grid lg:grid-cols-2">
        <div className="relative flex flex-col justify-center bg-surface-alt px-6 py-16 sm:px-10 lg:px-14">
          <div className="relative z-10 max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Need guidance
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {blogPage.ctaPanels.help.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body">
              {blogPage.ctaPanels.help.description}
            </p>
            <Button asChild variant="brand" size="xl" className="mt-8">
              <Link href="/contact#quote-form">
                Talk to our team
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-brand px-6 py-16 text-white sm:px-10 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Stay updated
          </p>
          <h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {blogPage.ctaPanels.subscribe.title}
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
            {blogPage.ctaPanels.subscribe.description}
          </p>
          <SubscribeForm
            placeholder={blogPage.ctaPanels.subscribe.placeholder}
            className="mt-8"
          />
        </div>
      </div>
    </section>
  );
}
