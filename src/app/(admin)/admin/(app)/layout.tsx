import Image from "next/image";
import type { ReactNode } from "react";

import { AdminLoginScreen } from "@/components/admin/admin-login-screen";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ManageAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return <AdminLoginScreen />;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-white">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
          <span className="relative size-8 shrink-0 overflow-hidden">
            <Image
              src="/brand/mahraj-mark.png"
              alt=""
              fill
              sizes="32px"
              className="object-cover object-top"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-ink">
              Mahraj <span className="text-brand">Arabia</span>
            </p>
            <p className="text-[11px] text-muted-foreground">CMS</p>
          </div>
        </div>
        <AdminNav />
        <div className="border-t border-border p-3">
          <p className="truncate px-2 text-sm font-medium text-ink">{user.name}</p>
          <p className="truncate px-2 text-xs capitalize text-muted-foreground">
            {user.role}
          </p>
          <div className="mt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
