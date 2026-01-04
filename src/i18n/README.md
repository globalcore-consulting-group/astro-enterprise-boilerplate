# Internationalization (i18n)

This folder contains the **internationalization configuration and type-safe translation system** for UI text. Our i18n strategy separates UI translations from content, leveraging both Astro's built-in i18n routing and Content Collections.

---

## Overview

Our i18n system has **two parts**:

1. **UI Translations** (`translations.ts`) - Static UI text (buttons, navigation, error messages)
2. **Content Collections** (`src/content/`) - Dynamic content (Hero sections, Services, Projects)

This separation allows:

- ✅ **UI text** to be version-controlled and type-safe
- ✅ **Content** to be managed by non-technical users (future Strapi CMS)
- ✅ **Clean architecture** - UI translations in code, content in data layer

---

## Supported Languages

| Language          | Code | URL Pattern                           | Status |
| ----------------- | ---- | ------------------------------------- | ------ |
| English (default) | `en` | `/`, `/about`, `/services`            | ✅     |
| German            | `de` | `/de`, `/de/ueber-uns`, `/de/dienste` | ✅     |

**Default locale:** English (no URL prefix)
**Additional locales:** Use `/{lang}/` prefix

---

## Architecture

### 1. Astro i18n Routing

Configured in [astro.config.mjs](../../../astro.config.mjs):

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false, // EN = no prefix
    },
  },
});
```

**URL structure:**

- `/` → English homepage
- `/about` → English about page
- `/de` → German homepage
- `/de/ueber-uns` → German about page

### 2. UI Translations

File: [translations.ts](./translations.ts)

**Purpose:** Type-safe translations for static UI text

**What belongs here:**

- ✅ Navigation labels
- ✅ Button text
- ✅ Form labels and placeholders
- ✅ Error messages
- ✅ Loading states
- ✅ 404 pages

**What doesn't belong here:**

- ❌ Hero section content → Content Collections
- ❌ Service descriptions → Content Collections
- ❌ Blog posts → Content Collections/Strapi

**Example:**

```typescript
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
      loading: "Loading...",
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
      loading: "Wird geladen...",
    },
  },
};
```

### 3. Content Collections i18n

Content organized by locale folders:

```
src/content/
  hero/
    en/
      home.json
    de/
      home.json
  services/
    en/
      consulting.json
    de/
      consulting.json
```

**Benefits:**

- Clear separation of content by language
- Easy to add new locales (just add folder)
- Works with Astro's Content Collections API
- Ready for Strapi migration (same structure)

---

## Usage

### Type-Safe Translation Helper - t()

```typescript
import { t } from "@/i18n/translations";

// Full TypeScript autocomplete:
t("en", "nav", "home"); // "Home"
t("de", "ui", "loading"); // "Wird geladen..."

// ❌ Compile error - invalid namespace:
t("en", "invalid", "key");

// ❌ Compile error - invalid key:
t("en", "nav", "nonexistent");
```

**Available namespaces:**

- `nav` - Navigation labels (home, about, services, contact, domains)
- `ui` - UI elements (buttons, states, aria labels)
- `footer` - Footer-specific text (legal links, copyright)
- `routes` - Route slug translations (used by helpers, not directly)
- `sections` - Section headings (temporary, will move to Content Collections)

### Route Helpers

The translation system includes three route helper functions for building paths and handling route translations:

#### buildPath(routeKey, locale)

Build full path with locale prefix and translated slug:

```typescript
import { buildPath } from "@/i18n/translations";

buildPath("about", "en");     // "/about"
buildPath("about", "de");     // "/de/ueber-uns"
buildPath("services", "de");  // "/de/dienstleistungen"
buildPath("home", "en");      // "/"
buildPath("home", "de");      // "/de"

// Use in templates
<a href={buildPath("about", locale)}>
  {t(locale, "nav", "about")}
</a>
```

#### getRouteKeyFromPath(path)

Extract route key from any localized path (useful for language switchers):

```typescript
import { getRouteKeyFromPath } from "@/i18n/translations";

getRouteKeyFromPath("/about"); // "about"
getRouteKeyFromPath("/de/ueber-uns"); // "about"
getRouteKeyFromPath("/"); // "home"
getRouteKeyFromPath("/de"); // "home"
getRouteKeyFromPath("/unknown"); // undefined

// Language switcher example
const currentRouteKey = getRouteKeyFromPath(Astro.url.pathname);
const alternateLocale = locale === "en" ? "de" : "en";
const alternateUrl = currentRouteKey
  ? buildPath(currentRouteKey, alternateLocale)
  : alternateLocale === "en"
    ? "/"
    : "/de";
