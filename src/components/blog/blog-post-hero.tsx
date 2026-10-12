import { CalendarDays } from "lucide-react";

import { ProfileHero } from "@/components/layout/profile-hero";
import type { PublicPost } from "@/lib/public/blog";
import { toBlogCard } from "@/lib/public/blog";

export function BlogPostHero({ post }: { post: PublicPost }) {
  const card = toBlogCard(post, "hero");
  const image = post.coverImage?.url || card.image;

  return (
    <ProfileHero
      title={post.title}
      description={post.excerpt}
      image={image}
      breadcrumb={[
        { label: "Blogs", href: "/blog" },
        { label: post.title },
      ]}
      eyebrow={post.category?.title || "Blogs"}
      fullBleed
      footer={
        card.date ? (
          <p className="inline-flex items-center gap-1.5 text-sm text-white/80">
            <CalendarDays className="size-3.5" />
            {card.date}
          </p>
        ) : null
      }
    />
  );
}
