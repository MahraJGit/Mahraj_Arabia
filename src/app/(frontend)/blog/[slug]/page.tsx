import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { BlogArticleBody } from "@/components/blog/blog-article";
import { BlogPostHero } from "@/components/blog/blog-post-hero";
import { BlogPostCard } from "@/components/blog/blog-sections";
import { BlogShare } from "@/components/blog/blog-share";
import { TechnicalFaqForm } from "@/components/home/technical-faq-form";
import { ArticleToc, BackToTop } from "@/components/layout/article-toc";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import {
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
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
    keywords: post.focusKeyword || undefined,
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

  const related = await getRelatedPosts(post.category?.slug ?? "", post.id);
  const headings = extractHeadings(post.content);
  const shareUrl = `${site.url}/blog/${post.slug}`;

  const faqJsonLd =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <BlogPostHero post={post} />

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
            {post.tags.length > 0 ? (
              <ul className="mb-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-body"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            {post.content ? (
              <BlogArticleBody data={post.content} mediaById={post.inlineMedia} />
            ) : (
              <p className="text-body">This article is being written.</p>
            )}

            <div className="mt-12 flex justify-end border-t border-border pt-6">
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

      {post.faqs.length > 0 ? (
        <TechnicalFaqForm
          formIdPrefix={`blog-${post.slug}`}
          faqs={post.faqs}
          faqIntro={post.faqDescription || "Answers related to this article."}
        />
      ) : null}

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
