"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  featured = "all",
  sort = "published",
  categories,
  filtered,
}: {
  q?: string;
  status?: string;
  category?: string;
  featured?: string;
  sort?: string;
  categories: { id: string; title: string }[];
  filtered: boolean;
}) {
  const router = useRouter();
  const [categoryValue, setCategoryValue] = useState(category || "all");
  const [featuredValue, setFeaturedValue] = useState(
    featured === "featured" || featured === "standard" ? featured : "all"
  );
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
    const nextFeatured = String(data.get("featured") ?? "");
    const nextSort = String(data.get("sort") ?? "");
    if (query) params.set("q", query);
    if (nextStatus === "draft" || nextStatus === "published") params.set("status", nextStatus);
    if (nextCategory && nextCategory !== "all") params.set("category", nextCategory);
    if (nextFeatured === "featured" || nextFeatured === "standard") {
      params.set("featured", nextFeatured);
    }
    if (nextSort === "title" || nextSort === "updated") params.set("sort", nextSort);
    const qs = params.toString();
    router.push(qs ? `/admin/blog?${qs}` : "/admin/blog");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <Input
        name="q"
        defaultValue={q}
        placeholder="Search title, slug, or author"
        aria-label="Search posts"
        className="w-full sm:w-64"
      />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="category" value={categoryValue} />
      <input type="hidden" name="featured" value={featuredValue} />
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
      <Select value={featuredValue} onValueChange={setFeaturedValue}>
        <SelectTrigger className="w-full sm:w-40" aria-label="Featured">
          <SelectValue placeholder="All posts" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All posts</SelectItem>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="standard">Not featured</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortValue} onValueChange={setSortValue}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Sort">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="published">Published date</SelectItem>
          <SelectItem value="updated">Last updated</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit" variant="outline">
          Filter
        </Button>
        {filtered ? (
          <Button asChild variant="ghost">
            <Link href="/admin/blog">Clear</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
