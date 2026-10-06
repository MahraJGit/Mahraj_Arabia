import type { Metadata } from "next";

import { BlogHero } from "@/components/blog/blog-hero";
import {
  ExploreByTopic,
  FeaturedBlogs,
  KnowledgeHubBand,
  LatestInsights,
  LessonsAndCta,
  WorkingOnSection,
} from "@/components/blog/blog-sections";
import { getCategories, getFeaturedPosts, getPosts } from "@/lib/public/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Short practical guides to help you prepare a clearer modular or steel project brief.",
};

function firstValue(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

export default async function BlogPage({
  searchParams,
}: PageProps<"/blog">) {
  const params = await searchParams;
  const categorySlug = firstValue(params.category);
  const query = firstValue(params.q);
  const page = Number(firstValue(params.page) ?? "1") || 1;

  const [featured, categories, latest] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
    getPosts({ page, categorySlug, search: query }),
  ]);

  return (
    <>
      <BlogHero query={query} category={categorySlug} />
      <FeaturedBlogs posts={featured} />
      <ExploreByTopic categories={categories} />
      {/* <WorkingOnSection /> */}
      <LatestInsights
        posts={latest.docs}
        categories={categories}
        activeCategory={categorySlug}
        query={query}
        page={latest.page}
        totalPages={latest.totalPages}
      />
      {/* <KnowledgeHubBand /> */}
      <LessonsAndCta />
    </>
  );
}
