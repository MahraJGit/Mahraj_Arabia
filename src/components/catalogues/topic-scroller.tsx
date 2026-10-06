"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function TopicScroller({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const overflow = max > 2;
    setEdges({
      left: overflow && el.scrollLeft > 2,
      right: overflow && el.scrollLeft < max - 2,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const item = el.querySelector("li");
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const amount = (item?.getBoundingClientRect().width ?? 144) + gap;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  const overflowing = edges.left || edges.right;

  return (
    <div className="relative">
      <ul
        ref={scrollerRef}
        className={cn(
          "flex gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          overflowing ? "justify-start" : "justify-center",
        )}
      >
        {children}
      </ul>

      {edges.left ? (
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute start-0 top-[5.25rem] z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-colors hover:bg-brand hover:text-white sm:top-24"
          aria-label="Scroll industries left"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : null}
      {edges.right ? (
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute end-0 top-[5.25rem] z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-colors hover:bg-brand hover:text-white sm:top-24"
          aria-label="Scroll industries right"
        >
          <ChevronRight className="size-5" />
        </button>
      ) : null}
    </div>
  );
}
