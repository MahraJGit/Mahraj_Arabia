"use client";

import { Button } from "@/components/ui/button";

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6" role="alert">
      <h2 className="font-heading text-lg font-semibold">Could not load media</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "Something went wrong while reading the media library."}
      </p>
      <Button type="button" variant="outline" className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
