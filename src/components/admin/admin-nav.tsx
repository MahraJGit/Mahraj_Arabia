"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderTree,
  Home,
  Image as ImageIcon,
  Layers3,
  Tags,
  UserRound,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/cms/types";

const content = [
  { href: "/admin", label: "Overview", icon: Home, exact: true },
  { href: "/admin/service-groups", label: "Families", icon: FolderTree },
  { href: "/admin/services", label: "Services", icon: Layers3 },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

const settings = [
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export function AdminNav({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-6 px-3 py-4">
      <NavGroup title="Content" items={content} pathname={pathname} />
      <NavGroup
        title="Settings"
        items={settings.filter((item) => !item.adminOnly || role === "admin")}
        pathname={pathname}
      />
    </nav>
  );
}

function NavGroup({
  title,
  items,
  pathname,
}: {
  title: string;
  items: {
    href: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    exact?: boolean;
  }[];
  pathname: string;
}) {
  return (
    <div>
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-ink/80 hover:bg-muted hover:text-ink"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
