"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Trash2,
  Underline,
} from "lucide-react";

import { MediaPicker } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  blocksToLexical,
  emptyParagraph,
  htmlToSpans,
  lexicalToBlocks,
  newBlockId,
  spansToHtml,
  spansToPlainText,
  type EditorBlock,
  type InlineMedia,
  type InlineSpan,
} from "@/lib/cms/lexical";
import { cn } from "@/lib/utils";

const BLOCK_TYPES = [
  { value: "paragraph", label: "Paragraph" },
  { value: "heading-2", label: "Heading" },
  { value: "heading-3", label: "Subheading" },
  { value: "list", label: "Bulleted list" },
  { value: "ordered", label: "Numbered list" },
  { value: "quote", label: "Quote" },
  { value: "code", label: "Code" },
] as const;

export function LexicalEditor({
  value,
  mediaById,
  onChange,
  error,
}: {
  value: unknown;
  mediaById?: Record<string, InlineMedia>;
  onChange: (next: unknown) => void;
  error?: string;
}) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() =>
    lexicalToBlocks(value, mediaById)
  );
  const [activeId, setActiveId] = useState<string | null>(blocks[0]?.id ?? null);
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const skipEmit = useRef(true);

  useEffect(() => {
    if (skipEmit.current) {
      skipEmit.current = false;
      return;
    }
    onChange(blocksToLexical(blocks));
    // Parent handlers are recreated each render; serialize only after local edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const active = blocks.find((block) => block.id === activeId) ?? blocks.at(-1) ?? null;

  function updateBlocks(next: EditorBlock[]) {
    const safe = next.length > 0 ? next : [emptyParagraph()];
    setBlocks(safe);
    if (!safe.some((block) => block.id === activeId)) {
      setActiveId(safe[0]?.id ?? null);
    }
  }

  function replace(id: string, next: EditorBlock) {
    updateBlocks(blocks.map((block) => (block.id === id ? next : block)));
  }

  function remove(id: string) {
    updateBlocks(blocks.filter((block) => block.id !== id));
  }

  function insert(afterId: string | null, block: EditorBlock) {
    if (!afterId) {
      updateBlocks([...blocks, block]);
    } else {
      const index = blocks.findIndex((item) => item.id === afterId);
      const next = [...blocks];
      next.splice(index < 0 ? next.length : index + 1, 0, block);
      updateBlocks(next);
    }
    setActiveId(block.id);
    return block;
  }

  function convert(id: string, kind: string) {
    const current = blocks.find((block) => block.id === id);
    if (!current || current.type === "raw") return;
    const spans =
      "spans" in current
        ? current.spans
        : current.type === "list"
          ? current.items[0] ?? [{ text: "" }]
          : current.type === "code"
            ? [{ text: current.text }]
            : [{ text: "" }];
    const text = spansToPlainText(spans);

    let next: EditorBlock = { id, type: "paragraph", spans };
    if (kind === "heading-2") next = { id, type: "heading", level: 2, spans };
    else if (kind === "heading-3") next = { id, type: "heading", level: 3, spans };
    else if (kind === "list") next = { id, type: "list", ordered: false, items: [spans] };
    else if (kind === "ordered") next = { id, type: "list", ordered: true, items: [spans] };
    else if (kind === "quote") next = { id, type: "quote", spans };
    else if (kind === "code") next = { id, type: "code", text };
    else if (kind === "hr") next = { id, type: "hr" };

    replace(id, next);
    setActiveId(id);
  }

  function applyKind(kind: string) {
    if (active && active.type !== "image" && active.type !== "raw" && active.type !== "hr") {
      convert(active.id, kind);
      return;
    }
    const id = newBlockId();
    if (kind === "heading-2") {
      insert(active?.id ?? null, { id, type: "heading", level: 2, spans: [{ text: "" }] });
    } else if (kind === "heading-3") {
      insert(active?.id ?? null, { id, type: "heading", level: 3, spans: [{ text: "" }] });
    } else if (kind === "list") {
      insert(active?.id ?? null, { id, type: "list", ordered: false, items: [[{ text: "" }]] });
    } else if (kind === "ordered") {
      insert(active?.id ?? null, { id, type: "list", ordered: true, items: [[{ text: "" }]] });
    } else if (kind === "quote") {
      insert(active?.id ?? null, { id, type: "quote", spans: [{ text: "" }] });
    } else if (kind === "code") {
      insert(active?.id ?? null, { id, type: "code", text: "" });
    } else if (kind === "hr") {
      insert(active?.id ?? null, { id, type: "hr" });
    } else {
      insert(active?.id ?? null, emptyParagraph());
    }
  }

  function insertImage() {
    const block: EditorBlock = { id: newBlockId(), type: "image", mediaId: "", caption: "" };
    insert(active?.id ?? null, block);
    setPickerFor(block.id);
  }

  const activeKind =
    !active || active.type === "image" || active.type === "hr" || active.type === "raw"
      ? ""
      : active.type === "heading"
        ? `heading-${active.level}`
        : active.type === "list"
          ? active.ordered
            ? "ordered"
            : "list"
          : active.type;

  return (
    <TooltipProvider delayDuration={400}>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-border bg-card/95 px-2 py-2 backdrop-blur-sm">
          <select
            aria-label="Block style"
            className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
            value={activeKind || "paragraph"}
            onChange={(event) => applyKind(event.target.value)}
          >
            {BLOCK_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ToolbarDivider />
          <MarkButton icon={Bold} label="Bold" command="bold" />
          <MarkButton icon={Italic} label="Italic" command="italic" />
          <MarkButton icon={Underline} label="Underline" command="underline" />
          <LinkButton />
          <ToolbarDivider />
          <ToolbarButton icon={Pilcrow} label="Paragraph" onClick={() => applyKind("paragraph")} />
          <ToolbarButton icon={Heading2} label="Heading" onClick={() => applyKind("heading-2")} />
          <ToolbarButton icon={Heading3} label="Subheading" onClick={() => applyKind("heading-3")} />
          <ToolbarButton icon={List} label="Bulleted list" onClick={() => applyKind("list")} />
          <ToolbarButton icon={ListOrdered} label="Numbered list" onClick={() => applyKind("ordered")} />
          <ToolbarButton icon={Quote} label="Quote" onClick={() => applyKind("quote")} />
          <ToolbarButton icon={Code} label="Code" onClick={() => applyKind("code")} />
          <ToolbarDivider />
          <ToolbarButton icon={ImagePlus} label="Image" onClick={insertImage} />
          <ToolbarButton icon={Minus} label="Divider" onClick={() => applyKind("hr")} />
        </div>

        <div className="space-y-1 px-3 py-5 sm:px-8 sm:py-7">
          {blocks.map((block) => (
            <EditorBlockView
              key={block.id}
              block={block}
              active={block.id === active?.id}
              pickerOpen={pickerFor === block.id}
              onFocus={() => setActiveId(block.id)}
              onReplace={() => setPickerFor(block.id)}
              onPickerClose={() => setPickerFor(null)}
              onChange={(next) => replace(block.id, next)}
              onRemove={() => remove(block.id)}
              onInsertAfter={() => insert(block.id, emptyParagraph())}
            />
          ))}
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          Select text to format it. Images are stored in Media and shown on the published article.
        </p>
      )}
    </TooltipProvider>
  );
}

