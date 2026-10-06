import { AdminPageHeader } from "@/components/admin/page-chrome";
import { ServiceForm } from "@/components/admin/service-form";
import { requireUser } from "@/actions/auth";
import { listGroupOptions, listServiceOptions } from "@/lib/services/queries";

export default async function NewServicePage() {
  await requireUser();
  const [groups, relatedOptions] = await Promise.all([
    listGroupOptions(),
    listServiceOptions(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="New service"
        description="Choose a family first. The service is listed on the right of that family in the Services menu."
      />
      <ServiceForm groups={groups} relatedOptions={relatedOptions} />
    </>
  );
}
