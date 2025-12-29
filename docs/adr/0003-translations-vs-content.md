# ADR 0003: Separate UI Translations from CMS Content

**Date:** 2025-12-29
**Status:** Accepted
**Deciders:** Development Team
**Tags:** i18n, content, architecture

---

## Context

We have two types of translatable text in our application:

1. **UI text** - Buttons, navigation, error messages, form labels
2. **Content** - Hero sections, service descriptions, blog posts, testimonials

The question: **Should we manage UI translations and content in the same place, or separate them?**

Both need to be:

- Multilingual (EN, DE)
- Type-safe (TypeScript)
- Easy to update
- Version-controlled or CMS-managed

---

## Decision

**We will separate UI translations from content:**

- **UI Translations** → `src/i18n/translations.ts` (type-safe, version-controlled)
- **Content** → Content Collections / Strapi (data layer, CMS-managed)

### Structure

```
src/
  i18n/
    translations.ts        ← UI text (nav, buttons, errors)
    config.ts              ← i18n settings

  content/                 ← Content (Hero, Services, Projects)
    hero/
      en/home.json
      de/home.json
    services/
      en/consulting.json
      de/consulting.json
```

---

## Rationale

### Why Separate?

**1. Different ownership**

| Type        | Owner              | Update Frequency | Tools Needed        |
| ----------- | ------------------ | ---------------- | ------------------- |
| **UI Text** | Developers         | Rarely           | Code editor, Git    |
| **Content** | Marketing, Content | Frequently       | CMS (Strapi future) |

**UI text** rarely changes - "Home", "About", "Contact" are stable.

**Content** changes often - hero text, service descriptions updated regularly.

Separating them means:

- Developers manage code-level translations
- Marketers manage content via CMS
- No Git commits needed for content updates

**2. Different validation needs**

**UI text:**

```typescript
// Simple key-value, rarely changes
{
  nav: {
    home: "Home",
    about: "About",
  }
}
```

**Content:**

```typescript
// Rich schema with nested objects, arrays
{
  title: "Welcome to GlobalCore",
  subtitle: "Digital transformation experts",
  features: [
    { icon: "chart", title: "Analytics" },
    { icon: "code", title: "Development" },
  ],
  cta: {
    label: "Get started",
    href: "/contact",
    variant: "primary",
  }
}
```

Content has **complex schemas** with validation rules. UI text is **flat key-value pairs**.

**3. Type safety approach differs**

**UI text:**

- Inferred from object structure
- Compile-time autocomplete
- No runtime validation needed (hardcoded)

```typescript
t("en", "nav", "home"); // ← Full autocomplete
```

**Content:**

- Defined with Zod schemas
- Runtime validation required
- Data comes from external sources

```typescript
const heroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});
```

**4. Version control vs CMS**

**UI text should be version-controlled:**

- ✅ Changes tracked in Git
- ✅ Code review for text changes
- ✅ Rollback if mistake
- ✅ Part of deployment

**Content should be CMS-managed (future):**

- ✅ Non-technical users can edit
- ✅ Preview before publish
- ✅ Scheduled publishing
- ✅ No deployment needed

**5. Caching and performance**

**UI text:**

- Bundled in JavaScript
- Always available, no fetch needed
- Part of application code

**Content:**

- Fetched from Content Collections / Strapi
- Cached separately
- Can be lazy-loaded

---

## Alternatives Considered

### Alternative 1: Everything in translations.ts

**Approach:**

```typescript
export const translations = {
  en: {
    nav: { home: "Home", about: "About" },
    hero: {
      title: "Welcome to GlobalCore Consulting",
      subtitle: "Your trusted partner for digital transformation",
    },
    services: {
      consulting: {
        title: "Consulting Services",
        description: "Expert consulting for your business...",
      },
    },
  },
};
```

**Pros:**

- Everything in one place
- Type-safe with autocomplete
- No external data fetching

**Cons:**

- ❌ **Not CMS-friendly** - Marketing can't update without Git
- ❌ **Large file** - Hundreds of lines for all content
- ❌ **Poor separation** - UI and content mixed
- ❌ **Deployment required** - Every content change = new deploy
- ❌ **No rich validation** - Can't use Zod schemas

**Verdict:** Rejected. Not scalable, not CMS-friendly.

---

### Alternative 2: Everything in Content Collections

**Approach:**

```
src/content/
  ui-translations/
    en/nav.json
    de/nav.json
  hero/
    en/home.json
    de/home.json
```

