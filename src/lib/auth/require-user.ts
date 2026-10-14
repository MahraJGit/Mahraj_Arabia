import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";

/** Server-only auth gate for RSC pages — not a Server Action. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}
