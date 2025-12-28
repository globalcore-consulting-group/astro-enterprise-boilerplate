# Testing Strategy: Vitest + Playwright

**Last Updated:** 2025-12-28
**Version:** 1.0.0
**Status:** Approved Strategy
**Project:** GlobalCore Website Boilerplate

---

## Table of Contents

1. [Overview & Philosophy](#overview--philosophy)
2. [Recommended Testing Strategy](#recommended-testing-strategy)
3. [Vitest vs Playwright Separation](#vitest-vs-playwright-separation)
4. [Content Collections Testing](#content-collections-testing)
5. [Migration Path (JSON → Strapi)](#migration-path-json--strapi)
6. [Test Organization Structure](#test-organization-structure)
7. [Coverage Strategy (60-80%)](#coverage-strategy-60-80)
8. [Playwright E2E Examples](#playwright-e2e-examples)
9. [Key Decisions](#key-decisions)
10. [Future Phases](#future-phases)

---

## Overview & Philosophy

**Core Philosophy:** Test real data flows, not mocked approximations.

### Context

This testing strategy is designed for the GlobalCore Astro website boilerplate, which will handle:

- **Current:** JSON static data matching future Strapi response format
- **Future:** BFF (Backend for Frontend) layer fetching from Strapi CMS
- **Architecture:** Clean Architecture layers (domain, application, infrastructure)
- **i18n:** EN/DE routing and translations
- **Coverage Target:** 60-80% (balanced approach)

### Why This Approach?

**Problems with Traditional Mocking:**

- ❌ Maintenance burden - Mocks drift out of sync with real APIs
- ❌ False confidence - Tests pass with mocks but fail in production
- ❌ Additional complexity - MSW, nock, etc. add dependencies and setup
- ❌ Mock maintenance scales poorly as project grows

**Our Solution:**

- ✅ Use Astro Content Collections for test data
- ✅ Real data validation via Zod schemas
- ✅ Tests fail when data format changes (catches real issues!)
- ✅ Simple, Astro-native approach
- ✅ Zero mocking libraries needed
- ✅ Migration-friendly (JSON → Strapi loader swap)

---

## Recommended Testing Strategy

### Three-Phase Approach

```
PHASE 1: Static JSON with Content Collections (Current)
├─ Test mappers with real JSON files
├─ Test use-cases with Content Collection APIs
├─ Test components with real data from collections
└─ No mocks, no network calls, just Astro's loader

PHASE 2: Strapi BFF (Future)
├─ Swap Content Collection loader (JSON → Strapi)
├─ Unit tests: UNCHANGED (still test mappers/use-cases)
├─ Integration tests: Use test fixtures (real Strapi format)
└─ E2E tests: Playwright with real Strapi endpoints

PHASE 3: Production (Live)
├─ Unit/Integration: Same as Phase 2
└─ E2E: Playwright against staging Strapi
```

**Key Insight:** Astro Content Collections abstract the data source. Tests don't need to know if data comes from JSON or Strapi.

### Testing Layers Without Mocks

| Layer                   | Test Strategy                          | No Mocks Needed                            |
| ----------------------- | -------------------------------------- | ------------------------------------------ |
| **Mappers**             | Pure functions with real JSON fixtures | ✅ Test with actual Strapi response format |
| **Content Collections** | Test schema validation with real data  | ✅ Zod catches invalid data                |
| **Use-cases**           | Test business logic with Content API   | ✅ Use Astro's `getCollection()` in tests  |
| **Components**          | Container API with real props          | ✅ Pass actual domain entities             |
| **E2E**                 | Playwright with real pages             | ✅ No mocking, just real user flows        |

---

## Vitest vs Playwright Separation

### Tool Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                        VITEST                               │
│                   (Unit & Integration)                      │
├─────────────────────────────────────────────────────────────┤
│ ✅ Mappers (Strapi → Domain)          Priority: HIGH       │
│ ✅ Use-cases (business logic)         Priority: HIGH       │
│ ✅ Zod schemas (validation)           Priority: HIGH       │
│ ✅ Content Collections (data layer)   Priority: HIGH       │
│ ✅ Complex components (Container API) Priority: MEDIUM     │
│ ✅ Utilities & helpers                Priority: MEDIUM     │
│ ❌ Full page flows                    Use Playwright      │
│ ❌ Browser-specific behavior          Use Playwright      │
│ ❌ Visual/responsive testing          Use Playwright      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      PLAYWRIGHT                             │
│                   (End-to-End Only)                         │
├─────────────────────────────────────────────────────────────┤
│ ✅ Language switching (EN ↔ DE)       Priority: HIGH       │
│ ✅ Contact form submission            Priority: HIGH       │
│ ✅ Responsive design validation       Priority: HIGH       │
│ ✅ Page navigation & transitions      Priority: MEDIUM     │
│ ✅ Real Strapi integration (future)   Priority: MEDIUM     │
│ ❌ Component rendering                Use Vitest          │
│ ❌ Business logic isolation           Use Vitest          │
│ ❌ Data transformation                Use Vitest          │
└─────────────────────────────────────────────────────────────┘
```

### When to Use Which Tool

| Scenario                        | Use Vitest | Use Playwright |
| ------------------------------- | ---------- | -------------- |
| Testing mappers                 | ✅         | ❌             |
| Testing use-cases               | ✅         | ❌             |
| Testing Zod schemas             | ✅         | ❌             |
| Testing components in isolation | ✅         | ❌             |
| Testing full page navigation    | ❌         | ✅             |
| Testing language switching      | ❌         | ✅             |
| Testing form submission flow    | ❌         | ✅             |
| Testing responsive design       | ❌         | ✅             |
| Testing browser-specific APIs   | ❌         | ✅             |

---

## Content Collections Testing

### Setup Example

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const servicesCollection = defineCollection({
  type: "data", // JSON loader
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    category: z.string(),
    icon: z.string().nullable(),
  }),
});

export const collections = {
  services: servicesCollection,
};
```

### Testing Content Collections

```typescript
// tests/integration/services.test.ts
import { describe, it, expect } from "vitest";
import { getCollection } from "astro:content";

describe("Services Collection", () => {
  it("should load services from JSON", async () => {
    const services = await getCollection("services");

    expect(services.length).toBeGreaterThan(0);
    expect(services[0].data).toHaveProperty("title");
    expect(services[0].data).toHaveProperty("slug");
  });

  it("should validate schema with Zod", async () => {
    const services = await getCollection("services");

    // If this passes, Zod validated all data
    services.forEach((service) => {
      expect(service.data.title).toBeTruthy();
      expect(service.data.slug).toBeTruthy();
    });
  });
});
```

### Testing Mappers with Real Fixtures

```typescript
// src/infrastructure/mappers/ServiceMapper.test.ts
import { describe, it, expect } from "vitest";
import { toService } from "./ServiceMapper";

describe("ServiceMapper", () => {
  it("should map Strapi response to domain entity", () => {
    // Use ACTUAL Strapi response format (from documentation or API)
    const strapiResponse = {
      id: 1,
      attributes: {
        title: "Consulting",
        description: "Expert consulting",
        slug: "consulting",
        category: "business",
        icon: "briefcase",
      },
    };

    const service = toService(strapiResponse);

    expect(service).toEqual({
      id: 1,
      title: "Consulting",
      description: "Expert consulting",
      slug: "consulting",
      category: "business",
      icon: "briefcase",
    });
  });

  it("should handle null optional fields", () => {
    const strapiResponse = {
      id: 2,
      attributes: {
        title: "Development",
        description: "Software development",
        slug: "development",
        category: "tech",
        icon: null,
      },
    };

    const service = toService(strapiResponse);

    expect(service.icon).toBeNull();
  });
});
```

**No mocks!** Just test fixtures matching real API format.

---

## Migration Path (JSON → Strapi)

### Phase 1: JSON with Content Collections (Current)

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

export const collections = {
  services: defineCollection({
    type: "data",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      slug: z.string(),
      category: z.string(),
      icon: z.string().nullable(),
    }),
  }),
};
```

```typescript
// src/content/services/consulting.json
{
  "title": "Consulting",
  "description": "Expert consulting services",
  "slug": "consulting",
  "category": "business",
  "icon": "briefcase"
}
```

```typescript
// src/pages/services.astro
import { getCollection } from "astro:content";

const services = await getCollection("services");
```

**Tests:** Vitest tests use `getCollection()` - tests actual JSON loading.

---

### Phase 2: Strapi Loader (Future - BFF Ready)

```typescript
// src/content/config.ts (ONLY change loader)
import { defineCollection, z } from "astro:content";
import { strapiLoader } from "@/loaders/strapi";

export const collections = {
  services: defineCollection({
    loader: strapiLoader({
      endpoint: "services",
      locale: "en",
    }),
    schema: z.object({
      // SAME SCHEMA!
      title: z.string(),
      description: z.string(),
      slug: z.string(),
      category: z.string(),
      icon: z.string().nullable(),
    }),
  }),
};
```

**Pages don't change! Tests don't change!**

```typescript
// src/pages/services.astro (UNCHANGED)
import { getCollection } from "astro:content";

const services = await getCollection("services"); // Still works!
```

**Tests:** Same Vitest tests still work - `getCollection()` now loads from Strapi.

---

### Phase 3: Custom BFF Endpoint (If Needed)

Only if you need custom business logic beyond Content Collections:

```typescript
// src/pages/api/services.ts (Astro API endpoint)
export async function GET({ params }) {
  const services = await getCollection("services");
  // Add custom logic, filtering, aggregation, etc.
  return new Response(JSON.stringify(services));
}
```

**Tests:**

- Unit tests: Still test with `getCollection()`
- API tests: Vitest can test API endpoints directly (no mocks!)
- E2E tests: Playwright tests full flow

**Key Insight:** Content Layer abstracts data source. Tests stay the same across all phases!

---

## Test Organization Structure

```
src/
├── content/
│   ├── config.ts                          # Content Collections with Zod schemas
│   ├── services/
│   │   ├── consulting.json                # Real test data!
│   │   └── development.json
│   └── projects/
│       └── project-1.json
├── application/
│   └── use-cases/
│       ├── getServices.ts
│       └── getServices.test.ts            # Vitest (uses getCollection)
├── infrastructure/
│   ├── mappers/
│   │   ├── ServiceMapper.ts
│   │   └── ServiceMapper.test.ts          # Vitest (real fixtures)
│   └── loaders/
│       ├── strapiLoader.ts                # Custom Strapi loader (future)
│       └── strapiLoader.test.ts           # Vitest (real API format)
├── domain/
│   └── entities/
│       ├── Service.ts
│       └── Service.test.ts                # Vitest (Zod validation tests)
├── components/
│   └── sections/
│       ├── HeroSection.astro
│       └── HeroSection.test.ts            # Vitest + Container API
└── test/
    ├── setup.ts                            # jest-dom setup (no MSW!)
    └── fixtures/
        └── strapi-responses.ts             # Real Strapi format examples

tests/
├── integration/
│   └── content-collections.test.ts        # Test Content Layer integration
└── e2e/
    ├── language-switching.spec.ts         # Playwright
    ├── contact-form.spec.ts               # Playwright
    └── responsive-design.spec.ts          # Playwright
```

### Key Points

- ❌ No `src/test/mocks/` directory
- ❌ No MSW handlers
- ✅ Real JSON data in `src/content/` serves as test data
- ✅ Test fixtures for Strapi responses (not mocks, just examples)
- ✅ Integration tests for Content Collections in `tests/integration/`
- ✅ E2E tests in `tests/e2e/`

### Naming Conventions

| Test Type         | File Pattern | Location              | Example                       |
| ----------------- | ------------ | --------------------- | ----------------------------- |
| Unit tests        | `*.test.ts`  | Colocated with source | `ServiceMapper.test.ts`       |
| Integration tests | `*.test.ts`  | `tests/integration/`  | `content-collections.test.ts` |
| E2E tests         | `*.spec.ts`  | `tests/e2e/`          | `language-switching.spec.ts`  |

---

## Coverage Strategy (60-80%)

### Testing Pyramid

```
        /\
       /E2E\              5-8 Playwright tests (~5% of tests)
      /────\              - Lang switch, contact form, responsive
     /Comp. \             10-15 component tests (~15% of tests)
    /────────\            - Hero, ServiceCard, LanguageSwitcher
   /Use-Cases \           20-30 integration tests (~40% of tests)
  /────────────\          - getServices, mappers, repositories
 /Mappers/Schema\ 30-40 unit tests (~40% of tests)
/________________\        - ServiceMapper, Zod schemas, utils
```

### What to Test (Priority Order)

**HIGH Priority (Must Test - Core of 60%):**

1. **Mappers** (100% coverage target)
   - ServiceMapper, ProjectMapper, TestimonialMapper
   - Pure functions, critical for data integrity
   - Example: `ServiceMapper.test.ts`

2. **Use-cases** (90% coverage target)
   - getServices, getProjectBySlug, etc.
   - Business logic must be bulletproof
   - Example: `getServices.test.ts`

3. **Zod Schemas** (100% coverage target)
   - Validation rules, error messages
   - Guard against invalid data
   - Example: `Service.test.ts`

**MEDIUM Priority (For 60-80% range):**

4. **Content Collections** (80% coverage target)
   - Test schema validation
   - Test data loading
   - Example: `content-collections.test.ts`

5. **Complex Components** (60% coverage target)
   - Components with conditional logic
   - Skip simple presentational components
   - Example: `HeroSection.test.ts`

**LOW Priority (Not required for boilerplate):**

6. **Utilities** (test as needed)
7. **Simple presentational components**
8. **Layout components** (basic structure only)

### Coverage Configuration

```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  thresholds: {
    lines: 60,
    functions: 60,
    branches: 60,
    statements: 60,
  },
  include: [
    'src/application/**',
    'src/infrastructure/**',
    'src/domain/**',
  ],
  exclude: [
    'src/test/**',
    '**/*.test.ts',
    'src/components/ui/**',  // Skip simple UI components
  ],
}
```

---

## Playwright E2E Examples

### Test 1: Language Switching

```typescript
// tests/e2e/language-switching.spec.ts
import { test, expect } from "@playwright/test";

test("should switch from EN to DE and update URL", async ({ page }) => {
  await page.goto("/about");

  // Verify English page
  await expect(page).toHaveURL("/about");
  await expect(page.locator("h1")).toContainText("About Us");

  // Click language switcher
  await page.click('[data-testid="lang-switcher-de"]');

  // Verify German page
  await expect(page).toHaveURL("/de/ueber-uns");
  await expect(page.locator("h1")).toContainText("Über uns");
});

test("should maintain navigation context when switching languages", async ({ page }) => {
  await page.goto("/services");

  // Switch to German
  await page.click('[data-testid="lang-switcher-de"]');

  // Should navigate to German services page
  await expect(page).toHaveURL("/de/dienstleistungen");
});
```

### Test 2: Contact Form

```typescript
// tests/e2e/contact-form.spec.ts
import { test, expect } from "@playwright/test";

test("should validate and submit contact form", async ({ page }) => {
  await page.goto("/contact");

  // Submit empty form - should show validation errors
  await page.click('button[type="submit"]');
  await expect(page.locator(".error-message")).toBeVisible();

  // Fill form correctly
  await page.fill('input[name="name"]', "John Doe");
  await page.fill('input[name="email"]', "john@example.com");
  await page.fill('textarea[name="message"]', "Test message");

  // Submit and verify success
  await page.click('button[type="submit"]');
  await expect(page.locator(".success-message")).toBeVisible();
  await expect(page.locator(".success-message")).toContainText("Thank you");
});

test("should validate email format", async ({ page }) => {
  await page.goto("/contact");

  await page.fill('input[name="email"]', "invalid-email");
  await page.blur('input[name="email"]');

  await expect(page.locator(".error-message")).toContainText("valid email");
});
```

### Test 3: Responsive Design

```typescript
// tests/e2e/responsive-design.spec.ts
import { test, expect } from "@playwright/test";

test("should show mobile menu on small screens", async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  // Mobile menu should be hidden initially
  await expect(page.locator(".mobile-menu")).not.toBeVisible();

  // Click hamburger icon
  await page.click('[data-testid="mobile-menu-toggle"]');

  // Menu should be visible
  await expect(page.locator(".mobile-menu")).toBeVisible();

  // Navigation links should be clickable
  await page.click('.mobile-menu a[href="/about"]');
  await expect(page).toHaveURL("/about");
});

test("should display desktop menu on large screens", async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");

  // Desktop menu should be visible
  await expect(page.locator("nav.desktop-menu")).toBeVisible();

  // Mobile toggle should not be visible
  await expect(page.locator('[data-testid="mobile-menu-toggle"]')).not.toBeVisible();
});
```

---

## Key Decisions

### 1. No Mocks - Use Astro Content Collections ✅

**Rationale:**

- User feedback: "Not a fan of mocks" - mocks create maintenance burden
- Content Collections provide real data validation via Zod
- Tests use actual data structures, no false confidence
- Simpler, more maintainable, Astro-native approach

### 2. 60-80% Coverage Target ✅

**Rationale:**

- Balanced approach, focuses on critical paths
- Doesn't slow down development
- HIGH priority: mappers, use-cases, schemas (bulletproof)
- MEDIUM priority: complex components, Content Collections
- LOW priority: simple presentational components

### 3. Playwright for E2E Only ✅

**Rationale:**

- Expensive to run (slower than unit tests)
- Reserve for critical user flows (lang switch, forms, responsive)
- 5-8 high-value E2E tests provide confidence
- Vitest handles everything else (faster feedback loop)

### 4. Content Layer as Test Data Source ✅

**Rationale:**

- JSON files in `src/content/` serve as both production data AND test data
- Zod validates data at build time AND test time
- Swap loader (JSON → Strapi) without changing tests
- No mocking libraries needed

### 5. Colocated Tests for Source Files ✅

**Rationale:**

- Better developer experience
- Tests live next to code they test
- Easier to maintain and refactor
- Exception: Integration tests in `tests/integration/`, E2E in `tests/e2e/`

### 6. Test Fixtures for Mappers (Not Mocks) ✅

**Rationale:**

- Use real Strapi API response format in fixtures
- Fixtures serve as documentation of real API format
- No network interception complexity
- Easy to update when API changes

---

## Future Phases

### Phase 1: Foundation (Current)

**Focus:** Set up testing infrastructure

- ✅ Install Vitest + Testing Library
- ✅ Configure happy-dom environment
- ✅ Set up jest-dom matchers
- ✅ Create test setup file
- ⏳ Write example tests (next step)
- ⏳ Install Playwright
- ⏳ Write E2E tests for high-priority flows

### Phase 2: Clean Architecture Implementation

**Focus:** Build application layers with tests

- Create `domain/` layer with Zod schemas → Write schema tests
- Create `infrastructure/` layer with mappers → Write mapper tests
- Create `application/` layer with use-cases → Write use-case tests
- Set up Content Collections with JSON data
- Write integration tests for Content Collections

### Phase 3: Component Development

**Focus:** Build UI with component tests

- Create base components from Starwind UI
- Write tests for complex components
- Test components with Container API
- Skip tests for simple presentational components

### Phase 4: E2E Testing

**Focus:** Validate critical user flows

- Language switching (EN ↔ DE)
- Contact form submission
- Responsive design validation
- Page navigation and transitions

### Phase 5: Strapi Integration

**Focus:** Migrate to Strapi CMS

- Create custom Strapi loader
- Swap Content Collection loader (JSON → Strapi)
- Verify existing tests still pass (they should!)
- Add E2E tests for real Strapi integration
- Optional: Create custom BFF endpoints if needed

---

## Resources

### Official Documentation

- [Vitest](https://vitest.dev/)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
- [Astro Container API](https://docs.astro.build/en/reference/container-reference/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

### Related Setup Guides

- [Vitest Setup Guide](./vitest-setup.md)
- [Playwright Setup Guide](./playwright-setup.md) (pending)

### Clean Architecture Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture on Frontend](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)

---

**Last Updated:** 2025-12-28
**Version:** 1.0.0
**Status:** Approved and ready for implementation
