# AGENTS.md

> **This file provides context and guidelines for AI coding agents working on this project.**
>
> **Last updated:** 2026-01-04 | **Version:** 1.0.0

---

## Project Overview

**Name:** globalcore-website  
**Description:** Corporate landing page for GlobalCore Consulting Group  
**Type:** Static-first website with hybrid rendering capabilities  
**Repository:** https://github.com/globalcore-consulting-group/globalcore-website

---

## Quick Start

```bash
fnm use              # Use correct Node version
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
```

---

## Project Status

> 🎉 **v1.0.0 COMPLETE!** (20 of 20 core items) - Boilerplate Ready

### ✅ Done

- [x] Repository created
- [x] Astro initialized
- [x] AGENTS.md defined
- [x] ESLint + Prettier
- [x] VSCode workspace configuration (Peacock, format on save, recommended extensions)
- [x] Husky
- [x] lint-staged
- [x] commitlint
- [x] .nvmrc file
- [x] Path aliases (@/\*)
- [x] Tailwind CSS v4
- [x] Starwind UI (Button component)
- [x] Vitest + Testing Library (52 unit tests, 83% coverage)
- [x] Playwright (15 E2E tests: 11 EN, 4 DE)
- [x] **Zod** (transitive dependency from Astro 3.25.76)
- [x] **Clean Architecture folder structure** (domain/, application/, infrastructure/)
- [x] **Content Collections** (Modular structure: hero, seo, pageSections with EN/DE content)
- [x] **i18n configuration** (EN default, DE with /de prefix)
- [x] **Documentation** (Layer READMEs: domain, application, infrastructure, i18n + 4 ADRs)
- [x] **Pre-push hook** (typecheck + unit tests + E2E tests, ~9s total)
- [x] **Modular Content Collections** (\_schemas/ and \_collections/ structure)
- [x] **Domain Value Objects** (Locale, Slug, Url with zero dependencies)
- [x] **Production Homepage** (All sections: Hero, Cards, OneLiner, CtaStrip)
- [x] **Starwind UI Card** (v1.3.0 installed with barrel export fix)
- [x] **Navigation Components** (Navbar with mobile menu + language switcher, Footer)
- [x] **SEO Component** (Dynamic meta tags, Open Graph, Twitter cards, hreflang)
- [x] **Boilerplate Repository** (astro-enterprise-boilerplate with comprehensive README)
- [x] **semantic-release** (v1.0.0 released with automated CHANGELOG generation)

### ⏳ Post v1.0.0

- [ ] GitHub Action for deploy (CI/CD automation)

> ⚠️ **Note:** Sections in this document describe the target setup. Check this checklist to know what's actually available.

---

## Resources

