import { isDemoMode } from "@/lib/auth/demo";
import { getDemoOverviewData } from "@/lib/cms/demo-data";
import { publishStatus } from "@/lib/cms/status";
import {
  isSupabaseContentEnabled,
  listBlogCategories,
  listBlogPosts,
  listCmsServices,
  listServiceFamilies,
} from "@/lib/supabase/content";

export type OverviewCounts = {
  serviceGroups: { total: number; published: number };
  services: { total: number; published: number; comingSoon: number };
  posts: { total: number; published: number; drafts: number };
  categories: { total: number };
  media: { total: number };
};

export type RecentItem = {
  id: string;
  title: string;
  href: string;
  status: "draft" | "published";
  updatedAt: string;
};

export async function getOverviewData() {
  if (!isSupabaseContentEnabled()) {
    if (isDemoMode()) return getDemoOverviewData();
    return {
      counts: {
        serviceGroups: { total: 0, published: 0 },
        services: { total: 0, published: 0, comingSoon: 0 },
        posts: { total: 0, published: 0, drafts: 0 },
        categories: { total: 0 },
        media: { total: 0 },
      },
      recent: [] as RecentItem[],
    };
  }

  const [families, services, posts, categories] = await Promise.all([
    listServiceFamilies(),
    listCmsServices({ limit: 200, sort: "updated" }),
    listBlogPosts({ limit: 5, sort: "updated" }),
    listBlogCategories(),
  ]);

  const publishedFamilies = families.filter((item) => item.status === "published").length;
  const publishedServices = services.items.filter((item) => item.status === "published").length;

  const counts: OverviewCounts = {
    serviceGroups: {
      total: families.length,
      published: publishedFamilies,
    },
    services: {
      total: services.total,
      published: publishedServices,
      comingSoon: Math.max(0, services.total - publishedServices),
    },
    posts: {
      total: posts.counts.all,
      published: posts.counts.published,
      drafts: posts.counts.draft,
    },
    categories: { total: categories.length },
    media: { total: 0 },
  };

  const recent: RecentItem[] = [
    ...posts.items.map((post) => ({
      id: post.id,
      title: post.title || "Untitled post",
      href: `/admin/blog/${post.id}`,
      status: publishStatus(post.status),
      updatedAt: post.updatedAt,
    })),
    ...services.items.slice(0, 5).map((service) => ({
      id: service.id,
      title: service.title || "Untitled service",
      href: `/admin/services/${service.id}`,
      status: publishStatus(service.status),
      updatedAt: service.updatedAt,
    })),
  ]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 8);

  return { counts, recent };
}
