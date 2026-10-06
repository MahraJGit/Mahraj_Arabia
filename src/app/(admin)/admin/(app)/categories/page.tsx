import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";

import { CategoryActionProvider, CategoryActions } from "@/components/admin/category-actions";
import { SavedBanner } from "@/components/admin/field";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-chrome";
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
import { listCategories } from "@/lib/blog/queries";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const params = await searchParams;
  const saved = Array.isArray(params.saved) ? params.saved[0] : params.saved;
  const categories = await listCategories();

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Topics used to filter the public blog. A category can be deleted only when no posts use it."
        action={
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus />
              New category
            </Link>
          </Button>
        }
      />
      <SavedBanner value={saved} />

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          body="Create a category before publishing a blog post."
          action={
            <Button asChild>
              <Link href="/admin/categories/new">
                <Plus />
                New category
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {categories.length === 1 ? "1 category" : `${categories.length} categories`}
            </p>
          </div>
          <CategoryActionProvider>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="hidden h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:table-cell">
                    Subtitle
                  </TableHead>
                  <TableHead className="h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Posts
                  </TableHead>
                  <TableHead className="hidden h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground lg:table-cell">
                    Updated
                  </TableHead>
                  <TableHead className="h-11 bg-muted/60 px-4 text-end text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="px-4 py-3 whitespace-normal">
                      <div className="flex min-w-52 items-center gap-3">
                        {category.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.imageUrl}
                            alt=""
                            className="size-10 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <ImageIcon className="size-4" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="line-clamp-2 font-medium text-ink hover:text-brand"
                          >
                            {category.title}
                          </Link>
                          <p className="truncate text-xs text-muted-foreground">
                            {category.slug ? `/blog?category=${category.slug}` : "No public URL yet"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden px-4 py-3 whitespace-normal md:table-cell">
                      {category.subtitle ? (
                        category.subtitle
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {category.postCount > 0 ? (
                        <Badge variant="muted" className="normal-case tracking-normal">
                          {category.postCount === 1 ? "1 post" : `${category.postCount} posts`}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden px-4 py-3 lg:table-cell">
                      {formatDate(category.updatedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-end">
                      <CategoryActions
                        id={category.id}
                        title={category.title}
                        slug={category.slug}
                        postCount={category.postCount}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CategoryActionProvider>
        </div>
      )}
    </>
  );
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
