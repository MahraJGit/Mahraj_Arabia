"use client";

import { useState, useTransition } from "react";
import { CircleAlert, Eye, EyeOff, Loader2 } from "lucide-react";

import { createUser, updateUser, type UserActionResult } from "@/actions/users";
import { Field } from "@/components/admin/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/lib/cms/types";
import {
  cleanEmail,
  cleanName,
  emailError,
  nameError,
  passwordError,
  roleValue,
} from "@/lib/users/fields";
import type { UserListItem } from "@/lib/users/queries";

function PasswordInput({
  id,
  name,
  label,
  hint,
  required,
  invalid,
  disabled,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  required: boolean;
  invalid: boolean;
  disabled: boolean;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className="h-10 pe-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute inset-e-1 top-1 size-8"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </Field>
  );
}

export function UserFormDialog({
  open,
  mode,
  user,
  soleAdmin,
  currentUserId,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  mode: "create" | "edit";
  user: UserListItem | null;
  soleAdmin: boolean;
  currentUserId: string;
  onOpenChange: (open: boolean) => void;
  onSaved: (href: string) => void;
}) {
  const editing = mode === "edit" && user;
  const [role, setRole] = useState<UserRole>(editing ? user.role : "editor");
  const [result, setResult] = useState<UserActionResult | null>(null);
  const [pending, start] = useTransition();
  const roleLocked = Boolean(editing && user.id === currentUserId && soleAdmin && user.role === "admin");

  function close(next: boolean) {
    if (pending) return;
    onOpenChange(next);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("role", role);

    const name = cleanName(String(formData.get("name") ?? ""));
    const email = cleanEmail(String(formData.get("email") ?? ""));
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");
    const invalidName = nameError(name);
    const invalidEmail = emailError(email);
    const invalidPassword = passwordError(password, mode === "create");

    if (invalidName) {
      setResult({ error: invalidName, field: "name" });
      return;
    }
    if (invalidEmail) {
      setResult({ error: invalidEmail, field: "email" });
      return;
    }
    if (!roleValue(role)) {
      setResult({ error: "Choose Admin or Editor.", field: "role" });
      return;
    }
    if (invalidPassword) {
      setResult({ error: invalidPassword, field: "password" });
      return;
    }
    if (password && password !== confirm) {
      setResult({
        error: "Password and confirmation do not match.",
        field: "confirm",
      });
      return;
    }

    setResult(null);
    start(async () => {
      const next = editing ? await updateUser(formData) : await createUser(formData);
      if (next.error || !next.href) {
        setResult(next.error ? next : { error: "The user could not be saved.", field: null });
        return;
      }
      onSaved(next.href);
    });
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit user" : "New user"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this account. Leave the password blank to keep the current one."
              : "Create a sign-in for an admin or an editor."}
          </DialogDescription>
        </DialogHeader>
        <form key={editing ? user.id : "create"} onSubmit={submit} className="grid gap-4">
          {editing ? <input type="hidden" name="id" value={user.id} /> : null}
          {result?.error ? (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Could not save</AlertTitle>
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          ) : null}
          <Field label="Name" htmlFor="user-name">
            <Input
              id="user-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              defaultValue={editing ? user.name : ""}
              disabled={pending}
              aria-invalid={result?.field === "name" || undefined}
              className="h-10"
            />
          </Field>
          <Field label="Email" htmlFor="user-email" hint="This is the sign-in address.">
            <Input
              id="user-email"
              name="email"
              type="email"
              autoComplete="off"
              required
              maxLength={160}
              defaultValue={editing ? user.email : ""}
              disabled={pending}
              aria-invalid={result?.field === "email" || undefined}
              className="h-10"
            />
          </Field>
          <Field
            label="Role"
            htmlFor="user-role"
            hint={
              roleLocked
                ? "Add another admin before changing your own role."
                : "Admins manage users. Editors manage content only."
            }
          >
            <Select
              value={role}
              onValueChange={(value) => {
                const next = roleValue(value);
                if (next) setRole(next);
              }}
              disabled={pending || roleLocked}
            >
              <SelectTrigger
                id="user-role"
                className="h-10 w-full"
                aria-invalid={result?.field === "role" || undefined}
              >
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[60]">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <PasswordInput
            id="user-password"
            name="password"
            label={editing ? "New password" : "Password"}
            hint={editing ? "Optional. At least 8 characters." : "At least 8 characters."}
            required={mode === "create"}
            invalid={result?.field === "password"}
            disabled={pending}
            autoComplete="new-password"
          />
          <PasswordInput
            id="user-confirm-password"
            name="confirmPassword"
            label="Confirm password"
            required={mode === "create"}
            invalid={result?.field === "confirm"}
            disabled={pending}
            autoComplete="new-password"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={pending}
              onClick={() => close(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              {pending ? "Saving…" : editing ? "Save user" : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
