"use client";

import { useState } from "react";
import { mergeAttributes, Node } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";

import { HtmlBlockDialog } from "@/components/admin/html-block-dialog";
import { Button } from "@/components/ui/button";
import {
  decodeHtmlBlockAttr,
  encodeHtmlBlockAttr,
  sanitizeHtmlBlock,
} from "@/lib/cms/sanitize-html";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    htmlBlock: {
      insertHtmlBlock: (html: string) => ReturnType;
      updateHtmlBlock: (html: string) => ReturnType;
    };
  }
}

function HtmlBlockView({ node, updateAttributes, selected }: NodeViewProps) {
  const [open, setOpen] = useState(false);
  const html = String(node.attrs.html ?? "");
  const preview = sanitizeHtmlBlock(html);

  return (
    <NodeViewWrapper
      as="div"
      className={`my-4 overflow-hidden rounded-xl border ${
        selected ? "border-brand ring-2 ring-brand/20" : "border-border"
      } bg-background`}
      data-html-block="true"
    >
      <div className="max-h-56 overflow-auto p-4">
        {preview.trim() ? (
          <div
            className="html-block-preview text-sm text-ink [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-2.5 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-brand [&_th]:px-2.5 [&_th]:py-2 [&_th]:text-start [&_th]:text-white"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Empty HTML block</p>
        )}
      </div>
      <div className="border-t border-border bg-muted/30 px-3 py-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="rounded-lg"
          contentEditable={false}
          onClick={() => setOpen(true)}
        >
          Edit HTML
        </Button>
      </div>

      <HtmlBlockDialog
        open={open}
        initialHtml={html}
        onOpenChange={setOpen}
        onInsert={(next) => updateAttributes({ html: next })}
      />
    </NodeViewWrapper>
  );
}

export const HtmlBlock = Node.create({
  name: "htmlBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      html: {
        default: "",
        parseHTML: (element) =>
          sanitizeHtmlBlock(
            decodeHtmlBlockAttr(element.getAttribute("data-html")) ||
              element.innerHTML
          ),
        renderHTML: (attributes) => ({
          "data-html": encodeHtmlBlockAttr(String(attributes.html ?? "")),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-html-block="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-html-block": "true" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HtmlBlockView);
  },

  addCommands() {
    return {
      insertHtmlBlock:
        (html: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { html: sanitizeHtmlBlock(html) },
          }),
      updateHtmlBlock:
        (html: string) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, {
            html: sanitizeHtmlBlock(html),
          }),
    };
  },
});