function EditorBlockView({
  block,
  active,
  pickerOpen,
  onFocus,
  onReplace,
  onPickerClose,
  onChange,
  onRemove,
  onInsertAfter,
}: {
  block: EditorBlock;
  active: boolean;
  pickerOpen: boolean;
  onFocus: () => void;
  onReplace: () => void;
  onPickerClose: () => void;
  onChange: (next: EditorBlock) => void;
  onRemove: () => void;
  onInsertAfter: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-lg px-2 py-1.5",
        active && "bg-muted/30"
      )}
      onFocus={onFocus}
      onMouseDown={onFocus}
    >
      <div className="absolute top-1 right-1 z-10 flex gap-1 rounded-lg bg-card/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Button type="button" variant="ghost" size="sm" onClick={onInsertAfter}>
          Add paragraph
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove block">
          <Trash2 />
        </Button>
      </div>

      {block.type === "paragraph" || block.type === "heading" || block.type === "quote" ? (
        <RichLine
          placeholder={
            block.type === "heading"
              ? block.level === 2
                ? "Heading"
                : "Subheading"
              : block.type === "quote"
                ? "Quote"
                : "Write…"
          }
          className={
            block.type === "heading"
              ? block.level === 2
                ? "font-heading text-2xl font-semibold"
                : "font-heading text-xl font-semibold"
              : block.type === "quote"
                ? "border-s-4 border-brand bg-surface-alt px-4 py-3 italic"
                : "text-base leading-7"
          }
          spans={block.spans}
          onChange={(spans) => onChange({ ...block, spans })}
        />
      ) : null}

      {block.type === "list" ? (
        <div className="space-y-1.5">
          {block.items.map((item, index) => (
            <div key={`${block.id}-${index}`} className="flex items-start gap-2">
              <span className="mt-2 w-6 shrink-0 text-sm text-muted-foreground">
                {block.ordered ? `${index + 1}.` : "•"}
              </span>
              <RichLine
                className="flex-1 text-base leading-7"
                placeholder="List item"
                spans={item}
                onChange={(spans) => {
                  const items = block.items.map((current, itemIndex) =>
                    itemIndex === index ? spans : current
                  );
                  onChange({ ...block, items });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    const items = [...block.items];
                    items.splice(index + 1, 0, [{ text: "" }]);
                    onChange({ ...block, items });
                  }
                  if (
                    event.key === "Backspace" &&
                    spansToPlainText(item).length === 0 &&
                    block.items.length > 1
                  ) {
                    event.preventDefault();
                    onChange({
                      ...block,
                      items: block.items.filter((_, itemIndex) => itemIndex !== index),
                    });
                  }
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...block, items: [...block.items, [{ text: "" }]] })}
          >
            Add item
          </Button>
        </div>
      ) : null}

      {block.type === "code" ? (
        <textarea
          className="min-h-28 w-full rounded-lg border border-input bg-muted/40 p-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          placeholder="Code"
          value={block.text}
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          onFocus={onFocus}
        />
      ) : null}

      {block.type === "hr" ? <hr className="my-4 border-border" /> : null}

      {block.type === "image" ? (
        <ImageBlock
          block={block}
          pickerOpen={pickerOpen}
          onChange={onChange}
          onReplace={onReplace}
          onPickerClose={onPickerClose}
          onRemove={onRemove}
        />
      ) : null}

      {block.type === "raw" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          This block is kept as it appears on the live article so existing formatting is not rewritten.
        </p>
      ) : null}
    </div>
  );
}

