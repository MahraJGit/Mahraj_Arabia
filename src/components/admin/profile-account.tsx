"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, Eye, EyeOff, Loader2 } from "lucide-react";

import {
  changePassword,
  updateProfile,
  type PasswordState,
  type ProfileState,
} from "@/actions/profile";
import { Field } from "@/components/admin/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminUser } from "@/lib/cms/types";

const profileInitial: ProfileState = {
  error: null,
  field: null,
  success: null,
  savedAt: null,
};

const passwordInitial: PasswordState = {
  error: null,
  field: null,
  success: null,
  savedAt: null,
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "MF";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function StatusAlert({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (error) {
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Could not save</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert variant="success">
        <CheckCircle2 />
        <AlertTitle>{success}</AlertTitle>
        <AlertDescription>
          {success === "Password changed."
            ? "Use the new password the next time you sign in."
            : "Your account details are up to date."}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

function PasswordField({
  id,
  name,
  label,
  autoComplete,
  error,
  disabled,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  error: boolean;
  disabled: boolean;
  hint?: string;
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
          required
          disabled={disabled}
          aria-invalid={error || undefined}
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

export function ProfileAccount({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [profile, setProfile] = useState(user);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileState, saveProfile, profilePending] = useActionState(
    updateProfile,
    profileInitial
  );
  const [passwordState, savePassword, passwordPending] = useActionState(
    changePassword,
    passwordInitial
  );
  const [passwordError, setPasswordError] = useState<PasswordState | null>(null);
  const passwordFormId = useId();

  useEffect(() => {
    setProfile(user);
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (!profileState.savedAt || !profileState.name || !profileState.email) return;
    const nextName = profileState.name;
    const nextEmail = profileState.email;
    setName(nextName);
    setEmail(nextEmail);
    setProfile((current) => ({
      ...current,
      name: nextName,
      email: nextEmail,
    }));
    router.refresh();
  }, [profileState.savedAt, profileState.name, profileState.email, router]);

  useEffect(() => {
    if (!passwordState.savedAt) return;
    const form = document.getElementById(passwordFormId) as HTMLFormElement | null;
    form?.reset();
    setPasswordError(null);
  }, [passwordState.savedAt, passwordFormId]);

  const shownPassword = passwordError ?? passwordState;
  const roleLabel = profile.role === "admin" ? "Admin" : "Editor";

  function submitPassword(formData: FormData) {
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword.length < 8 || newPassword.length > 128) {
      setPasswordError({
        error: "New password must be between 8 and 128 characters.",
        field: "new",
        success: null,
        savedAt: null,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError({
        error: "New password and confirmation do not match.",
        field: "confirm",
        success: null,
        savedAt: null,
      });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError({
        error: "New password must be different from your current password.",
        field: "new",
        success: null,
        savedAt: null,
      });
      return;
    }

    setPasswordError(null);
    savePassword(formData);
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <Card>
        <CardContent className="flex flex-col items-center px-5 py-6 text-center sm:items-start sm:text-left lg:items-center lg:text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-muted font-heading text-lg font-semibold text-ink">
            {initials(profile.name)}
          </span>
          <p className="mt-4 font-heading text-lg font-semibold text-ink">
            {profile.name}
          </p>
          <p className="mt-1 max-w-full truncate text-sm text-muted-foreground">
            {profile.email}
          </p>
          <Badge variant="muted" className="mt-3 normal-case tracking-normal">
            {roleLabel}
          </Badge>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Role is managed by an administrator and cannot be changed here.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>
              This name appears in the dashboard. Email is what you use to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={saveProfile} className="grid gap-4">
              <StatusAlert error={profileState.error} success={profileState.success} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="profile-name">
                  <Input
                    id="profile-name"
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={profilePending}
                    aria-invalid={profileState.field === "name" || undefined}
                    className="h-10"
                  />
                </Field>
                <Field
                  label="Email"
                  htmlFor="profile-email"
                  hint="Changing email updates your sign-in address."
                >
                  <Input
                    id="profile-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={160}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={profilePending}
                    aria-invalid={profileState.field === "email" || undefined}
                    className="h-10"
                  />
                </Field>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Signed in as {roleLabel.toLowerCase()}.
                </p>
                <Button type="submit" className="h-10 sm:min-w-36" disabled={profilePending}>
                  {profilePending ? <Loader2 className="animate-spin" /> : null}
                  {profilePending ? "Saving…" : "Save profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Enter your current password, then choose a new one and confirm it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id={passwordFormId} action={submitPassword} className="grid gap-4">
              <StatusAlert
                error={shownPassword.error}
                success={passwordError ? null : passwordState.success}
              />
              <PasswordField
                id="current-password"
                name="currentPassword"
                label="Current password"
                autoComplete="current-password"
                error={shownPassword.field === "current"}
                disabled={passwordPending}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <PasswordField
                  id="new-password"
                  name="newPassword"
                  label="New password"
                  autoComplete="new-password"
                  hint="At least 8 characters."
                  error={shownPassword.field === "new"}
                  disabled={passwordPending}
                />
                <PasswordField
                  id="confirm-password"
                  name="confirmPassword"
                  label="Confirm new password"
                  autoComplete="new-password"
                  error={shownPassword.field === "confirm"}
                  disabled={passwordPending}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  className="h-10 w-full sm:w-auto sm:min-w-40"
                  disabled={passwordPending}
                >
                  {passwordPending ? <Loader2 className="animate-spin" /> : null}
                  {passwordPending ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
