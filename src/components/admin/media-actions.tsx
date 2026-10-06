"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Eye, ImageIcon, Trash2 } from "lucide-react";

import { deleteMedia } from "@/actions/media";
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

export function MediaActionProvider({ children }: { children: ReactNode }) {
  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
}

export function MediaPreview({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="flex h-12 w-16 max-w-none shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
        <ImageIcon className="size-4" aria-hidden />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={64}
      height={48}
      className="h-12 w-16 max-w-none shrink-0 rounded-md border border-border bg-muted object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export function MediaItemActions({
  id,
  filename,
  alt,
  url,
  previewUrl,
}: {
  id: string;
  filename: string;
  alt: string;
  url: string;
  previewUrl: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const name = filename || "Untitled image";

  function onOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) setError(null);
  }

  function remove() {
    start(async () => {
      setError(null);
      const result = await deleteMedia(id);
      if (result.error || !result.href) {
        setError(result.error ?? "The image could not be deleted. Please try again.");
        return;
      }
      router.push(result.href);
    });
  }

  return (
    <>
      <div className="flex items-center justify-end gap-0.5">
        {url ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${name}`}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2")}
              >
                <Eye />
                <span className="hidden xl:inline">View</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>View</TooltipContent>
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
                  aria-label="View is unavailable for this file"
                >
                  <Eye />
                  <span className="hidden xl:inline">View</span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>No file to view</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${name}`}
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
        <AlertDialogContent className="overflow-hidden [&>*]:min-w-0">
          <AlertDialogHeader className="min-w-0">
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription className="break-words">
              <span className="font-medium text-foreground [overflow-wrap:anywhere]">“{name}”</span>{" "}
              will be removed from the media library. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-border bg-muted/40 p-2">
            <MediaPreview src={previewUrl || url} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink" title={name}>
                {name}
              </p>
              <p className="truncate text-xs text-muted-foreground" title={alt || undefined}>
                {alt || "No alt text"}
              </p>
            </div>
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button type="button" variant="destructive" disabled={pending} onClick={remove}>
              {pending ? "Deleting…" : "Delete image"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
