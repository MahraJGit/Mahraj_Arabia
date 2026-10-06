"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, EyeOff, Pencil, Trash2 } from "lucide-react";

import { deletePost } from "@/actions/posts";
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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PublishStatus } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function BlogActionProvider({ children }: { children: ReactNode }) {
  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
}

export function BlogPostActions({
  id,
  title,
  slug,
  status,
}: {
  id: string;
  title: string;
  slug: string;
  status: PublishStatus;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const published = status === "published";

  function onOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) setError(null);
  }

  function remove() {
    start(async () => {
      setError(null);
      const result = await deletePost(id);
      if (result.error || !result.href) {
        setError(result.error ?? "The post could not be deleted. Please try again.");
        return;
      }
      router.push(result.href);
    });
  }

  return (
    <>
      <div className="flex items-center justify-end gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/admin/blog/${id}`}
              aria-label={`Edit ${title}`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2")}
            >
              <Pencil />
              <span className="hidden xl:inline">Edit</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        {published ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`/blog/${slug}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${title} on the website`}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2")}
              >
                <ExternalLink />
                <span className="hidden xl:inline">View</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>View live</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex" tabIndex={0}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  disabled
                  aria-label="View live is unavailable for drafts"
                >
                  <EyeOff />
                  <span className="hidden xl:inline">View</span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Drafts stay off the website</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${title}`}
              onClick={() => onOpenChange(true)}
            >
              <Trash2 />
              <span className="hidden xl:inline">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>

      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              {published
                ? `“${title}” is live. Deleting it removes the article from the website. This cannot be undone. Images stay in Media.`
                : `“${title}” is a draft and is not on the website. Deleting it cannot be undone. Images stay in Media.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button type="button" variant="destructive" disabled={pending} onClick={remove}>
              {pending ? "Deleting…" : "Delete post"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
