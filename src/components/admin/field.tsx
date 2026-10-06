import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SavedBanner({ value }: { value?: string }) {
  if (!value) return null;
  const message =
    value === "published"
      ? "Published. The website will update shortly."
      : value === "draft"
        ? "Draft saved."
        : value === "duplicated"
          ? "Copy created as a draft. It stays off the website until you publish it."
        : value === "deleted"
          ? "Deleted. The website will update shortly."
          : "Saved.";
  return (
    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
      {message}
    </div>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <p className="text-right text-[11px] text-muted-foreground">
      {value.length}/{max}
    </p>
  );
}
