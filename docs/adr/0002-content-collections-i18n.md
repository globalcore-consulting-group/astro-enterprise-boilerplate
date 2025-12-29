# ADR 0002: Content Collections with Locale Folder Structure

**Date:** 2025-12-29
**Status:** Accepted
**Deciders:** Development Team
**Tags:** i18n, content, astro

---

## Context

We need to organize multilingual content for our Astro website that:

1. **Supports EN and DE** (with potential for more languages)
2. **Works with Content Collections** (current data source)
3. **Migrates easily to Strapi** (future CMS)
4. **Provides type safety** (Zod validation)
5. **Keeps content organized** (easy to find and maintain)

The question: **How should we structure multilingual content in Content Collections?**

---

## Decision

**We will use locale folders within each content collection**, following this structure:

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
      development.json
    de/
      consulting.json
      development.json
  projects/
    en/
      project-alpha.json
    de/
      project-alpha.json
```

### Key Characteristics

1. **Locale as folder name** - `en/`, `de/` folders within each collection
2. **Identical file names** across locales - `home.json` exists in both `en/` and `de/`
3. **Entry ID format** - `{locale}/{slug}` (e.g., `en/home`, `de/home`)
4. **Zod validation** - Schema defined once, applies to all locales
5. **Type safety** - Full TypeScript autocomplete for content

---

## Rationale

### Why Locale Folders?

**1. Clear organization**

```
✅ GOOD: Locale folders
content/hero/
  en/
    home.json
  de/
    home.json

❌ ALTERNATIVE: Locale suffix
content/hero/
  home-en.json
  home-de.json
```

**Benefits:**

- All EN content grouped together
- All DE content grouped together
- Easy to see which locales exist
- Mirrors URL structure (`/`, `/de`)

**2. Consistent file names across locales**

Same filename = easier to maintain translations:

```typescript
// Fetch by locale + slug pattern
const entry = await getEntry("hero", `${locale}/home`);
```

Both `en/home` and `de/home` use the same slug name.

**3. Works with Astro's Content Collections**

Astro's `getEntry()` and `getCollection()` work naturally:

```typescript
// Get specific locale entry
const heroEN = await getEntry("hero", "en/home");
const heroDE = await getEntry("hero", "de/home");

// Get all entries for a locale
const servicesEN = await getCollection("services", (entry) => {
  return entry.id.startsWith("en/");
});
```

**4. Strapi-ready structure**

When we migrate to Strapi, the concept remains the same:

```typescript
// Content Collections (current)
const services = await getCollection("services", (entry) => entry.id.startsWith(`${locale}/`));

// Strapi (future)
const response = await fetch(`${STRAPI_URL}/api/services?locale=${locale}`);
```

Both organize content by locale, just different implementations.

**5. Scales to additional languages**

Adding French is trivial:

```
content/hero/
  en/
    home.json
  de/
    home.json
  fr/        ← Add French folder
    home.json
```

---

## Alternatives Considered

### Alternative 1: Locale Suffix in Filename

**Approach:**

```
content/hero/
  home-en.json
  home-de.json
  about-en.json
  about-de.json
```

**Pros:**

- Flat structure (no folders)
- All files visible at once

**Cons:**

- ❌ **Cluttered** - Many files in one folder
- ❌ **Hard to filter** - Must parse filename to determine locale
- ❌ **Inconsistent with URLs** - URLs are `/de/about`, not `/about-de`
- ❌ **Naming conflicts** - `home-en` vs `home-de` looks messy

**Verdict:** Rejected. Not scalable, hard to maintain.

---

### Alternative 2: Locale at Collection Level

**Approach:**

```
content/
  hero-en/
    home.json
  hero-de/
    home.json
  services-en/
    consulting.json
  services-de/
    consulting.json
```

**Pros:**

- Strict separation by locale
- Can define different schemas per locale (if needed)

**Cons:**

- ❌ **Schema duplication** - Must define `heroSchema` twice
- ❌ **More config code** - Double the collections in `config.ts`
- ❌ **Harder to manage** - Translations not visually grouped
- ❌ **Doesn't scale** - Adding French means `hero-fr`, `services-fr`, etc.

**Verdict:** Rejected. Too much overhead, schema duplication.

---

### Alternative 3: Single Collection with Locale Field

**Approach:**

```
content/hero/
  home.json       ← Contains locale: "en"
  home-de.json    ← Contains locale: "de"
```

Each file has a `locale` field:

```json
{
  "locale": "en",
  "title": "Welcome"
}
```

**Pros:**

- No folders needed
- Locale is explicit in data

**Cons:**

- ❌ **Naming confusion** - `home.json` vs `home-de.json` (inconsistent)
- ❌ **Manual filtering** - Must filter by `locale` field in queries
- ❌ **Redundant data** - Locale in filename AND in content
- ❌ **Error-prone** - Easy to mismatch filename and locale field

**Verdict:** Rejected. Redundant and error-prone.

---

## Implementation

### Content Collections Configuration

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const heroCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    primaryCta: z.object({
      label: z.string(),
      href: z.string(),
    }),
    secondaryCta: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
  }),
});

export const collections = {
  hero: heroCollection,
};
```

