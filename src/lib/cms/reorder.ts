import type { DbModel } from "@/lib/db/models";

type SortDoc = { _id: unknown; sortOrder?: number };

export async function swapAdjacentSortOrder(
  Model: DbModel,
  id: string,
  direction: "earlier" | "later",
  filter: Record<string, unknown> = {}
) {
  const docs = (await Model.find(filter)
    .sort({ sortOrder: 1, title: 1 })
    .select("_id sortOrder")
    .lean()) as SortDoc[];

  const index = docs.findIndex((doc) => String(doc._id) === id);
  const swapWith = direction === "earlier" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= docs.length) {
    return { moved: false as const };
  }

  const a = docs[index];
  const b = docs[swapWith];
  const aOrder = Number(a.sortOrder ?? 0);
  const bOrder = Number(b.sortOrder ?? 0);

  const first = await Model.updateOne(
    { _id: a._id, sortOrder: a.sortOrder },
    { $set: { sortOrder: bOrder } }
  );
  if (first.matchedCount !== 1) {
    return { moved: false as const, error: "The order changed. Refresh and try again." };
  }

  const second = await Model.updateOne(
    { _id: b._id, sortOrder: b.sortOrder },
    { $set: { sortOrder: aOrder } }
  );
  if (second.matchedCount !== 1) {
    await Model.updateOne({ _id: a._id }, { $set: { sortOrder: aOrder } });
    return { moved: false as const, error: "The order changed. Refresh and try again." };
  }

  return { moved: true as const };
}
