/**
 * Custom CMS seed. Does not wipe production content.
 *
 * Ensures the first admin user exists. Does not re-upload media.
 * Existing documents are left unchanged.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

import mongoose from "mongoose";

import { loadEnv } from "./lib/load-env.mjs";

loadEnv();

const scryptAsync = promisify(scrypt);
const SCRYPT_KEYLEN = 64;

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, SCRYPT_KEYLEN);
  return {
    hash: `scrypt$${salt}$${derived.toString("hex")}`,
    salt,
  };
}

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error("DATABASE_URI is not set.");
  process.exit(1);
}

const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME || "Administrator";

if (!email || !password) {
  console.error("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

const conn = await mongoose.createConnection(uri).asPromise();
const users = conn.collection("users");

try {
  const existing = await users.findOne({
    email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  });

  if (existing) {
    console.log(`Admin ${email} already exists.`);
  } else {
    const next = await hashPassword(password);
    await users.insertOne({
      email,
      name,
      role: "admin",
      hash: next.hash,
      salt: next.salt,
      loginAttempts: 0,
      lockUntil: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Created admin ${email}.`);
  }

  console.log("Seed complete. Content collections were not modified.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await conn.close();
}
