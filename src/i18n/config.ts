import type { Locale } from "@/domain";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/domain";

export const i18nConfig = {
  defaultLocale: DEFAULT_LOCALE,
  locales: [...SUPPORTED_LOCALES],

  // Routing configuration
  routing: {
    prefixDefaultLocale: false, // EN has no prefix
  },

  // Locale display names
  localeNames: {
    en: "English",
    de: "Deutsch",
  } satisfies Record<Locale, string>,

  // Date formatting
  dateFormats: {
    en: "en-US",
    de: "de-DE",
  } satisfies Record<Locale, string>,
} as const;
