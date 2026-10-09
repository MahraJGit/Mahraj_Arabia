import { BlogSearchForm } from "@/components/blog/blog-search-form";
import { ProfileHero } from "@/components/layout/profile-hero";
import { blogPage } from "@/content/blog";

export function BlogHero({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  return (
    <ProfileHero
      title={blogPage.hero.title}
      description={blogPage.hero.description}
      image={blogPage.hero.image}
      breadcrumb={[{ label: "Blogs" }]}
      eyebrow="Project blogs"
      fullBleed
      footer={<BlogSearchForm query={query} category={category} />}
    />
  );
}
