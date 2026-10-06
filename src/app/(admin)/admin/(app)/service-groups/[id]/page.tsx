import { notFound } from "next/navigation";

import { SavedBanner } from "@/components/admin/field";
import { AdminPageHeader } from "@/components/admin/page-chrome";
import { ServiceGroupForm } from "@/components/admin/service-group-form";
import { requireUser } from "@/actions/auth";
import { getServiceGroup } from "@/lib/services/queries";

export default async function EditServiceGroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const { id } = await params;
  const saved = (await searchParams).saved;
  const group = await getServiceGroup(id);
  if (!group) notFound();

  return (
    <>
      <AdminPageHeader
        title={group.title}
        description="Edit this family. Published changes appear on the left of the Services menu."
      />
      <SavedBanner value={Array.isArray(saved) ? saved[0] : saved} />
      <ServiceGroupForm group={group} />
    </>
  );
}
