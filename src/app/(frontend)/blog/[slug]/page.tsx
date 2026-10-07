import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  Tag,
  UserRound,
} from "lucide-react";

import { BlogArticleBody } from "@/components/blog/blog-article";
import { BlogPostCard } from "@/components/blog/blog-sections";
import { BlogShare } from "@/components/blog/blog-share";
import { ArticleToc, BackToTop } from "@/components/layout/article-toc";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Media } from "@/components/media";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import {
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
  toBlogCard,
} from "@/lib/public/blog";
import { extractHeadings } from "@/lib/public/rich-text";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const card = toBlogCard(post, "hero");
  const related = await getRelatedPosts(post.category?.slug ?? "", post.id);
  const headings = extractHeadings(post.content);
  const shareUrl = `${site.url}/blog/${post.slug}`;

  return (
    <>
      {/* Hero banner removed at client request.
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 z-0">
          <Media
            src={card.image}
            alt={card.imageAlt}
            className="h-full w-full"
            sizes="100vw"
            priority
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 z-[1] bg-gradient-to-r from-black/88 via-black/68 to-black/35"
        />

        <Container className="relative z-10 flex min-h-[26rem] flex-col justify-center py-16 lg:min-h-[32rem] lg:py-24">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/75">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" />
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blogs
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" />
                <span className="line-clamp-1 text-white">{post.title}</span>
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            {post.category ? (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-flex items-center gap-1.5 rounded bg-brand px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Tag className="size-3.5" />
                {post.category.title}
              </Link>
            ) : null}

            <h1 className="mt-4 font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
              {post.excerpt}
            </p>

            <ul className="mt-8 flex flex-wrap items-center gap-2.5 text-xs text-white/80">
              {card.author ? (
                <li className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
                  {card.authorImage ? (
                    <Media
                      src={card.authorImage}
                      alt={card.authorImageAlt}
                      className="size-5 rounded-full"
                      sizes="1.25rem"
                    />
                  ) : (
                    <UserRound className="size-3.5" />
                  )}
                  {card.author}
                </li>
              ) : null}
              {card.date ? (
                <li className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
                  <CalendarDays className="size-3.5" />
                  {card.date}
                </li>
              ) : null}
              {card.readTime ? (
                <li className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
                  <Clock className="size-3.5" />
                  {card.readTime}
                </li>
              ) : null}
            </ul>
          </div>
        </Container>
      </section>
      */}

      <Section tone="alt">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-12">
          <aside className="space-y-6 lg:sticky lg:top-28">
            {headings.length > 0 ? <ArticleToc items={headings} /> : null}

            <BlogShare url={shareUrl} title={post.title} />

            <div className="hidden rounded-md border border-border bg-background p-5 lg:block">
              <p className="text-sm font-semibold text-ink">
                Planning a similar project?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Our technical team reviews requirements and recommends a
                suitable modular or steel solution.
              </p>
              <Link
                href="/contact#quote-form"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                Request a quote
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </aside>

          <article className="rounded-md border border-border bg-background p-6 sm:p-8 lg:p-10">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-body">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" />
                  <Link href="/blog" className="transition-colors hover:text-ink">
                    Blogs
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5" />
                  <span className="line-clamp-1 text-ink">{post.title}</span>
                </li>
              </ol>
            </nav>

            <div className="mt-6">
              {post.category ? (
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="inline-flex items-center gap-1.5 rounded bg-brand px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Tag className="size-3.5" />
                  {post.category.title}
                </Link>
              ) : null}

              <h1 className="mt-4 font-heading text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl">
                {post.title}
              </h1>

              <ul className="mt-5 flex flex-wrap items-center gap-2.5 text-xs text-body">
                {card.author ? (
                  <li className="flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-3 py-1.5">
                    {card.authorImage ? (
                      <Media
                        src={card.authorImage}
                        alt={card.authorImageAlt}
                        className="size-5 rounded-full"
                        sizes="1.25rem"
                      />
                    ) : (
                      <UserRound className="size-3.5" />
                    )}
                    {card.author}
                  </li>
                ) : null}
                {card.date ? (
                  <li className="flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-3 py-1.5">
                    <CalendarDays className="size-3.5" />
                    {card.date}
                  </li>
                ) : null}
                {card.readTime ? (
                  <li className="flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-3 py-1.5">
                    <Clock className="size-3.5" />
                    {card.readTime}
                  </li>
                ) : null}
              </ul>
            </div>

            <p className="mt-8 border-s-2 border-brand ps-5 text-base leading-relaxed text-ink">
              {post.excerpt}
            </p>

            {post.content ? (
              <BlogArticleBody data={post.content} mediaById={post.inlineMedia} />
            ) : (
              <p className="mt-8 text-body">This article is being written.</p>
            )}

            <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {card.authorImage ? (
                  <Media
                    src={card.authorImage}
                    alt={card.authorImageAlt}
                    className="size-11 shrink-0 rounded-full"
                    sizes="2.75rem"
                  />
                ) : (
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <UserRound className="size-5" />
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {card.author || "Mahraj Engineering Team"}
                  </p>
                  <p className="text-xs text-body">
                    Modular and steel specialists in Riyadh
                  </p>
                </div>
              </div>

              <Button asChild variant="brandOutline" size="lg">
                <Link href="/blog">
                  <ArrowLeft className="size-4" />
                  All articles
                </Link>
              </Button>
            </div>

            <div className="mt-8 overflow-hidden rounded-md bg-ink p-6 text-center sm:p-8">
              <h2 className="font-heading text-xl font-semibold text-white sm:text-2xl">
                Need advice on your project?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Share your brief and our team will recommend a suitable modular,
                portable or steel solution for your site, timeline and budget.
              </p>
              <Button asChild variant="brand" size="xl" className="mt-6">
                <Link href="/contact#quote-form">
                  Request a Quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>

        <BackToTop />
      </Section>

      {related.length > 0 ? (
        <Section>
          <SectionHeading
            align="center"
            eyebrow="Keep reading"
            title="Related Blogs"
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <BlogPostCard post={item} />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="brand" size="xl">
              <Link href="/blog">View all Blogs</Link>
            </Button>
          </div>
        </Section>
      ) : null}
    </>
  );
}
