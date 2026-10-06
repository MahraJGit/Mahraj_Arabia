import type { PublishStatus } from "@/lib/cms/types";

export function PublishStatusBanner({
  status,
  kind,
  liveHref,
}: {
  status: PublishStatus;
  kind: "service" | "group" | "post";
  liveHref?: string;
}) {
  const published = status === "published";

  return (
    <div
      className={
        published
          ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
          : "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
      }
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={
            published
              ? "inline-block size-2.5 rounded-full bg-emerald-600"
              : "inline-block size-2.5 rounded-full border-2 border-amber-700"
          }
          aria-hidden
        />
        {published ? "Published" : "Draft"}
      </p>
      <p className="mt-1 text-sm text-ink/80">
        {published
          ? "Changes made here will update the live website immediately."
          : "This content is not visible on the public website until published."}
      </p>
      {(kind === "service" || kind === "post") && published && liveHref ? (
        <a
          href={liveHref}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex text-sm font-medium text-brand hover:underline"
        >
          View live
        </a>
      ) : null}
      {(kind === "service" || kind === "post") && !published ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Draft preview will be available in a later phase.
        </p>
      ) : null}
      {kind === "group" ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Service groups do not have their own page. When published, a family appears on the left of the Services menu.
        </p>
      ) : null}
    </div>
  );
}
