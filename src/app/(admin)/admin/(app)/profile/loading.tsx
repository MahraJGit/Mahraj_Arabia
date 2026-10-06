export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading profile</span>
      <div className="space-y-2">
        <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full max-w-lg animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="h-56 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-6">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
