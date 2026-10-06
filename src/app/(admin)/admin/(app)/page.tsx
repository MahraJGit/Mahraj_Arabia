import type { ComponentType } from "react";
import Link from "next/link";
import {
  FileText,
  FolderTree,
  Image as ImageIcon,
  Layers3,
  Tags,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-chrome";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getOverviewData } from "@/lib/cms/overview";

export default async function OverviewPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return null;

  const { counts, recent } = await getOverviewData();

  const attention: string[] = [];
  if (counts.posts.drafts > 0) {
    attention.push(
      `${counts.posts.drafts} blog ${counts.posts.drafts === 1 ? "post is" : "posts are"} still in draft.`
    );
  }
  if (counts.services.comingSoon > 0) {
    attention.push(
      `${counts.services.comingSoon} ${counts.services.comingSoon === 1 ? "service is" : "services are"} marked Coming Soon.`
    );
  }
  if (counts.serviceGroups.published === 0) {
    attention.push("No families are published, so the Services menu will be empty.");
  }

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="What is on the website right now, and what still needs attention."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          href="/admin/service-groups"
          icon={FolderTree}
          label="Families"
          value={counts.serviceGroups.total}
          hint={`${counts.serviceGroups.published} published`}
        />
        <StatCard
          href="/admin/services"
          icon={Layers3}
          label="Services"
          value={counts.services.total}
          hint={`${counts.services.published} published · ${counts.services.comingSoon} coming soon`}
        />
        <StatCard
          href="/admin/blog"
          icon={FileText}
          label="Blog posts"
          value={counts.posts.total}
          hint={`${counts.posts.published} published · ${counts.posts.drafts} draft`}
        />
        <StatCard
          href="/admin/media"
          icon={ImageIcon}
          label="Media"
          value={counts.media.total}
          hint={`${counts.categories.total} categories`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
          </CardHeader>
          <CardContent>
            {attention.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing urgent. Published content looks in good shape.
              </p>
            ) : (
              <ul className="space-y-2 text-sm text-ink">
                {attention.map((item) => (
                  <li key={item} className="rounded-lg bg-amber-50 px-3 py-2 text-amber-950">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shortcut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link className="block text-brand hover:underline" href="/admin/categories">
              Categories <Tags className="ml-1 inline size-3.5" />
            </Link>
            <p className="text-muted-foreground">
              Families and services build the website Services menu. Blog posts and categories are edited here too.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-heading text-lg font-semibold">Recent activity</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent posts or services yet.</p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {recent.map((item) => (
              <li key={`${item.href}-${item.id}`}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function StatCard({
  href,
  icon: Icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-colors hover:border-brand/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Icon className="size-4 text-brand" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-heading text-3xl font-semibold text-ink">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
