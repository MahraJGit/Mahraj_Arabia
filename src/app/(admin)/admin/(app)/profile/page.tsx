import { AdminPageHeader } from "@/components/admin/page-chrome";
import { ProfileAccount } from "@/components/admin/profile-account";
import { requireUser } from "@/lib/auth/require-user";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <>
      <AdminPageHeader
        title="Profile"
        description="View and update your account details, or change the password you use to sign in."
      />
      <ProfileAccount user={user} />
    </>
  );
}
