import Link from "next/link";

import { HomeCarousel } from "@/components/home/home-carousel";
import { Media } from "@/components/media";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { blogHighlights } from "@/content/home";
import { getPosts } from "@/lib/public/blog";

export async function TechnicalInsights() {
  const { docs } = await getPosts({ limit: 6 });
  const posts =
    docs.length > 0
      ? docs.map((post) => ({
          key: post.id,
          title: post.title,
          image: post.image,
          imageAlt: post.imageAlt || post.title,
          href: post.href,
        }))
      : blogHighlights.map((post) => ({
          key: post.slug,
          title: post.title,
          image: post.image,
          imageAlt: post.title,
          href: `/blog/${post.slug}`,
        }));

  return (
    <Section tone="alt">
      <SectionHeading
        align="center"
        title="Expert Project Insights"
        description="Practical guides to help you prepare a clearer modular or steel project brief."
      />

      <HomeCarousel
        className="mt-10"
        itemClassName="w-full md:w-[calc((100%-2.5rem)/3)]"
        prevLabel="Previous insights"
        nextLabel="Next insights"
      >
        {posts.map((post) => (
          <article key={post.key}>
            <Link href={post.href} className="block">
              <Media
                src={post.image}
                alt={post.imageAlt}
                className="aspect-[16/10] rounded-md"
                sizes="(min-width: 768px) 30vw, 90vw"
              />
            </Link>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              <Link href={post.href} className="transition-colors hover:text-brand">
                {post.title}
              </Link>
            </h3>
            <Button asChild variant="brandDark" className="mt-4">
              <Link href={post.href}>Read Full Guide</Link>
            </Button>
          </article>
        ))}
      </HomeCarousel>
    </Section>
  );
}