```

#### getRouteSlugs(locale)

Get all route slugs for a locale (excluding home, used in getStaticPaths):

```typescript
import { getRouteSlugs } from "@/i18n/translations";

getRouteSlugs("en"); // ["about", "services", "contact", "domains", "privacy", "impressum"]
getRouteSlugs("de"); // ["ueber-uns", "dienstleistungen", "kontakt", "domaenen", "datenschutz", "impressum"]

// Use in getStaticPaths for catch-all routes
export function getStaticPaths() {
  const locales = ["de"]; // Non-default locales

  return locales.flatMap((locale) =>
    getRouteSlugs(locale).map((slug) => ({
      params: { lang: locale, slug },
    }))
  );
}
```

### In Astro Components

**Always use `buildPath()` for links:**

```astro
---
// src/components/common/Header.astro
import { t, buildPath } from "@/i18n/translations";
import type { Locale } from "@/domain";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
---

<nav>
  <a href={buildPath("home", locale)}>
    {t(locale, "nav", "home")}
  </a>
  <a href={buildPath("about", locale)}>
    {t(locale, "nav", "about")}
  </a>
  <a href={buildPath("services", locale)}>
    {t(locale, "nav", "services")}
  </a>
</nav>
```

### Get Entire Namespace

Useful for iterating over navigation items:

```typescript
import { getNamespace, buildPath } from "@/i18n/translations";

const navItems = getNamespace("en", "nav");
// { home: "Home", about: "About", services: "Services", contact: "Contact", domains: "Domains" }

// Iterate for dynamic navigation (use buildPath for href):
Object.entries(navItems)
  .filter(([key]) => key !== "home") // Example: exclude home
  .map(([key, label]) => ({
    key,
    label,
    href: buildPath(key as RouteKey, locale),
  }));
```

### In Pages (Combining UI + Content)

**Example placeholder page:**

```astro
---
// src/pages/about.astro
import { t, buildPath } from "@/i18n/translations";
import Layout from "@/layouts/Layout.astro";

const locale = "en";
const title = t(locale, "nav", "about");
---

<Layout title={title} locale={locale}>
  <main class="container mx-auto px-4 md:px-6 max-w-7xl py-12 md:py-24">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-6">
        {title}
      </h1>
      <p class="text-lg text-muted-foreground mb-8">{t(locale, "ui", "comingSoon")}</p>
      <a
        href={buildPath("home", locale)}
        class="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t(locale, "ui", "backToHome")}
      </a>
    </div>
  </main>
</Layout>
```

**Example with Content Collections:**

```astro
---
// src/pages/services.astro (future implementation)
import { t, buildPath } from "@/i18n/translations";
import { getCollection } from "astro:content";
import Layout from "@/layouts/Layout.astro";

const locale = "en"; // or from Astro.currentLocale
const pageTitle = t(locale, "nav", "services");

// Content from Content Collections
const services = await getCollection("services", (entry) => entry.id.startsWith(`${locale}/`));
---

<Layout title={pageTitle} locale={locale}>
  <main>
    <h1>{pageTitle}</h1>
    {
      services.map((service) => (
        <article>
          <h2>{service.data.title}</h2>
          <p>{service.data.description}</p>
          {/* Use buildPath for consistency, even though service detail pages don't exist yet */}
          <a href={buildPath("services", locale) + `/${service.slug}`}>{t(locale, "ui", "learnMore")}</a>
        </article>
      ))
    }
  </main>
</Layout>
```

---

## Configuration

File: [config.ts](./config.ts)

**Purpose:** Centralized i18n settings

```typescript
export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en", "de"],

  routing: {
    prefixDefaultLocale: false, // EN has no prefix
  },

  localeNames: {
    en: "English",
    de: "Deutsch",
  },

  dateFormats: {
    en: "en-US",
    de: "de-DE",
  },
};
```

**Usage:**

```typescript
import { i18nConfig } from "@/i18n/config";

// Display locale name
const localeName = i18nConfig.localeNames[locale]; // "English" or "Deutsch"