All text, including UI, in Content Collections.

**Pros:**

- Consistent data fetching
- All text in JSON files
- CMS-ready structure

**Cons:**

- ❌ **Overhead for simple UI text** - Fetch "Home" from Content Collections?
- ❌ **Loss of type safety** - No autocomplete for `t("nav", "home")`
- ❌ **Performance hit** - Fetch UI text at runtime instead of bundled
- ❌ **More complex** - Content Collections setup for static text

**Verdict:** Rejected. Overkill for static UI text.

---

### Alternative 3: Use i18next or similar library

**Approach:**

- Install `i18next` or `react-i18next`
- Manage all translations through library
- Use translation keys in components

**Pros:**

- Industry-standard solution
- Pluralization, interpolation built-in
- Large ecosystem

**Cons:**

- ❌ **Additional dependency** - More bundle size
- ❌ **More complex** - Learning curve for team
- ❌ **Not Astro-native** - Doesn't leverage Astro's Content Collections
- ❌ **Over-engineering** - We don't need advanced features yet

**Verdict:** Rejected. We'll revisit if we need pluralization/interpolation.

---

## Decision Matrix

| Criterion                   | Separate (Chosen) | All in translations.ts | All in Content Collections | i18next   |
| --------------------------- | ----------------- | ---------------------- | -------------------------- | --------- |
| Type safety (UI)            | ✅ Excellent      | ✅ Excellent           | ❌ Poor                    | ⚠️ Fair   |
| Type safety (Content)       | ✅ Excellent      | ⚠️ Fair                | ✅ Excellent               | ⚠️ Fair   |
| CMS-friendly                | ✅ Yes            | ❌ No                  | ✅ Yes                     | ⚠️ Maybe  |
| Performance                 | ✅ Fast           | ✅ Fast                | ⚠️ Slower                  | ⚠️ Slower |
| Separation of concerns      | ✅ Clear          | ❌ Mixed               | ⚠️ Okay                    | ⚠️ Okay   |
| Simple to maintain          | ✅ Yes            | ❌ No (large file)     | ⚠️ Overhead                | ❌ No     |
| Non-technical user friendly | ✅ Yes (content)  | ❌ No                  | ✅ Yes                     | ⚠️ Maybe  |

**Winner:** Separate UI translations from content.

---

## Implementation

### UI Translations (Static, Code-Based)

```typescript
// src/i18n/translations.ts
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
      error: "Something went wrong",
    },
    forms: {
      nameLabel: "Your name",
      emailLabel: "Email address",
      submitButton: "Send message",
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
      error: "Etwas ist schief gelaufen",
    },
    forms: {
      nameLabel: "Ihr Name",
      emailLabel: "E-Mail-Adresse",
      submitButton: "Nachricht senden",
    },
  },
} as const;

type Locale = "en" | "de";
type Namespace = keyof typeof translations.en;
type Key<N extends Namespace> = keyof (typeof translations.en)[N];

export function t<N extends Namespace>(locale: Locale, namespace: N, key: Key<N>): string {
  return translations[locale][namespace][key] as string;
}
```

**Usage in components:**

```astro
---
import { t } from "@/i18n/translations";
const locale = Astro.currentLocale as "en" | "de";
---

<nav>
  <a href="/">{t(locale, "nav", "home")}</a>
  <a href="/about">{t(locale, "nav", "about")}</a>
</nav>
```

---

### Content (Dynamic, CMS-Ready)

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const heroCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    features: z
      .array(
        z.object({
          icon: z.string(),
          title: z.string(),
          description: z.string(),
        })
      )
      .optional(),
    primaryCta: z.object({
      label: z.string(),
      href: z.string(),
    }),
  }),
});

export const collections = {
  hero: heroCollection,
};
```

**Content file:**

```json
// src/content/hero/en/home.json
{
  "title": "Welcome to GlobalCore Consulting",
  "subtitle": "Digital transformation experts",
  "features": [
    {
      "icon": "chart",
      "title": "Data Analytics",
      "description": "Turn data into insights"
    }
  ],
  "primaryCta": {
    "label": "Get started",
    "href": "/contact"
  }
}
```

**Usage in pages:**

```astro
---
import { getEntry } from "astro:content";

const locale = Astro.currentLocale as "en" | "de";
const heroContent = await getEntry("hero", `${locale}/home`);
---

