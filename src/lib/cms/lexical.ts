/**
 * Lexical adapter for the Blog CMS.
 *
 * Reads and writes the stored document shape (`content.root.children`).
 * The public site renders that JSON via `lexical-article.tsx`.
 * The admin TipTap editor converts through `lexicalToHtml` / `htmlToLexical`.
 *
 * Unknown nodes are kept as opaque `raw` blocks so existing articles are
 * not rewritten just because the editor opened them.
 */

import {
  decodeHtmlBlockAttr,
  encodeHtmlBlockAttr,
  sanitizeHtmlBlock,
} from "@/lib/cms/sanitize-html";

export const FORMAT_BOLD = 1;
export const FORMAT_ITALIC = 2;
export const FORMAT_UNDERLINE = 8;
export const FORMAT_CODE = 16;

export type InlineSpan = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  href?: string;
};

export type EditorBlock =
  | { id: string; type: "paragraph"; spans: InlineSpan[] }
  | { id: string; type: "heading"; level: 2 | 3; spans: InlineSpan[] }
  | { id: string; type: "list"; ordered: boolean; items: InlineSpan[][] }
  | { id: string; type: "quote"; spans: InlineSpan[] }
  | { id: string; type: "code"; text: string }
  | { id: string; type: "hr" }
  | { id: string; type: "htmlBlock"; html: string }
  | {
      id: string;
      type: "image";
      mediaId: string;
      url?: string;
      alt?: string;
      caption?: string;
      filename?: string;
      width?: number | null;
      height?: number | null;
    }
  | { id: string; type: "raw"; node: LexicalNode };

export type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  format?: number | string;
  detail?: number;
  mode?: string;
  style?: string;
  version?: number;
  direction?: string | null;
  indent?: number;
  textFormat?: number;
  listType?: string;
  start?: number;
  value?: unknown;
  relationTo?: string;
  fields?: Record<string, unknown> | null;
  url?: string;
  children?: LexicalNode[];
  language?: string;
  [key: string]: unknown;
};

export type LexicalDoc = {
  root: {
    type: "root";
    children: LexicalNode[];
    direction: "ltr" | null;
    format: string;
    indent: number;
    version: number;
  };
};

