import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";

/** Old /admin/login URL → short /admin */
export default async function LoginPage() {
  const user = await getCurrentUser();
  redirect(user ? "/admin" : "/admin");
}
