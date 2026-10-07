"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { blogPage } from "@/content/blog";

export function BlogSearchForm({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query ?? "");

  useEffect(() => {
    setValue(query ?? "");
  }, [query]);

  function buildHref(nextQuery: string) {
    const params = new URLSearchParams();
    const trimmed = nextQuery.trim();

    if (category) params.set("category", category);
    if (trimmed) params.set("q", trimmed);

    const search = params.toString();
    return search ? `/blog?${search}#latest-insights` : "/blog#latest-insights";
  }

  function resetResults() {
    setValue("");
    router.push(buildHref(""));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      resetResults();
      return;
    }

    router.push(buildHref(trimmed));
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="mt-2 flex w-full max-w-xl items-center gap-2 border border-border bg-background p-1.5"
    >
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);

          // Clearing the field (typing delete or native clear "x") resets results.
          if (next.trim() === "" && (query ?? "").trim() !== "") {
            router.push(buildHref(""));
          }
        }}
        placeholder={blogPage.hero.searchPlaceholder}
        aria-label="Search blog"
        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-body sm:text-base"
      />
      <button
        type="submit"
        className="inline-flex size-11 shrink-0 items-center justify-center bg-brand text-white transition-colors hover:bg-brand-dark"
        aria-label="Search blog"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
}
