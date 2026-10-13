import nodemailer from "nodemailer";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createMailTransport() {
  const host = requireEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASSWORD");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function getMailFrom() {
  return process.env.SMTP_FROM?.trim() || requireEnv("SMTP_USER");
}

export function getMailTo() {
  return process.env.SMTP_TO?.trim() || requireEnv("SMTP_USER");
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
