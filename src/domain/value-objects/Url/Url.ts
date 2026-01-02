/**
 * Url value object.
 * Supports:
 * - Internal paths starting with "/"
 * - Absolute http(s) URLs
 *
 * Intentionally rejects dangerous schemes (javascript:, data:, vbscript:).
 */
export type Url = string;

const INTERNAL_PATH_RE = /^\/(?!\/).*/; // starts with single "/" (not "//")
const HAS_WHITESPACE_RE = /\s/;

export function isInternalPath(value: unknown): value is Url {
  return typeof value === "string" && INTERNAL_PATH_RE.test(value) && !HAS_WHITESPACE_RE.test(value);
}

export function isHttpUrl(value: unknown): value is Url {
  if (typeof value !== "string" || HAS_WHITESPACE_RE.test(value)) return false;

  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * True if value is a safe URL we allow in content:
 * - internal path (/...)
 * - http/https absolute URL
 */
export function isValidUrl(value: unknown): value is Url {
  return isInternalPath(value) || isHttpUrl(value);
}

/**
 * Fail-fast URL assertion for boundary validation (mappers/adapters).
 */
export function assertUrl(value: unknown, errorMessage = "Invalid URL"): Url {
  if (!isValidUrl(value)) throw new Error(errorMessage);
  return value;
}
