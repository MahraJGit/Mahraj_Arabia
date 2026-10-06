import { toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { isDemoMode } from "@/lib/auth/demo";
import { getDemoOverviewData } from "@/lib/cms/demo-data";
import { publishStatus } from "@/lib/cms/status";

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
  if (isDemoMode()) {
    return getDemoOverviewData();
  }

  const { MainService, Service, Post, Category, Media } = await getModels();

  const [
    serviceGroupsTotal,
    serviceGroupsPublished,
    servicesTotal,
    servicesPublished,
    servicesComingSoon,
    postsTotal,
    postsPublished,
    categoriesTotal,
    mediaTotal,
    recentPosts,
    recentServices,
  ] = await Promise.all([
    MainService.countDocuments(),
    MainService.countDocuments({ _status: "published" }),
    Service.countDocuments(),
    Service.countDocuments({ _status: "published" }),
    Service.countDocuments({
      $or: [{ detailReady: { $ne: true } }, { detailReady: { $exists: false } }],
    }),
    Post.countDocuments(),
    Post.countDocuments({ _status: "published" }),
    Category.countDocuments(),
    Media.countDocuments(),
    Post.find().sort({ updatedAt: -1 }).limit(5).select("title slug _status updatedAt").lean(),
    Service.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title slug _status updatedAt")
      .lean(),
  ]);

  const counts: OverviewCounts = {
    serviceGroups: {
      total: serviceGroupsTotal,
      published: serviceGroupsPublished,
    },
    services: {
      total: servicesTotal,
      published: servicesPublished,
      comingSoon: servicesComingSoon,
    },
    posts: {
      total: postsTotal,
      published: postsPublished,
      drafts: Math.max(0, postsTotal - postsPublished),
    },
    categories: { total: categoriesTotal },
    media: { total: mediaTotal },
  };

  const recent: RecentItem[] = [
    ...recentPosts.map((doc) => ({
      id: toId(doc._id),
      title: String(doc.title ?? "Untitled post"),
      href: `/admin/blog/${toId(doc._id)}`,
      status: publishStatus(doc._status),
      updatedAt: formatWhen(doc.updatedAt),
    })),
    ...recentServices.map((doc) => ({
      id: toId(doc._id),
      title: String(doc.title ?? "Untitled service"),
      href: `/admin/services/${toId(doc._id)}`,
      status: publishStatus(doc._status),
      updatedAt: formatWhen(doc.updatedAt),
    })),
  ]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 8);

  return { counts, recent };
}

function formatWhen(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}
