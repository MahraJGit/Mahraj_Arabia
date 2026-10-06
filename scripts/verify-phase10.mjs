import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import mongoose from "mongoose";

import { loadEnv } from "./lib/load-env.mjs";

loadEnv();

const report = [];

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

const EXPECTED_COUNTS = {
  users: 1,
  media: 5,
  posts: 4,
  categories: 4,
  services: 6,
  "main-services": 4,
};

const SAMPLE = {
  serviceId: "6aa3b692b6daac29d6c4664f",
  serviceSlug: "anti-static-epoxy-flooring",
  postId: "6aa3a646909b92052165fdde",
  postSlug: "rubber-gym-flooring-the-best-choice-for-safe-and-durable-workouts",
  mediaId: "6aa3a40d9594dac2da831b72",
  mediaFilename: "images - 2026-09-11T114633.380-1.jpg",
};

const root = process.cwd();

try {
  const required = [
    "src/lib/public/services.ts",
    "src/lib/public/blog.ts",
    "src/lib/public/categories.ts",
    "src/lib/public/media.ts",
    "src/lib/public/rich-text.ts",
    "src/app/api/media/file/[filename]/route.ts",
    "src/lib/auth/session.ts",
    "src/lib/auth/password.ts",
    "src/lib/cms/permissions.ts",
    "src/components/blog/lexical-article.tsx",
    "src/app/(frontend)/page.tsx",
    "src/app/(frontend)/services/page.tsx",
    "src/app/(frontend)/services/[slug]/page.tsx",
    "src/app/(frontend)/blog/page.tsx",
    "src/app/(frontend)/blog/[slug]/page.tsx",
    "src/app/(admin)/admin/login/page.tsx",
  ];
  for (const file of required) {
    assert(existsSync(join(root, file)), `${file} exists`);
  }
  assert(
    !existsSync(join(root, "src/app/(admin)/manage")),
    "old /manage app directory is removed"
  );

  const removed = [
    "payload.config.ts",
    "src/payload",
    "src/lib/payload",
    "src/app/(payload)",
    "src/app/(frontend)/preview",
    "src/app/(frontend)/exit-preview",
  ];
  for (const file of removed) {
    assert(!existsSync(join(root, file)), `${file} is removed`);
  }

  const nextConfig = read(join(root, "next.config.ts"));
  assert(!nextConfig.includes("withPayload"), "next.config.ts does not use withPayload");
  assert(!nextConfig.includes("@payloadcms"), "next.config.ts does not import @payloadcms");

  const tsconfig = JSON.parse(read(join(root, "tsconfig.json")));
  assert(!tsconfig.compilerOptions?.paths?.["@payload-config"], "@payload-config alias is gone");

  const pkg = JSON.parse(read(join(root, "package.json")));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of [
    "payload",
    "@payloadcms/next",
    "@payloadcms/db-mongodb",
    "@payloadcms/storage-s3",
    "@payloadcms/richtext-lexical",
    "graphql",
  ]) {
    assert(!deps[name], `${name} is not in package.json`);
  }
  assert(Boolean(deps.mongoose), "mongoose remains");
  assert(Boolean(deps["@aws-sdk/client-s3"]), "@aws-sdk/client-s3 remains");
  assert(Boolean(deps.sharp), "sharp remains");
  assert(!pkg.scripts.payload, "payload CLI script is gone");
  assert(!pkg.scripts["generate:types"], "generate:types is gone");
  assert(!pkg.scripts["generate:importmap"], "generate:importmap is gone");
  assert(!pkg.scripts["migrate:services"], "migrate:services is gone");

  const session = read(join(root, "src/lib/auth/session.ts"));
  assert(session.includes("AUTH_SECRET"), "session signing uses AUTH_SECRET");
  assert(!session.includes("PAYLOAD_SECRET"), "custom auth does not read PAYLOAD_SECRET");
  assert(Boolean(process.env.AUTH_SECRET), "AUTH_SECRET is set");
  const envFiles = [".env", ".env.local"];
  for (const file of envFiles) {
    const contents = read(join(root, file));
    assert(!contents.includes("PAYLOAD_SECRET"), `${file} does not contain PAYLOAD_SECRET`);
  }

  const forbidden = [
    "getPayload(",
    "@payloadcms/",
    "@/payload/payload-types",
    "@payload-config",
    'from "payload"',
    "from 'payload'",
    "withPayload",
    "PAYLOAD_SECRET",
  ];
  const scanRoots = [
    "src/app",
    "src/components",
    "src/lib",
    "src/actions",
    "src/content",
    "next.config.ts",
    "tsconfig.json",
    "package.json",
  ];
  for (const dir of scanRoots) {
    const full = join(root, dir);
    const files = existsSync(full) && statSync(full).isDirectory() ? walkFiles(full) : [full];
    for (const file of files) {
      const source = read(file);
      for (const token of forbidden) {
        assert(!source.includes(token), `${relative(root, file)} does not contain ${token}`);
      }
    }
  }

  const uri = process.env.DATABASE_URI;
  assert(Boolean(uri), "DATABASE_URI is set");
  const conn = await mongoose.createConnection(uri).asPromise();
  try {
    for (const [name, expected] of Object.entries(EXPECTED_COUNTS)) {
      const actual = await conn.collection(name).countDocuments();
      assert(actual === expected, `${name} count is ${actual} (expected ${expected})`);
    }

    const service = await conn.collection("services").findOne({
      _id: new mongoose.Types.ObjectId(SAMPLE.serviceId),
    });
    assert(Boolean(service), "sample service still exists");
    assert(service.slug === SAMPLE.serviceSlug, "sample service slug is unchanged");

    const post = await conn.collection("posts").findOne({
      _id: new mongoose.Types.ObjectId(SAMPLE.postId),
    });
    assert(Boolean(post), "sample post still exists");
    assert(post.slug === SAMPLE.postSlug, "sample post slug is unchanged");
    assert(post.content?.root?.type === "root", "sample post Lexical JSON is unchanged");

    const media = await conn.collection("media").findOne({
      _id: new mongoose.Types.ObjectId(SAMPLE.mediaId),
    });
    assert(Boolean(media), "sample media still exists");
    assert(media.filename === SAMPLE.mediaFilename, "sample media filename is unchanged");

    const internals = [
      "payload-kvs",
      "payload-locked-documents",
      "payload-preferences",
      "payload-migrations",
      "_posts_versions",
      "_services_versions",
      "_main-services_versions",
      "globals",
    ];
    for (const name of internals) {
      const exists = (await conn.db.listCollections({ name }).toArray()).length > 0;
      assert(exists, `${name} remains (not deleted)`);
    }
  } finally {
    await conn.close();
  }

  console.log(report.join("\n"));
  console.log("Phase 10 verification passed.");
} catch (error) {
  console.error(report.join("\n"));
  console.error(`fail ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
}
