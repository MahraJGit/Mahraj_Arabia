import { Fragment, type ReactNode } from "react";

import {
  FORMAT_BOLD,
  FORMAT_CODE,
  FORMAT_ITALIC,
  FORMAT_UNDERLINE,
  type LexicalNode,
  isLexicalDoc,
} from "@/lib/cms/lexical";
import { mediaIdFromValue, type PublicMedia } from "@/lib/public/media";
import { buildHeadingIds, type LexicalContent } from "@/lib/public/rich-text";

const FORMAT_STRIKETHROUGH = 4;
const FORMAT_SUBSCRIPT = 32;
const FORMAT_SUPERSCRIPT = 64;

const SUPPORTED = new Set([
  "root",
  "paragraph",
  "heading",
  "text",
  "list",
  "listitem",
  "quote",
  "code",
  "horizontalrule",
  "hr",
  "link",
  "autolink",
  "linebreak",
  "tab",
  "upload",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asNodes(value: unknown): LexicalNode[] {
  return Array.isArray(value) ? (value as LexicalNode[]) : [];
}

function formatNumber(value: unknown) {
  return typeof value === "number" ? value : 0;
}

function linkHref(node: LexicalNode) {
  if (typeof node.url === "string" && node.url.trim()) return node.url.trim();
  const fields = isRecord(node.fields) ? node.fields : null;
  if (fields && typeof fields.url === "string" && fields.url.trim()) {
    return fields.url.trim();
  }
  return "";
}

function captionFromUpload(node: LexicalNode, media?: PublicMedia) {
  const fields = isRecord(node.fields) ? node.fields : null;
  if (fields && typeof fields.caption === "string" && fields.caption.trim()) {
    return fields.caption.trim();
  }
  return media?.caption?.trim() || "";
}

function wrapMarks(text: ReactNode, format: number) {
  let node = text;
  if (format & FORMAT_CODE) node = <code>{node}</code>;
  if (format & FORMAT_BOLD) node = <strong>{node}</strong>;
  if (format & FORMAT_ITALIC) node = <em>{node}</em>;
  if (format & FORMAT_UNDERLINE) node = <u>{node}</u>;
  if (format & FORMAT_STRIKETHROUGH) node = <s>{node}</s>;
  if (format & FORMAT_SUBSCRIPT) node = <sub>{node}</sub>;
  if (format & FORMAT_SUPERSCRIPT) node = <sup>{node}</sup>;
  return node;
}

function hasBlockChild(nodes: LexicalNode[]) {
  return nodes.some((node) => {
    const type = String(node.type ?? "");
    return (
      type === "paragraph" ||
      type === "heading" ||
      type === "quote" ||
      type === "list" ||
      type === "code" ||
      type === "upload" ||
      type === "horizontalrule" ||
      type === "hr"
    );
  });
}

function renderFlow(
  nodes: LexicalNode[],
  mediaById: Record<string, PublicMedia>,
  headingIds: Map<unknown, string>,
  unknown: Set<string>
): ReactNode {
  if (!hasBlockChild(nodes)) {
    return renderInline(nodes, mediaById, unknown);
  }
  return nodes.map((node, index) => (
    <Fragment key={index}>
      {renderBlock(node, mediaById, headingIds, unknown)}
    </Fragment>
  ));
}

function renderInline(
  nodes: LexicalNode[],
  mediaById: Record<string, PublicMedia>,
  unknown: Set<string>
): ReactNode[] {
  return nodes.map((node, index) => {
    const type = String(node.type ?? "unknown");
    if (type === "text") {
      return (
        <span key={index}>
          {wrapMarks(String(node.text ?? ""), formatNumber(node.format))}
        </span>
      );
    }
    if (type === "linebreak") {
      return <br key={index} />;
    }
    if (type === "tab") {
      return <span key={index}>{"\u00a0\u00a0"}</span>;
    }
    if (type === "link" || type === "autolink") {
      const href = linkHref(node);
      const fields = isRecord(node.fields) ? node.fields : null;
      const newTab = Boolean(fields?.newTab);
      const inner = renderInline(asNodes(node.children), mediaById, unknown);
      if (!href || href.startsWith("javascript:")) {
        return <span key={index}>{inner}</span>;
      }
      return (
        <a
          key={index}
          href={href}
          {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {inner}
        </a>
      );
    }

    unknown.add(type);
    const children = asNodes(node.children);
    if (children.length > 0) {
      return (
        <span key={index} data-lexical-unknown={type}>
          {renderInline(children, mediaById, unknown)}
        </span>
      );
    }
    if (typeof node.text === "string" && node.text) {
      return (
        <span key={index} data-lexical-unknown={type}>
          {node.text}
        </span>
      );
    }
    return <span key={index} data-lexical-unknown={type} hidden />;
  });
}

function renderBlock(
  node: LexicalNode,
  mediaById: Record<string, PublicMedia>,
  headingIds: Map<unknown, string>,
  unknown: Set<string>
): ReactNode {
  const type = String(node.type ?? "unknown");

  if (type === "paragraph") {
    return <p>{renderInline(asNodes(node.children), mediaById, unknown)}</p>;
  }

  if (type === "heading") {
    const Tag = node.tag === "h3" ? "h3" : node.tag === "h2" ? "h2" : "p";
    return (
      <Tag id={headingIds.get(node)} className="scroll-mt-28">
        {renderInline(asNodes(node.children), mediaById, unknown)}
      </Tag>
    );
  }

  if (type === "quote") {
    return (
      <blockquote>
        {renderFlow(asNodes(node.children), mediaById, headingIds, unknown)}
      </blockquote>
    );
  }

  if (type === "list") {
    const Tag = node.listType === "number" || node.tag === "ol" ? "ol" : "ul";
    return (
      <Tag>
        {asNodes(node.children).map((item, index) => (
          <li key={index}>
            {renderFlow(asNodes(item.children), mediaById, headingIds, unknown)}
          </li>
        ))}
      </Tag>
    );
  }

  if (type === "code") {
    return (
      <pre>
        <code>{asNodes(node.children).map((child) => String(child.text ?? "")).join("")}</code>
      </pre>
    );
  }

  if (type === "horizontalrule" || type === "hr") {
    return <hr />;
  }

  if (type === "upload") {
    const mediaId = mediaIdFromValue(node.value);
    const media =
      (mediaId && mediaById[mediaId]) ||
      (isRecord(node.value)
        ? {
            id: mediaId,
            alt: typeof node.value.alt === "string" ? node.value.alt : "",
            caption:
              typeof node.value.caption === "string" ? node.value.caption : "",
            url: typeof node.value.url === "string" ? node.value.url : "",
            filename:
              typeof node.value.filename === "string" ? node.value.filename : "",
            mimeType: "",
            width: typeof node.value.width === "number" ? node.value.width : null,
            height:
              typeof node.value.height === "number" ? node.value.height : null,
            focalX: null,
            focalY: null,
            sizes: {},
          }
        : null);
    if (!media?.url) {
      return <span data-lexical-unknown="upload" hidden />;
    }
    const caption = captionFromUpload(node, media);
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.url}
          alt={media.alt || caption || ""}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          loading="lazy"
          decoding="async"
        />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }

  unknown.add(type);
  const children = asNodes(node.children);
  if (children.length > 0) {
    return (
      <div data-lexical-unknown={type}>
        {children.map((child, index) => (
          <div key={index}>
            {renderBlock(child, mediaById, headingIds, unknown)}
          </div>
        ))}
      </div>
    );
  }
  if (typeof node.text === "string" && node.text) {
    return <p data-lexical-unknown={type}>{node.text}</p>;
  }
  return <div data-lexical-unknown={type} hidden />;
}

export function collectLexicalNodeTypes(content: unknown) {
  const types = new Set<string>();
  const unknown = new Set<string>();

  function walk(nodes: LexicalNode[]) {
    for (const node of nodes) {
      const type = String(node.type ?? "unknown");
      types.add(type);
      if (!SUPPORTED.has(type)) unknown.add(type);
      walk(asNodes(node.children));
    }
  }

  if (isLexicalDoc(content)) walk(content.root.children);
  return { types: [...types].sort(), unknown: [...unknown].sort() };
}

export function LexicalArticle({
  data,
  mediaById = {},
}: {
  data: unknown;
  mediaById?: Record<string, PublicMedia>;
}) {
  const content = (isLexicalDoc(data) ? data : { root: { children: [] } }) as LexicalContent;
  const headingIds = buildHeadingIds(content);
  const unknown = new Set<string>();
  const children = isLexicalDoc(data) ? data.root.children : [];

  return (
    <>
      {children.map((node, index) => (
        <Fragment key={index}>
          {renderBlock(node, mediaById, headingIds, unknown)}
        </Fragment>
      ))}
    </>
  );
}
