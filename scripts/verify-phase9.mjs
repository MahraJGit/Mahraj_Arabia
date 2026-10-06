import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import mongoose from "mongoose";

import { loadEnv } from "./lib/load-env.mjs";

loadEnv();

const report = [];
const remaining = {
  runtime: [],
  build: [],
  preview: [],
  scripts: [],
  admin: [],
  historical: [],
  configuration: [],
  packages: [],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
  report.push(`ok  ${message}`);
}

function walkFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walkFiles(full, files);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) files.push(full);
  }
  return files;
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

const root = process.cwd();

try {
  assert(existsSync(join(root, "src/lib/public/services.ts")), "public services module exists");
  assert(existsSync(join(root, "src/lib/public/blog.ts")), "public blog module exists");
  assert(existsSync(join(root, "src/lib/public/categories.ts")), "public categories module exists");
  assert(existsSync(join(root, "src/lib/public/media.ts")), "public media module exists");
  assert(existsSync(join(root, "src/lib/public/rich-text.ts")), "public rich-text module exists");
  assert(
    existsSync(join(root, "src/app/api/media/file/[filename]/route.ts")),
    "custom media GET route exists"
  );
  assert(
    existsSync(join(root, "src/components/blog/lexical-article.tsx")),
    "standalone Lexical renderer exists"
  );
  assert(existsSync(join(root, "src/lib/auth/session.ts")), "custom session auth exists");
  assert(existsSync(join(root, "src/lib/auth/password.ts")), "custom password auth exists");
  assert(existsSync(join(root, "src/lib/cms/permissions.ts")), "custom CMS permissions exist");
  assert(existsSync(join(root, "scripts/seed.mjs")), "mongoose seed script exists");
  assert(existsSync(join(root, "scripts/reset-content.mjs")), "mongoose reset script exists");

  const session = read(join(root, "src/lib/auth/session.ts"));
  assert(session.includes("AUTH_SECRET"), "session signing uses AUTH_SECRET");
  assert(
    !session.includes("PAYLOAD_SECRET"),
    "session signing no longer falls back to PAYLOAD_SECRET"
  );
  assert(Boolean(process.env.AUTH_SECRET), "AUTH_SECRET is set in the environment");

  const previewPath = join(root, "src/app/(frontend)/preview/route.ts");
  if (existsSync(previewPath)) {
    const preview = read(previewPath);
    assert(!preview.includes("getPayload"), "preview route does not call getPayload");
    assert(!preview.includes("@/lib/payload"), "preview route does not import Payload client");
    assert(preview.includes("410") || preview.includes("not available"), "preview is retired, not faked");
  } else {
    assert(true, "preview route removed after Payload cutover");
  }

  const pkg = JSON.parse(read(join(root, "package.json")));
  assert(pkg.scripts.seed === "node scripts/seed.mjs", "npm run seed uses mongoose");
  assert(
    pkg.scripts["reset:blog"] === "node scripts/reset-content.mjs --blog",
    "reset:blog uses mongoose"
  );
  assert(
    pkg.scripts["reset:services"] === "node scripts/reset-content.mjs --services",
    "reset:services uses mongoose"
  );
  assert(
    pkg.scripts["reset:content"] === "node scripts/reset-content.mjs --all",
    "reset:content uses mongoose"
  );
  assert(!pkg.scripts["migrate:services"], "historical Payload migrate:services script is gone");
  assert(!pkg.scripts.payload, "payload CLI script is gone");
  assert(!pkg.dependencies?.payload, "payload package is not a dependency");
  assert(!pkg.dependencies?.["@payloadcms/next"], "@payloadcms/next is not a dependency");

  const forbidden = [
    "getPayload(",
    "@payloadcms/",
    "@/payload/payload-types",
    "@payload-config",
    'from "payload"',
    "from 'payload'",
  ];
  const publicRoots = [
    "src/app/(frontend)",
    "src/app/api",
    "src/components/blog",
    "src/components/home",
    "src/components/services",
    "src/components/layout",
    "src/lib/public",
    "src/lib/auth",
    "src/lib/cms",
    "src/lib/blog",
    "src/lib/services",
    "src/lib/media",
    "src/actions",
    "src/content/services.ts",
  ];

  for (const dir of publicRoots) {
    const full = join(root, dir);
    const files = statSync(full).isDirectory() ? walkFiles(full) : [full];
    for (const file of files) {
      const source = read(file);
      for (const token of forbidden) {
        assert(
          !source.includes(token),
          `${relative(root, file)} does not import ${token}`
        );
      }
    }
  }

  const uri = process.env.DATABASE_URI;
  assert(Boolean(uri), "DATABASE_URI is set");
  const conn = await mongoose.createConnection(uri).asPromise();
  const stamp = Date.now().toString(36);
  const groupSlug = `cms-phase9-group-${stamp}`;
  const serviceSlug = `cms-phase9-service-${stamp}`;
  const postSlug = `cms-phase9-post-${stamp}`;
  const categorySlug = `cms-phase9-category-${stamp}`;

  try {
    const mains = conn.collection("main-services");
    const services = conn.collection("services");
    const posts = conn.collection("posts");
    const categories = conn.collection("categories");

    const group = await mains.insertOne({
      title: "Phase 9 QA Group",
      slug: groupSlug,
      sortOrder: 9999,
      showInMegaMenu: false,
      _status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    let publicGroup = await services.findOne({
      parent: group.insertedId,
      _status: "published",
    });
    assert(!publicGroup, "draft group has no published public children");

    await mains.updateOne(
      { _id: group.insertedId },
      { $set: { _status: "published" } }
    );

    const service = await services.insertOne({
      title: "Phase 9 QA Service",
      slug: serviceSlug,
      parent: group.insertedId,
      excerpt: "Temporary Phase 9 service",
      sortOrder: 1,
      showInMegaMenu: false,
      detailReady: false,
      _status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    assert(
      !(await services.findOne({ slug: serviceSlug, _status: "published" })),
      "draft service is not publicly queryable"
    );

    await services.updateOne(
      { _id: service.insertedId },
      { $set: { _status: "published", excerpt: "Published Phase 9 service" } }
    );
    assert(
      Boolean(await services.findOne({ slug: serviceSlug, _status: "published" })),
      "published service is publicly queryable"
    );

    await services.updateOne(
      { _id: service.insertedId },
      { $set: { _status: "draft" } }
    );
    assert(
      !(await services.findOne({ slug: serviceSlug, _status: "published" })),
      "unpublished service is hidden again"
    );

    const category = await categories.insertOne({
      title: "Phase 9 QA Category",
      slug: categorySlug,
      subtitle: "temporary",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const post = await posts.insertOne({
      title: "Phase 9 QA Post",
      slug: postSlug,
      excerpt: "Temporary Phase 9 post",
      content: {
        root: {
          type: "root",
          children: [
            {
              type: "heading",
              tag: "h2",
              children: [
                {
                  type: "text",
                  text: "Phase 9 Heading",
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        },
      },
      category: category.insertedId,
      featured: false,
      _status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    assert(
      !(await posts.findOne({ slug: postSlug, _status: "published" })),
      "draft post is not publicly queryable"
    );

    await posts.updateOne(
      { _id: post.insertedId },
      {
        $set: {
          _status: "published",
          publishedAt: new Date(),
          excerpt: "Published Phase 9 post",
        },
      }
    );
    const publishedPost = await posts.findOne({
      slug: postSlug,
      _status: "published",
    });
    assert(Boolean(publishedPost), "published post is publicly queryable");
    assert(
      publishedPost.content.root.children[0].tag === "h2",
      "published post keeps Lexical heading JSON"
    );

    await posts.updateOne({ _id: post.insertedId }, { $set: { _status: "draft" } });
    assert(
      !(await posts.findOne({ slug: postSlug, _status: "published" })),
      "unpublished post is hidden again"
    );
  } finally {
    await conn.collection("services").deleteMany({ slug: serviceSlug });
    await conn.collection("main-services").deleteMany({ slug: groupSlug });
    await conn.collection("posts").deleteMany({ slug: postSlug });
    await conn.collection("categories").deleteMany({ slug: categorySlug });
    await conn.close();
  }

  remaining.historical.push(
    "MongoDB Payload internal collections kept for later archival (not deleted)"
  );

  console.log(report.join("\n"));
  console.log("\nALLOWED REMAINING DEPENDENCIES");
  for (const [group, items] of Object.entries(remaining)) {
    if (!items.length) continue;
    console.log(`${group}:`);
    for (const item of items) console.log(`  - ${item}`);
  }
  console.log("Phase 9 verification passed.");
} catch (error) {
  console.error(report.join("\n"));
  console.error(`fail ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
}
