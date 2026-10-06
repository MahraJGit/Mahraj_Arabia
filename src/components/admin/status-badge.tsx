import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/cms/status";
import type { PublishStatus } from "@/lib/cms/types";

export function StatusBadge({ status }: { status: PublishStatus }) {
  return (
    <Badge variant={status === "published" ? "published" : "draft"}>
      {statusLabel(status)}
    </Badge>
  );
}
