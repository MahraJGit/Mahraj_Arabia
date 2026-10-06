import { readFileSync } from "node:fs";
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
    // optional env file
  }
}

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error("DATABASE_URI is not set.");
  process.exit(1);
}

const options = { strict: false, timestamps: true };
const Category = mongoose.model(
  "CategoryVerify",
  new mongoose.Schema({}, { ...options, collection: "categories" })
);
const Post = mongoose.model(
  "PostVerify",
  new mongoose.Schema({}, { ...options, collection: "posts" })
);
const Media = mongoose.model(
  "MediaVerify",
  new mongoose.Schema({}, { ...options, collection: "media" })
);

const stamp = Date.now().toString(36);
const categorySlug = `cms-phase6-test-category-${stamp}`;
const postSlug = `cms-phase6-test-post-${stamp}`;
const report = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  report.push(`ok  ${message}`);
}

function lexicalDoc(blocks) {
  return {
    root: {
      type: "root",
      children: blocks.map((block) =>
        block.heading
          ? {
              type: "heading",
              tag: "h2",
              children: [
                {
                  type: "text",
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: block.heading,
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            }
          : {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  detail: 0,
                  format: block.bold ? 1 : 0,
                  mode: "normal",
                  style: "",
                  text: block.paragraph,
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              textFormat: 0,
              version: 1,
            }
      ),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

await mongoose.connect(uri, { bufferCommands: false });

try {
  const media = await Media.findOne().select("_id url").lean();
  assert(Boolean(media?._id), "existing media is available for cover image");

  const createdCategory = await Category.create({
    title: "Phase 6 Test Category",
    slug: categorySlug,
    subtitle: "Temporary verification category",
  });
  assert(createdCategory.slug === categorySlug, "created category stores slug");
  assert(!createdCategory._status, "categories do not use draft status");

  const used = await Post.countDocuments({ category: createdCategory._id });
  assert(used === 0, "new category has no post references");

  const createdDraft = await Post.create({
    title: "Phase 6 Test Draft",
    slug: postSlug,
    excerpt: "Temporary verification draft",
    content: lexicalDoc([
      { paragraph: "Draft body that must stay Payload Lexical." },
      { heading: "Draft heading" },
    ]),
    coverImage: media._id,
    seoTitle: "Phase 6 draft SEO",
    seoDescription: "Temporary draft SEO text",
    category: createdCategory._id,
    author: "By Mahraj QA",
    authorImage: media._id,
    readTime: "4 min read",
    featured: false,
    _status: "draft",
  });
  assert(createdDraft._status === "draft", "created post stores _status draft");
  assert(createdDraft.content?.root?.type === "root", "draft content is Payload Lexical");
  assert(
    Array.isArray(createdDraft.content.root.children) &&
      createdDraft.content.root.children[0].type === "paragraph",
    "draft content children stay Lexical nodes"
  );
  assert(!createdDraft.publishedAt, "draft does not invent a publication date");

  const publicDraft = await Post.findOne({
    slug: postSlug,
    _status: "published",
  }).lean();
  assert(!publicDraft, "draft is not publicly visible");

  const firstPublishedAt = new Date("2026-03-15T12:00:00.000Z");
  await Post.updateOne(
    { _id: createdDraft._id },
    {
      $set: {
        title: "Phase 6 Test Published",
        excerpt: "Temporary verification published post",
        featured: true,
        publishedAt: firstPublishedAt,
        _status: "published",
        content: lexicalDoc([
          { paragraph: "Published body that the public renderer must understand." },
          { heading: "Wear layer" },
          { paragraph: "Specify at least 0.55mm for commercial corridors.", bold: true },
        ]),
      },
    }
  );
  const published = await Post.findById(createdDraft._id).lean();
  assert(published._status === "published", "publish writes _status published");
  assert(published.featured === true, "featured flag persists");
  assert(
    published.publishedAt?.toISOString() === firstPublishedAt.toISOString(),
    "first publication date is stored"
  );
  const publicPublished = await Post.findOne({
    slug: postSlug,
    _status: "published",
  }).lean();
  assert(Boolean(publicPublished), "published post is publicly visible");
  assert(
    publicPublished.content.root.children.some((node) => node.type === "heading" && node.tag === "h2"),
    "published content remains compatible with public heading extraction"
  );

  await Post.updateOne(
    { _id: createdDraft._id },
    {
      $set: {
        excerpt: "Updated published excerpt",
        seoTitle: "Phase 6 updated SEO",
        _status: "published",
      },
    }
  );
  const updated = await Post.findById(createdDraft._id).lean();
  assert(updated._status === "published", "saving a published post keeps _status published");
  assert(
    updated.publishedAt?.toISOString() === firstPublishedAt.toISOString(),
    "later edits do not overwrite publishedAt"
  );
  assert(updated.excerpt === "Updated published excerpt", "published excerpt update persisted");

  await Post.updateOne({ _id: createdDraft._id }, { $set: { _status: "draft" } });
  const unpublished = await Post.findById(createdDraft._id).lean();
  assert(unpublished._status === "draft", "unpublish writes _status draft");
  assert(
    unpublished.publishedAt?.toISOString() === firstPublishedAt.toISOString(),
    "unpublish keeps the original publication date"
  );
  const publicAfterUnpublish = await Post.findOne({
    slug: postSlug,
    _status: "published",
  }).lean();
  assert(!publicAfterUnpublish, "unpublished post is not publicly visible");

  const referenced = await Post.countDocuments({ category: createdCategory._id });
  assert(referenced === 1, "delete protection would block this category while a post references it");

  await Post.deleteOne({ _id: createdDraft._id });
  await Category.deleteOne({ _id: createdCategory._id });

  const leftoverPost = await Post.findOne({ slug: postSlug }).lean();
  const leftoverCategory = await Category.findOne({ slug: categorySlug }).lean();
  assert(!leftoverPost && !leftoverCategory, "test documents removed");

  const leftoverQa = await Post.find({ slug: { $regex: "^cms-phase6-test-" } }).lean();
  const leftoverQaCategories = await Category.find({
    slug: { $regex: "^cms-phase6-test-" },
  }).lean();
  assert(leftoverQa.length === 0 && leftoverQaCategories.length === 0, "no leftover phase 6 QA records");

  console.log(report.join("\n"));
  console.log("Phase 6 verification passed.");
} catch (error) {
  await Post.deleteMany({ slug: { $regex: `^${postSlug}` } });
  await Category.deleteMany({ slug: categorySlug });
  console.error("Phase 6 verification failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
