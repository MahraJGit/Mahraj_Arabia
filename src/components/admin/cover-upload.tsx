"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

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
  hint = "1920×800px · JPG, PNG or WebP · Max 3MB",
  previewClassName = "aspect-video w-full object-cover",
}: {
  value: CoverValue | null;
  error?: string;
  onChange: (next: CoverValue | null) => void;
  label?: string;
  hint?: string;
  previewClassName?: string;
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
        <div className="relative overflow-hidden rounded-xl border border-border">
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
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center transition-colors hover:border-brand/60 hover:bg-brand/5",
            pending && "opacity-70"
          )}
        >
          {pending ? (
            <Loader2 className="size-7 animate-spin text-brand" />
          ) : (
            <span className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ImagePlus className="size-5" />
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
