import { pbkdf2, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);
const scryptAsync = promisify(scrypt);

/** Payload has used more than one PBKDF2 setting across versions. Try them all. */
const PAYLOAD_VARIANTS = [
  { iterations: 25_000, keylen: 512, digest: "sha256" },
  { iterations: 25_000, keylen: 512, digest: "sha512" },
  { iterations: 25_000, keylen: 64, digest: "sha256" },
  { iterations: 250_000, keylen: 64, digest: "sha256" },
  { iterations: 25_000, keylen: 64, digest: "sha512" },
] as const;

const SCRYPT_PREFIX = "scrypt$";
const SCRYPT_KEYLEN = 64;

function safeEqualHex(left: string, right: Buffer) {
  try {
    const leftBuf = Buffer.from(left, "hex");
    if (leftBuf.length !== right.length) return false;
    return timingSafeEqual(leftBuf, right);
  } catch {
    return false;
  }
}

async function verifyPayloadPassword(
  password: string,
  hash: string,
  salt: string
) {
  let expectedLen = 0;
  try {
    expectedLen = Buffer.from(hash, "hex").length;
  } catch {
    return false;
  }

  for (const variant of PAYLOAD_VARIANTS) {
    if (expectedLen && variant.keylen !== expectedLen) continue;
    const derived = (await pbkdf2Async(
      password,
      salt,
      variant.iterations,
      variant.keylen,
      variant.digest
    )) as Buffer;
    if (safeEqualHex(hash, derived)) return true;
  }
  return false;
}

async function verifyScryptPassword(password: string, stored: string) {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = parts[1];
  const hash = parts[2];
  const derived = (await scryptAsync(password, salt, SCRYPT_KEYLEN)) as Buffer;
  return safeEqualHex(hash, derived);
}

export async function verifyPassword(args: {
  password: string;
  hash?: string | null;
  salt?: string | null;
}): Promise<"payload" | "scrypt" | false> {
  const { password, hash, salt } = args;
  if (!password || !hash) return false;

  if (hash.startsWith(SCRYPT_PREFIX)) {
    return (await verifyScryptPassword(password, hash)) ? "scrypt" : false;
  }

  if (!salt) return false;
  return (await verifyPayloadPassword(password, hash, salt)) ? "payload" : false;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, SCRYPT_KEYLEN)) as Buffer;
  return {
    hash: `${SCRYPT_PREFIX}${salt}$${derived.toString("hex")}`,
    salt,
  };
}
