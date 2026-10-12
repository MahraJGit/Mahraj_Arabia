"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
  Underline as UnderlineIcon,
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
  htmlToLexical,
  lexicalToHtml,
  type InlineMedia,
} from "@/lib/cms/lexical";
import { cn } from "@/lib/utils";

const MediaImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-media-id": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-id"),
        renderHTML: (attributes) => {
          if (!attributes["data-media-id"]) return {};
          return { "data-media-id": attributes["data-media-id"] };
        },
      },
      "data-caption": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attributes) => {
          if (!attributes["data-caption"]) return {};
          return { "data-caption": attributes["data-caption"] };
        },
      },
    };
  },
});

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
  const [pickerOpen, setPickerOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const skipEmit = useRef(true);
  const lastHtml = useRef("");

  const emitChange = useCallback(
    (html: string) => {
      if (skipEmit.current) {
        skipEmit.current = false;
        lastHtml.current = html;
        return;
      }
      if (html === lastHtml.current) return;
      lastHtml.current = html;
      onChange(htmlToLexical(html));
    },
    [onChange]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
      }),
      MediaImage.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-md",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your article…",
      }),
    ],
    content: lexicalToHtml(value, mediaById),
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral max-w-none min-h-full px-3 py-4 outline-none sm:px-6 sm:py-5",
          "focus:outline-none",
          "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink",
          "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink",
          "[&_p]:my-3 [&_p]:leading-relaxed [&_p]:text-ink",
          "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6",
          "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6",
          "[&_blockquote]:my-4 [&_blockquote]:border-s-4 [&_blockquote]:border-brand [&_blockquote]:bg-muted/40 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:italic",
          "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-ink [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-white",
          "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md",
          "[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4",
          "[&_hr]:my-8 [&_hr]:border-border",
          "[&_.is-empty:first-child::before]:pointer-events-none [&_.is-empty:first-child::before]:float-left [&_.is-empty:first-child::before]:h-0 [&_.is-empty:first-child::before]:text-muted-foreground [&_.is-empty:first-child::before]:content-[attr(data-placeholder)]"
        ),
      },
    },
    onUpdate: ({ editor: next }) => {
      emitChange(next.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const nextHtml = lexicalToHtml(value, mediaById);
    if (nextHtml === lastHtml.current) return;
    if (nextHtml === editor.getHTML()) {
      lastHtml.current = nextHtml;
      return;
    }
    skipEmit.current = true;
    lastHtml.current = nextHtml;
    editor.commands.setContent(nextHtml, { emitUpdate: false });
  }, [editor, mediaById, value]);

  function setLink() {
    if (!editor) return;
    const href = linkUrl.trim();
    if (!href || href === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else if (!href.startsWith("javascript:")) {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkOpen(false);
    setLinkUrl("https://");
  }

  function insertImage(next: {
    id: string;
    url: string;
    alt: string;
    filename?: string;
    width?: number | null;
    height?: number | null;
  }) {
    if (!editor || !next.url) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: {
          src: next.url,
          alt: next.alt || "",
          "data-media-id": next.id || null,
        },
      })
      .run();
    setPickerOpen(false);
  }

  return (
    <TooltipProvider delayDuration={400}>
      <div className="flex h-[min(75vh,52rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="z-20 flex shrink-0 flex-wrap items-center gap-1 border-b border-border bg-card px-2 py-2">
          <ToolbarButton
            icon={Pilcrow}
            label="Paragraph"
            active={editor?.isActive("paragraph")}
            onClick={() => editor?.chain().focus().setParagraph().run()}
          />
          <ToolbarButton
            icon={Heading2}
            label="Heading"
            active={editor?.isActive("heading", { level: 2 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          />
          <ToolbarButton
            icon={Heading3}
            label="Subheading"
            active={editor?.isActive("heading", { level: 3 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          />
          <ToolbarDivider />
          <ToolbarButton
            icon={Bold}
            label="Bold"
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={Italic}
            label="Italic"
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={UnderlineIcon}
            label="Underline"
            active={editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            icon={Link2}
            label="Link"
            active={editor?.isActive("link")}
            onClick={() => {
              const current = editor?.getAttributes("link").href;
              setLinkUrl(
                typeof current === "string" && current ? current : "https://"
              );
              setLinkOpen((open) => !open);
            }}
          />
          <ToolbarDivider />
          <ToolbarButton
            icon={List}
            label="Bulleted list"
            active={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="Numbered list"
            active={editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            icon={Quote}
            label="Quote"
            active={editor?.isActive("blockquote")}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={Code}
            label="Code block"
            active={editor?.isActive("codeBlock")}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarDivider />
          <ToolbarButton
            icon={ImagePlus}
            label="Image"
            onClick={() => setPickerOpen(true)}
          />
          <ToolbarButton
            icon={Minus}
            label="Divider"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          />
        </div>

        {linkOpen ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
            <Input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://"
              className="h-8 max-w-md rounded-lg"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  setLink();
                }
              }}
            />
            <Button type="button" size="sm" className="rounded-lg" onClick={setLink}>
              Apply
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="rounded-lg"
              onClick={() => {
                editor?.chain().focus().extendMarkRange("link").unsetLink().run();
                setLinkOpen(false);
              }}
            >
              Remove
            </Button>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <EditorContent editor={editor} />
        </div>
      </div>

      {pickerOpen ? (
        <div className="mt-3 rounded-xl border border-border bg-card p-4">
          <MediaPicker
            label="Insert image"
            value=""
            startOpen
            onChange={insertImage}
            onDismiss={() => setPickerOpen(false)}
          />
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          Select text to format it. Use the toolbar for headings, lists, links, and images.
        </p>
      )}
    </TooltipProvider>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Bold;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={active ? "secondary" : "ghost"}
          className="size-8 rounded-lg"
          onClick={onClick}
          aria-label={label}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarDivider() {
  return (
    <span className="mx-0.5 hidden h-5 w-px bg-border sm:block" aria-hidden />
  );
}