### External Documentation

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Starwind UI](https://starwind.dev)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture on Frontend](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Web Vitals](https://web.dev/vitals/)

### Setup Documentation

Detailed setup guides in `docs/setup-resources/`:

- `eslint-prettier-setup.md` - ESLint and Prettier configuration
- `git-hooks-setup.md` - Husky, lint-staged, commitlint setup
- `tailwind-setup.md` - Tailwind CSS v4 installation and customization
- `starwind-ui-setup.md` - Starwind UI components and CLI usage
- `vitest-setup.md` - Vitest testing framework guide (~1,188 lines)
- `testing-strategy.md` - Complete testing approach (~700 lines)

### Progress Tracking

**Stakeholder Summary:**

- `STAKEHOLDER-SUMMARY.md` - Living document for stakeholder communication (always update when completing major milestones)

**Session handoff documents in `docs/progress/`:**

- `2025-12-26-foundation-complete.md` - Foundation setup (ESLint, hooks, etc.)
- `2025-12-26-tailwind-starwind-complete.md` - UI framework setup
- `2025-12-28-testing-infrastructure-complete.md` - Testing infrastructure implementation (~487 lines)

---

## Commands

```bash
# Development
npm run dev              # Start dev server at localhost:4321
npm run build            # Production build
npm run preview          # Preview production build locally

# Testing
npm run test             # Run unit tests (Vitest)
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:e2e         # Run E2E tests (Playwright)

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format with Prettier
npm run format:check     # Check formatting without fixing

# Type Checking
npm run typecheck        # Run TypeScript compiler check
```

---

## Tech Stack

| Technology                | Version | Purpose                             |
| ------------------------- | ------- | ----------------------------------- |
| Astro                     | ^5.16.6 | Framework                           |
| TypeScript                | ^5.x    | Type safety                         |
| Tailwind CSS              | ^4.1.18 | Styling framework                   |
| Starwind UI               | 2.2.0   | UI Components (Button installed)    |
| Vitest                    | 4.0.16  | Unit & Integration tests            |
| Playwright                | 1.57.0  | E2E tests                           |
| @testing-library/dom      | 10.4.1  | Component testing utilities         |
| @testing-library/jest-dom | 6.9.1   | DOM assertion matchers              |
| happy-dom                 | 20.0.11 | Lightweight DOM environment         |
| @vitest/coverage-v8       | 4.0.16  | Coverage reporting                  |
| Zod                       | TBD     | Schema validation (pending install) |

> ⚠️ **Note:** Update versions in this table as dependencies are installed. All dependencies must be compatible with Astro 5.x.

### Key Astro Features

- `output: 'hybrid'` - Static by default, SSR opt-in
- `astro:image` - Image optimization
- `astro:transitions` - View transitions
- Content Collections with Zod validation
- i18n routing

---

## Testing Strategy

**Philosophy:** Test real data flows, not mocked approximations

### Tools & Responsibilities

| Tool              | Purpose            | What to Test                                     |
| ----------------- | ------------------ | ------------------------------------------------ |
| **Vitest**        | Unit & Integration | Mappers, use-cases, schemas, Content Collections |
| **Playwright**    | End-to-End         | Language switching, forms, responsive design     |
| **Content Layer** | Test Data Source   | Astro Content Collections (no mocks needed)      |

### Coverage Target

- **Goal:** 60-80% coverage
- **Focus:** application/, infrastructure/, domain/ layers
- **Skip:** Simple presentational components

### Test Priority

1. **HIGH (Must Test):** Domain value objects, entities, use-cases, mappers
2. **MEDIUM (Should Test):** Content Collections, complex components, Zod schemas at boundaries
3. **LOW (Optional):** Simple presentational components, utilities

### Data Migration Strategy

The testing approach supports seamless migration:

1. **Phase 1 (Current):** JSON files in `src/content/` with Zod validation
2. **Phase 2 (Future):** Swap to Strapi loader - tests unchanged
3. **Phase 3 (Optional):** Add custom BFF - Content Layer still works

**Key Insight:** Tests use `getCollection()` API. Data source is abstracted.

### Testing Conventions

**Playwright E2E Tests:**

- **Test function naming:** Use `test()` for Playwright E2E tests (not `it()` - that's for Vitest unit tests)
- **Selector priority:** Always prefer in this order:
  1. Role-based selectors (`getByRole`) for user-facing elements
  2. Text content (`getByText`) for visible text
  3. Test IDs (`getByTestId`) for layout containers and implementation details
  4. CSS selectors (last resort)
- **data-testid usage:** Add `data-testid` attributes to elements that need testing but lack semantic meaning (layout containers, wrappers)
- **Hardcoded expectations:** E2E tests should hardcode expected text - intentional content changes should fail tests
- **Test organization:** Use nested `describe` blocks to organize tests by feature, locale, or device type

**Vitest Unit Tests:**

- **Test function naming:** Use `test()` or `it()` for Vitest unit tests
- **Container API:** Use Astro's Container API to render real components (no mocking)
- **Coverage:** Maintain 60%+ coverage threshold (lines, functions, branches, statements)

### Resources

- [Vitest Setup Guide](docs/setup-resources/vitest-setup.md) - Complete guide with Container API examples
- [Complete Testing Strategy](docs/setup-resources/testing-strategy.md) - No-mocks philosophy and migration strategy
- [Testing Infrastructure Handoff](docs/progress/2025-12-28-testing-infrastructure-complete.md) - Implementation session details

---

## Boundaries

### ✅ Always Do

- Run `npm run lint` and `npm run typecheck` before considering work complete
- Write tests for new use-cases and mappers
- Use semantic HTML elements
- Add TypeScript types for all function parameters and returns
- Use i18n for all user-facing text
- Update AGENTS.md when discovering new project conventions
- **Before installing packages**: Check official documentation for latest recommended installation methods and integration patterns
- **When configuring tools**: Ask user preferences for opinionated settings (line width, quotes, etc.)

### ⚠️ Ask First

- Before modifying `astro.config.mjs` or `tailwind.config.mjs`
- Before adding new dependencies
- Before changing the project structure
- Before modifying shared components in `components/ui/`
- Before making architectural decisions (document in ADR after approval)

### 🚫 Never Do

- Never commit without running tests
- Never use `any` type without explicit justification in comments
- Never hardcode text (use i18n)
- Never delete files without explicit confirmation
- Never modify `.env` files or commit secrets
- Never ignore TypeScript errors
- Never skip accessibility considerations (ARIA, keyboard nav, contrast)
- Never push directly to main without testing locally

### 📁 Protected Paths

- `.env*` - Environment files
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.astro/` - Astro cache
- `package-lock.json` - Only modify via npm commands

---

## Agent Behavior

### Core Principles

- **Human in the loop always** - Ask before making significant changes
- **Never assume** - If context or arguments are missing, ask or investigate first
- **Be strict** - Enforce best practices, don't cut corners
- **Challenge when needed** - Disagree and push back when you have solid arguments backed by valid, recent resources. Don't just agree to please.
- **Log all actions** - Document what was done and why
- **Document decisions** - Create ADRs for architectural decisions (always in English)
- **Code in English** - All code, comments, and documentation in English
- **Commit atomically** - Make small, focused commits for each logical change. Commit completed work before moving to the next task.

### Session Start Checklist

1. Review recent code changes (human may have coded without the agent)
2. Check current plans in `docs/plans/`
3. Review progress in `docs/progress/`
4. Review `docs/STAKEHOLDER-SUMMARY.md` to understand current project state
5. Verify no uncommitted changes

### Context Management

⚠️ **Alert at 20% context remaining**

When context is running low:

1. Save current progress to `docs/progress/`
2. Update active plans in `docs/plans/`
3. Summarize pending tasks
4. Prepare handoff notes for next session

### When Completing Major Milestones

After completing any major milestone (testing setup, architecture implementation, feature completion):

1. Update `docs/STAKEHOLDER-SUMMARY.md` with new progress
2. Update the checklist in AGENTS.md (Project Status section)
3. Create session handoff document in `docs/progress/`
4. Commit changes with descriptive conventional commit message

**Major milestones include:**

- Completing any item from the v1.0.0 checklist
- Implementing new architecture layers
- Adding new framework integrations
- Completing documentation for new features

---

## Response Format Preferences

- **Be concise** - No unnecessary preambles or summaries
- **Show, don't tell** - Code examples over explanations when possible
- **One thing at a time** - Don't overwhelm with multiple changes at once
- **Explain trade-offs** - When suggesting solutions, mention pros/cons
- **Think first, act later** - Clearly separate planning/thinking from execution. When thinking out loud, don't make changes. Plan first, then execute after approval.

---

## Architecture

This project follows **Clean Architecture** principles adapted to Astro conventions.

```
src/
  // === ASTRO CONVENTIONS ===
  pages/                    ← Routes (orchestration only, no business logic)
  layouts/                  ← Page layouts
  components/               ← UI Components (presentational)
    ui/                     ← Base reusable components (Button, Card, Input...)
    sections/                 ← Page sections (Hero, Services, Testimonials...)
    common/                 ← Project-specific shared (Header, Footer, LanguageSwitcher...)
  content/                  ← Content Collections (Astro)
    _schemas/               ← Zod schemas (modular, ignored by Astro)
    _collections/           ← Collection definitions (modular)
    config.ts               ← Collection registration (imports only)
    hero/, seo/, pageSections/  ← Content data (EN/DE)

  // === CLEAN ARCHITECTURE ===
  domain/
    value-objects/          ← Pure types with validation (Locale, Slug, Url...)
    entities/               ← Business objects with identity (Service, Project, Testimonial...)

  application/
    use-cases/              ← Business logic (getServices, getProjectBySlug...)
    ports/                  ← Repository interfaces

  infrastructure/
    repositories/           ← Implementations (JSONRepository → StrapiRepository)
    mappers/                ← Transform external data → entities

  // === SHARED ===
  i18n/
    translations.ts       ← Type-safe UI translations

  lib/                      ← Generic utilities

// === TESTS ===
tests/
  integration/              ← Use-cases + repositories tests
  e2e/                      ← End-to-end flows (Playwright)

// === DOCUMENTATION ===
docs/
  adr/                      ← Architecture Decision Records
  guides/                   ← Development guides
  plans/                    ← Work plans in progress
  progress/                 ← Progress checkpoints
```

### Architecture Principles

1. **Pages only orchestrate** - No business logic in pages, only call use-cases and pass data to components
2. **Components are presentational** - Receive data via props, no data fetching
3. **Use-cases contain business logic** - Single responsibility, testable
4. **Repositories are swappable** - JSON now, Strapi later (only change infrastructure layer)
5. **Mappers normalize data** - External data → domain entities
6. **Design patterns only when justified** - Propose patterns only when there's direct ROI, not just because we can. Avoid over-engineering.
7. **DX is sacred** - Astro's great DX is a priority. Every decision should maintain or improve developer experience, never degrade it.

---

## i18n Configuration

| Language          | Code | URL Pattern                                            |
| ----------------- | ---- | ------------------------------------------------------ |
| English (default) | `en` | `/about`, `/services`, `/contact`                      |
| German            | `de` | `/de/ueber-uns`, `/de/dienstleistungen`, `/de/kontakt` |

- Default language (EN) has no prefix in URL
- All other languages use `/{lang}/` prefix
- **Slugs are translated** per language for better SEO and UX

### Route Structure

```
src/
  pages/
    index.astro                     ← / (EN home)
    about.astro                     ← /about (EN)
    services.astro                  ← /services (EN)
    contact.astro                   ← /contact (EN)

    [lang]/
      index.astro                   ← /de (DE home)
      [...slug].astro               ← Catch-all for translated slugs
                                      /de/ueber-uns → about
                                      /de/dienstleistungen → services
                                      /de/kontakt → contact
```

### i18n Usage Conventions

**CRITICAL:** Never hardcode text or routes. Always use the i18n system.

#### Translation Function - t()

Use the type-safe `t()` helper for all UI text:

```typescript
import { t } from "@/i18n/translations";

// ✅ CORRECT - Use t() helper
<button>{t(locale, "ui", "getStarted")}</button>
<h1>{t(locale, "nav", "about")}</h1>

// ❌ WRONG - Never hardcode text
<button>Get Started</button>
<h1>About</h1>
```

**Available namespaces:**

- `nav` - Navigation labels (home, about, services, contact, domains)
- `ui` - UI elements (buttons, states, aria labels)
- `footer` - Footer-specific text (legal links, copyright)
- `routes` - Route slug translations (used by helpers, not directly)
- `sections` - Section headings (temporary, will move to Content Collections)

#### Route Helpers

Always use route helpers for building paths and extracting route keys:

```typescript
import { buildPath, getRouteKeyFromPath, getRouteSlugs } from "@/i18n/translations";

// ✅ CORRECT - Build locale-specific paths
<a href={buildPath("about", locale)}>About</a>
// EN: /about
// DE: /de/ueber-uns

// ✅ CORRECT - Extract route key from path for language switcher
const routeKey = getRouteKeyFromPath(Astro.url.pathname);
const alternateUrl = buildPath(routeKey, alternateLocale);

// ✅ CORRECT - Generate static paths in getStaticPaths()
export function getStaticPaths() {
  return getRouteSlugs("de").map(slug => ({ params: { slug } }));
}

// ❌ WRONG - Never hardcode route logic
<a href={locale === "en" ? "/about" : "/de/ueber-uns"}>About</a>
```

**Route helper functions:**

- `buildPath(routeKey, locale)` - Build full path with locale prefix and translated slug
- `getRouteKeyFromPath(path)` - Extract route key from any localized path
- `getRouteSlugs(locale)` - Get all route slugs for a locale (for getStaticPaths)

#### What Goes Where

**translations.ts (UI text):**

- ✅ Navigation labels, button text, form labels
- ✅ Error messages, loading states
- ✅ Aria labels, accessibility text
- ✅ Route slug mappings (in `routes` namespace)

**Content Collections (dynamic content):**

- ✅ Hero sections, feature descriptions
- ✅ Service offerings, project descriptions
- ✅ Blog posts, case studies

```typescript
// ✅ CORRECT - UI text in translations.ts
const buttonLabel = t(locale, "ui", "learnMore");

// ✅ CORRECT - Content from Content Collections
const heroContent = await getEntry("hero", `${locale}/home`);
```

#### Common Mistakes to Avoid

```typescript
// ❌ WRONG - Hardcoded text
<p>This page is coming soon.</p>

// ✅ CORRECT
<p>{t(locale, "ui", "comingSoon")}</p>

// ❌ WRONG - Hardcoded route building
const deUrl = locale === "de" ? `/de/${slug}` : `/${slug}`;

// ✅ CORRECT
const url = buildPath(routeKey, locale);

// ❌ WRONG - Ternary operators for locale-specific text
{locale === "en" ? "Privacy Policy" : "Datenschutz"}

// ✅ CORRECT
{t(locale, "footer", "privacyPolicy")}

// ❌ WRONG - Duplicated route mappings
const routeMap = { about: "ueber-uns", services: "dienstleistungen" };

// ✅ CORRECT - Use existing helpers
const slugs = getRouteSlugs("de");
```

### Route Translations Map

Route translations are centralized in `src/i18n/translations.ts`:

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

// Route helpers automatically use this mapping
buildPath("about", "de"); // "/de/ueber-uns"
```

---

## Component Structure

```
src/components/ui/Button/
  Button.astro             ← Component
  Button.test.ts           ← Unit test (colocated)

src/components/sections/Hero/
  Hero.astro
  Hero.test.ts
```

### Component Guidelines

- One component per folder
- Tests colocated with components
- Props interface defined with TypeScript
- Use Starwind UI as base when applicable

### Component Import Conventions

**IMPORTANT:** Astro components (`.astro` files) cannot be exported via barrel exports (index.ts files). This is a limitation of Astro's TypeScript plugin, which only works in editors, not in the CLI.

**✅ Correct - Direct imports:**

```typescript
// Import .astro components directly
import Button from "@/components/starwind/button/Button.astro";
import Hero from "@/components/sections/Hero/Hero.astro";

// Import utilities from barrel exports
import { button, type ButtonProps } from "@/components/starwind/button";
```

**❌ Wrong - Barrel exports for .astro files:**

```typescript
// This breaks TypeScript checking
import { Button } from "@/components/starwind/button";
import { Hero } from "@/components/sections/Hero";
```

**Component structure with utilities:**

```
src/components/starwind/button/
├── Button.astro          # Import directly (no barrel export)
├── Button.variants.ts    # Tailwind variants (exported via barrel)
├── Button.types.ts       # TypeScript types (exported via barrel)
├── index.ts             # Barrel for .ts files ONLY
└── Button.test.ts       # Tests
```

**index.ts pattern:**

```typescript
/**
 * Button component utilities
 *
 * Import the component directly:
 * import Button from '@/components/starwind/button/Button.astro'
 *
 * This file exports variants and types only (not the component).
 * Reason: Astro components don't support barrel exports.
 */

export { button } from "./Button.variants";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";
```

**Why this pattern?**

- Astro's `@astrojs/ts-plugin` only works in editors (VS Code), not when running `tsc` or `astro check` from CLI
- Attempting to re-export `.astro` components causes TypeScript errors
- See [ADR 0004](docs/adr/0004-typescript-testing-strategy.md) for full details
- GitHub Issues: [#6858](https://github.com/withastro/astro/issues/6858), [#7264](https://github.com/withastro/astro/issues/7264)

---

## Content Collections Structure

**Modular organization for maintainability and future Strapi migration.**

```
src/content/
├── _schemas/              # Zod schemas (underscore = Astro ignores)
│   ├── shared.ts         # Shared schemas (ctaSchema)
│   ├── hero.ts
│   ├── seo.ts
│   └── pageSections.ts
├── _collections/         # Collection definitions
│   ├── hero.ts
│   ├── seo.ts
│   └── pageSections.ts
├── config.ts             # Imports and exports collections
├── hero/
│   ├── en/home.json
│   └── de/home.json
├── seo/
│   ├── en/home.json
│   └── de/home.json
└── pageSections/
    ├── en/home.json
    └── de/home.json
```

### Why Modular?

1. **Maintainability** - Each schema in its own file
2. **Reusability** - Shared schemas like `ctaSchema` used across collections
3. **Clean config** - `config.ts` is just imports, no inline schemas
4. **Migration ready** - Easy to swap loaders when moving to Strapi

### Shared Schemas

**Example: `src/content/_schemas/shared.ts`**

```typescript
import { z } from "astro:content";

/**
 * Shared CTA button schema
 * Used across all collections for call-to-action buttons
 */
export const ctaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
});
```

### Collection Schemas

**Example: `src/content/_schemas/hero.ts`**

```typescript
import { z } from "astro:content";
import { ctaSchema } from "./shared";

export const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  image: z.string().optional(),
});
```

### Collection Definitions

**Example: `src/content/_collections/hero.ts`**

```typescript
import { defineCollection } from "astro:content";
import { heroSchema } from "../_schemas/hero";

export const heroCollection = defineCollection({
  type: "data",
  schema: heroSchema,
});
```

### Config File

**`src/content/config.ts`** - Clean imports only:

```typescript
import { heroCollection } from "./_collections/hero";
import { seoCollection } from "./_collections/seo";
import { pageSectionsCollection } from "./_collections/pageSections";

export const collections = {
  hero: heroCollection,
  seo: seoCollection,
  pageSections: pageSectionsCollection,
};
```

### Current Collections

| Collection     | Purpose                                     | Status       |
| -------------- | ------------------------------------------- | ------------ |
| `hero`         | Hero sections with CTAs                     | ✅ In use    |
| `seo`          | Page-level SEO metadata                     | 📝 Data only |
| `pageSections` | Structured page content (cards, CTAs, etc.) | 📝 Data only |

**Note:** Collections marked "Data only" have schemas and content but are not yet rendered in pages.

---

## Testing Strategy

| Type        | Tool       | Location                | What to Test                                   |
| ----------- | ---------- | ----------------------- | ---------------------------------------------- |
| Unit        | Vitest     | `*.test.ts` (colocated) | Mappers, use-cases, utils, Zod schemas         |
| Integration | Vitest     | `tests/integration/`    | Repositories with mock data                    |
| E2E         | Playwright | `tests/e2e/`            | Critical flows (contact form, language switch) |

### Testing Priority

1. **High:** Domain value objects, entities, use-cases, mappers
2. **Medium:** Complex components with logic
3. **Low:** Pure presentational components

---

## Code Conventions

### File Naming

| Type             | Convention               | Example             |
| ---------------- | ------------------------ | ------------------- |
| Components       | PascalCase               | `HeroSection.astro` |
| Utils/Helpers    | kebab-case               | `format-date.ts`    |
| Types/Interfaces | PascalCase               | `Service.ts`        |
| Tests            | Same as source + `.test` | `Button.test.ts`    |
| Constants        | SCREAMING_SNAKE_CASE     | `API_ENDPOINTS.ts`  |

### Exports

| Type                           | Export Style     |
| ------------------------------ | ---------------- |
| Astro Components               | `export default` |
| Utils, hooks, types, use-cases | Named exports    |

### Code Style

- **ESLint + Prettier** for formatting
- **Semantic HTML** - Use correct elements (`<nav>`, `<main>`, `<article>`, etc.)
- **Accessibility first** - ARIA labels, keyboard navigation, color contrast
- **SEO conscious** - Proper headings hierarchy, meta tags, structured data

### Comments

```typescript
// ✅ DO: Explain WHY when not obvious
// Cache TTL set to 1 hour to balance freshness with API rate limits
const CACHE_TTL = 3600;

// ❌ DON'T: Explain WHAT (code already shows this)
// Set the cache TTL to 3600
const CACHE_TTL = 3600;
```

### JSDoc

Use JSDoc for functions and types:

```typescript
/**
 * Retrieves all services filtered by category
 * @param category - Service category to filter by
 * @returns Array of services matching the category
 */
export async function getServicesByCategory(category: string): Promise<Service[]> {
  // ...
}
```

---

## Code Examples

### Astro Component

```astro
---
// src/components/ui/Button/Button.astro
interface Props {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  disabled?: boolean;
}

const { variant = "primary", size = "md", href, disabled = false } = Astro.props;

const baseStyles =
  "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
  ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Element = href ? "a" : "button";
---

<Element
  class:list={[baseStyles, variants[variant], sizes[size]]}
  href={href}
  disabled={disabled}
  aria-disabled={disabled}
>
  <slot />
</Element>
```

### Use Case

```typescript
// src/application/use-cases/getServices.ts
import type { Service } from "@/domain/entities/Service";
import type { ServiceRepository } from "@/application/ports/ServiceRepository";

interface GetServicesParams {
  locale: string;
  category?: string;
}

/**
 * Retrieves services filtered by locale and optional category
 */
export async function getServices(repository: ServiceRepository, params: GetServicesParams): Promise<Service[]> {
  const { locale, category } = params;

  const services = await repository.findAll(locale);

  if (!category) {
    return services;
  }

  return services.filter((service) => service.category === category);
}
```

### Mapper

```typescript
// src/infrastructure/mappers/ServiceMapper.ts
import type { Service } from "@/domain/entities/Service";
import type { StrapiService } from "@/infrastructure/types/strapi";

/**
 * Maps Strapi service response to domain entity
 */
export function toService(raw: StrapiService): Service {
  const { id, attributes } = raw;

  return {
    id,
    title: attributes.title,
    description: attributes.description,
    slug: attributes.slug,
    category: attributes.category,
    icon: attributes.icon ?? null,
  };
}

/**
 * Maps array of Strapi services to domain entities
 */
export function toServices(raw: StrapiService[]): Service[] {
  return raw.map(toService);
}
```

### i18n (Type-safe UI translations)

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
      readMore: "Read more",
      sendMessage: "Send message",
      loading: "Loading...",
      error: "Something went wrong",
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
      readMore: "Mehr lesen",
      sendMessage: "Nachricht senden",
      loading: "Laden...",
      error: "Etwas ist schief gelaufen",
    },
  },
} as const;

