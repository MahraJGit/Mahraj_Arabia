import type { PublishStatus } from "@/lib/cms/types";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type {
  ServiceFamilyRow,
  ServiceFamilyWrite,
} from "@/lib/supabase/content/types";

function client() {
  return getSupabaseAdminClient();
}

function asFamily(row: ServiceFamilyRow) {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    menuDescription: String(row.menu_description ?? ""),
    sortOrder: Number(row.sort_order ?? 10),
    showInMegaMenu: row.show_in_mega_menu !== false,
    status: (row.status === "published" ? "published" : "draft") as PublishStatus,
    updatedAt: String(row.updated_at ?? ""),
  };
}

export async function listServiceFamilies(filters?: {
  q?: string;
  status?: "all" | PublishStatus;
  menu?: "all" | "visible" | "hidden";
  publishedOnly?: boolean;
}) {
  let query = client()
    .from("service_families")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (filters?.publishedOnly || filters?.status === "published") {
    query = query.eq("status", "published");
  } else if (filters?.status === "draft") {
    query = query.eq("status", "draft");
  }

  if (filters?.menu === "visible") {
    query = query.eq("show_in_mega_menu", true);
  } else if (filters?.menu === "hidden") {
    query = query.eq("show_in_mega_menu", false);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as ServiceFamilyRow[];
  const q = filters?.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) || row.slug.toLowerCase().includes(q)
    );
  }

  return rows.map(asFamily);
}

export async function getServiceFamily(id: string) {
  const { data, error } = await client()
    .from("service_families")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return asFamily(data as ServiceFamilyRow);
}

export async function findServiceFamilyBySlug(slug: string, excludeId?: string) {
  let query = client()
    .from("service_families")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? String(data.id) : null;
}

export async function nextServiceFamilySortOrder() {
  const { data, error } = await client()
    .from("service_families")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Number(data?.sort_order ?? 0) + 10;
}

export async function insertServiceFamily(input: ServiceFamilyWrite) {
  const { data, error } = await client()
    .from("service_families")
    .insert({
      title: input.title,
      slug: input.slug,
      menu_description: input.menuDescription || "",
      sort_order: input.sortOrder,
      show_in_mega_menu: input.showInMegaMenu,
      status: input.status,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { id: null as string | null, duplicateSlug: true as const };
    }
    throw new Error(error.message);
  }

  return { id: String(data.id), duplicateSlug: false as const };
}

export async function updateServiceFamily(id: string, input: ServiceFamilyWrite) {
  const { data, error } = await client()
    .from("service_families")
    .update({
      title: input.title,
      slug: input.slug,
      menu_description: input.menuDescription || "",
      sort_order: input.sortOrder,
      show_in_mega_menu: input.showInMegaMenu,
      status: input.status,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, duplicateSlug: true as const };
    }
    throw new Error(error.message);
  }

  if (!data) return { ok: false as const, duplicateSlug: false as const };
  return { ok: true as const, duplicateSlug: false as const };
}

export async function deleteServiceFamily(id: string) {
  const { error } = await client().from("service_families").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderServiceFamilies(orderedIds: string[]) {
  const updates = orderedIds.map((id, index) =>
    client()
      .from("service_families")
      .update({ sort_order: (index + 1) * 10 })
      .eq("id", id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);
}

export async function moveServiceFamily(
  id: string,
  direction: "earlier" | "later"
) {
  const families = await listServiceFamilies();
  const index = families.findIndex((family) => family.id === id);
  const swapWith = direction === "earlier" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= families.length) {
    return { moved: false as const };
  }

  const a = families[index];
  const b = families[swapWith];
  await Promise.all([
    client()
      .from("service_families")
      .update({ sort_order: b.sortOrder })
      .eq("id", a.id),
    client()
      .from("service_families")
      .update({ sort_order: a.sortOrder })
      .eq("id", b.id),
  ]);

  return { moved: true as const };
}

export async function getServiceFamilyTitles(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const map = new Map<string, { id: string; title: string }>();
  if (unique.length === 0) return map;

  const { data, error } = await client()
    .from("service_families")
    .select("id, title")
    .in("id", unique);

  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    map.set(String(row.id), {
      id: String(row.id),
      title: String(row.title ?? ""),
    });
  }
  return map;
}
