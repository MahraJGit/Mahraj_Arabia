export const DEFAULT_PROCESS_TITLE = "From requirements to installation.";

export const DEFAULT_PROCESS_DESCRIPTION =
  "Our experienced team develops practical designs, delivers quality fabrication and coordinates reliable installation tailored to each project.";

export const DEFAULT_PROCESS_STEPS = [
  "Understand",
  "Configure",
  "Fabricate",
  "Install",
];

export function readProcessSteps(value: unknown) {
  if (!Array.isArray(value)) {
    return DEFAULT_PROCESS_STEPS.map((label) => ({ label }));
  }

  return value
    .map((step) => {
      if (typeof step === "string") return step.trim();
      if (step && typeof step === "object" && "label" in step) {
        return String((step as { label?: unknown }).label ?? "").trim();
      }
      return "";
    })
    .filter(Boolean)
    .map((label) => ({ label }));
}
