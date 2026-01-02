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

### Type-Safe Translation Helper

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

### In Astro Components

```astro
---
// src/components/common/Header.astro
import { t } from "@/i18n/translations";

const locale = Astro.currentLocale as "en" | "de";
---

<nav>
  <a href={locale === "en" ? "/" : `/${locale}`}>
    {t(locale, "nav", "home")}
  </a>
  <a href={locale === "en" ? "/about" : `/${locale}/ueber-uns`}>
    {t(locale, "nav", "about")}
  </a>
</nav>
```

### Get Entire Namespace

Useful for iterating over navigation items:

```typescript
import { getNamespace } from "@/i18n/translations";

const navItems = getNamespace("en", "nav");
// { home: "Home", about: "About", services: "Services", contact: "Contact" }

// Iterate for dynamic navigation:
Object.entries(navItems).map(([key, label]) => ({
  key,
  label,
  href: `/${key}`,
}));
```

### In Pages (Combining UI + Content)

```astro
---
// src/pages/services.astro
import { t } from "@/i18n/translations";
import { getCollection } from "astro:content";
import Layout from "@/layouts/Layout.astro";

const locale = Astro.currentLocale as "en" | "de";

// UI translation
const pageTitle = t(locale, "nav", "services");

// Content from Content Collections
const services = await getCollection("services", (entry) => entry.id.startsWith(`${locale}/`));
---

<Layout title={pageTitle}>
  <main>
    <h1>{pageTitle}</h1>
    {
      services.map((service) => (
        <article>
          <h2>{service.data.title}</h2>
          <p>{service.data.description}</p>
          <a href={`/${locale}/services/${service.slug}`}>{t(locale, "ui", "learnMore")}</a>
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

For **SEO-friendly translated slugs**, define route mappings:

```typescript
// src/i18n/routes.ts (future)
export const routeTranslations = {
  en: {
    about: "about",
    services: "services",
    contact: "contact",
  },
  de: {
    about: "ueber-uns",
    services: "dienstleistungen",
    contact: "kontakt",
  },
} as const;
```

**Catch-all route:**

```astro
---
// src/pages/[lang]/[...slug].astro
import { routeTranslations } from "@/i18n/routes";

const { lang, slug } = Astro.params;

// Map translated slug to canonical route
const canonicalRoute = Object.entries(routeTranslations[lang]).find(
  ([_, translatedSlug]) => translatedSlug === slug
)?.[0];

// Fetch content using canonical route
const content = await getEntry("pages", `${lang}/${canonicalRoute}`);
---
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
├── translations.ts              ← Type-safe UI translations
├── routes.ts (future)           ← Route slug translations
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

### 5. Use TypeScript Autocomplete

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

### Unit Tests for Translation Helper

```typescript
// src/i18n/translations.test.ts
import { describe, it, expect } from "vitest";
import { t, getNamespace } from "./translations";

describe("i18n translations", () => {
  it("returns correct translation for en locale", () => {
    expect(t("en", "nav", "home")).toBe("Home");
    expect(t("en", "ui", "loading")).toBe("Loading...");
  });

  it("returns correct translation for de locale", () => {
    expect(t("de", "nav", "home")).toBe("Startseite");
    expect(t("de", "ui", "loading")).toBe("Wird geladen...");
  });

  it("returns entire namespace", () => {
    const navEn = getNamespace("en", "nav");

    expect(navEn.home).toBe("Home");
    expect(navEn.about).toBe("About");
    expect(Object.keys(navEn)).toHaveLength(4);
  });
});
```

### E2E Tests for Language Switching

```typescript
// tests/e2e/i18n.spec.ts
import { test, expect } from "@playwright/test";

test("switches language and updates UI text", async ({ page }) => {
  await page.goto("/");

  // Verify EN text
  await expect(page.locator("nav a:first-child")).toHaveText("Home");

  // Switch to DE
  await page.click('[data-language-switcher="de"]');
  await expect(page).toHaveURL("/de");

  // Verify DE text
  await expect(page.locator("nav a:first-child")).toHaveText("Startseite");
});

test("loads correct content for locale", async ({ page }) => {
  await page.goto("/de");

  // Verify DE content from Content Collections
  await expect(page.locator("h1")).toContainText("Willkommen");
});
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

- **Type-safe** - Full TypeScript autocomplete with `t()` helper
- **Organized** - Namespace pattern for logical grouping
- **Separated** - UI translations in code, content in data layer
- **Scalable** - Easy to add new languages
- **Framework-aware** - Integrates with Astro's i18n routing
- **CMS-ready** - Content structure ready for Strapi migration

**Key Rule:** If it's static UI text (buttons, labels, errors), use `translations.ts`. If it's dynamic content (hero, services, blog), use Content Collections.