// Format dates
const formatter = new Intl.DateTimeFormat(i18nConfig.dateFormats[locale]);
const formattedDate = formatter.format(new Date());
```

---

## Route Translations

Route translations are centralized in `src/i18n/translations.ts` in the `routes` namespace:

```typescript
// src/i18n/translations.ts (excerpt)
export const translations = {
  en: {
    routes: {
      home: "",
      about: "about",
      services: "services",
      contact: "contact",
      domains: "domains",
      privacy: "privacy",
      imprint: "impressum",
    },
  },
  de: {
    routes: {
      home: "",
      about: "ueber-uns",
      services: "dienstleistungen",
      contact: "kontakt",
      domains: "domaenen",
      privacy: "datenschutz",
      imprint: "impressum",
    },
  },
} as const;
```

**Catch-all route for non-default locales:**

```astro
---
// src/pages/[lang]/[...slug].astro
import { getRouteKeyFromPath, buildPath, getRouteSlugs, t } from "@/i18n/translations";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, getLocaleOrDefault } from "@/domain";
import type { Locale } from "@/domain";
import Layout from "@/layouts/Layout.astro";

// Generate static paths for all non-default locales
export async function getStaticPaths() {
  const locales = SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

  return locales.flatMap((locale) =>
    getRouteSlugs(locale).map((slug) => ({
      params: { lang: locale, slug },
    }))
  );
}

const locale: Locale = getLocaleOrDefault(Astro.params.lang);
const localizedSlug = Astro.params.slug;

// Extract route key from localized path
const routeKey = getRouteKeyFromPath(`/${locale}/${localizedSlug}`);

// Get page title from translations
const title = routeKey ? t(locale, "nav", routeKey as any) : "Page";
---

<Layout title={title} locale={locale}>
  <main>
    <h1>{title}</h1>
    <p>{t(locale, "ui", "comingSoon")}</p>
    <a href={buildPath("home", locale)}>
      {t(locale, "ui", "backToHome")}
    </a>
  </main>
</Layout>
```

---

## Adding a New Language

### 1. Add locale to domain value object

```typescript
// src/domain/value-objects/Locale/Locale.ts
export const SUPPORTED_LOCALES = ["en", "de", "fr"] as const; // Add "fr"
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// The Set is auto-updated from SUPPORTED_LOCALES
const SUPPORTED_LOCALE_SET: ReadonlySet<string> = new Set(SUPPORTED_LOCALES);
```

**Update the tests:**

```typescript
// src/domain/value-objects/Locale/Locale.test.ts
it("exposes supported locales and default locale", () => {
  expect(SUPPORTED_LOCALES).toEqual(["en", "de", "fr"]); // Add "fr"
  expect(DEFAULT_LOCALE).toBe("en");
});

it("validates locales with a runtime guard", () => {
  expect(isValidLocale("en")).toBe(true);
  expect(isValidLocale("de")).toBe(true);
  expect(isValidLocale("fr")).toBe(true); // Add test for "fr"

  expect(isValidLocale("es")).toBe(false);
  // ... rest of negative tests
});
```

### 2. Update Astro config

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "fr"], // Add "fr"
  },
});
```

### 3. Add UI translations

```typescript
// src/i18n/translations.ts
export const translations = {
  en: {
    /* ... */
  },
  de: {
    /* ... */
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      services: "Services",
      contact: "Contact",
    },
    ui: {
      learnMore: "En savoir plus",
      getStarted: "Commencer",
      loading: "Chargement...",
    },
  },
};
```

### 4. Update i18n config

```typescript
// src/i18n/config.ts
export const i18nConfig = {
  locales: ["en", "de", "fr"],
  localeNames: {
    en: "English",
    de: "Deutsch",
    fr: "Français",
  },
  dateFormats: {
    en: "en-US",
    de: "de-DE",
    fr: "fr-FR",
  },
};
```

### 5. Add content folders

```bash
mkdir -p src/content/hero/fr
mkdir -p src/content/services/fr
# ... other collections
```

### 6. Create content

```json
// src/content/hero/fr/home.json
{
  "title": "Bienvenue chez GlobalCore",
  "subtitle": "Votre partenaire en conseil"
}
```

---

## File Structure

```
src/i18n/
├── README.md (this file)
├── config.ts                    ← i18n configuration
├── translations.ts              ← Type-safe UI translations + route helpers
├── translations.test.ts         ← Comprehensive test suite (29 tests)
└── index.ts                     ← Barrel export
```

---

## Best Practices

### 1. Use Namespaces

Organize translations by **feature/section**:

```typescript
export const translations = {
  en: {
    nav: {
      /* navigation */
    },
    ui: {
      /* buttons, states */
    },
    forms: {
      /* form labels, validation */
    },
    errors: {
      /* error messages */
    },
  },
};
```

### 2. Keep Keys Descriptive

```typescript
// ✅ GOOD: Descriptive key
{
  ui: {
    submitContactForm: "Send message",
    cancelContactForm: "Cancel",
  }
}

// ❌ BAD: Generic key
{
  ui: {
    button1: "Send message",
    button2: "Cancel",
  }
}
```

