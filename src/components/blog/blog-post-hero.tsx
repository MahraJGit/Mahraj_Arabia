import { CalendarDays } from "lucide-react";

import { Media } from "@/components/media";
import { ProfileHero } from "@/components/layout/profile-hero";
import type { PublicPost } from "@/lib/public/blog";
import { toBlogCard } from "@/lib/public/blog";

export function BlogPostHero({ post }: { post: PublicPost }) {
  const card = toBlogCard(
    {
      ...post,
      coverUrl: post.coverImage?.url,
      coverAlt: post.coverImage?.alt,
      authorImageUrl: post.authorImage?.url,
      authorImageAlt: post.authorImage?.alt,
      categoryTitle: post.category?.title,
      categorySlug: post.category?.slug,
    },
    "hero"
  );
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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {post.author ? (
            <div className="flex items-center gap-3">
              {post.authorImage?.url ? (
                <Media
                  src={post.authorImage.url}
                  alt={post.authorImage.alt || post.author}
                  className="size-11 overflow-hidden rounded-full ring-2 ring-white/30"
                  sizes="44px"
                />
              ) : null}
              <div>
                <p className="text-sm font-semibold text-white">{post.author}</p>
                {post.authorRole ? (
                  <p className="text-xs text-white/75">{post.authorRole}</p>
                ) : null}
              </div>
            </div>
          ) : null}
          {card.date ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-white/80">
              <CalendarDays className="size-3.5" aria-hidden />
              {card.date}
            </p>
          ) : null}
        </div>
      }
    />
  );
}
