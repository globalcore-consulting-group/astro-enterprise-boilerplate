/**
 * Locale value object.
 * Keep domain free of framework dependencies; validate with small runtime guards.
 */

export const SUPPORTED_LOCALES = ["en", "de"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

const SUPPORTED_LOCALE_SET: ReadonlySet<string> = new Set(SUPPORTED_LOCALES);

/** Runtime type guard. */
export function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && SUPPORTED_LOCALE_SET.has(value);
}

/** Returns a valid locale or falls back to DEFAULT_LOCALE. */
export function getLocaleOrDefault(value: unknown): Locale {
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}