### 3. Avoid Hardcoded Text

```astro
---
import { t } from "@/i18n/translations";
const locale = Astro.currentLocale;
---

<!-- ✅ GOOD -->
<button>{t(locale, "ui", "getStarted")}</button>

<!-- ❌ BAD -->
<button>Get Started</button>
```

### 4. Separate UI from Content

```typescript
// ✅ UI translations - belongs in translations.ts
{
  ui: {
    readMore: "Read more",
    learnMore: "Learn more",
  }
}

// ❌ Content - belongs in Content Collections
{
  hero: {
    title: "Welcome to GlobalCore",
    subtitle: "Your trusted consulting partner",
  }
}
```

**Why?**

- UI text is static and rarely changes
- Content is dynamic and managed by CMS
- Clear separation of concerns

### 5. Always Use Route Helpers

Never hardcode route logic - always use the provided helpers:

```astro
---
import { buildPath, getRouteKeyFromPath } from "@/i18n/translations";
---

<!-- ✅ GOOD - Use buildPath -->
<a href={buildPath("about", locale)}>About</a>

<!-- ❌ BAD - Hardcoded route logic -->
<a href={locale === "en" ? "/about" : "/de/ueber-uns"}>About</a>

<!-- ✅ GOOD - Use getRouteKeyFromPath for language switcher -->
const currentRouteKey = getRouteKeyFromPath(Astro.url.pathname); const alternateUrl = buildPath(currentRouteKey, alternateLocale);

<!-- ❌ BAD - Hardcoded language switcher -->
const alternateUrl = locale === "en" ? "/de/ueber-uns" : "/about";
```

### 6. Use TypeScript Autocomplete

The `t()` function provides **full autocomplete**:

```typescript
t("en", "nav" /*<-- autocomplete here --> */);

// Suggestions:
// - home
// - about
// - services
// - contact
```

This prevents typos and makes refactoring easier.

---

## Testing i18n

**Test Coverage:** 29 comprehensive unit tests in [translations.test.ts](./translations.test.ts)

### Test Suite Overview

Our i18n system has **100% test coverage** with tests organized into three main categories:

#### 1. Translation Functions (20 tests)

Tests for `t()` and `getNamespace()` functions across all namespaces:

```typescript
// src/i18n/translations.test.ts
import { describe, it, expect } from "vitest";
import { t, getNamespace, translations } from "./translations";

describe("Translation Functions", () => {
  describe("t", () => {
    it("should return correct EN translations for nav namespace", () => {
      expect(t("en", "nav", "home")).toBe("Home");
      expect(t("en", "nav", "about")).toBe("About");
    });

    it("should return correct DE translations for nav namespace", () => {
      expect(t("de", "nav", "home")).toBe("Startseite");
      expect(t("de", "nav", "about")).toBe("Über uns");
    });

    // Additional tests for ui, footer, sections namespaces
  });

  describe("getNamespace", () => {
    it("should return entire nav namespace for EN", () => {
      const navEN = getNamespace("en", "nav");
      expect(navEN).toEqual({
        home: "Home",
        about: "About",
        services: "Services",
        contact: "Contact",
        domains: "Domains",
      });
    });
  });

  describe("Translation schema consistency", () => {
    it("should have the same namespace keys across all locales", () => {
      const enNamespaces = Object.keys(translations.en);
      const deNamespaces = Object.keys(translations.de);
      expect(enNamespaces).toEqual(deNamespaces);
    });

    // Tests for all namespaces (nav, ui, footer, routes, sections)
  });
});
```

#### 2. Route Helpers (13 tests)

Tests for `buildPath()`, `getRouteKeyFromPath()`, and `getRouteSlugs()`:

```typescript
describe("Route Helpers", () => {
  describe("buildPath", () => {
    it("should build EN paths without locale prefix", () => {
      expect(buildPath("about", "en")).toBe("/about");
      expect(buildPath("services", "en")).toBe("/services");
    });

    it("should build DE paths with locale prefix and translated slugs", () => {
      expect(buildPath("about", "de")).toBe("/de/ueber-uns");
      expect(buildPath("services", "de")).toBe("/de/dienstleistungen");
    });
  });

  describe("getRouteKeyFromPath", () => {
    it("should extract route key from EN paths", () => {
      expect(getRouteKeyFromPath("/about")).toBe("about");
    });

    it("should extract route key from DE paths", () => {
      expect(getRouteKeyFromPath("/de/ueber-uns")).toBe("about");
    });
  });

  describe("getRouteSlugs", () => {
    it("should return EN route slugs excluding home", () => {
      const slugs = getRouteSlugs("en");
      expect(slugs).toContain("about");
      expect(slugs).not.toContain(""); // home excluded
    });
  });
});
```

