"use client";

import { useEffect, useRef } from "react";

import {
  clearPendingSave,
  peekPendingSave,
  type PendingSave,
} from "@/lib/admin/stale-action";

/**
 * Restores a parked admin save after a quiet reconnect, then retries once.
 */
export function usePendingSaveRecovery(
  key: string,
  handlers: {
    restore: (pending: PendingSave) => void;
    retry: (pending: PendingSave) => void | Promise<void>;
  }
) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    const pending = peekPendingSave(key);
    if (!pending) return;
    ran.current = true;
    clearPendingSave(key);
    handlers.restore(pending);
    void handlers.retry(pending);
    // intentionally once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
