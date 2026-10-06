import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import type { SessionPayload } from "@/lib/cms/types";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { DEMO_AUTH_SECRET } from "@/lib/auth/demo";

export { SESSION_COOKIE };
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.AUTH_SECRET?.trim() || DEMO_AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET must be set.");
  }
  return value;
}

function encode(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function decode(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", secret())
    .update(body)
    .digest("base64url");

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as SessionPayload;
    if (!payload?.userId || !payload.exp) return null;
    if (payload.exp < Date.now()) return null;
    if (payload.role !== "admin" && payload.role !== "editor") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(
  input: Omit<SessionPayload, "exp">
) {
  const token = encode({
    ...input,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decode(token);
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export function hasSessionCookie(token: string | undefined) {
  return Boolean(token);
}
