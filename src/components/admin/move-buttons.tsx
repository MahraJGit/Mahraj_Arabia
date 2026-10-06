"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { moveServiceGroup } from "@/actions/service-groups";
import { moveService } from "@/actions/services";
import { Button } from "@/components/ui/button";

export function MoveGroupButton({
  id,
  direction,
}: {
  id: string;
  direction: "earlier" | "later";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await moveServiceGroup(id, direction);
          router.refresh();
        })
      }
    >
      {direction === "earlier" ? "Earlier" : "Later"}
    </Button>
  );
}

export function MoveServiceButton({
  id,
  direction,
}: {
  id: string;
  direction: "earlier" | "later";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await moveService(id, direction);
          router.refresh();
        })
      }
    >
      {direction === "earlier" ? "Earlier" : "Later"}
    </Button>
  );
}
