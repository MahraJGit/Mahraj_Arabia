"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeHtmlBlock } from "@/lib/cms/sanitize-html";

export function HtmlBlockDialog({
  open,
  initialHtml = "",
  onOpenChange,
  onInsert,
}: {
  open: boolean;
  initialHtml?: string;
  onOpenChange: (open: boolean) => void;
  onInsert: (html: string) => void;
}) {
  const [html, setHtml] = useState(initialHtml);

  useEffect(() => {
    if (open) setHtml(initialHtml);
  }, [initialHtml, open]);

  const preview = useMemo(() => sanitizeHtmlBlock(html), [html]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Custom HTML</DialogTitle>
          <DialogDescription>
            Paste a table or any other HTML. It is rendered on the article. The
            code button still shows code as text.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-html-input">HTML</Label>
            <Textarea
              id="custom-html-input"
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              placeholder="<table>...</table>"
              className="h-44 max-h-44 min-h-44 resize-none overflow-y-auto field-sizing-fixed font-mono text-xs leading-relaxed"
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="h-44 max-h-44 overflow-auto rounded-lg border border-border bg-muted/20 p-3">
              {preview.trim() ? (
                <div
                  className="html-block-preview text-sm text-ink [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-2.5 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-brand [&_th]:px-2.5 [&_th]:py-2 [&_th]:text-start [&_th]:text-white"
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Preview appears here once you paste HTML.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand"
            disabled={!html.trim()}
            onClick={() => {
              onInsert(sanitizeHtmlBlock(html.trim()));
              onOpenChange(false);
            }}
          >
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
