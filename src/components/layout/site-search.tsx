"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SearchEntry } from "@/lib/public/services";

export function SiteSearch({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const results =
    term.length > 1
      ? searchIndex
          .filter((entry) => entry.label.toLowerCase().includes(term))
          .slice(0, 8)
      : [];

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="text-body">
          <Search className="size-5" />
          <span className="sr-only">Search solutions</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="p-0" showCloseButton={false}>
        <SheetHeader className="p-6">
          <SheetTitle className="sr-only">Search</SheetTitle>
          <div className="flex items-center gap-3">
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search solutions, facilities, applications..."
              className="h-12 flex-1 text-base"
            />
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="size-12 shrink-0 text-body"
              >
                <X className="size-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </SheetClose>
          </div>
          {term.length > 1 ? (
            <div className="mt-4">
              {results.length > 0 ? (
                <ul className="divide-y divide-border">
                  {results.map((result) => (
                    <li key={`${result.group}-${result.href}-${result.label}`}>
                      <Link
                        href={result.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-3 text-sm text-ink transition-colors hover:text-brand"
                      >
                        {result.label}
                        <span className="text-xs text-body">{result.group}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-3 text-sm text-body">
                  No solutions match &ldquo;{query}&rdquo;.
                </p>
              )}
            </div>
          ) : null}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
