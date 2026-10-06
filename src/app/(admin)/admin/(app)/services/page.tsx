import Link from "next/link";
import { Plus } from "lucide-react";

import { SavedBanner } from "@/components/admin/field";
import { MenuGuide } from "@/components/admin/menu-guide";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-chrome";
import { ServiceFilters } from "@/components/admin/service-filters";
import { ServiceTable } from "@/components/admin/service-table";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/actions/auth";
import { listGroupOptions, listServices } from "@/lib/services/queries";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const params = await searchParams;
  const q = first(params.q);
  const status = first(params.status);
  const group = first(params.group);
  const ready = first(params.ready);
  const page = Number(first(params.page) ?? "1") || 1;
  const saved = first(params.saved);
  const statusFilter = status === "draft" || status === "published" ? status : "all";
  const readyFilter = ready === "ready" || ready === "soon" ? ready : "all";
  const filtered = Boolean(q || status || group || ready);
  const ordering = Boolean(group) && !q && statusFilter === "all" && readyFilter === "all";

  const [result, groups] = await Promise.all([
    listServices({
      q,
      status: statusFilter,
      group,
      ready: readyFilter,
      sort: "position",
      page: ordering ? 1 : page,
      limit: ordering ? 200 : 25,
    }),
    listGroupOptions(),
  ]);

  const canReorder = ordering && result.pageCount <= 1 && result.items.length > 1;

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Services are the links on the right of the Services menu, inside the family you choose."
        action={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus />
              New service
            </Link>
          </Button>
        }
      />
      <SavedBanner value={saved} />
      <MenuGuide focus="services" />
      <div className="mb-4">
        <ServiceFilters
          key={[q, status, group, ready].join("|")}
          q={q}
          status={statusFilter}
          group={group || "all"}
          ready={readyFilter}
          groups={groups}
          filtered={filtered}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title={filtered ? "No services match" : "No services yet"}
          body={
            filtered
              ? "Try another filter, or clear them to see every service."
              : "Create a family first, then add services under it."
          }
          action={
            filtered ? (
              <Button asChild variant="outline">
                <Link href="/admin/services">Clear filters</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/admin/services/new">
                  <Plus />
                  New service
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <ServiceTable
            services={result.items.map((service) => ({
              id: service.id,
              title: service.title,
              slug: service.slug,
              parentTitle: service.parentTitle,
              detailReady: service.detailReady,
              showInMegaMenu: service.showInMegaMenu,
              status: service.status,
              updatedLabel: formatDate(service.updatedAt),
            }))}
            total={result.total}
            groupId={group}
            canReorder={canReorder}
            ordering={ordering}
            filtered={filtered}
            startIndex={ordering ? 0 : (result.page - 1) * 25}
          />
          <ServicesPagination
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={(next) => listingHref({ q, status, group, ready }, next)}
          />
        </>
      )}
    </>
  );
}

function ServicesPagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="mt-4 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}
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

function listingHref(
  current: { q?: string; status?: string; group?: string; ready?: string },
  page: number
) {
  const params = new URLSearchParams();
  if (current.q) params.set("q", current.q);
  if (current.status === "draft" || current.status === "published") params.set("status", current.status);
  if (current.group) params.set("group", current.group);
  if (current.ready === "ready" || current.ready === "soon") params.set("ready", current.ready);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin/services?${qs}` : "/admin/services";
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
