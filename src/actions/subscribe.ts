"use server";

import { validateEmail } from "@/lib/form-validation";
import {
  createMailTransport,
  escapeHtml,
  getMailFrom,
  getMailTo,
} from "@/lib/mail";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitSubscribeAction(
  email: string
): Promise<SubscribeResult> {
  const fieldError = validateEmail(email);
  if (fieldError) {
    return { ok: false, error: fieldError };
  }

  const address = email.trim();

  try {
    const transport = createMailTransport();
    const from = getMailFrom();
    const to = getMailTo();

    await transport.sendMail({
      from,
      to,
      replyTo: address,
      subject: "Newsletter subscription",
      text: [
        "New newsletter subscription from mahrajarabia.com",
        "",
        `Email: ${address}`,
      ].join("\n"),
      html: `
        <h2>New newsletter subscription</h2>
        <p><strong>Email:</strong> ${escapeHtml(address)}</p>
      `,
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to send subscription email:", error);
    return {
      ok: false,
      error: "We could not complete your subscription right now. Please try again.",
    };
  }
}
