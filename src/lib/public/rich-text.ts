export type ArticleHeading = {
  id: string;
  title: string;
  level: 2 | 3;
};

type HeadingNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: HeadingNode[];
};

export type LexicalContent = {
  root?: {
    children?: unknown[];
  };
} | null;

export function toHeadingId(text: string) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug || "section";
}

function readNodeText(node: HeadingNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(readNodeText).join("");
}

/**
 * Anchors are derived from heading text, so the sidebar and the rendered
 * article have to agree on them. Both read from this single walk, keyed by
 * node identity so repeated headings stay stable regardless of render order.
 */
function collectHeadings(content: LexicalContent) {
  const nodes = (content?.root?.children ?? []) as HeadingNode[];
  const seen = new Map<string, number>();

  return nodes.flatMap((node) => {
    if (node.type !== "heading") return [];
    if (node.tag !== "h2" && node.tag !== "h3") return [];

    const title = readNodeText(node).trim();
    if (!title) return [];

    const base = toHeadingId(title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    return [
      {
        node,
        id: count === 0 ? base : `${base}-${count + 1}`,
        title,
        level: node.tag === "h2" ? (2 as const) : (3 as const),
      },
    ];
  });
}

function asLexical(content: unknown): LexicalContent {
  if (!content || typeof content !== "object") return null;
  return content as LexicalContent;
}

export function extractHeadings(content: unknown): ArticleHeading[] {
  return collectHeadings(asLexical(content)).map(({ id, title, level }) => ({
    id,
    title,
    level,
  }));
}

export function buildHeadingIds(content: unknown) {
  return new Map<unknown, string>(
    collectHeadings(asLexical(content)).map(({ node, id }) => [node, id])
  );
}
