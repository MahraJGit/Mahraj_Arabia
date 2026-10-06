/**
 * DESTRUCTIVE QA helper. Deletes CMS documents. Never run against production
 * unless you intend to wipe content. Admin users are never deleted.
 *
 * Usage:
 *   npm run reset:blog
 *   npm run reset:services
 *   npm run reset:content
 *   npm run reset:content -- --media
 */
import mongoose from "mongoose";

import { loadEnv } from "./lib/load-env.mjs";

loadEnv();

const args = process.argv.slice(2);
const resetBlog = args.includes("--blog") || args.includes("--all");
const resetServices = args.includes("--services") || args.includes("--all");
const resetMedia = args.includes("--media");

if (!resetBlog && !resetServices && !resetMedia) {
  console.error(`
DESTRUCTIVE: deletes CMS documents. Admin users are kept.

Usage:
  npm run reset:blog
  npm run reset:services
  npm run reset:content
  npm run reset:content -- --media
`);
  process.exit(1);
}

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error("DATABASE_URI is not set.");
  process.exit(1);
}

const conn = await mongoose.createConnection(uri).asPromise();

async function clearCollection(name) {
  const col = conn.collection(name);
  const before = await col.countDocuments();
  const result = await col.deleteMany({});
  console.log(`Cleared ${name} (previously ${before}, deleted ${result.deletedCount}).`);
}

try {
  if (resetBlog) {
    await clearCollection("posts");
    await clearCollection("categories");
  }
  if (resetServices) {
    await clearCollection("services");
    await clearCollection("main-services");
  }
  if (resetMedia) {
    await clearCollection("media");
  }
  console.log("Reset complete. Admin users were not changed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await conn.close();
}
