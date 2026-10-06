type Attempt = {
  count: number;
  lockedUntil: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const globalForLimit = globalThis as typeof globalThis & {
  __mahrajLoginAttempts?: Map<string, Attempt>;
};

const attempts =
  globalForLimit.__mahrajLoginAttempts ?? new Map<string, Attempt>();
globalForLimit.__mahrajLoginAttempts = attempts;

function keyFor(email: string) {
  return email.trim().toLowerCase();
}

export function getLoginLock(email: string) {
  const current = attempts.get(keyFor(email));
  if (!current) return { locked: false, remaining: MAX_ATTEMPTS };
  if (current.lockedUntil > Date.now()) {
    return { locked: true, remaining: 0 };
  }
  return { locked: false, remaining: Math.max(0, MAX_ATTEMPTS - current.count) };
}

export function recordLoginFailure(email: string) {
  const key = keyFor(email);
  const current = attempts.get(key);
  const count = (current?.count ?? 0) + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + WINDOW_MS : 0;
  attempts.set(key, { count, lockedUntil });
  return { locked: lockedUntil > Date.now(), remaining: Math.max(0, MAX_ATTEMPTS - count) };
}

export function clearLoginFailures(email: string) {
  attempts.delete(keyFor(email));
}
