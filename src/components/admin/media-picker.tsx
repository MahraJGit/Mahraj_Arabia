"use client";

import { useEffect, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { searchMedia, uploadMedia } from "@/actions/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MediaListItem } from "@/lib/media/queries";

function dimensions(item: { width?: number | null; height?: number | null }) {
  if (!item.width || !item.height) return "Size unknown";
  return `${item.width} × ${item.height}`;
}

export function MediaPicker({
  label,
  value,
  previewUrl,
  previewAlt,
  previewFilename,
  previewWidth,
  previewHeight,
  onChange,
  onDismiss,
  startOpen = false,
  error,
}: {
  label: string;
  value: string;
  previewUrl?: string;
  previewAlt?: string;
  previewFilename?: string;
  previewWidth?: number | null;
  previewHeight?: number | null;
  onChange: (next: {
    id: string;
    url: string;
    alt: string;
    filename?: string;
    width?: number | null;
    height?: number | null;
  }) => void;
  onDismiss?: () => void;
  startOpen?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(startOpen);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MediaListItem[]>([]);
  const [alt, setAlt] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function closePicker() {
    setOpen(false);
    onDismiss?.();
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    start(async () => {
      try {
        const next = await searchMedia(query);
        if (!cancelled) setItems(next);
      } catch {
        if (!cancelled) {
          setItems([]);
          setMessage("Images could not be loaded. Please try again.");
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, query]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && previewUrl ? (
        <div className="flex items-center gap-3 rounded-lg border border-border p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={previewAlt || ""}
            className="size-16 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{previewAlt || "Selected image"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {previewFilename || "Image"} · {dimensions({ width: previewWidth, height: previewHeight })}
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
            Replace
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange({ id: "", url: "", alt: "" })}
            aria-label="Remove image"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-8 text-sm text-muted-foreground hover:border-brand/40 hover:text-ink"
        >
          <ImagePlus className="size-4" />
          Choose or upload an image
        </button>
      )}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-heading text-lg font-semibold">Choose image</h2>
              <Button type="button" variant="ghost" size="sm" onClick={closePicker}>
                Close
              </Button>
            </div>
            <div className="space-y-4 overflow-y-auto px-5 py-4">
              <Input
                placeholder="Search by name or file name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange({
                        id: item.id,
                        url: item.url,
                        alt: item.alt,
                        filename: item.filename,
                        width: item.width,
                        height: item.height,
                      });
                      setOpen(false);
                    }}
                    className="overflow-hidden rounded-lg border border-border text-left hover:border-brand"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.alt} className="aspect-[4/3] w-full object-cover" />
                    <div className="space-y-0.5 px-2 py-1.5">
                      <p className="truncate text-xs font-medium">{item.alt || item.filename}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {item.filename} · {dimensions(item)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {items.length === 0 && !pending ? (
                <p className="text-sm text-muted-foreground">No images match that search.</p>
              ) : null}
              {pending ? (
                <p className="text-sm text-muted-foreground">Loading images…</p>
              ) : null}

              <div className="border-t border-border pt-4">
                <p className="mb-2 text-sm font-medium">Upload new</p>
                <p className="mb-3 text-xs text-muted-foreground">
                  JPG, PNG, WebP, or GIF. Max 8 MB. A file can use the same name as an image already in the library. Replacing a picture keeps the previous file for anything still using it.
                </p>
                <form
                  className="grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const data = new FormData(form);
                    const file = data.get("file");
                    if (!(file instanceof File) || file.size === 0) {
                      setMessage("Please choose an image to upload.");
                      return;
                    }
                    if (file.size > 8 * 1024 * 1024) {
                      setMessage("Images must be 8 MB or smaller.");
                      return;
                    }
                    if (!alt.trim()) {
                      setMessage("Please describe the image for accessibility.");
                      return;
                    }
                    if (localPreview) URL.revokeObjectURL(localPreview);
                    setLocalPreview(URL.createObjectURL(file));
                    setUploadName(file.name);
                    start(async () => {
                      setMessage(null);
                      let result: Awaited<ReturnType<typeof uploadMedia>>;
                      try {
                        result = await uploadMedia(data);
                      } catch {
                        setMessage("The image could not be uploaded. Please try again.");
                        setUploadName(null);
                        return;
                      }
                      if (result.error || !result.item) {
                        setMessage(result.error ?? "The image could not be uploaded.");
                        setUploadName(null);
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
                      setOpen(false);
                      form.reset();
                      setAlt("");
                      setUploadName(null);
                    });
                  }}
                >
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div className="space-y-2">
                      <Input
                        name="file"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        required
                        disabled={pending}
                      />
                      <Input
                        name="alt"
                        value={alt}
                        onChange={(event) => setAlt(event.target.value)}
                        placeholder="Describe the image"
                        required
                        disabled={pending}
                      />
                    </div>
                    <Button type="submit" disabled={pending}>
                      {pending ? "Uploading…" : "Upload"}
                    </Button>
                  </div>
                  {pending || (message && localPreview) ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                      {localPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={localPreview}
                          alt=""
                          className="size-14 rounded-md object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                          {pending
                            ? `Uploading ${uploadName || "image"}…`
                            : "Upload failed. You can try again."}
                        </p>
                        {pending ? (
                          <div
                            className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-label="Upload progress"
                          >
                            <div className="h-full w-1/2 animate-pulse rounded-full bg-brand" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </form>
                {message ? (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
