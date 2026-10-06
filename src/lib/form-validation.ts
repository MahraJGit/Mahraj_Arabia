export type EnquiryValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  solution: string;
  brief: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

export function validateEnquiry(
  values: EnquiryValues,
  options?: { requireCompany?: boolean; requirePhone?: boolean }
): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (options?.requireCompany && !values.company.trim()) {
    errors.company = "Please enter your company name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (options?.requirePhone || values.phone.trim()) {
    if (!values.phone.trim()) {
      errors.phone = "Please enter your phone number.";
    } else if (!PHONE_RE.test(values.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
  }

  if (!values.solution.trim()) {
    errors.solution = "Please select an industry solution.";
  }

  if (!values.brief.trim()) {
    errors.brief = "Please describe your project briefly.";
  } else if (values.brief.trim().length < 10) {
    errors.brief = "Please add a bit more detail (at least 10 characters).";
  }

  return errors;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Please enter your email.";
  if (!EMAIL_RE.test(email.trim())) return "Please enter a valid email address.";
  return null;
}

export function hasErrors(errors: Record<string, string | undefined>) {
  return Object.values(errors).some(Boolean);
}
