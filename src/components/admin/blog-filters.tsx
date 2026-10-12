"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BlogFilters({
  q = "",
  status = "all",
  category = "all",
  sort = "published",
  categories,
  filtered,
}: {
  q?: string;
  status?: string;
  category?: string;
  sort?: string;
  categories: { id: string; title: string }[];
  filtered: boolean;
}) {
  const router = useRouter();
  const [categoryValue, setCategoryValue] = useState(category || "all");
  const [sortValue, setSortValue] = useState(
    sort === "title" || sort === "updated" ? sort : "published"
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const query = String(data.get("q") ?? "").trim();
    const nextStatus = String(data.get("status") ?? "");
    const nextCategory = String(data.get("category") ?? "");
    const nextSort = String(data.get("sort") ?? "");
    if (query) params.set("q", query);
    if (nextStatus === "draft" || nextStatus === "published") params.set("status", nextStatus);
    if (nextCategory && nextCategory !== "all") params.set("category", nextCategory);
    if (nextSort === "title" || nextSort === "updated") params.set("sort", nextSort);
    const qs = params.toString();
    router.push(qs ? `/admin/blog?${qs}` : "/admin/blog");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <div className="relative w-full sm:max-w-xs sm:flex-1">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search by title or slug"
          aria-label="Search posts"
          className="ps-9"
        />
      </div>
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="category" value={categoryValue} />
      <input type="hidden" name="sort" value={sortValue} />
      <Select value={categoryValue} onValueChange={setCategoryValue}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Category">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortValue} onValueChange={setSortValue}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Sort">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="published">Newest published</SelectItem>
          <SelectItem value="updated">Recently updated</SelectItem>
          <SelectItem value="title">Title A–Z</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit" variant="outline">
          Apply
        </Button>
        {filtered ? (
          <Button asChild variant="ghost">
            <Link href="/admin/blog">
              <X className="size-4" />
              Clear
            </Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
