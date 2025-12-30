import type { Locale } from "@/domain/entities/Locale";

/**
 * UI-level translations (buttons, navigation, states)
 * Content (Hero, Features, etc.) should come from Content Collections/Strapi
 */
export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
    },
    ui: {
      learnMore: "Learn more",
      getStarted: "Get started",
      contactUs: "Contact us",
      loading: "Loading...",
      error: "Something went wrong",
      notFound: "Page not found",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      services: "Dienstleistungen",
      contact: "Kontakt",
    },
    ui: {
      learnMore: "Mehr erfahren",
      getStarted: "Jetzt starten",
      contactUs: "Kontaktieren Sie uns",
      loading: "Wird geladen...",
      error: "Etwas ist schief gelaufen",
      notFound: "Seite nicht gefunden",
    },
  },
} as const;

type TranslationSchema = typeof translations.en;
type NamespaceKey = keyof TranslationSchema;
type TranslationKey<N extends NamespaceKey> = keyof TranslationSchema[N];

/**
 * Type-safe translation helper with full autocompletion
 *
 * @example
 * t("en", "nav", "home") // "Home"
 * t("de", "ui", "loading") // "Wird geladen..."
 */
export function t<N extends NamespaceKey>(locale: Locale, namespace: N, key: TranslationKey<N>): string {
  const localeData = translations[locale];
  const namespaceData = localeData[namespace];
  return namespaceData[key as keyof typeof namespaceData] as string;
}

/**
 * Get entire namespace of translations
 * Useful for iterating over navigation items, etc.
 *
 * @example
 * Object.entries(getNamespace("en", "nav")).map(([key, label]) => ...)
 */
export function getNamespace<N extends NamespaceKey>(locale: Locale, namespace: N): Record<string, string> {
  return translations[locale][namespace] as Record<string, string>;
}
