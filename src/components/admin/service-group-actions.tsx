"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { deleteServiceGroup } from "@/actions/service-groups";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PublishStatus } from "@/lib/cms/types";

export function ServiceGroupActions({
  id,
  title,
  slug,
  status,
  serviceCount,
}: {
  id: string;
  title: string;
  slug: string;
  status: PublishStatus;
  serviceCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const inUse = serviceCount > 0;
  const published = status === "published";
  const canView = published && Boolean(slug) && serviceCount > 0;
  const viewHref = `/services#service-group-${slug}`;
  const viewReason = !published
    ? "Drafts stay off the website"
    : !slug
      ? "No public URL yet"
      : "Nothing from this group is on the services page yet.";
  const blockedMessage =
    serviceCount === 1
      ? "This family cannot be deleted because it contains 1 service. Move or delete that service first."
      : `This family cannot be deleted because it contains ${serviceCount} services. Move or delete those services first.`;

  function onOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) setError(null);
  }

  function remove() {
    if (inUse) return;
    start(async () => {
      setError(null);
      const result = await deleteServiceGroup(id);
      if (result.error || !result.href) {
        setError(result.error ?? "The family could not be deleted. Please try again.");
        return;
      }
      router.push(result.href);
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-w-9"
            aria-label={`Actions for ${title}`}
            disabled={pending}
          >
            <MoreHorizontal className="sm:hidden" />
            <span className="hidden sm:inline">{pending ? "Working…" : "Actions"}</span>
            <ChevronDown className="hidden sm:inline" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          {canView ? (
            <DropdownMenuItem asChild>
              <a href={viewHref} target="_blank" rel="noreferrer">
                <ExternalLink />
                View
              </a>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <EyeOff />
              <span className="flex min-w-0 flex-col items-start">
                <span>View</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {viewReason}
                </span>
              </span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={`/admin/service-groups/${id}`}>
              <Pencil />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => onOpenChange(true)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia
              className={inUse ? "bg-amber-100 text-amber-800" : "bg-destructive/10 text-destructive"}
            >
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>
              {inUse ? "This family cannot be deleted" : "Delete this family?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {inUse
                ? blockedMessage
                : `“${title}” has no services. Deleting it removes the family from the menu. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>{inUse ? "Close" : "Cancel"}</AlertDialogCancel>
            {inUse ? null : (
              <Button type="button" variant="destructive" disabled={pending} onClick={remove}>
                {pending ? "Deleting…" : "Delete family"}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
