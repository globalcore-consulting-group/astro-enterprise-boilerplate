import { z } from "zod";

/**
 * Supported locales in the application
 */
export const LocaleSchema = z.enum(["en", "de"]);

export type Locale = z.infer<typeof LocaleSchema>;

export const DEFAULT_LOCALE: Locale = "en";

export const SUPPORTED_LOCALES: Locale[] = ["en", "de"];

/**
 * Type guard for locale validation
 */
export function isValidLocale(value: unknown): value is Locale {
  return LocaleSchema.safeParse(value).success;
}

/**
 * Get locale with fallback to default
 */
export function getLocaleOrDefault(locale: unknown): Locale {
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}
