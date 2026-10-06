"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { MegaMenuColumn } from "@/lib/public/services";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function MegaMenuPanel({ columns }: { columns: MegaMenuColumn[] }) {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = columns[Math.min(activeIndex, Math.max(columns.length - 1, 0))];

  if (!active) {
    return (
      <div className="px-5 py-3">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
        >
          View all services
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-3">
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-brand">
            Our solutions
          </p>
          <p className="mt-1 text-sm text-body">
            Choose a capability, then open the detail page.
          </p>
        </div>
        <Link
          href="/services"
          className="hidden items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-brand sm:inline-flex"
        >
          View all services
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid items-start gap-2.5 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-3">
        <div
          role="tablist"
          aria-label="Service groups"
          className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {columns.map((column, index) => {
            const selected = column.title === active.title;
            return (
              <button
                key={column.title}
                type="button"
                role="tab"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "flex min-w-[11rem] shrink-0 items-center justify-between gap-2 rounded-md border px-3 py-2 text-start transition-colors lg:min-w-0 lg:w-full",
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-background text-ink hover:border-brand/40"
                )}
              >
                <span>
                  <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] opacity-70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold leading-5">
                    {column.title}
                  </span>
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
                    selected ? "bg-white/15 text-white" : "bg-surface-alt text-body"
                  )}
                >
                  {column.links.length}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.title}
            role="tabpanel"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease }}
            className="rounded-md border border-border bg-surface-alt/70 p-2"
          >
            <div className="mb-1.5 flex items-center justify-between gap-3 px-1.5">
              <h3 className="text-sm font-semibold text-ink">{active.title}</h3>
              <span className="text-xs text-body">
                {active.links.length === 1
                  ? "1 system"
                  : `${active.links.length} systems`}
              </span>
            </div>
            <ul className="grid gap-1 sm:grid-cols-2">
              {active.links.map((link) => (
                <li key={`${active.title}-${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between gap-2 rounded-md bg-background px-3 py-2 text-sm font-medium text-ink ring-1 ring-transparent transition-all hover:-translate-y-px hover:text-brand hover:ring-brand/30 hover:shadow-sm motion-reduce:hover:translate-y-0"
                  >
                    <span className="min-w-0 leading-5">{link.label}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-body transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <Link
        href="/services"
        className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand sm:hidden"
      >
        View all services
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
