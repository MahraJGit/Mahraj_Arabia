import { toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { loadMediaMap, resolveMediaUrl } from "@/lib/public/media";

export type BlogCategory = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  postCount: number;
};

export async function getCategories(): Promise<BlogCategory[]> {
  try {
    const { Category, Post } = await getModels();
    const docs = await Category.find().sort({ title: 1 }).limit(100).lean();
    const media = await loadMediaMap(docs.map((doc) => toId(doc.image)));

    const counts = await Post.aggregate<{ _id: unknown; total: number }>([
      { $match: { _status: "published" } },
      { $group: { _id: "$category", total: { $sum: 1 } } },
    ]);
    const countById = new Map(
      counts.map((row) => [toId(row._id), row.total] as const)
    );

    return docs.map((doc) => {
      const image = resolveMediaUrl(media.get(toId(doc.image)) ?? null, "card");
      return {
        id: toId(doc._id),
        title: typeof doc.title === "string" ? doc.title : "",
        slug: typeof doc.slug === "string" ? doc.slug : "",
        subtitle: typeof doc.subtitle === "string" ? doc.subtitle : "",
        image: image.url,
        postCount: countById.get(toId(doc._id)) ?? 0,
      };
    });
  } catch {
    return [];
  }
}
