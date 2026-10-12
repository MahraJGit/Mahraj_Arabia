import { ExternalLink } from "lucide-react";

import type { PublishStatus } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

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
  const label = kind === "group" ? "family" : kind === "post" ? "blog" : "service";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3",
        published
          ? "border-emerald-200/80 bg-emerald-50/70"
          : "border-border/80 bg-muted/40"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex size-2.5 rounded-full",
            published ? "bg-emerald-600" : "bg-amber-500"
          )}
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold text-ink">
            {published ? "Published" : "Draft"}
          </p>
          <p className="text-xs text-muted-foreground">
            {published
              ? `This ${label} is live on the website.`
              : `This ${label} is private until you publish it.`}
          </p>
        </div>
      </div>
      {published && liveHref ? (
        <a
          href={liveHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          View live
          <ExternalLink className="size-3.5" />
        </a>
      ) : null}
    </div>
  );
}
