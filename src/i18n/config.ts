import type { Locale } from "@/domain/entities/Locale";

export const i18nConfig = {
  defaultLocale: "en" as Locale,
  locales: ["en", "de"] as Locale[],

  // Routing configuration
  routing: {
    prefixDefaultLocale: false, // EN has no prefix
  },

  // Locale display names
  localeNames: {
    en: "English",
    de: "Deutsch",
  } as Record<Locale, string>,

  // Date formatting
  dateFormats: {
    en: "en-US",
    de: "de-DE",
  } as Record<Locale, string>,
} as const;
