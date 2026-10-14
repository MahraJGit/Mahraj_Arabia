"use client";

import { AdminErrorState } from "@/components/admin/admin-error-state";

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AdminErrorState
      title="Could not load profile"
      error={error}
      reset={reset}
    />
  );
}
