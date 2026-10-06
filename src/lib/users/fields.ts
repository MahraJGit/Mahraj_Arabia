import type { UserRole } from "@/lib/cms/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function cleanEmail(value: string) {
  return value.trim().toLowerCase();
}

export function nameError(name: string) {
  if (name.length < 2 || name.length > 80) {
    return "Name must be between 2 and 80 characters.";
  }
  return null;
}

export function emailError(email: string) {
  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    return "Enter a valid email address.";
  }
  return null;
}

export function roleValue(value: string): UserRole | null {
  if (value === "admin" || value === "editor") return value;
  return null;
}

export function passwordError(password: string, required: boolean) {
  if (!password) {
    return required ? "Enter a password for this account." : null;
  }
  if (password.length < 8 || password.length > 128) {
    return "Password must be between 8 and 128 characters.";
  }
  return null;
}
