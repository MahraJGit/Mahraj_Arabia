function hasHexString(
  value: object
): value is { toHexString: () => string } {
  return (
    "toHexString" in value &&
    typeof (value as { toHexString?: unknown }).toHexString === "function"
  );
}

export function toId(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && hasHexString(value)) {
    return value.toHexString();
  }
  if (typeof value === "object" && value !== null && "_id" in value) {
    return toId((value as { _id: unknown })._id);
  }
  if (typeof value === "object" && value !== null && "id" in value) {
    return String((value as { id: unknown }).id);
  }
  return String(value);
}

export function isObjectId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
}

export function asObjectId(value: string) {
  return value;
}
