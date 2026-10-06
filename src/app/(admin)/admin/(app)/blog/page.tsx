import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";

import { BlogFilters } from "@/components/admin/blog-filters";
import { BlogActionProvider, BlogPostActions } from "@/components/admin/blog-post-actions";
import { SavedBanner } from "@/components/admin/field";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-chrome";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/actions/auth";
import { listCategoryOptions, listPosts } from "@/lib/blog/queries";
import { cn } from "@/lib/utils";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const params = await searchParams;
  const q = first(params.q);
  const status = first(params.status);
  const category = first(params.category);
  const featured = first(params.featured);
  const sort = first(params.sort);
  const page = Number(first(params.page) ?? "1") || 1;
  const saved = first(params.saved);
  const statusFilter = status === "draft" || status === "published" ? status : "all";

  const [result, categories] = await Promise.all([
    listPosts({
      q,
      status: statusFilter,
      category,
      featured: featured === "featured" || featured === "standard" ? featured : "all",
      sort: sort === "title" || sort === "updated" ? sort : "published",
      page,
      limit: 25,
    }),
    listCategoryOptions(),
  ]);

  const filtered = Boolean(q || status || category || featured || (sort && sort !== "published"));
  const query = { q, status, category, featured, sort };

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Published posts appear on the website. Drafts stay hidden until you publish them."
        action={
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus />
              New post
            </Link>
          </Button>
        }
      />
      <SavedBanner value={saved} />

      <nav className="mb-3 flex flex-wrap gap-2" aria-label="Filter by status">
        <StatusTab
          href={listingHref(query, { status: undefined })}
          active={statusFilter === "all"}
          label="All"
          count={result.counts.all}
        />
        <StatusTab
          href={listingHref(query, { status: "published" })}
          active={statusFilter === "published"}
          label="Published"
          count={result.counts.published}
        />
        <StatusTab
          href={listingHref(query, { status: "draft" })}
          active={statusFilter === "draft"}
          label="Draft"
          count={result.counts.draft}
        />
      </nav>

      <div className="mb-4">
        <BlogFilters
          key={[q, status, category, featured, sort].join("|")}
          q={q}
          status={statusFilter}
          category={category || "all"}
          featured={featured}
          sort={sort}
          categories={categories}
          filtered={filtered}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title={filtered ? "No posts match" : "No blog posts yet"}
          body={
            filtered
              ? "Try another filter, or clear them to see every post."
              : "Drafts stay private. Published posts appear on the website blog."
          }
          action={
            filtered ? (
              <Button asChild variant="outline">
                <Link href="/admin/blog">Clear filters</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/admin/blog/new">
                  <Plus />
                  New post
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {result.total === 1 ? "1 post" : `${result.total} posts`}
              </p>
            </div>
            <BlogActionProvider>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Post
                    </TableHead>
                    <TableHead className="h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="hidden h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground lg:table-cell">
                      Featured
                    </TableHead>
                    <TableHead className="hidden h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground xl:table-cell">
                      Author
                    </TableHead>
                    <TableHead className="hidden h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:table-cell">
                      Published
                    </TableHead>
                    <TableHead className="hidden h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground xl:table-cell">
                      Updated
                    </TableHead>
                    <TableHead className="h-11 bg-muted/60 px-4 text-end text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.items.map((post) => {
                    const draft = post.status === "draft";
                    return (
                      <TableRow
                        key={post.id}
                        className={cn(
                          draft && "bg-amber-50/80 hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
                        )}
                      >
                        <TableCell className="px-4 py-3 whitespace-normal">
                          <div className="flex min-w-56 items-center gap-3">
                            <span
                              className={cn(
                                "h-10 w-1 shrink-0 rounded-full",
                                draft ? "bg-amber-400" : "bg-emerald-500"
                              )}
                              aria-hidden
                            />
                            {post.coverUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={post.coverUrl}
                                alt=""
                                className="size-10 shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <ImageIcon className="size-4" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Link
                                  href={`/admin/blog/${post.id}`}
                                  className="line-clamp-2 font-medium text-ink hover:text-brand"
                                >
                                  {post.title}
                                </Link>
                                {post.featured ? (
                                  <Badge variant="muted" className="lg:hidden">
                                    Featured
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="truncate text-xs text-muted-foreground">
                                {post.slug ? `/blog/${post.slug}` : "No public URL yet"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 whitespace-normal">
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={post.status} />
                            <span className="text-xs text-muted-foreground">
                              {draft ? "Hidden from the website" : "On the website"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 whitespace-normal md:table-cell">
                          {post.categoryTitle === "—" ? (
                            <span className="text-muted-foreground">Uncategorised</span>
                          ) : (
                            post.categoryTitle
                          )}
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 lg:table-cell">
                          {post.featured ? (
                            <Badge variant="muted">Featured</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden max-w-40 truncate px-4 py-3 xl:table-cell">
                          {displayAuthor(post.author)}
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 whitespace-normal md:table-cell">
                          {post.publishedAt ? (
                            formatDate(post.publishedAt)
                          ) : (
                            <span className="text-muted-foreground">
                              {draft ? "Not published" : "—"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 xl:table-cell">
                          {formatDate(post.updatedAt)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-end">
                          <BlogPostActions
                            id={post.id}
                            title={post.title}
                            slug={post.slug}
                            status={post.status}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </BlogActionProvider>
          </div>

          <BlogPagination
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={(next) => listingHref(query, { page: String(next) })}
          />
        </>
      )}
    </>
  );
}

function StatusTab({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Button asChild variant={active ? "default" : "outline"} size="sm">
      <Link href={href} aria-current={active ? "page" : undefined}>
        {label}
        <span
          className={cn(
            "tabular-nums",
            active ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {count}
        </span>
      </Link>
    </Button>
  );
}

function BlogPagination({
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
        {pages[0] > 1 ? (
          <span className="inline-flex h-7 items-center px-1 text-sm text-muted-foreground">…</span>
        ) : null}
        {pages.map((next) => (
          <Button key={next} asChild variant={next === page ? "default" : "outline"} size="sm">
            <Link href={hrefFor(next)} aria-current={next === page ? "page" : undefined}>
              {next}
            </Link>
          </Button>
        ))}
        {pages[pages.length - 1] < pageCount ? (
          <span className="inline-flex h-7 items-center px-1 text-sm text-muted-foreground">…</span>
        ) : null}
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
  current: {
    q?: string;
    status?: string;
    category?: string;
    featured?: string;
    sort?: string;
  },
  patch: {
    q?: string;
    status?: string;
    category?: string;
    featured?: string;
    sort?: string;
    page?: string;
  }
) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.status === "draft" || next.status === "published") params.set("status", next.status);
  if (next.category) params.set("category", next.category);
  if (next.featured === "featured" || next.featured === "standard") {
    params.set("featured", next.featured);
  }
  if (next.sort === "title" || next.sort === "updated") params.set("sort", next.sort);
  if (next.page && next.page !== "1") params.set("page", next.page);
  const qs = params.toString();
  return qs ? `/admin/blog?${qs}` : "/admin/blog";
}

function displayAuthor(author: string) {
  const name = author.replace(/^by\s+/i, "").trim();
  return name || "—";
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00.000Z`);
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
