import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AdminTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border bg-card", className)}>
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-border bg-muted/60 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </th>
  );
}

export function AdminTd({ children }: { children: ReactNode }) {
  return <td className="border-b border-border px-4 py-3 text-ink last:border-b-0">{children}</td>;
}

export function AdminPagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {Array.from({ length: pageCount }, (_, index) => {
        const next = index + 1;
        return (
          <a
            key={next}
            href={hrefFor(next)}
            className={cn(
              "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2.5 text-sm",
              page === next
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted"
            )}
          >
            {next}
          </a>
        );
      })}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="font-heading text-base font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
