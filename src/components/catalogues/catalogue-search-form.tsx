"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cataloguePage } from "@/content/catalogues";

export function CatalogueSearchForm({ query }: { query?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query ?? "");

  useEffect(() => {
    setValue(query ?? "");
  }, [query]);

  function go(nextQuery: string) {
    const trimmed = nextQuery.trim();
    router.push(
      trimmed
        ? `/catalogues?q=${encodeURIComponent(trimmed)}#catalogue-results`
        : "/catalogues"
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    go(value);
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="flex flex-1 items-center gap-3 rounded-full border border-white/20 bg-black/45 p-2"
    >
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          if (next.trim() === "" && (query ?? "").trim() !== "") {
            go("");
          }
        }}
        placeholder={cataloguePage.hero.searchPlaceholder}
        aria-label="Search catalogues"
        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/60 sm:text-base"
      />
      <button
        type="submit"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark"
        aria-label="Search"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
}
