"use server";

import { revalidatePath } from "next/cache";

import { isDemoMode } from "@/lib/auth/demo";
import { demoWriteBlockedMessage } from "@/lib/cms/demo-data";
import { revalidateServicePaths } from "@/lib/cms/revalidate";
import { requireServiceEditor } from "@/lib/cms/permissions";
import { swapAdjacentSortOrder } from "@/lib/cms/reorder";
import { slugify } from "@/lib/cms/slug";
import { asObjectId, isObjectId, toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import {
  countServicesInGroup,
  nextSortOrder,
} from "@/lib/services/queries";
import { flattenZod } from "@/lib/validation/flatten";
import { serviceGroupInputSchema } from "@/lib/validation/service-group";

export type ActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  href?: string;
};

async function assertUniqueGroupSlug(slug: string, excludeId?: string) {
  const { MainService } = await getModels();
  const filter: Record<string, unknown> = { slug };
  if (excludeId && isObjectId(excludeId)) {
    filter._id = { $ne: asObjectId(excludeId) };
  }
  const existing = await MainService.findOne(filter).select("_id").lean();
  return !existing;
}

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

function isDuplicateKey(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000
  );
}

export async function saveServiceGroup(
  id: string | null,
  formData: FormData
): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  const parsed = parseGroupForm(formData);
  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  const data = parsed.data;
  const unique = await assertUniqueGroupSlug(data.slug, id ?? undefined);
  if (!unique) {
    return {
      fieldErrors: {
        slug: "This URL slug is already used by another service group.",
      },
    };
  }

  const { MainService } = await getModels();
  const payload = {
    title: data.title,
    slug: data.slug,
    menuDescription: data.menuDescription || "",
    sortOrder: data.sortOrder,
    showInMegaMenu: data.showInMegaMenu,
    _status: data._status,
  };

  let savedId = id;
  try {
    if (id) {
      if (!isObjectId(id)) return { error: "This service group could not be found." };
      const updated = await MainService.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true }
      );
      if (!updated) return { error: "This service group could not be found." };
    } else {
      const sortOrder =
        Number(data.sortOrder) > 0
          ? data.sortOrder
          : await nextSortOrder("main-services");
      const created = await MainService.create({ ...payload, sortOrder });
      savedId = toId(created._id);
    }
  } catch (error) {
    if (isDuplicateKey(error)) {
      return {
        fieldErrors: {
          slug: "This URL slug is already used by another service group.",
        },
      };
    }
    throw error;
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
  if (!isObjectId(id)) return { error: "This service group could not be found." };

  const childCount = await countServicesInGroup(id);
  if (childCount > 0) {
    return {
      error: `This family contains ${childCount} ${childCount === 1 ? "service" : "services"}. Move or delete those services before deleting the family.`,
    };
  }

  const { MainService } = await getModels();
  await MainService.deleteOne({ _id: asObjectId(id) });
  await revalidateServicePaths();
  revalidatePath("/admin/service-groups");
  return { href: "/admin/service-groups?saved=deleted" };
}

export async function reorderServiceGroups(orderedIds: string[]): Promise<ActionResult> {
  await requireServiceEditor();
  if (isDemoMode()) return { error: demoWriteBlockedMessage()! };
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { error: "The menu order could not be saved." };
  }
  if (orderedIds.some((id) => !isObjectId(id))) {
    return { error: "The menu order could not be saved." };
  }
  if (new Set(orderedIds).size !== orderedIds.length) {
    return { error: "The menu order could not be saved." };
  }

  const { MainService } = await getModels();
  const existing = await MainService.find().select("_id").lean();
  const existingIds = new Set(existing.map((doc) => toId(doc._id)));
  const matches =
    existingIds.size === orderedIds.length &&
    orderedIds.every((id) => existingIds.has(id));
  if (!matches) {
    return { error: "The group list changed. Refresh the page and try again." };
  }

  await Promise.all(
    orderedIds.map((id, index) =>
      MainService.updateOne(
        { _id: asObjectId(id) },
        { $set: { sortOrder: (index + 1) * 10 } }
      )
    )
  );
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
  if (!isObjectId(id)) return { error: "This service group could not be found." };
  const { MainService } = await getModels();
  const result = await swapAdjacentSortOrder(MainService, id, direction);
  if (result.error) return { error: result.error };
  if (!result.moved) return {};
  await revalidateServicePaths();
  revalidatePath("/admin/service-groups");
  return {};
}
