"use server";

import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { revalidateServicePaths } from "@/lib/cms/revalidate";
import { requireServiceEditor } from "@/lib/cms/permissions";
import { slugify } from "@/lib/cms/slug";
import { isUuid } from "@/lib/db/ids";
import { countServicesInGroup, nextSortOrder } from "@/lib/services/queries";
import {
  deleteServiceFamily,
  findServiceFamilyBySlug,
  insertServiceFamily,
  isSupabaseContentEnabled,
  listServiceFamilies,
  moveServiceFamily,
  reorderServiceFamilies,
  updateServiceFamily,
} from "@/lib/supabase/content";
import { flattenZod } from "@/lib/validation/flatten";
import { serviceGroupInputSchema } from "@/lib/validation/service-group";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  href?: string;
};

function parseGroupForm(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const slugRaw = String(formData.get("slug") ?? "");
  return serviceGroupInputSchema.safeParse({
    title,
    slug: slugRaw.trim() ? slugRaw : slugify(title),
    menuDescription: String(formData.get("menuDescription") ?? ""),
    sortOrder: formData.get("sortOrder") ?? 10,
    showInMegaMenu: formData.get("showInMegaMenu") === "on",
    _status: formData.get("_status") === "published" ? "published" : "draft",
  });
}

export async function saveServiceGroup(
  id: string | null,
  formData: FormData
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) {
    return { error: "Supabase is not configured. Connect Supabase to manage service families." };
  }

  const parsed = parseGroupForm(formData);
  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  const data = parsed.data;
  const duplicate = await findServiceFamilyBySlug(data.slug, id ?? undefined);
  if (duplicate) {
    return {
      fieldErrors: {
        slug: "This URL slug is already used by another service group.",
      },
    };
  }

  const sortOrder =
    Number(data.sortOrder) > 0
      ? data.sortOrder
      : await nextSortOrder("main-services");

  const payload = {
    title: data.title,
    slug: data.slug,
    menuDescription: data.menuDescription || "",
    sortOrder,
    showInMegaMenu: data.showInMegaMenu,
    status: data._status,
  };

  let savedId = id;
  if (id) {
    if (!isUuid(id)) {
      return { error: "This service group could not be found." };
    }
    const result = await updateServiceFamily(id, payload);
    if (result.duplicateSlug) {
      return {
        fieldErrors: {
          slug: "This URL slug is already used by another service group.",
        },
      };
    }
    if (!result.ok) {
      return { error: "This service group could not be found." };
    }
  } else {
    const created = await insertServiceFamily(payload);
    if (created.duplicateSlug) {
      return {
        fieldErrors: {
          slug: "This URL slug is already used by another service group.",
        },
      };
    }
    savedId = created.id;
  }

  await revalidateServicePaths();
  revalidatePath("/admin/service-groups");
  if (savedId) revalidatePath(`/admin/service-groups/${savedId}`);
  return {
    href: `/admin/service-groups/${savedId}?saved=${data._status === "published" ? "published" : "draft"}`,
  };
}

export async function deleteServiceGroup(id: string): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };
  if (!isUuid(id)) return { error: "This service group could not be found." };

  const childCount = await countServicesInGroup(id);
  if (childCount > 0) {
    return {
      error: `This family contains ${childCount} ${childCount === 1 ? "service" : "services"}. Move or delete those services before deleting the family.`,
    };
  }

  await deleteServiceFamily(id);
  await revalidateServicePaths();
  revalidatePath("/admin/service-groups");
  return { href: "/admin/service-groups?saved=deleted" };
}

export async function reorderServiceGroups(orderedIds: string[]): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { error: "The menu order could not be saved." };
  }
  if (orderedIds.some((id) => !isUuid(id))) {
    return { error: "The menu order could not be saved." };
  }
  if (new Set(orderedIds).size !== orderedIds.length) {
    return { error: "The menu order could not be saved." };
  }

  const existing = await listServiceFamilies();
  const existingIds = new Set(existing.map((family) => family.id));
  const matches =
    existingIds.size === orderedIds.length &&
    orderedIds.every((id) => existingIds.has(id));
  if (!matches) {
    return { error: "The group list changed. Refresh the page and try again." };
  }
  await reorderServiceFamilies(orderedIds);

  await revalidateServicePaths();
  revalidatePath("/admin/service-groups");
  return {};
}

export async function moveServiceGroup(
  id: string,
  direction: "earlier" | "later"
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!isSupabaseContentEnabled()) return { error: "Supabase is not configured." };
  if (!isUuid(id)) return { error: "This service group could not be found." };

  const result = await moveServiceFamily(id, direction);
  if (!result.moved) return {};

  await revalidateServicePaths();
  revalidatePath("/admin/service-groups");
  return {};
}