type Locale = keyof typeof translations;
type Sections = typeof translations.en;

/**
 * Type-safe translation helper with full autocompletion
 */
export function t<S extends keyof Sections>(locale: Locale, section: S, key: keyof Sections[S]): string {
  return translations[locale][section][key] as string;
}
```

```astro
---
// src/pages/about.astro
import { t } from "@/i18n/translations";
import Layout from "@/layouts/Layout.astro";

const locale = Astro.currentLocale as "en" | "de";
---

<Layout title={t(locale, "nav", "about")}>
  <nav>
    <a href="/">{t(locale, "nav", "home")}</a>
    <a href="/about">{t(locale, "nav", "about")}</a>
  </nav>
  <main>
    <button>{t(locale, "ui", "sendMessage")}</button>
  </main>
</Layout>
```

---

## Error Handling

- Use early returns for guard clauses
- Prefer explicit error types over generic `Error`
- Always handle loading, error, and empty states in UI
- Log errors with meaningful context

---

## Git Conventions

### Commits

Follow **Conventional Commits**:

```
feat: add hero section component
fix: resolve mobile navigation overlap
docs: update README with setup instructions
style: format code with prettier
refactor: extract validation logic to use-case
test: add unit tests for date formatter
chore: update dependencies
```

**AI Agent Commit Guidelines:**

- **DO NOT** add AI attribution footers (e.g., "🤖 Generated with...", "Co-Authored-By: AI...")
- Keep commit messages clean and professional
- Focus on **what** changed and **why**, not **who** (human or AI) made the change
- Commits should look indistinguishable from human-written commits
- Make **atomic commits** - one logical change per commit
- Commit completed work before moving to the next task

### Commit Tools (Pending Setup)

- **Husky** - Git hooks management
- **commitlint** - Enforce conventional commits
- **lint-staged** - Run linters on staged files
- **semantic-release** - Automated versioning and changelog

### Branch Strategy

**Current (MVP phase):** Trunk-based development

- Push directly to `main`
- **Baby steps, baby commits** - Small, atomic, focused changes
- Conventional commits enforced

**Future (team growth):** Feature branches + PRs

---

## Performance & SEO

### Core Web Vitals Targets

| Metric | Target  | How to Achieve                             |
| ------ | ------- | ------------------------------------------ |
| LCP    | < 2.5s  | Optimize images, preload critical assets   |
| INP    | < 200ms | Minimize JS, avoid blocking operations     |
| CLS    | < 0.1   | Reserve space for images, no layout shifts |

### Implementation Checklist

- [ ] Use `astro:image` for all images
- [ ] Implement `loading="lazy"` for below-fold images
- [ ] Set explicit `width` and `height` on images
- [ ] Use `font-display: swap` for custom fonts
- [ ] Generate sitemap automatically
- [ ] Configure robots.txt
- [ ] Implement JSON-LD schema markup
- [ ] Add meta tags for social sharing (OG, Twitter)

### Fonts

| Font             | Usage            |
| ---------------- | ---------------- |
| Aspekta Variable | Headings         |
| Roboto           | Body text        |
| Roboto Mono      | Numbers/counters |

---

## Data Strategy

### Current: Static JSON

```
src/data/
  services.json
  testimonials.json
