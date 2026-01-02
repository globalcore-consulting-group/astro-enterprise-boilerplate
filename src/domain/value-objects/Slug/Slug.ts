/**
 * URL-safe slug (lowercase, digits, hyphens).
 * Examples: "how-we-work", "team", "insights-2026"
 */
export type Slug = string;

// Common slug pattern: words separated by hyphens, lowercase + digits
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(value: unknown): value is Slug {
  return typeof value === "string" && SLUG_RE.test(value);
}

/**
 * Normalize an input into a slug (best-effort).
 * Useful when generating slugs from titles.
 */
export function toSlug(value: string): Slug {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Returns a valid slug or throws (fail-fast).
 * Useful at boundaries (mappers/adapters).
 */
export function assertSlug(value: unknown, errorMessage = "Invalid slug"): Slug {
  if (!isValidSlug(value)) throw new Error(errorMessage);
  return value;
}
