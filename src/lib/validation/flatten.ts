import type { ZodError } from "zod";

export function flattenZod(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const full = issue.path.map(String).join(".");
    const root = String(issue.path[0] ?? "");
    if (full && !fieldErrors[full]) fieldErrors[full] = issue.message;
    if (root && !fieldErrors[root]) fieldErrors[root] = issue.message;
    if (!full && !fieldErrors._root) fieldErrors._root = issue.message;
  }

  return fieldErrors;
}

export function firstFieldError(fieldErrors: Record<string, string>) {
  return Object.values(fieldErrors)[0] ?? null;
}