**Schema applies to all locales** - EN and DE both validate against same schema.

---

### Fetching Content

**Pattern 1: Get entry for specific locale**

```typescript
// src/pages/index.astro
const locale = Astro.currentLocale as "en" | "de";
const heroContent = await getEntry("hero", `${locale}/home`);
```

**Pattern 2: Get all entries for a locale**

```typescript
// src/pages/services.astro
const locale = Astro.currentLocale as "en" | "de";

const services = await getCollection("services", (entry) => {
  return entry.id.startsWith(`${locale}/`);
});
```

**Pattern 3: Extract slug from entry ID**

```typescript
// Entry ID format: "en/consulting"
const [locale, slug] = entry.id.split("/");

console.log(locale); // "en"
console.log(slug); // "consulting"
```

---

### Example Content File

```json
// src/content/hero/en/home.json
{
  "title": "Welcome to GlobalCore Consulting",
  "subtitle": "Your trusted partner for digital transformation",
  "primaryCta": {
    "label": "Get started",
    "href": "/contact"
  },
  "secondaryCta": {
    "label": "Learn more",
    "href": "/about"
  }
}
```

```json
// src/content/hero/de/home.json
{
  "title": "Willkommen bei GlobalCore Consulting",
  "subtitle": "Ihr vertrauenswürdiger Partner für digitale Transformation",
  "primaryCta": {
    "label": "Jetzt starten",
    "href": "/de/kontakt"
  },
  "secondaryCta": {
    "label": "Mehr erfahren",
    "href": "/de/ueber-uns"
  }
}
```

---

## Consequences

### Positive

✅ **Clear organization**

- All EN content in one place
- All DE content in one place
- Easy to see what's translated

✅ **Type-safe queries**

- TypeScript knows entry IDs follow `{locale}/{slug}` pattern
- Autocomplete suggests available entries

✅ **Scalable**

- Add new locales by creating folders
- No config changes needed

✅ **Strapi-ready**

- Same locale-based organization
- Easy to map from Content Collections to Strapi

✅ **Consistent file names**

- `home.json` in EN matches `home.json` in DE
- Easy to find translations

### Negative

❌ **Folder nesting**

- Two levels deep (`content/hero/en/`)
- More navigation to reach files

❌ **Filename ambiguity**

- `home.json` in `en/` vs `home.json` in `de/`
- Need to check folder to know locale

❌ **Duplication risk**

- Easy to forget to create DE version
- No automatic check for translation completeness

### Mitigation Strategies

**1. Editor workspace**

- VSCode can show both `en/` and `de/` folders side-by-side
- Easy to compare translations

**2. Lint/test for missing translations**

```typescript
// Future: Check all EN content has DE equivalent
const enEntries = await getCollection("services", (e) => e.id.startsWith("en/"));
const deEntries = await getCollection("services", (e) => e.id.startsWith("de/"));

const missingDE = enEntries.filter((enEntry) => {
  const slug = enEntry.id.replace("en/", "");
  return !deEntries.some((deEntry) => deEntry.id === `de/${slug}`);
});

if (missingDE.length > 0) {
  console.warn("Missing DE translations:", missingDE);
}
```

**3. Documentation**

- README in each collection explaining structure
- Template files for new content

---

## Migration to Strapi

When we migrate to Strapi, the locale structure remains conceptually the same:

### Content Collections (Current)

```
src/content/services/
  en/
    consulting.json
  de/
    consulting.json
```

Fetching:

```typescript
const services = await getCollection("services", (entry) => entry.id.startsWith(`${locale}/`));
```

### Strapi (Future)

Strapi structure:

```
Strapi → Services → Entry
  - Title (localized)
  - Description (localized)
  - Slug (localized)
  - Locale: en, de
```

Fetching:

```typescript
const response = await fetch(`${STRAPI_URL}/api/services?locale=${locale}&populate=*`);
const services = toServices(response.data);
```

**Key insight:** Both organize by `locale`, just different storage mechanisms.

---

## Success Metrics

We'll know this structure works well if:

1. **Adding translations is easy**
   - New DE translations take < 5 minutes
   - No confusion about where to put files

2. **Queries are simple**
   - Fetching locale-specific content is one line
   - No complex filtering logic needed

3. **Strapi migration is smooth**
   - Content structure maps 1:1
   - No data transformation needed
   - Migration script is straightforward

4. **Translation completeness is visible**
   - Easy to see which content is missing DE version
   - Folder structure makes gaps obvious

---

## References

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Strapi i18n](https://docs.strapi.io/dev-docs/i18n)
- [Content Organization Best Practices](https://www.netlify.com/blog/2016/10/20/content-modeling-with-gatsby/)

---

## Related ADRs

- [ADR 0001: Adopt Clean Architecture](./0001-clean-architecture.md)
- [ADR 0003: UI Translations vs CMS Content](./0003-translations-vs-content.md)

---

## Revision History

| Date       | Author | Changes                                  |
| ---------- | ------ | ---------------------------------------- |
| 2025-12-29 | MMA    | Initial draft - Content Collections i18n |
