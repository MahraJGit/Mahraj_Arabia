export const DEFAULT_PROCESS_TITLE = "Steps commercial project process";

export const DEFAULT_PROCESS_DESCRIPTION =
  "Excellence delivered for the region’s top-tier business destinations.";

export const DEFAULT_PROCESS_STEPS = [
  "Understand",
  "Assess",
  "Recommend",
  "Coordinate",
  "Delivery",
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