#### 3. Language Switching Scenarios (3 integration tests)

Tests for real-world language switching behavior:

```typescript
describe("Language switching scenario", () => {
  it("should correctly generate alternate URL when switching from EN to DE", () => {
    const currentPath = "/about";
    const currentRouteKey = getRouteKeyFromPath(currentPath);
    const alternateUrl = currentRouteKey ? buildPath(currentRouteKey, "de") : "/de";

    expect(currentRouteKey).toBe("about");
    expect(alternateUrl).toBe("/de/ueber-uns");
  });
});
```

**Run tests:**

```bash
npm run test -- src/i18n/translations.test.ts
# All 29 tests passing ✓
```

### E2E Tests for i18n

We have **15 E2E tests** covering EN and DE homepages in [tests/e2e/home.spec.ts](../../tests/e2e/home.spec.ts):

- 11 EN homepage tests (layout, interactions, content)
- 4 DE homepage tests (localized content, navigation)

**Example E2E test for language switching:**

```typescript
// tests/e2e/home.spec.ts
import { test, expect } from "@playwright/test";

test("DE homepage has correct language switcher", async ({ page }) => {
  await page.goto("/de");

  // Language switcher should show "EN"
  const languageSwitcher = page.getByRole("link", { name: /en/i });
  await expect(languageSwitcher).toBeVisible();
  await expect(languageSwitcher).toHaveAttribute("href", "/");
});

test("EN homepage has correct navigation links", async ({ page }) => {
  await page.goto("/");

  // Navigation should use buildPath() results
  const aboutLink = page.getByRole("link", { name: /about/i }).first();
  await expect(aboutLink).toHaveAttribute("href", "/about");
});
```

**Run E2E tests:**

```bash
npm run test:e2e
# 15 tests passing ✓
```

---

## Future Enhancements

### 1. Pluralization

```typescript
// src/i18n/pluralization.ts (future)
export function plural(locale: Locale, key: string, count: number): string {
  const rules = {
    en: {
      items: {
        zero: "No items",
        one: "1 item",
        other: `${count} items`,
      },
    },
    de: {
      items: {
        zero: "Keine Elemente",
        one: "1 Element",
        other: `${count} Elemente`,
      },
    },
  };

  if (count === 0) return rules[locale][key].zero;
  if (count === 1) return rules[locale][key].one;
  return rules[locale][key].other;
}
```

### 2. Date/Number Formatting Helpers

```typescript
// src/i18n/formatters.ts (future)
import { i18nConfig } from "./config";

export function formatDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(i18nConfig.dateFormats[locale]).format(date);
}

export function formatCurrency(locale: Locale, amount: number): string {
  const currency = locale === "en" ? "USD" : "EUR";
  return new Intl.NumberFormat(i18nConfig.dateFormats[locale], {
    style: "currency",
    currency,
  }).format(amount);
}
```

### 3. Lazy Loading for Large Translation Files

For apps with many languages:

```typescript
// src/i18n/lazy-translations.ts (future)
export async function loadTranslations(locale: Locale) {
  const module = await import(`./locales/${locale}.ts`);
  return module.default;
}
```

---

## Resources

**Astro i18n:**

- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

**i18n Best Practices:**

- [W3C i18n](https://www.w3.org/International/)
- [i18next Best Practices](https://www.i18next.com/principles/fallback)

**TypeScript:**

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

---

## Summary

Our i18n system is:

- **Type-safe** - Full TypeScript autocomplete with `t()` helper and route helpers
- **Organized** - 5 namespaces (nav, ui, footer, routes, sections) for logical grouping
- **DRY** - Single source of truth in `translations.ts`, no hardcoded text or routes
- **Route helpers** - 3 functions (`buildPath`, `getRouteKeyFromPath`, `getRouteSlugs`) eliminate hardcoded routing logic
- **Separated** - UI translations in code, content in data layer
- **Scalable** - Designed for N languages, not hardcoded to EN/DE
- **Framework-aware** - Integrates with Astro's i18n routing
- **100% tested** - 29 comprehensive tests covering all functions and schema consistency
- **CMS-ready** - Content structure ready for Strapi migration

**Key Rules:**

1. **Never hardcode text** - Always use `t()` helper
2. **Never hardcode routes** - Always use `buildPath()` helper
3. **UI text** → `translations.ts` (buttons, labels, errors, route slugs)
4. **Dynamic content** → Content Collections (hero, services, blog posts)