export type InlineMedia = {
  url: string;
  alt: string;
  filename: string;
  width: number | null;
  height: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asNodes(value: unknown): LexicalNode[] {
  return Array.isArray(value) ? (value as LexicalNode[]) : [];
}

export function newBlockId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `block-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyLexicalDoc(): LexicalDoc {
  return {
    root: {
      type: "root",
      children: [emptyParagraphNode()],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

export function isLexicalDoc(value: unknown): value is LexicalDoc {
  if (!isRecord(value)) return false;
  const root = value.root;
  return (
    isRecord(root) &&
    root.type === "root" &&
    Array.isArray(root.children)
  );
}

export function normalizeLexicalDoc(value: unknown): LexicalDoc {
  if (isLexicalDoc(value)) {
    return {
      root: {
        type: "root",
        children: asNodes(value.root.children),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      },
    };
  }
  return emptyLexicalDoc();
}

export function emptyParagraph(): EditorBlock {
  return { id: newBlockId(), type: "paragraph", spans: [{ text: "" }] };
}

export function lexicalToBlocks(
  value: unknown,
  mediaById: Record<string, InlineMedia> = {}
): EditorBlock[] {
  const doc = normalizeLexicalDoc(value);
  const blocks = doc.root.children
    .map((node) => nodeToBlock(node, mediaById))
    .filter((block): block is EditorBlock => Boolean(block));
  return blocks.length > 0 ? blocks : [emptyParagraph()];
}

export function blocksToLexical(blocks: EditorBlock[]): LexicalDoc {
  const children = blocks
    .map(blockToNode)
    .filter((node): node is LexicalNode => Boolean(node));

  return {
    root: {
      type: "root",
      children: children.length > 0 ? children : [emptyParagraphNode()],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

export function lexicalToHtml(
  value: unknown,
  mediaById: Record<string, InlineMedia> = {}
): string {
  const blocks = lexicalToBlocks(value, mediaById);
  const html = blocks.map(blockToHtml).filter(Boolean).join("");
  return html || "<p></p>";
}

export function htmlToLexical(html: string): LexicalDoc {
  if (typeof DOMParser === "undefined") {
    const text = html.replace(/<[^>]+>/g, "").trim();
    return blocksToLexical([
      { id: newBlockId(), type: "paragraph", spans: [{ text }] },
    ]);
  }

  const document = new DOMParser().parseFromString(
    `<div id="root">${html}</div>`,
    "text/html"
  );
  const root = document.getElementById("root");
  if (!root) return emptyLexicalDoc();

  const blocks: EditorBlock[] = [];
  for (const child of Array.from(root.childNodes)) {
    const block = htmlNodeToBlock(child);
    if (block) blocks.push(block);
  }

  return blocksToLexical(blocks.length > 0 ? blocks : [emptyParagraph()]);
}

function blockToHtml(block: EditorBlock): string {
  if (block.type === "paragraph") {
    return `<p>${spansToHtml(block.spans) || "<br>"}</p>`;
  }
  if (block.type === "heading") {
    const tag = block.level === 3 ? "h3" : "h2";
    return `<${tag}>${spansToHtml(block.spans)}</${tag}>`;
  }
  if (block.type === "list") {
    const tag = block.ordered ? "ol" : "ul";
    const items = block.items
      .map((item) => `<li>${spansToHtml(item) || "<br>"}</li>`)
      .join("");
    return `<${tag}>${items}</${tag}>`;
  }
  if (block.type === "quote") {
    return `<blockquote><p>${spansToHtml(block.spans) || "<br>"}</p></blockquote>`;
  }
  if (block.type === "code") {
    return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
  }
  if (block.type === "hr") {
    return "<hr>";
  }
  if (block.type === "image") {
    const src = escapeHtml(block.url || "");
    if (!src) return "";
    const alt = escapeHtml(block.alt || "");
    const mediaId = escapeHtml(block.mediaId || "");
    const caption = escapeHtml(block.caption || "");
    const attrs = [
      `src="${src}"`,
      `alt="${alt}"`,
      mediaId ? `data-media-id="${mediaId}"` : "",
      caption ? `data-caption="${caption}"` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `<img ${attrs}>`;
  }
  if (block.type === "htmlBlock") {
    const html = sanitizeHtmlBlock(block.html || "");
    if (!html.trim()) return "";
    return `<div data-html-block="true" data-html="${encodeHtmlBlockAttr(html)}"></div>`;
  }
  return "";
}

function htmlNodeToBlock(node: Node): EditorBlock | null {
  if (node.nodeType === 3) {
    const text = (node.textContent ?? "").trim();
    if (!text) return null;
    return { id: newBlockId(), type: "paragraph", spans: [{ text }] };
  }
  if (node.nodeType !== 1) return null;

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (tag === "p") {
    return {
      id: newBlockId(),
      type: "paragraph",
      spans: htmlToSpans(element.innerHTML),
    };
  }
  if (tag === "h2" || tag === "h3") {
    return {
      id: newBlockId(),
      type: "heading",
      level: tag === "h3" ? 3 : 2,
      spans: htmlToSpans(element.innerHTML),
    };
  }
  if (tag === "h1" || tag === "h4" || tag === "h5" || tag === "h6") {
    return {
      id: newBlockId(),
      type: "heading",
      level: 2,
      spans: htmlToSpans(element.innerHTML),
    };
  }
  if (tag === "ul" || tag === "ol") {
    const items = Array.from(element.children)
      .filter((child) => child.tagName.toLowerCase() === "li")
      .map((li) => htmlToSpans((li as HTMLElement).innerHTML));
    return {
      id: newBlockId(),
      type: "list",
      ordered: tag === "ol",
      items: items.length > 0 ? items : [[{ text: "" }]],
    };
  }
  if (tag === "blockquote") {
    return {
      id: newBlockId(),
      type: "quote",
      spans: htmlToSpans(element.innerHTML),
    };
  }
  if (tag === "pre") {
    return {
      id: newBlockId(),
      type: "code",
      text: element.textContent ?? "",
    };
  }
  if (tag === "hr") {
    return { id: newBlockId(), type: "hr" };
  }
  if (tag === "img") {
    return {
      id: newBlockId(),
      type: "image",
      mediaId: element.getAttribute("data-media-id")?.trim() || "",
      url: element.getAttribute("src")?.trim() || "",
      alt: element.getAttribute("alt")?.trim() || "",
      caption: element.getAttribute("data-caption")?.trim() || "",
    };
  }
  if (tag === "figure") {
    const img = element.querySelector("img");
    if (!img) return null;
    const caption =
      element.querySelector("figcaption")?.textContent?.trim() ||
      img.getAttribute("data-caption")?.trim() ||
      "";
    return {
      id: newBlockId(),
      type: "image",
      mediaId: img.getAttribute("data-media-id")?.trim() || "",
      url: img.getAttribute("src")?.trim() || "",
      alt: img.getAttribute("alt")?.trim() || "",
      caption,
    };
  }
  if (tag === "div" && element.getAttribute("data-html-block") === "true") {
    const html = sanitizeHtmlBlock(
      decodeHtmlBlockAttr(element.getAttribute("data-html")) || element.innerHTML
    );
    if (!html.trim()) return null;
    return { id: newBlockId(), type: "htmlBlock", html };
  }
  if (tag === "table") {
    return {
      id: newBlockId(),
      type: "htmlBlock",
      html: sanitizeHtmlBlock(element.outerHTML),
    };
  }
  if (tag === "div") {
    const nested: EditorBlock[] = [];
    for (const child of Array.from(element.childNodes)) {
      const block = htmlNodeToBlock(child);
      if (block) nested.push(block);
    }
    if (nested.length === 1) return nested[0];
    if (nested.length > 1) {
      return {
        id: newBlockId(),
        type: "paragraph",
        spans: htmlToSpans(element.innerHTML),
      };
    }
  }

  const text = element.textContent?.trim();
  if (!text) return null;
  return {
    id: newBlockId(),
    type: "paragraph",
    spans: htmlToSpans(element.innerHTML),
  };
}

export function lexicalHasVisibleText(value: unknown): boolean {
  if (!isLexicalDoc(value)) return false;
  if (readNodeText({ type: "root", children: value.root.children }).trim()) {
    return true;
  }
  return value.root.children.some((node) => {
    const type = String(node.type ?? "");
    if (type === "htmlBlock" || type === "html-block") {
      return sanitizeHtmlBlock(String(node.html ?? "")).trim().length > 0;
    }
    if (type === "upload" || type === "horizontalrule" || type === "hr") {
      return true;
    }
    return false;
  });
}

export function collectUploadIds(value: unknown): string[] {
  const ids = new Set<string>();
  walkUploads(isLexicalDoc(value) ? value.root.children : [], ids);
  return [...ids];
}

export function spansToPlainText(spans: InlineSpan[]) {
  return spans.map((span) => span.text).join("");
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function spansToHtml(spans: InlineSpan[]) {
  return spans
    .map((span) => {
      let html = escapeHtml(span.text).replace(/\n/g, "<br>");
      if (span.code) html = `<code>${html}</code>`;
      if (span.bold) html = `<strong>${html}</strong>`;
      if (span.italic) html = `<em>${html}</em>`;
      if (span.underline) html = `<u>${html}</u>`;
      if (span.href) {
        html = `<a href="${escapeHtml(span.href)}">${html}</a>`;
      }
      return html;
    })
    .join("");
}

export function htmlToSpans(html: string): InlineSpan[] {
  if (typeof DOMParser === "undefined") {
    return [{ text: html.replace(/<[^>]+>/g, "") }];
  }
  const document = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const spans: InlineSpan[] = [];
  walkHtml(document.body.firstElementChild, {}, spans);
  return spans.length > 0 ? spans : [{ text: "" }];
}

function walkHtml(
  node: Node | null,
  marks: Partial<InlineSpan>,
  spans: InlineSpan[]
) {
  if (!node) return;

  if (node.nodeType === 3) {
    const text = node.textContent ?? "";
    if (!text) return;
    spans.push({
      text,
      bold: marks.bold || undefined,
      italic: marks.italic || undefined,
      underline: marks.underline || undefined,
      code: marks.code || undefined,
      href: marks.href,
    });
    return;
  }

  if (node.nodeType !== 1) return;
  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();

  if (tag === "br") {
    spans.push({ text: "\n", ...cleanMarks(marks) });
    return;
  }

  const next: Partial<InlineSpan> = { ...marks };
  if (tag === "strong" || tag === "b") next.bold = true;
  if (tag === "em" || tag === "i") next.italic = true;
  if (tag === "u") next.underline = true;
  if (tag === "code") next.code = true;
  if (tag === "a") {
    const href = element.getAttribute("href")?.trim();
    if (href && !href.startsWith("javascript:")) next.href = href;
  }

  for (const child of Array.from(element.childNodes)) {
    walkHtml(child, next, spans);
  }
}

function cleanMarks(marks: Partial<InlineSpan>): Partial<InlineSpan> {
  return {
    bold: marks.bold || undefined,
    italic: marks.italic || undefined,
    underline: marks.underline || undefined,
    code: marks.code || undefined,
    href: marks.href,
  };
}

function nodeToBlock(
  node: LexicalNode,
  mediaById: Record<string, InlineMedia>
): EditorBlock | null {
  const type = String(node.type ?? "");

  if (type === "paragraph") {
    const spans = inlineFromChildren(asNodes(node.children));
    return spans
      ? { id: newBlockId(), type: "paragraph", spans: spans.length ? spans : [{ text: "" }] }
      : rawBlock(node);
  }

  if (type === "heading") {
    const tag = String(node.tag ?? "");
    if (tag !== "h2" && tag !== "h3") return rawBlock(node);
    const spans = inlineFromChildren(asNodes(node.children));
    return spans
      ? {
          id: newBlockId(),
          type: "heading",
          level: tag === "h3" ? 3 : 2,
          spans: spans.length ? spans : [{ text: "" }],
        }
      : rawBlock(node);
  }

  if (type === "quote") {
    const spans = flattenBlockChildren(asNodes(node.children));
    return spans
      ? { id: newBlockId(), type: "quote", spans: spans.length ? spans : [{ text: "" }] }
      : rawBlock(node);
  }

  if (type === "list") {
    const listType = String(node.listType ?? "");
    if (listType !== "bullet" && listType !== "number") return rawBlock(node);
    const items: InlineSpan[][] = [];
    for (const child of asNodes(node.children)) {
      if (child.type !== "listitem") return rawBlock(node);
      const spans = flattenBlockChildren(asNodes(child.children));
      if (!spans) return rawBlock(node);
      items.push(spans.length ? spans : [{ text: "" }]);
    }
    return {
      id: newBlockId(),
      type: "list",
      ordered: listType === "number",
      items: items.length ? items : [[{ text: "" }]],
    };
  }

  if (type === "code") {
    return {
      id: newBlockId(),
      type: "code",
      text: readNodeText(node),
    };
  }

  if (type === "horizontalrule" || type === "hr") {
    return { id: newBlockId(), type: "hr" };
  }

  if (type === "htmlBlock" || type === "html-block") {
    const html = sanitizeHtmlBlock(String(node.html ?? ""));
    if (!html.trim()) return null;
    return { id: newBlockId(), type: "htmlBlock", html };
  }

  if (type === "upload") {
    const mediaId = mediaIdFromValue(node.value);
    const media = mediaId ? mediaById[mediaId] : undefined;
    const populated = isRecord(node.value) ? node.value : null;
    const fields = isRecord(node.fields) ? node.fields : null;
    const caption =
      fields && typeof fields.caption === "string"
        ? fields.caption
        : populated && typeof populated.caption === "string"
          ? populated.caption
          : "";
    const url =
      media?.url ||
      (populated && typeof populated.url === "string" ? populated.url : undefined);
    if (!mediaId && !url) return rawBlock(node);
    return {
      id: newBlockId(),
      type: "image",
      mediaId: mediaId || "",
      url,
      alt:
        media?.alt ||
        (populated && typeof populated.alt === "string" ? populated.alt : undefined) ||
        (fields && typeof fields.alt === "string" ? fields.alt : undefined),
      caption,
      filename:
        media?.filename ||
        (populated && typeof populated.filename === "string"
          ? populated.filename
          : undefined),
      width: media?.width ?? (typeof populated?.width === "number" ? populated.width : null),
      height:
        media?.height ?? (typeof populated?.height === "number" ? populated.height : null),
    };
  }

  return rawBlock(node);
}

function rawBlock(node: LexicalNode): EditorBlock {
  return { id: newBlockId(), type: "raw", node };
}

function inlineFromChildren(children: LexicalNode[]): InlineSpan[] | null {
  const spans: InlineSpan[] = [];
  for (const child of children) {
    const type = String(child.type ?? "");
    if (type === "text") {
      spans.push(spanFromText(child));
      continue;
    }
    if (type === "linebreak") {
      spans.push({ text: "\n" });
      continue;
    }
    if (type === "link" || type === "autolink") {
      const href = linkHref(child);
      const inner = inlineFromChildren(asNodes(child.children));
      if (!inner) return null;
      for (const span of inner) {
        spans.push({ ...span, href: href || span.href });
      }
      continue;
    }
    return null;
  }
  return spans;
}

function flattenBlockChildren(children: LexicalNode[]): InlineSpan[] | null {
  const spans: InlineSpan[] = [];
  for (const child of children) {
    const type = String(child.type ?? "");
    if (type === "paragraph" || type === "heading" || type === "quote") {
      const inner = inlineFromChildren(asNodes(child.children));
      if (!inner) return null;
      if (spans.length && inner.length) spans.push({ text: "\n" });
      spans.push(...inner);
      continue;
    }
    const inner = inlineFromChildren([child]);
    if (!inner) return null;
    spans.push(...inner);
  }
  return spans;
}

function spanFromText(node: LexicalNode): InlineSpan {
  const format = typeof node.format === "number" ? node.format : 0;
  return {
    text: String(node.text ?? ""),
    bold: (format & FORMAT_BOLD) !== 0 || undefined,
    italic: (format & FORMAT_ITALIC) !== 0 || undefined,
    underline: (format & FORMAT_UNDERLINE) !== 0 || undefined,
    code: (format & FORMAT_CODE) !== 0 || undefined,
  };
}

function linkHref(node: LexicalNode) {
  if (typeof node.url === "string" && node.url.trim()) return node.url.trim();
  const fields = isRecord(node.fields) ? node.fields : null;
  if (fields && typeof fields.url === "string" && fields.url.trim()) {
    return fields.url.trim();
  }
  return "";
}

function blockToNode(block: EditorBlock): LexicalNode | null {
  if (block.type === "raw") return block.node;
  if (block.type === "hr") {
    return { type: "horizontalrule", version: 1 };
  }
  if (block.type === "htmlBlock") {
    const html = sanitizeHtmlBlock(block.html || "");
    if (!html.trim()) return null;
    return {
      type: "htmlBlock",
      html,
      version: 1,
    };
  }
  if (block.type === "code") {
    return {
      type: "code",
      language: "",
      children: [textNode(block.text)],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    };
  }
  if (block.type === "image") {
    if (!block.mediaId && !block.url) return null;
    return {
      type: "upload",
      version: 3,
      relationTo: "media",
      value: {
        id: block.mediaId || "",
        url: block.url || "",
        alt: block.alt || "",
        filename: block.filename || "",
        width: block.width ?? null,
        height: block.height ?? null,
        caption: block.caption?.trim() || "",
      },
      fields: {
        caption: block.caption?.trim() || "",
        alt: block.alt?.trim() || "",
      },
    };
  }
  if (block.type === "list") {
    return {
      type: "list",
      listType: block.ordered ? "number" : "bullet",
      tag: block.ordered ? "ol" : "ul",
      start: 1,
      children: block.items.map((item, index) => ({
        type: "listitem",
        value: index + 1,
        children: childrenFromSpans(item),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      })),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    };
  }
  if (block.type === "heading") {
    if (!spansToPlainText(block.spans).trim()) return null;
    return {
      type: "heading",
      tag: block.level === 3 ? "h3" : "h2",
      children: childrenFromSpans(block.spans),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    };
  }
  if (block.type === "quote") {
    return {
      type: "quote",
      children: childrenFromSpans(block.spans),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    };
  }
  return {
    type: "paragraph",
    children: childrenFromSpans(block.spans),
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

function childrenFromSpans(spans: InlineSpan[]): LexicalNode[] {
  const children: LexicalNode[] = [];
  for (const span of spans) {
    const parts = span.text.split("\n");
    parts.forEach((part, index) => {
      if (part) {
        const text = textNode(part, span);
        if (span.href) {
          children.push(linkNode(span.href, [text]));
        } else {
          children.push(text);
        }
      }
      if (index < parts.length - 1) {
        children.push({ type: "linebreak", version: 1 });
      }
    });
  }
  return children;
}

function textNode(text: string, span?: InlineSpan): LexicalNode {
  let format = 0;
  if (span?.bold) format |= FORMAT_BOLD;
  if (span?.italic) format |= FORMAT_ITALIC;
  if (span?.underline) format |= FORMAT_UNDERLINE;
  if (span?.code) format |= FORMAT_CODE;
  return {
    type: "text",
    detail: 0,
    format,
    mode: "normal",
    style: "",
    text,
    version: 1,
  };
}

function linkNode(url: string, children: LexicalNode[]): LexicalNode {
  return {
    type: "link",
    fields: {
      linkType: "custom",
      url,
      newTab: false,
    },
    children,
    direction: "ltr",
    format: "",
    indent: 0,
    version: 3,
  };
}

function emptyParagraphNode(): LexicalNode {
  return {
    type: "paragraph",
    children: [],
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

function readNodeText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  return asNodes(node.children).map(readNodeText).join("");
}

function isMediaId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function mediaIdFromValue(value: unknown): string {
  if (typeof value === "string" && isMediaId(value)) return value;
  if (value && typeof value === "object" && "toHexString" in value) {
    const hex = (value as { toHexString: () => string }).toHexString();
    if (typeof hex === "string" && isMediaId(hex)) return hex;
  }
  if (isRecord(value)) {
    const id = value.id ?? value._id;
    if (typeof id === "string" && isMediaId(id)) return id;
    if (id && typeof id === "object") {
      if ("toHexString" in id) {
        const hex = (id as { toHexString: () => string }).toHexString();
        if (typeof hex === "string" && isMediaId(hex)) return hex;
      }
      const next = String(id);
      if (isMediaId(next)) return next;
    }
  }
  return "";
}

function walkUploads(nodes: LexicalNode[], ids: Set<string>) {
  for (const node of nodes) {
    if (node.type === "upload") {
      const id = mediaIdFromValue(node.value);
      if (id) ids.add(id);
    }
    walkUploads(asNodes(node.children), ids);
  }
}
