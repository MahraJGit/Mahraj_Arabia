const PENDING_KEY = "mahraj:admin:pending-save";
const PENDING_TTL_MS = 10 * 60 * 1000;

export type PendingSave = {
  key: string;
  href: string;
  payload: unknown;
  status?: string;
  createdAt: number;
};

export function isStaleServerActionError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : String(error ?? "");

  const lower = message.toLowerCase();
  return (
    lower.includes("server action") ||
    lower.includes("failed-to-find-server-action")
  );
}

export function friendlyActionError(error: unknown, fallback: string) {
  if (isStaleServerActionError(error)) {
    return "Please try saving again in a moment.";
  }
  if (error instanceof Error && error.message.trim()) {
    // Never surface Next.js internal action IDs to editors.
    if (/server action/i.test(error.message)) {
      return fallback;
    }
    return error.message;
  }
  return fallback;
}

export function parkPendingSave(entry: Omit<PendingSave, "createdAt" | "href"> & {
  href?: string;
}) {
  if (typeof window === "undefined") return;
  const pending: PendingSave = {
    key: entry.key,
    payload: entry.payload,
    status: entry.status,
    href: entry.href || window.location.href,
    createdAt: Date.now(),
  };
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function peekPendingSave(key: string): PendingSave | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const pending = JSON.parse(raw) as PendingSave;
    if (pending.key !== key) return null;
    if (Date.now() - pending.createdAt > PENDING_TTL_MS) {
      sessionStorage.removeItem(PENDING_KEY);
      return null;
    }
    return pending;
  } catch {
    return null;
  }
}

export function clearPendingSave(key?: string) {
  if (typeof window === "undefined") return;
  if (!key) {
    sessionStorage.removeItem(PENDING_KEY);
    return;
  }
  const pending = peekPendingSave(key);
  if (pending) sessionStorage.removeItem(PENDING_KEY);
}

/**
 * Runs a server action. If the open tab is on an older deploy, parks the
 * payload and reconnects once so the save can finish without losing work.
 */
export async function runAdminAction<T>(
  action: () => Promise<T>,
  options?: {
    pendingKey?: string;
    payload?: unknown;
    status?: string;
  }
): Promise<{ ok: true; data: T } | { ok: false; error: unknown; recovering: boolean }> {
  try {
    const data = await action();
    if (options?.pendingKey) clearPendingSave(options.pendingKey);
    return { ok: true, data };
  } catch (error) {
    if (
      typeof window !== "undefined" &&
      isStaleServerActionError(error) &&
      options?.pendingKey &&
      options.payload !== undefined
    ) {
      parkPendingSave({
        key: options.pendingKey,
        payload: options.payload,
        status: options.status,
      });
      // Same-URL navigation picks up the new client bundle without a blank
      // error screen; the form restores the draft and retries on mount.
      window.location.href = window.location.href;
      return { ok: false, error, recovering: true };
    }
    return { ok: false, error, recovering: false };
  }
}
