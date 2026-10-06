"use client";

import { Children, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function HomeCarousel({
  children,
  className,
  itemClassName,
  gapClassName = "gap-5",
  heading,
  middle,
  controlsPlacement = "after",
  controlStyle = "circles",
  prevLabel = "Previous",
  nextLabel = "Next",
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  gapClassName?: string;
  heading?: ReactNode;
  middle?: ReactNode;
  controlsPlacement?: "before" | "after";
  controlStyle?: "circles" | "squares";
  prevLabel?: string;
  nextLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const loopSlides = count > 0 ? [...slides, ...slides, ...slides] : [];

  function getMetrics() {
    const root = scrollerRef.current;
    const item = root?.firstElementChild as HTMLElement | null;
    if (!root || !item || count === 0) return null;

    const styles = getComputedStyle(root);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const itemSize = item.offsetWidth + gap;

    return { root, itemSize, count };
  }

  function jumpTo(index: number) {
    const metrics = getMetrics();
    if (!metrics || metrics.itemSize <= 0) return;

    metrics.root.style.scrollBehavior = "auto";
    metrics.root.scrollLeft = index * metrics.itemSize;
    metrics.root.style.scrollBehavior = "";
  }

  function normalize() {
    const metrics = getMetrics();
    if (!metrics || metrics.itemSize <= 0) return;

    const index = Math.round(metrics.root.scrollLeft / metrics.itemSize);

    if (index < count) {
      jumpTo(index + count);
    } else if (index >= count * 2) {
      jumpTo(index - count);
    }
  }

  useLayoutEffect(() => {
    jumpTo(count);
  }, [count]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    let settleTimer = 0;

    function onScroll() {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(normalize, 120);
    }

    function onResize() {
      const metrics = getMetrics();
      if (!metrics || metrics.itemSize <= 0) return;

      const index = Math.round(metrics.root.scrollLeft / metrics.itemSize);
      const wrapped = ((index % count) + count) % count;
      jumpTo(wrapped + count);
    }

    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", normalize);
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(settleTimer);
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", normalize);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  function scroll(direction: 1 | -1) {
    const metrics = getMetrics();
    if (!metrics) return;

    metrics.root.scrollBy({
      left: direction * metrics.itemSize,
      behavior: "smooth",
    });
  }

  const controls =
    controlStyle === "squares" ? (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="inline-flex size-7 items-center justify-center rounded border border-border text-body transition-colors hover:border-brand hover:text-brand"
          aria-label={prevLabel}
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="inline-flex size-7 items-center justify-center rounded border border-border text-body transition-colors hover:border-brand hover:text-brand"
          aria-label={nextLabel}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    ) : (
      <div className="mt-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark"
          aria-label={prevLabel}
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark"
          aria-label={nextLabel}
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    );

  const header =
    heading || controlsPlacement === "before" ? (
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">{heading}</div>
        {controlsPlacement === "before" ? controls : null}
      </div>
    ) : null;

  return (
    <>
      {header}
      {middle}
      <div
        ref={scrollerRef}
        className={cn(
          "flex overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          gapClassName,
          className
        )}
      >
        {loopSlides.map((child, index) => (
          <div
            key={`${count}-${index}`}
            className={cn("snap-start shrink-0", itemClassName)}
          >
            {child}
          </div>
        ))}
      </div>
      {controlsPlacement === "after" ? controls : null}
    </>
  );
}
