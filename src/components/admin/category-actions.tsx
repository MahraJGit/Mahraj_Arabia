"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, EyeOff, Pencil, Trash2 } from "lucide-react";

import { deleteCategory } from "@/actions/categories";
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
import { cn } from "@/lib/utils";

export function CategoryActionProvider({ children }: { children: ReactNode }) {
  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
}

export function CategoryActions({
  id,
  title,
  slug,
  postCount,
}: {
  id: string;
  title: string;
  slug: string;
  postCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const inUse = postCount > 0;
  const blockedMessage =
    postCount === 1
      ? "This category cannot be deleted because it is assigned to 1 blog post. Reassign that post first."
      : `This category cannot be deleted because it is assigned to ${postCount} blog posts. Reassign those posts first.`;

  function onOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) setError(null);
  }

  function remove() {
    if (inUse) return;
    start(async () => {
      setError(null);
      const result = await deleteCategory(id);
      if (result.error || !result.href) {
        setError(result.error ?? "The category could not be deleted. Please try again.");
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
              href={`/admin/categories/${id}`}
              aria-label={`Edit ${title}`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2")}
            >
              <Pencil />
              <span className="hidden xl:inline">Edit</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        {slug ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`/blog?category=${encodeURIComponent(slug)}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${title} on the website`}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2")}
              >
                <ExternalLink />
                <span className="hidden xl:inline">View</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>View on the blog</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex" tabIndex={0}>
                <Button type="button" variant="ghost" size="sm" className="px-2" disabled aria-label="View is unavailable">
                  <EyeOff />
                  <span className="hidden xl:inline">View</span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>This category has no public URL</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={inUse ? `Cannot delete ${title}` : `Delete ${title}`}
              onClick={() => onOpenChange(true)}
            >
              <Trash2 />
              <span className="hidden xl:inline">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{inUse ? "In use by blog posts" : "Delete"}</TooltipContent>
        </Tooltip>
      </div>

      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className={inUse ? "bg-amber-100 text-amber-800" : "bg-destructive/10 text-destructive"}>
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>{inUse ? "This category cannot be deleted" : "Delete this category?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {inUse
                ? blockedMessage
                : `“${title}” is not assigned to any blog posts. Deleting it removes the topic from the website filters. This cannot be undone.`}
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
                {pending ? "Deleting…" : "Delete category"}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
