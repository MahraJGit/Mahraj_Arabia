"use client";

import { Button } from "@/components/ui/button";
import { isStaleServerActionError } from "@/lib/admin/stale-action";

export function AdminErrorState({
  title,
  error,
  reset,
}: {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const transient = isStaleServerActionError(error.message);

  return (
    <div
      className="rounded-xl border border-border bg-muted/30 p-6"
      role="status"
    >
      <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {transient
          ? "This section needs a quick refresh. Your other work is unaffected."
          : "Something went wrong loading this section. Your other work is unaffected."}
      </p>
      <Button type="button" variant="outline" className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
