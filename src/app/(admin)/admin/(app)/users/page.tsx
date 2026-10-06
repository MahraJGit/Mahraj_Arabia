import { requireAdmin } from "@/actions/auth";
import { UsersManager } from "@/components/admin/users-manager";
import { listUsers } from "@/lib/users/queries";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireAdmin();
  const params = await searchParams;
  const saved = Array.isArray(params.saved) ? params.saved[0] : params.saved;
  const users = await listUsers();

  return <UsersManager users={users} currentUserId={actor.id} saved={saved} />;
}
