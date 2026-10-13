"use server";

import {
  hasErrors,
  validateEnquiry,
  type EnquiryValues,
} from "@/lib/form-validation";
import {
  createMailTransport,
  escapeHtml,
  getMailFrom,
  getMailTo,
} from "@/lib/mail";

export type EnquiryResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof EnquiryValues, string>> };

export async function submitEnquiryAction(
  values: EnquiryValues
): Promise<EnquiryResult> {
  const fieldErrors = validateEnquiry(values, { requirePhone: true });
  if (hasErrors(fieldErrors)) {
    return {
      ok: false,
      error: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const payload = {
    name: values.name.trim(),
    company: values.company.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    solution: values.solution.trim(),
    brief: values.brief.trim(),
  };

  try {
    const transport = createMailTransport();
    const from = getMailFrom();
    const to = getMailTo();

    await transport.sendMail({
      from,
      to,
      replyTo: `${payload.name} <${payload.email}>`,
      subject: `Quote request: ${payload.solution}`,
      text: [
        "New quote request from mahrajarabia.com",
        "",
        `Name: ${payload.name}`,
        `Company: ${payload.company || "—"}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Solution: ${payload.solution}`,
        "",
        "Project brief:",
        payload.brief,
      ].join("\n"),
      html: `
        <h2>New quote request</h2>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(payload.company || "—")}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Solution:</strong> ${escapeHtml(payload.solution)}</p>
        <p><strong>Project brief:</strong></p>
        <p>${escapeHtml(payload.brief).replaceAll("\n", "<br />")}</p>
      `,
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to send enquiry email:", error);
    return {
      ok: false,
      error: "We could not send your request right now. Please try again or contact us by phone.",
    };
  }
}