function ImageBlock({
  block,
  pickerOpen,
  onChange,
  onReplace,
  onPickerClose,
  onRemove,
}: {
  block: Extract<EditorBlock, { type: "image" }>;
  pickerOpen: boolean;
  onChange: (next: EditorBlock) => void;
  onReplace: () => void;
  onPickerClose: () => void;
  onRemove: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const choosing = pickerOpen || !block.mediaId;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-3">
      {choosing ? (
        <MediaPicker
          label="Article image"
          value={block.mediaId}
          previewUrl={block.url}
          previewAlt={block.alt}
          previewFilename={block.filename}
          previewWidth={block.width}
          previewHeight={block.height}
          startOpen={pickerOpen || !block.mediaId}
          onDismiss={() => {
            if (!block.mediaId) onRemove();
            else onPickerClose();
          }}
          onChange={(next) => {
            if (!next.id) {
              onRemove();
              return;
            }
            onChange({
              ...block,
              mediaId: next.id,
              url: next.url,
              alt: next.alt,
              filename: next.filename,
              width: next.width ?? null,
              height: next.height ?? null,
            });
            setBroken(false);
            onPickerClose();
          }}
        />
      ) : (
        <div className="space-y-3">
          {block.url && !broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.url}
              alt={block.alt || ""}
              className="mx-auto max-h-96 w-full rounded-lg bg-muted object-contain"
              onError={() => setBroken(true)}
            />
          ) : (
            <p className="rounded-lg bg-destructive/5 px-3 py-6 text-center text-sm text-destructive" role="alert">
              This image could not be loaded. Replace it or remove the block.
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p className="min-w-0 truncate">
              {block.alt ? `Alt: ${block.alt}` : "No alt text"}
              {block.filename ? ` · ${block.filename}` : ""}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onReplace}>
              Replace
            </Button>
          </div>
          <Input
            value={block.caption ?? ""}
            placeholder="Caption (optional)"
            aria-label="Image caption"
            onChange={(event) => onChange({ ...block, caption: event.target.value })}
          />
        </div>
      )}
    </div>
  );
}

function RichLine({
  spans,
  onChange,
  onKeyDown,
  className,
  placeholder,
}: {
  spans: InlineSpan[];
  onChange: (spans: InlineSpan[]) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  className?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const html = spansToHtml(spans);
  const empty = spansToPlainText(spans).trim().length === 0;

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== html && document.activeElement !== ref.current) {
      ref.current.innerHTML = html || "<br>";
    }
  }, [html]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      data-placeholder={placeholder}
      data-empty={empty ? "true" : "false"}
      className={cn(
        "min-h-10 rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        "data-[empty=true]:before:pointer-events-none data-[empty=true]:before:text-muted-foreground data-[empty=true]:before:content-[attr(data-placeholder)]",
        className
      )}
      onKeyDown={onKeyDown}
      onInput={() => {
        if (!ref.current) return;
        onChange(htmlToSpans(ref.current.innerHTML));
      }}
      onBlur={() => {
        if (!ref.current) return;
        onChange(htmlToSpans(ref.current.innerHTML));
      }}
    />
  );
}

function ToolbarDivider() {
  return <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden />;
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Bold;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={label} onClick={onClick}>
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function MarkButton({
  icon: Icon,
  label,
  command,
}: {
  icon: typeof Bold;
  label: string;
  command: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          onMouseDown={(event) => {
            event.preventDefault();
            document.execCommand(command);
          }}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function LinkButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Link"
          onMouseDown={(event) => {
            event.preventDefault();
            const current = selectedLinkHref();
            const href = window.prompt("Link URL", current || "https://");
            if (href === null) return;
            const next = href.trim();
            if (!next || next === "https://") {
              document.execCommand("unlink");
              return;
            }
            if (next.startsWith("javascript:")) return;
            document.execCommand("createLink", false, next);
          }}
        >
          <Link2 />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Link</TooltipContent>
    </Tooltip>
  );
}

function selectedLinkHref() {
  const anchor = window.getSelection()?.anchorNode?.parentElement?.closest("a");
  return anchor?.getAttribute("href") ?? "";
}
