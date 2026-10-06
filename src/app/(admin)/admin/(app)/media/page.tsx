import Link from "next/link";

import { MediaActionProvider, MediaItemActions, MediaPreview } from "@/components/admin/media-actions";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/actions/auth";
import { listMediaLibrary } from "@/lib/media/queries";

const headClass =
  "h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground";

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const params = await searchParams;
  const q = first(params.q)?.trim() || "";
  const page = Number(first(params.page) ?? "1") || 1;
  const saved = first(params.saved);
  const result = await listMediaLibrary({ q, page });

  return (
    <>
      <AdminPageHeader
        title="Media"
        description="Images used across posts, services, and categories. Each file keeps its public URL."
      />
      {saved === "deleted" ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Image deleted.
        </div>
      ) : null}

      <form
        method="get"
        className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center"
      >
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search filename or alt text"
          aria-label="Search media"
          className="w-full sm:max-w-sm"
        />
        <div className="flex gap-2">
          <Button type="submit" variant="outline">
            Search
          </Button>
          {q ? (
            <Button asChild variant="ghost">
              <Link href="/admin/media">Clear</Link>
            </Button>
          ) : null}
        </div>
      </form>

      {result.items.length === 0 ? (
        <EmptyState
          title={q ? "No images match" : "No media yet"}
          body={
            q
              ? "Try another filename or alt text, or clear the search to see every file."
              : "Images appear here after you upload them while editing a post, service, or category."
          }
          action={
            q ? (
              <Button asChild variant="outline">
                <Link href="/admin/media">Clear search</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {result.total === 1 ? "1 image" : `${result.total} images`}
              </p>
            </div>
            <MediaActionProvider>
              <Table className="min-w-[40rem] table-fixed">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={headClass}>File</TableHead>
                    <TableHead className={`hidden w-40 md:table-cell ${headClass}`}>Alt text</TableHead>
                    <TableHead className={`hidden w-24 sm:table-cell ${headClass}`}>Type</TableHead>
                    <TableHead className={`hidden w-24 md:table-cell ${headClass}`}>Size</TableHead>
                    <TableHead className={`hidden w-28 lg:table-cell ${headClass}`}>Dimensions</TableHead>
                    <TableHead className={`hidden w-28 xl:table-cell ${headClass}`}>Added</TableHead>
                    <TableHead className={`w-44 text-end ${headClass}`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.items.map((item) => {
                    const name = item.filename || "Untitled image";
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="px-4 py-3 whitespace-normal">
                          <div className="flex items-center gap-3">
                            <MediaPreview src={item.thumbnailUrl || item.url} />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink" title={name}>
                                {name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground md:hidden">
                                {item.alt || "No alt text"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground sm:hidden">
                                {metaLine(item, "mobile")}
                              </p>
                              {metaLine(item, "between") ? (
                                <p className="hidden truncate text-xs text-muted-foreground sm:max-md:block">
                                  {metaLine(item, "between")}
                                </p>
                              ) : null}
                              {dimensions(item.width, item.height) !== "—" ? (
                                <p className="hidden truncate text-xs text-muted-foreground md:max-lg:block">
                                  {dimensions(item.width, item.height)}
                    </p>
                  ) : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-56 truncate px-4 py-3 md:table-cell">
                          {item.alt || <span className="text-muted-foreground">No alt text</span>}
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 sm:table-cell">
                          <Badge variant="muted">{typeLabel(item.mimeType)}</Badge>
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 md:table-cell">
                          {formatBytes(item.filesize)}
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 whitespace-normal lg:table-cell">
                          {dimensions(item.width, item.height)}
                        </TableCell>
                        <TableCell className="hidden px-4 py-3 xl:table-cell">
                          {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-end whitespace-nowrap">
                          <MediaItemActions
                            id={item.id}
                            filename={item.filename}
                            alt={item.alt}
                            url={item.url}
                            previewUrl={item.thumbnailUrl || item.url}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </MediaActionProvider>
          </div>

          <MediaPagination
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={(next) => mediaHref(q, next)}
          />
        </>
      )}
    </>
  );
}

function MediaPagination({
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

function mediaHref(q: string, page: number) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin/media?${qs}` : "/admin/media";
}

function metaLine(
  item: { mimeType: string; filesize: number; width: number | null; height: number | null },
  viewport: "mobile" | "between"
) {
  const size = formatBytes(item.filesize);
  const pixels = dimensions(item.width, item.height);
  const parts =
    viewport === "mobile" ? [typeLabel(item.mimeType), size, pixels] : [size, pixels];
  return parts.filter((part) => part && part !== "—").join(" · ");
}

function typeLabel(mimeType: string) {
  if (mimeType === "image/jpeg") return "JPEG";
  if (mimeType === "image/png") return "PNG";
  if (mimeType === "image/webp") return "WEBP";
  if (mimeType === "image/gif") return "GIF";
  if (mimeType === "image/svg+xml") return "SVG";
  const subtype = mimeType.split("/")[1];
  return subtype ? subtype.toUpperCase() : "File";
}

function formatBytes(value: number) {
  if (!value) return "—";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function dimensions(width: number | null, height: number | null) {
  if (!width || !height) return "—";
  return `${width}×${height}`;
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