<section>
  <h1>{heroContent.data.title}</h1>
  <p>{heroContent.data.subtitle}</p>
</section>
```

---

## Guidelines

### What belongs in `translations.ts`?

✅ **Static UI elements:**

- Navigation labels
- Button text (generic: "Submit", "Cancel", "Save")
- Form labels ("Name", "Email", "Password")
- Error messages ("Field required", "Invalid email")
- Loading states ("Loading...", "Processing...")
- 404 / error pages ("Page not found")
- Accessibility labels ("Skip to content", "Close menu")

❌ **Dynamic content:**

- Hero section text
- Service descriptions
- Blog post content
- Testimonials
- Team bios
- Project details

### What belongs in Content Collections?

✅ **Marketing content:**

- Hero sections
- Feature lists
- Service offerings
- Project portfolios
- Team profiles
- Testimonials
- Blog posts
- Case studies

❌ **Static UI text:**

- Navigation
- Form labels
- Error messages
- Generic buttons

---

## Edge Cases

### Case 1: Call-to-action button text

**Question:** Is "Get started" UI or content?

**Answer:** Depends on context!

```astro
---
// Generic CTA in navigation → UI translation
{
  t(locale, "ui", "getStarted");
}

// Specific CTA in hero → Content (part of hero schema)
{
  heroContent.data.primaryCta.label;
}
---
```

**Guideline:** If the text is **specific to a section**, it's content. If it's **reusable across the site**, it's UI.

---

### Case 2: Validation error messages

**Question:** Are validation errors UI or content?

**Answer:** UI translations.

```typescript
// src/i18n/translations.ts
{
  en: {
    validation: {
      required: "This field is required",
      emailInvalid: "Please enter a valid email",
      minLength: "Minimum {min} characters",
    }
  }
}
```

These are **framework-level messages**, not content.

---

### Case 3: Page titles

**Question:** Are page titles UI or content?

**Answer:** **Both**, depending on page type:

```astro
---
// Example 1: Static page → UI translation
---

<title>{t(locale, "meta", "aboutPageTitle")}</title>

<!-- Example 2: Dynamic page (blog post) → Content -->
<title>{post.data.title} | GlobalCore</title>

<!-- Example 3: Hybrid (services page) → UI base + content -->
<title>{serviceContent.data.title} | {t(locale, "meta", "servicesSuffix")}</title>
```

---

## Consequences

### Positive

✅ **Clear boundaries**

- Developers know where to put what
- No confusion between UI and content

✅ **CMS-ready**

- Content can move to Strapi without touching UI translations
- Marketers can update content independently

✅ **Type safety**

- UI text has compile-time autocomplete
- Content has runtime Zod validation

✅ **Performance**

- UI text bundled in JavaScript (instant)
- Content fetched from data layer (optimized)

✅ **Version control**

- UI text changes tracked in Git
- Content updates don't require deployments (with Strapi)

### Negative

❌ **Two systems to learn**

- Developers must understand both
- Documentation needed for both

❌ **Edge case decisions**

- Team must decide "is this UI or content?"
- Requires guidelines (this ADR)

### Mitigation

**1. Clear guidelines (this document)**

- Decision tree for UI vs content
- Examples of edge cases

**2. Code reviews**

- Enforce separation during reviews
- Question placement of new translations

**3. Future tooling**

- Lint rule: "Don't put hero text in translations.ts"
- Script to detect content in UI translations

---

## Success Metrics

We'll know this approach works if:

1. **Clear separation maintained**
   - No hero text in `translations.ts`
   - No form labels in Content Collections

2. **Easy to migrate to Strapi**
   - Content moves to Strapi, UI translations stay
   - No confusion about what to migrate

3. **Team consensus**
   - No debates about where to put text
   - Guidelines are clear and followed

4. **Performance is good**
   - UI text instantly available
   - Content loads efficiently

---

## References

- [i18n Best Practices](https://www.i18next.com/principles/fallback)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Strapi i18n Plugin](https://docs.strapi.io/dev-docs/i18n)
- [W3C Internationalization](https://www.w3.org/International/)

---

## Related ADRs

- [ADR 0001: Adopt Clean Architecture](./0001-clean-architecture.md)
- [ADR 0002: Content Collections with Locale Folders](./0002-content-collections-i18n.md)

---

## Revision History

| Date       | Author | Changes                                    |
| ---------- | ------ | ------------------------------------------ |
| 2025-12-29 | MMA    | Initial draft - UI translations vs content |