```

Structure JSON to match Strapi response format:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Consulting",
        "description": "..."
      }
    }
  ]
}
```

### Future: Strapi Integration

Only change the repository implementation in `infrastructure/repositories/`.

---

## Environment

### Node Version

Specified in `.nvmrc` - Use fnm (recommended) or nvm.

```bash
fnm use
```

### Package Manager

**npm** (no yarn, no pnpm)

### Local Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

---

## Deployment

| Item            | Value                           |
| --------------- | ------------------------------- |
| **Platform**    | VPS with Docker                 |
| **CI/CD**       | GitHub Actions (pending setup)  |
| **Trigger**     | Push to `main` branch           |
| **Container**   | `globalcore-website:local`      |
| **Server path** | `/srv/stack/globalcore-website` |

> ⚠️ **Note:** GitHub Action workflow pending creation. Currently deployed manually.

---

## Gotchas

- **Astro components cannot use barrel exports** - Import `.astro` files directly, never via `index.ts` barrel exports. See [Component Import Conventions](#component-import-conventions) above.
- **Split type-checking strategy** - `tsc` checks app code, Vitest checks test code. Test files are excluded from `tsconfig.json`. See [ADR 0004](docs/adr/0004-typescript-testing-strategy.md) for details.
- **Pre-push hook runs full test suite** - Pushing takes ~9 seconds due to typecheck + unit tests + E2E tests. This is intentional to prevent broken code from reaching remote.
- **Props must be serializable** - No functions or classes in component props
- **Content Collections require restart** - After modifying collection schemas, restart dev server
- **i18n translations.ts changes require restart** - TypeScript types are cached
- **Hybrid mode default is static** - Add `export const prerender = false` for SSR pages

### Troubleshooting

```bash
# Clear Astro cache
rm -rf .astro dist node_modules/.vite

# Full reset
rm -rf node_modules package-lock.json && npm install

# Check TypeScript errors
npm run typecheck
```

---

## ADR Format

Location: `docs/adr/NNNN-title.md`

```markdown
# NNNN - Title

## Status

Accepted | Proposed | Deprecated

## Context

Why we need to make this decision.

## Decision

What we decided to do.

## Consequences

What are the trade-offs.
```

---

## Key Files

| File                  | Purpose                  |
| --------------------- | ------------------------ |
| `astro.config.mjs`    | Astro configuration      |
| `tailwind.config.mjs` | Tailwind configuration   |
| `tsconfig.json`       | TypeScript configuration |
| `.nvmrc`              | Node version             |
| `AGENTS.md`           | This file                |

### Path Aliases

| Alias | Path    |
| ----- | ------- |
| `@/*` | `src/*` |
