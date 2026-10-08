import { toId } from "@/lib/db/ids";
import { getModels } from "@/lib/db/models";
import { isDemoMode } from "@/lib/auth/demo";
import { getDemoUsers } from "@/lib/cms/demo-data";
import type { UserRole } from "@/lib/cms/types";
import { isSupabaseAuthEnabled } from "@/lib/supabase/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type UserAccountStatus = "active" | "locked";

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserAccountStatus;
  lockLabel: string | null;
  createdLabel: string;
};

function dateValue(value: unknown) {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

function formatLock(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hourCycle: "h23",
  }).format(value);
}

export async function listUsers(): Promise<UserListItem[]> {
  if (isSupabaseAuthEnabled()) {
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin
      .from("profiles")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((doc) => ({
      id: String(doc.id),
      name: String(doc.name ?? ""),
      email: String(doc.email ?? ""),
      role: doc.role === "admin" ? "admin" : "editor",
      status: "active" as const,
      lockLabel: null,
      createdLabel: formatDate(dateValue(doc.created_at)),
    }));
  }

  if (isDemoMode()) {
    return getDemoUsers();
  }

  const { User } = await getModels();
  const docs = await User.find()
    .sort({ createdAt: 1 })
    .select("name email role lockUntil createdAt")
    .lean();

  return docs.map((doc) => {
    const lockUntil = dateValue(doc.lockUntil);
    const locked = Boolean(lockUntil && lockUntil.getTime() > Date.now());

    return {
      id: toId(doc._id),
      name: String(doc.name ?? ""),
      email: String(doc.email ?? ""),
      role: doc.role === "admin" ? "admin" : "editor",
      status: locked ? "locked" : "active",
      lockLabel: locked && lockUntil ? `Until ${formatLock(lockUntil)} UTC` : null,
      createdLabel: formatDate(dateValue(doc.createdAt)),
    };
  });
}
