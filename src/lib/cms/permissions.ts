import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";

/**
 * Admin and editor may create, update, publish, unpublish, and delete content.
 */
export async function requireEditor() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  return user;
}

export async function requireServiceEditor() {
  return requireEditor();
}
