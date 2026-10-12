import { AdminPageHeader } from "@/components/admin/page-chrome";
import { ServiceForm } from "@/components/admin/service-form";
import { requireUser } from "@/actions/auth";
import { listGroupOptions } from "@/lib/services/queries";

export default async function NewServicePage() {
  await requireUser();
  const groups = await listGroupOptions();

  return (
    <>
      <AdminPageHeader
        title="Upload service"
        description="Cover image, tags, SEO, rich content, and publishing state are stored in Supabase."
      />
      <ServiceForm groups={groups} />
    </>
  );
}
