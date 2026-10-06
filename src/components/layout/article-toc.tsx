"use client";

import { useEffect, useState } from "react";
import { ArrowUp, List, X } from "lucide-react";

import { cn } from "@/lib/utils";

type TocItem = { id: string; title: string; level?: 2 | 3 };

function useActiveSection(items: TocItem[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    // Highlights the heading nearest the top of the reading area rather than
    // whichever one intersects first, so long sections stay selected.
    function updateActive() {
      const offset = 160;
      let current = headings[0];

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - offset <= 0) {
          current = heading;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 40;

      setActiveId(atBottom ? headings[headings.length - 1].id : current.id);
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [items]);

  return activeId;
}

export function ArticleToc({
  items,
  numbered = true,
}: {
  items: TocItem[];
  numbered?: boolean;
}) {
  const activeId = useActiveSection(items);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeIndex = Math.max(
    items.findIndex((item) => item.id === activeId),
    0
  );
  const progress = ((activeIndex + 1) / items.length) * 100;

  const list = (
    <ol className="space-y-0.5">
      {items.map((item, index) => {
        const isActive = item.id === activeId;

        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex gap-3 rounded-md border-s-2 px-3 py-2 text-sm transition-colors",
                item.level === 3 && "ps-6 text-[0.8125rem]",
                isActive
                  ? "border-brand bg-brand/5 font-medium text-brand"
                  : "border-transparent text-body hover:border-brand/40 hover:text-brand"
              )}
            >
              {numbered ? (
                <span
                  className={cn(
                    "w-6 shrink-0 tabular-nums",
                    isActive ? "text-brand" : "text-body/60"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : null}
              <span>{item.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Contents
        </p>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-body">
          Section {activeIndex + 1} of {items.length}
        </p>

        <nav aria-label="On this page" className="mt-4">
          {list}
        </nav>
      </div>

      {/* Mobile trigger + sheet */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-start"
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Contents
            </span>
            <span className="mt-0.5 block text-sm font-medium text-ink">
              {items[activeIndex]?.title}
            </span>
          </span>
          <List className="size-5 shrink-0 text-body" />
        </button>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 flex flex-col bg-black/50">
            <button
              type="button"
              aria-label="Close contents"
              className="flex-1"
              onClick={() => setMobileOpen(false)}
            />
            <div className="max-h-[75vh] overflow-y-auto rounded-t-xl bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Contents
                </p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex size-8 items-center justify-center rounded-md border border-border text-body"
                  aria-label="Close contents"
                >
                  <X className="size-4" />
                </button>
              </div>
              <nav aria-label="On this page" className="mt-4">
                {list}
              </nav>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 800);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 end-6 z-40 flex size-11 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-dark"
      aria-label="Back to top"
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
