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
      className="mx-auto mt-8 flex w-full max-w-3xl items-center gap-3 rounded-full border border-white/20 bg-black/45 p-2 backdrop-blur-sm"
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
        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/80 sm:text-base"
      />
      <button
        type="submit"
        className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-brand transition-colors hover:bg-brand hover:text-white"
        aria-label="Search blog"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
}
