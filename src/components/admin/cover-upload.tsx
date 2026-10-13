"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Replace, X } from "lucide-react";

import { uploadCmsCover } from "@/actions/cms-media";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CoverValue = {
  id: string;
  url: string;
  alt: string;
  filename: string;
  width: number | null;
  height: number | null;
};

export function CoverUpload({
  value,
  error,
  onChange,
  label = "Upload cover image",
  hint = "Recommended 1920×800px · JPG, PNG or WebP · Max 3MB",
  previewClassName = "aspect-video w-full object-cover",
  compact = false,
}: {
  value: CoverValue | null;
  error?: string;
  onChange: (next: CoverValue | null) => void;
  label?: string;
  hint?: string;
  previewClassName?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [localError, setLocalError] = useState<string | null>(null);

  function pick(file: File | null) {
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    formData.set("alt", file.name.replace(/\.[^.]+$/, ""));
    setLocalError(null);
    start(async () => {
      const result = await uploadCmsCover(formData);
      if (result.error || !result.item) {
        setLocalError(result.error || "Upload failed.");
        return;
      }
      onChange({
        id: result.item.id,
        url: result.item.url,
        alt: result.item.alt,
        filename: result.item.filename,
        width: result.item.width,
        height: result.item.height,
      });
    });
  }

  return (
    <div className="space-y-3">
      {value?.url ? (
        compact ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/15 p-2.5">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value.url}
                alt={value.alt || "Image"}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {value.filename || value.alt || "Uploaded image"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {value.width && value.height
                  ? `${value.width} × ${value.height}`
                  : "Ready to use"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg"
                  disabled={pending}
                  onClick={() => inputRef.current?.click()}
                >
                  {pending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Replace className="size-3.5" />
                  )}
                  Replace
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-lg text-muted-foreground hover:text-destructive"
                  onClick={() => onChange(null)}
                >
                  <X className="size-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative max-w-md overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.url}
              alt={value.alt || "Image"}
              className={previewClassName}
            />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute end-2 top-2 size-8 shadow-sm"
              onClick={() => onChange(null)}
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          </div>
        )
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            pick(event.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 text-center transition-colors hover:border-brand/60 hover:bg-brand/5",
            compact ? "px-4 py-5" : "px-4 py-10",
            pending && "opacity-70"
          )}
        >
          {pending ? (
            <Loader2 className={cn("animate-spin text-brand", compact ? "size-5" : "size-7")} />
          ) : (
            <span
              className={cn(
                "flex items-center justify-center rounded-full bg-brand/10 text-brand",
                compact ? "size-9" : "size-11"
              )}
            >
              <ImagePlus className={compact ? "size-4" : "size-5"} />
            </span>
          )}
          <div>
            <p className="text-sm font-medium text-ink">
              {pending ? "Uploading…" : label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
        </button>
      )}
      {error || localError ? (
        <p className="text-xs text-destructive">{error || localError}</p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          pick(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
    </div>
  );
}
