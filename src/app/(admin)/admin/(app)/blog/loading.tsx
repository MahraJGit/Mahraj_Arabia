export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading blog posts</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-16 animate-pulse rounded-xl bg-muted" />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="size-10 shrink-0 animate-pulse rounded-md bg-muted" />
            <div className="h-4 min-w-0 flex-1 animate-pulse rounded-md bg-muted" />
            <div className="hidden h-5 w-20 animate-pulse rounded-full bg-muted sm:block" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
