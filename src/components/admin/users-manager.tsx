"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { deleteUser } from "@/actions/users";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-chrome";
import { UserFormDialog } from "@/components/admin/user-form-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { UserListItem } from "@/lib/users/queries";

const headClass =
  "h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground";

function savedMessage(value?: string) {
  if (value === "created") return "User created. They can sign in with the email and password you set.";
  if (value === "updated") return "User updated.";
  if (value === "deleted") return "User removed. They can no longer sign in.";
  return null;
}

export function UsersManager({
  users,
  currentUserId,
  saved,
}: {
  users: UserListItem[];
  currentUserId: string;
  saved?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<
    { mode: "create" } | { mode: "edit"; user: UserListItem } | null
  >(null);
  const [removeTarget, setRemoveTarget] = useState<UserListItem | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const adminCount = users.filter((user) => user.role === "admin").length;
  const message = savedMessage(saved);
  const editingSelf = Boolean(removeTarget && removeTarget.id === currentUserId);

  function finish(href: string) {
    setForm(null);
    setRemoveTarget(null);
    setRemoveError(null);
    const next = new URL(href, window.location.origin);
    const current = `${window.location.pathname}${window.location.search}`;
    if (current === `${next.pathname}${next.search}`) {
      router.refresh();
      return;
    }
    router.push(href);
  }

  function remove() {
    if (!removeTarget || editingSelf) return;
    const id = removeTarget.id;
    start(async () => {
      setRemoveError(null);
      const result = await deleteUser(id);
      if (result.error || !result.href) {
        setRemoveError(result.error ?? "The user could not be removed.");
        return;
      }
      finish(result.href);
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Create accounts, change roles, and remove users. Only admins can open this page."
        action={
          <Button type="button" onClick={() => setForm({ mode: "create" })}>
            <Plus />
            New user
          </Button>
        }
      />

      {message ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {message}
        </div>
      ) : null}

      {users.length === 0 ? (
        <EmptyState
          title="No users yet"
          body="Create an admin or editor account to give someone access to the dashboard."
          action={
            <Button type="button" onClick={() => setForm({ mode: "create" })}>
              <Plus />
              New user
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {users.length === 1 ? "1 user" : `${users.length} users`}
              {adminCount === 1 ? " · 1 admin" : ` · ${adminCount} admins`}
            </p>
          </div>
          <TooltipProvider delayDuration={300}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={headClass}>User</TableHead>
                  <TableHead className={cn(headClass, "hidden md:table-cell")}>Email</TableHead>
                  <TableHead className={headClass}>Role</TableHead>
                  <TableHead className={cn(headClass, "hidden sm:table-cell")}>Status</TableHead>
                  <TableHead className={cn(headClass, "hidden lg:table-cell")}>Created</TableHead>
                  <TableHead className={cn(headClass, "text-end")}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="px-4 py-3 whitespace-normal">
                        <div className="min-w-40">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-ink">{user.name || "—"}</p>
                            {isSelf ? (
                              <Badge variant="muted" className="normal-case tracking-normal">
                                You
                              </Badge>
                            ) : null}
                          </div>
                          <p className="truncate text-xs text-muted-foreground md:hidden">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {user.status === "locked" ? "Locked" : "Active"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 md:table-cell">
                        <span className="block max-w-56 truncate">{user.email}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant={user.role === "admin" ? "default" : "muted"}
                          className="normal-case tracking-normal"
                        >
                          {user.role === "admin" ? "Admin" : "Editor"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 sm:table-cell">
                        <Badge
                          variant={user.status === "locked" ? "draft" : "published"}
                          className="normal-case tracking-normal"
                          title={user.lockLabel ?? undefined}
                        >
                          {user.status === "locked" ? "Locked" : "Active"}
                        </Badge>
                        {user.lockLabel ? (
                          <p className="mt-1 text-xs text-muted-foreground">{user.lockLabel}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 lg:table-cell">
                        {user.createdLabel}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end">
                        <div className="flex items-center justify-end gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="px-2"
                                aria-label={`Edit ${user.name || user.email}`}
                                onClick={() => setForm({ mode: "edit", user })}
                              >
                                <Pencil />
                                <span className="hidden xl:inline">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "px-2",
                                  !isSelf && "text-destructive hover:bg-destructive/10 hover:text-destructive"
                                )}
                                aria-label={
                                  isSelf
                                    ? "You cannot remove your own account"
                                    : `Remove ${user.name || user.email}`
                                }
                                onClick={() => {
                                  setRemoveError(null);
                                  setRemoveTarget(user);
                                }}
                              >
                                <Trash2 />
                                <span className="hidden xl:inline">Remove</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isSelf ? "You cannot remove your own account" : "Remove"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      )}

      <UserFormDialog
        key={form?.mode === "edit" ? form.user.id : "create"}
        open={form !== null}
        mode={form?.mode ?? "create"}
        user={form?.mode === "edit" ? form.user : null}
        soleAdmin={adminCount <= 1}
        currentUserId={currentUserId}
        onOpenChange={(open) => {
          if (!open) setForm(null);
        }}
        onSaved={finish}
      />

      <AlertDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (pending) return;
          if (!open) {
            setRemoveTarget(null);
            setRemoveError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia
              className={
                editingSelf ? "bg-amber-100 text-amber-800" : "bg-destructive/10 text-destructive"
              }
            >
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>
              {editingSelf ? "This account cannot be removed" : "Remove this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editingSelf
                ? "You cannot remove the account you are signed in with."
                : `“${removeTarget?.name || removeTarget?.email}” will no longer be able to sign in. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {removeError ? (
            <p className="text-sm text-destructive" role="alert">
              {removeError}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
              {editingSelf ? "Close" : "Cancel"}
            </AlertDialogCancel>
            {editingSelf ? null : (
              <Button type="button" variant="destructive" disabled={pending} onClick={remove}>
                {pending ? <Loader2 className="animate-spin" /> : null}
                {pending ? "Removing…" : "Remove user"}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
