import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FormShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-6 pb-24", className)}>{children}</div>;
}

export function FormPanel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm",
        className
      )}
    >
      {title ? (
        <header className="border-b border-border/80 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}
      <div className="space-y-5 px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

export function FormSidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="space-y-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm lg:sticky lg:top-24 lg:self-start">
      {children}
    </aside>
  );
}

export function SidebarBlock({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 border-b border-border/80 px-5 py-5 last:border-b-0", className)}>
      {title ? <p className="text-sm font-semibold text-ink">{title}</p> : null}
      {children}
    </div>
  );
}

export function FormSelect({
  id,
  value,
  onChange,
  children,
  error,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <select
        id={id}
        className={cn(
          "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-ink outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          error && "border-destructive"
        )}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-6 py-3">
        {children}
      </div>
    </div>
  );
}
