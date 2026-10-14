import { notFound } from "next/navigation";

import { SavedBanner } from "@/components/admin/field";
import { AdminPageHeader } from "@/components/admin/page-chrome";
import { ServiceForm } from "@/components/admin/service-form";
import { requireUser } from "@/lib/auth/require-user";
import { getService, listGroupOptions } from "@/lib/services/queries";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const { id } = await params;
  const saved = (await searchParams).saved;
  const service = await getService(id);
  if (!service) notFound();

  const groups = await listGroupOptions();

  return (
    <>
      <AdminPageHeader
        title={service.title}
        description={
          service.status === "published"
            ? `Live at /services/${service.slug}`
            : "Not on the public website until published."
        }
      />
      <SavedBanner value={Array.isArray(saved) ? saved[0] : saved} />
      <ServiceForm service={service} groups={groups} />
    </>
  );
}
