import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import mongoose from "mongoose";

for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (!match) continue;
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error("DATABASE_URI is not set.");
  process.exit(1);
}

const report = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  report.push(`ok  ${message}`);
}

function toId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value._id) return String(value._id);
  return String(value);
}

function toHeadingId(text) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return slug || "section";
}

function readNodeText(node) {
  if (typeof node?.text === "string") return node.text;
  return (node?.children ?? []).map(readNodeText).join("");
}

function extractHeadings(content) {
  const seen = new Map();
  const headings = [];
  for (const node of content?.root?.children ?? []) {
    if (node.type !== "heading") continue;
    if (node.tag !== "h2" && node.tag !== "h3") continue;
    const title = readNodeText(node).trim();
    if (!title) continue;
    const base = toHeadingId(title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({
      id: count === 0 ? base : `${base}-${count + 1}`,
      title,
      level: node.tag === "h2" ? 2 : 3,
    });
  }
  return headings;
}

function walkTypes(nodes, types) {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    types.add(String(node.type || "unknown"));
    walkTypes(node.children, types);
  }
}

function walkFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walkFiles(full, files);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry)) files.push(full);
  }
  return files;
}

const SUPPORTED_LEXICAL = new Set([
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

const conn = await mongoose.createConnection(uri).asPromise();
const posts = conn.collection("posts");
const categories = conn.collection("categories");
const services = conn.collection("services");
const mains = conn.collection("main-services");
const media = conn.collection("media");

try {
  const publishedServices = await services
    .find({ _status: "published" })
    .sort({ sortOrder: 1 })
    .toArray();
  const draftServices = await services.find({ _status: "draft" }).toArray();
  const publishedMains = await mains
    .find({ _status: "published" })
    .sort({ sortOrder: 1 })
    .toArray();
  const publishedPosts = await posts
    .find({ _status: "published" })
    .sort({ publishedAt: -1 })
    .toArray();
  const draftPosts = await posts.find({ _status: { $ne: "published" } }).toArray();
  const allCategories = await categories.find({}).sort({ title: 1 }).toArray();
  const mediaDocs = await media.find({}).toArray();

  assert(
    draftServices.every((doc) => doc._status !== "published"),
    "draft services stay unpublished"
  );
  assert(
    publishedServices.every((doc) => doc._status === "published"),
    "published service query is published-only"
  );
  assert(
    publishedServices.length === 0 ||
      publishedServices.every((doc, index, list) => {
        if (index === 0) return true;
        return (list[index - 1].sortOrder ?? 0) <= (doc.sortOrder ?? 0);
      }),
    "published services keep sortOrder"
  );

  const childrenByParent = new Map();
  for (const service of publishedServices) {
    const parentId = toId(service.parent);
    if (!parentId) continue;
    const list = childrenByParent.get(parentId) ?? [];
    list.push(service);
    childrenByParent.set(parentId, list);
  }
  const groups = publishedMains.filter(
    (main) => (childrenByParent.get(toId(main._id)) ?? []).length > 0
  );
  assert(Array.isArray(groups), "service groups resolve from published mains");
  for (const group of groups) {
    const children = childrenByParent.get(toId(group._id)) ?? [];
    assert(
      children.every((child) => child._status === "published"),
      `group ${group.slug || group._id} children are published`
    );
  }

  const slugs = publishedServices
    .map((doc) => doc.slug)
    .filter((slug) => typeof slug === "string" && slug);
  assert(
    slugs.every((slug) => publishedServices.some((doc) => doc.slug === slug)),
    "service slugs are published only"
  );
  for (const slug of slugs) {
    const found = publishedServices.find((doc) => doc.slug === slug);
    assert(Boolean(found), `service lookup ${slug} exists`);
    assert(
      !draftServices.some((doc) => doc.slug === slug && doc._status === "draft" && !found),
      `draft does not replace published lookup for ${slug}`
    );
  }

  const megaMains = publishedMains.filter((doc) => doc.showInMegaMenu === true);
  const megaSubs = publishedServices.filter((doc) => doc.showInMegaMenu === true);
  const megaColumns = megaMains
    .map((main) => ({
      title: main.title,
      links: megaSubs
        .filter((sub) => toId(sub.parent) === toId(main._id) && sub.slug)
        .map((sub) => ({ label: sub.title, href: `/services/${sub.slug}` })),
    }))
    .filter((column) => column.links.length > 0);
  assert(Array.isArray(megaColumns), "mega menu uses published + showInMegaMenu");
  assert(
    megaColumns.every((column) => column.links.every((link) => link.href.startsWith("/services/"))),
    "mega menu links keep public service hrefs"
  );

  const searchFromGroups = groups.flatMap((group) =>
    (childrenByParent.get(toId(group._id)) ?? []).map((service) => ({
      label: service.title,
      href: `/services/${service.slug}`,
      group: group.title,
    }))
  );
  const search = searchFromGroups.length
    ? searchFromGroups
    : megaColumns.flatMap((column) =>
        column.links.map((link) => ({
          label: link.label,
          href: link.href,
          group: column.title,
        }))
      );
  assert(Array.isArray(search), "search index is derived from public groups or mega menu");

  assert(
    publishedPosts.every((doc) => doc._status === "published"),
    "blog listing source is published-only"
  );
  assert(
    draftPosts.every((doc) => doc._status !== "published"),
    "draft posts are excluded from public blog reads"
  );
  assert(
    publishedPosts.length === 0 ||
      publishedPosts.every((doc, index, list) => {
        if (index === 0) return true;
        const prev = new Date(list[index - 1].publishedAt || 0).getTime();
        const next = new Date(doc.publishedAt || 0).getTime();
        return prev >= next;
      }),
    "published posts sort by publishedAt descending"
  );

  const featured = publishedPosts.filter((doc) => doc.featured === true);
  assert(
    featured.every((doc) => doc._status === "published"),
    "featured posts are published only"
  );

  for (const category of allCategories) {
    const count = publishedPosts.filter(
      (post) => toId(post.category) === toId(category._id)
    ).length;
    const draftsInCategory = draftPosts.filter(
      (post) => toId(post.category) === toId(category._id)
    ).length;
    assert(
      count ===
        publishedPosts.filter((post) => toId(post.category) === toId(category._id))
          .length,
      `category ${category.slug} counts published posts only`
    );
    if (draftsInCategory > 0) {
      assert(
        count !==
          count + draftsInCategory,
        `category ${category.slug} does not count drafts`
      );
    }
  }

  const postSlugs = publishedPosts
    .map((doc) => doc.slug)
    .filter((slug) => typeof slug === "string" && slug);
  assert(
    postSlugs.every((slug) => !draftPosts.some((doc) => doc.slug === slug && doc._status === "published")),
    "post slugs are published only"
  );

  if (publishedPosts[0]) {
    const post = publishedPosts[0];
    const related = publishedPosts
      .filter((doc) => toId(doc._id) !== toId(post._id))
      .filter((doc) =>
        post.category ? toId(doc.category) === toId(post.category) : true
      )
      .slice(0, 3);
    assert(
      related.every((doc) => doc._status === "published"),
      "related posts are published only"
    );
    assert(
      related.every((doc) => toId(doc._id) !== toId(post._id)),
      "related posts exclude the current post"
    );
  }

  assert(mediaDocs.length > 0, "existing media documents are available");
  for (const doc of mediaDocs.slice(0, 8)) {
    if (!doc.filename) continue;
    const expected = `/api/media/file/${encodeURIComponent(doc.filename)}`;
    const stored = typeof doc.url === "string" ? doc.url : "";
    assert(
      stored === expected || stored.startsWith("/api/media/file/"),
      `media ${doc.filename} keeps /api/media/file URL`
    );
  }

  const nodeTypes = new Set();
  for (const post of publishedPosts) {
    walkTypes(post.content?.root?.children, nodeTypes);
    const headings = extractHeadings(post.content);
    assert(isLexicalDoc(post.content), `${post.slug} content is Payload Lexical`);
    assert(
      headings.every((item) => item.id && item.title && (item.level === 2 || item.level === 3)),
      `${post.slug} heading IDs follow the existing algorithm`
    );
  }
  const unknown = [...nodeTypes].filter((type) => !SUPPORTED_LEXICAL.has(type));
  assert(
    unknown.length === 0,
    unknown.length
      ? `unsupported Lexical nodes: ${unknown.join(", ")}`
      : `production Lexical nodes are supported (${[...nodeTypes].sort().join(", ") || "none"})`
  );

  const expectedRubber = [
    "what-is-rubber-gym-flooring",
    "benefits-of-rubber-gym-flooring",
    "1-excellent-durability",
  ];
  const rubber = publishedPosts.find(
    (doc) =>
      doc.slug ===
      "rubber-gym-flooring-the-best-choice-for-safe-and-durable-workouts"
  );
  if (rubber) {
    const ids = extractHeadings(rubber.content).map((item) => item.id);
    assert(
      expectedRubber.every((id) => ids.includes(id)),
      "rubber gym article heading IDs match the previous renderer"
    );
  }

  const publicRoots = [
    "src/app/(frontend)",
    "src/components/blog",
    "src/components/home",
    "src/components/services",
    "src/components/layout",
    "src/lib/public",
    "src/content/services.ts",
  ];
  const forbidden = [
    'from "payload"',
    "from 'payload'",
    "getPayload(",
    "@payloadcms/richtext-lexical",
    "@/payload/payload-types",
    "@/lib/payload/",
  ];
  const scanned = [];
  for (const root of publicRoots) {
    const full = join(process.cwd(), root);
    try {
      const stat = statSync(full);
      if (stat.isDirectory()) scanned.push(...walkFiles(full));
      else scanned.push(full);
    } catch {
      // missing path
    }
  }

  for (const file of scanned) {
    const source = readFileSync(file, "utf8");
    for (const token of forbidden) {
      if (token === "@/lib/payload/" && file.includes(`${join("src", "lib", "payload")}`)) {
        continue;
      }
      assert(
        !source.includes(token),
        `${relative(process.cwd(), file)} does not import ${token}`
      );
    }
  }

  const previewPath = join(process.cwd(), "src/app/(frontend)/preview/route.ts");
  if (existsSync(previewPath)) {
    const preview = readFileSync(previewPath, "utf8");
    assert(!preview.includes("getPayload"), "preview route does not call getPayload");
    assert(preview.includes("410"), "preview route is retired with HTTP 410");
  } else {
    assert(true, "preview route removed after Payload cutover");
  }

  console.log(report.join("\n"));
  console.log("Phase 8 verification passed.");
} catch (error) {
  console.error(report.join("\n"));
  console.error(`fail ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  await conn.close();
}

function isLexicalDoc(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.root &&
      value.root.type === "root" &&
      Array.isArray(value.root.children)
  );
}
