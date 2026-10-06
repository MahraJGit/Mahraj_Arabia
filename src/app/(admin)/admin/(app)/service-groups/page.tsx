import Link from "next/link";
import { Plus } from "lucide-react";

import { SavedBanner } from "@/components/admin/field";
import { MenuGuide } from "@/components/admin/menu-guide";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-chrome";
import { ServiceGroupFilters } from "@/components/admin/service-group-filters";
import { ServiceGroupTable } from "@/components/admin/service-group-table";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/actions/auth";
import { listServiceGroups } from "@/lib/services/queries";

export default async function ServiceGroupsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const params = await searchParams;
  const q = first(params.q);
  const status = first(params.status);
  const menu = first(params.menu);
  const page = Number(first(params.page) ?? "1") || 1;
  const saved = first(params.saved);
  const statusFilter = status === "draft" || status === "published" ? status : "all";
  const menuFilter = menu === "visible" || menu === "hidden" ? menu : "all";

  const filtered = Boolean(q || status || menu);
  const query = { q, status: statusFilter, menu: menuFilter };

  const result = await listServiceGroups({
    q,
    status: statusFilter,
    menu: menuFilter,
    page: filtered ? page : 1,
    limit: filtered ? 50 : 200,
  });
  const canReorder = !filtered && result.pageCount <= 1 && result.items.length > 1;

  return (
    <>
      <AdminPageHeader
        title="Families"
        description="These are the choices on the left of the Services menu."
        action={
          <Button asChild>
            <Link href="/admin/service-groups/new">
              <Plus />
              New family
            </Link>
          </Button>
        }
      />
      <SavedBanner value={saved} />
      <MenuGuide focus="families" />
      <div className="mb-4">
        <ServiceGroupFilters
          key={[q, status, menu].join("|")}
          q={q}
          status={statusFilter}
          menu={menuFilter}
          filtered={filtered}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title={filtered ? "No families match" : "No families yet"}
          body={
            filtered
              ? "Try another filter, or clear them to see every family."
              : "Create the first family, then add services under it."
          }
          action={
            filtered ? (
              <Button asChild variant="outline">
                <Link href="/admin/service-groups">Clear filters</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/admin/service-groups/new">
                  <Plus />
                  New family
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <ServiceGroupTable
            groups={result.items.map((group) => ({
              id: group.id,
              title: group.title,
              slug: group.slug,
              showInMegaMenu: group.showInMegaMenu,
              status: group.status,
              serviceCount: group.serviceCount,
              updatedLabel: formatDate(group.updatedAt),
            }))}
            total={result.total}
            canReorder={canReorder}
            filtered={filtered}
          />
          <GroupPagination
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={(next) => listingHref(query, { page: String(next) })}
          />
        </>
      )}
    </>
  );
}

function GroupPagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  const pages = pageWindow(page, pageCount);

  return (
    <nav
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <div className="flex flex-wrap gap-1">
        {page > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}
        {pages.map((next) => (
          <Button key={next} asChild variant={next === page ? "default" : "outline"} size="sm">
            <Link href={hrefFor(next)} aria-current={next === page ? "page" : undefined}>
              {next}
            </Link>
          </Button>
        ))}
        {page < pageCount ? (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page + 1)}>Next</Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
    </nav>
  );
}

function pageWindow(page: number, pageCount: number) {
  const width = 5;
  const start = Math.max(1, Math.min(page - 2, pageCount - width + 1));
  const end = Math.min(pageCount, start + width - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function listingHref(
  current: { q?: string; status?: string; menu?: string },
  patch: { page?: string }
) {
  const params = new URLSearchParams();
  if (current.q) params.set("q", current.q);
  if (current.status === "draft" || current.status === "published") {
    params.set("status", current.status);
  }
  if (current.menu === "visible" || current.menu === "hidden") {
    params.set("menu", current.menu);
  }
  if (patch.page && patch.page !== "1") params.set("page", patch.page);
  const qs = params.toString();
  return qs ? `/admin/service-groups?${qs}` : "/admin/service-groups";
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
