import type { Locale } from "@/domain";

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
      domains: "Domains",
    },
    ui: {
      // Actions
      learnMore: "Learn more",
      getStarted: "Get started",
      contactUs: "Contact us",
      backToHome: "Back to Home",
      // States
      loading: "Loading...",
      error: "Something went wrong",
      notFound: "Page not found",
      comingSoon: "This page is coming soon.",
      contentComingSoon: "Content coming soon.",
      // Aria labels
      openMenu: "Open main menu",
    },
    footer: {
      navigation: "Navigation",
      legal: "Legal",
      privacyPolicy: "Privacy Policy",
      imprint: "Imprint",
      allRightsReserved: "All rights reserved.",
      companyDescription:
        "Resilience Architecture for Critical Systems. Independent consulting for decision-ready architecture.",
    },
    routes: {
      home: "",
      about: "about",
      services: "services",
      contact: "contact",
      domains: "domains",
      privacy: "privacy",
      imprint: "impressum",
    },
    sections: {
      howWeWork: "How We Work",
      howWeWorkContent: "FRAS™ content coming soon.",
      frameSprint: "FRAME Sprint",
      architectBlueprint: "ARCHITECT Blueprint",
      modelValidation: "MODEL Validation",
      steerRetainer: "STEER Retainer",
      energyInfrastructure: "Energy & Infrastructure Resilience",
      digitalCyber: "Digital & Cyber Resilience",
      financeResilience: "Finance Resilience",
      customerValue: "Customer Value & Revenue Resilience",
      regulatedHealth: "Regulated Operations / Health",
      esgData: "ESG Data Resilience & Auditability",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      services: "Dienstleistungen",
      contact: "Kontakt",
      domains: "Domänen",
    },
    ui: {
      // Actions
      learnMore: "Mehr erfahren",
      getStarted: "Jetzt starten",
      contactUs: "Kontaktieren Sie uns",
      backToHome: "Zurück zur Startseite",
      // States
      loading: "Wird geladen...",
      error: "Etwas ist schief gelaufen",
      notFound: "Seite nicht gefunden",
      comingSoon: "Diese Seite kommt bald.",
      contentComingSoon: "Inhalte kommen bald.",
      // Aria labels
      openMenu: "Hauptmenü öffnen",
    },
    footer: {
      navigation: "Navigation",
      legal: "Rechtliches",
      privacyPolicy: "Datenschutz",
      imprint: "Impressum",
      allRightsReserved: "Alle Rechte vorbehalten.",
      companyDescription:
        "Resilienz Architektur für kritische Systeme. Unabhängige Beratung für entscheidungsreife Architektur.",
    },
    routes: {
      home: "",
      about: "ueber-uns",
      services: "dienstleistungen",
      contact: "kontakt",
      domains: "domaenen",
      privacy: "datenschutz",
      imprint: "impressum",
    },
    sections: {
      howWeWork: "So arbeiten wir",
      howWeWorkContent: "FRAS™ Inhalte kommen bald.",
      frameSprint: "FRAME Sprint",
      architectBlueprint: "ARCHITECT Blueprint",
      modelValidation: "MODEL Validierung",
      steerRetainer: "STEER Retainer",
      energyInfrastructure: "Energy & Infrastructure Resilience",
      digitalCyber: "Digital & Cyber Resilience",
      financeResilience: "Finance Resilience",
      customerValue: "Customer Value & Revenue Resilience",
      regulatedHealth: "Regulated Operations / Health",
      esgData: "ESG Data Resilience & Auditability",
    },
  },
} as const satisfies Record<Locale, unknown>;

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

// ===== Route Helpers =====

type RouteKey = keyof typeof translations.en.routes;

/**
 * Build full path from route key for given locale
 * Handles locale prefix and route slug translation
 *
 * @param routeKey - Route key from translations.routes (e.g., "about", "services")
 * @param locale - Target locale
 * @returns Full path with locale prefix if needed
 *
 * @example
 * buildPath("about", "en") // "/about"
 * buildPath("about", "de") // "/de/ueber-uns"
 * buildPath("home", "en")  // "/"
 * buildPath("home", "de")  // "/de"
 */
export function buildPath(routeKey: RouteKey, locale: Locale): string {
  const routeSlug = translations[locale].routes[routeKey];

  // Handle home route
  if (routeKey === "home") {
    return locale === "en" ? "/" : `/${locale}`;
  }

  // Handle other routes
  if (locale === "en") {
    return `/${routeSlug}`;
  } else {
    return `/${locale}/${routeSlug}`;
  }
}

/**
 * Extract route key from any localized path
 * Works with all supported locales
 *
 * @param path - URL pathname (e.g., "/about", "/de/ueber-uns")
 * @returns Route key or undefined if not found
 *
 * @example
 * getRouteKeyFromPath("/about")        // "about"
 * getRouteKeyFromPath("/de/ueber-uns") // "about"
 * getRouteKeyFromPath("/")             // "home"
 * getRouteKeyFromPath("/de")           // "home"
 */
export function getRouteKeyFromPath(path: string): RouteKey | undefined {
  // Normalize path (remove trailing slash except for root)
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

  // Handle home routes
  if (normalizedPath === "/" || normalizedPath === "/de") {
    return "home";
  }

  // Extract slug from path
  // For EN: "/about" -> "about"
  // For DE: "/de/ueber-uns" -> "ueber-uns"
  const segments = normalizedPath.split("/").filter(Boolean);
  const slug = segments.length === 1 ? segments[0] : segments[1];

  if (!slug) return undefined;

  // Find matching route key across all locales
  const routeKeys = Object.keys(translations.en.routes) as RouteKey[];

  for (const routeKey of routeKeys) {
    for (const locale of ["en", "de"] as const) {
      if (translations[locale].routes[routeKey] === slug) {
        return routeKey;
      }
    }
  }

  return undefined;
}

/**
 * Get all route slugs for a given locale
 * Useful for generating static paths in getStaticPaths()
 *
 * @param locale - Locale to get route slugs for
 * @returns Array of route slugs (excluding home)
 *
 * @example
 * getRouteSlugs("de") // ["ueber-uns", "dienstleistungen", "kontakt", "domaenen", "datenschutz", "impressum"]
 * getRouteSlugs("en") // ["about", "services", "contact", "domains", "privacy", "impressum"]
 */
export function getRouteSlugs(locale: Locale): string[] {
  const routeKeys = Object.keys(translations[locale].routes) as RouteKey[];
  return routeKeys
    .filter((key) => key !== "home") // Exclude home route (which has empty slug)
    .map((key) => translations[locale].routes[key]);
}
