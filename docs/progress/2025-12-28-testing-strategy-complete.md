# Testing Strategy Documentation Complete - Session Handoff

**Date:** 2025-12-28
**Session Status:** Testing Strategy Research & Documentation Complete
**Previous Session:** Tailwind CSS & Starwind UI Setup Complete
**Context Usage:** 76% at session end

---

## Executive Summary

Successfully researched and documented a comprehensive **no-mocks testing strategy** for the GlobalCore Astro website boilerplate. The strategy leverages **Astro Content Collections** for test data, avoiding traditional mocking libraries entirely. Complete documentation created for both Vitest (unit/integration) and Playwright (E2E) testing approaches.

**Key Achievement:** Established a migration-friendly testing strategy that works seamlessly from JSON → Strapi → BFF without requiring test rewrites.

---

## Completed Work

### ✅ Testing Strategy Research (2025 Best Practices)

**Research Topics:**

- Vitest + Astro integration (Container API, getViteConfig)
- Testing Library + jest-dom with Vitest
- happy-dom vs jsdom comparison
- Astro Content Collections as test data source
- Coverage strategies (V8 vs Istanbul)
- Playwright E2E testing best practices
- MSW alternatives (decided against mocks)

**Key Findings:**

- Astro Container API is the official way to test components
- happy-dom is faster and sufficient for most Astro component tests
- V8 coverage (Vitest v3.2.0+) now has AST-based remapping = Istanbul accuracy
- Content Collections abstract data source perfectly for testing
- No mocking libraries needed with Content Layer approach

**Sources Consulted:**

- [Vitest Documentation](https://vitest.dev/)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
- [Astro Container API](https://docs.astro.build/en/reference/container-reference/)
- [How to set up unit tests for Astro components](https://angelika.me/2025/02/01/astro-component-unit-tests/) (Feb 2025)
- [Testing My Static Site with Vitest](https://randomgeekery.org/post/2025/01/testing-my-static-site-with-vitest/) (Jan 2025)
- Community discussions on happy-dom vs jsdom, MSW alternatives

---

### ✅ Documentation Files Created/Updated

**Commit:** `da8e61c` - `docs(test): add comprehensive Vitest/Playwright testing strategy`

**Files Modified (3 files, 1,990 insertions):**

1. **docs/setup-resources/vitest-setup.md** (~1,188 lines total)
   - Added note about no MSW needed
   - Added 6 new comprehensive sections:
     - Testing Strategy: Vitest vs Playwright (with separation diagrams)
     - Testing with Astro Content Collections (No Mocks!)
     - Data Layer Migration Strategy (JSON → Strapi → BFF)
     - Testing Without Mocks (fixtures vs mocks comparison)
     - Test Organization Structure
     - Complete code examples throughout
   - All examples use real data, no mocking

2. **docs/setup-resources/testing-strategy.md** (NEW, ~700 lines)
   - Master testing strategy reference document
   - Table of contents with 10 major sections
   - Complete philosophy and approach documentation
   - All 3 migration phases documented with code
   - Playwright E2E test examples
   - Coverage strategy (60-80% target)
   - Test priority matrix
   - Future phases roadmap

3. **AGENTS.md** (~40 lines added)
   - New "Testing Strategy" section after Tech Stack
   - Quick reference table (Vitest/Playwright/Content Layer)
   - Test priority (HIGH/MEDIUM/LOW)
   - Data migration strategy summary
   - Links to detailed testing guides

---

## Key Strategy Decisions

### 1. No Mocks - Use Astro Content Collections ✅

**User Feedback:** "Not a fan of mocks" - mocks create maintenance burden

**Why Content Collections Instead:**

- ✅ Real data validation via Zod schemas
- ✅ Tests fail when data format changes (catches real issues!)
- ✅ Simple, Astro-native approach
- ✅ Zero mocking libraries needed
- ✅ JSON files serve as both production data AND test data
- ✅ Migration-friendly (JSON → Strapi loader swap)

**Rejected Approach:** MSW (Mock Service Worker)

- ❌ Maintenance burden - mocks drift out of sync
- ❌ False confidence - tests pass with mocks but fail in production
- ❌ Additional complexity and dependencies

---

### 2. Clear Vitest vs Playwright Separation ✅

```
VITEST (Unit & Integration) - 95% of tests
├─ Mappers (Strapi → Domain)          [HIGH Priority]
├─ Use-cases (business logic)         [HIGH Priority]
├─ Zod schemas (validation)           [HIGH Priority]
├─ Content Collections (data layer)   [HIGH Priority]
├─ Complex components (Container API) [MEDIUM Priority]
└─ Utilities & helpers                [MEDIUM Priority]

PLAYWRIGHT (End-to-End Only) - 5% of tests
├─ Language switching (EN ↔ DE)       [HIGH Priority]
├─ Contact form submission            [HIGH Priority]
├─ Responsive design validation       [HIGH Priority]
└─ Page navigation & transitions      [MEDIUM Priority]
```

**User Requirements Met:**

- Language switching: EN/DE routing with URL validation
- Contact form: Validation + submission flow
- Responsive design: Mobile menu, viewport testing

---

### 3. 60-80% Coverage Target ✅

**Balanced Approach:**

- HIGH (Must Test): Domain entities, use-cases, mappers, Zod schemas
- MEDIUM (Should Test): Content Collections, complex components
- LOW (Optional): Simple presentational components, utilities

**Focus Areas:**

- `application/` layer (use-cases, ports)
- `infrastructure/` layer (mappers, repositories, loaders)
- `domain/` layer (entities, schemas)
- Skip: Simple UI components in `components/ui/`

---

### 4. Three-Phase Migration Strategy ✅

**Phase 1: JSON with Content Collections (Current)**

```typescript
// src/content/config.ts
export const collections = {
  services: defineCollection({
    type: "data",
    schema: z.object({
      /* Zod schema */
    }),
  }),
};

// Tests use getCollection('services')
```

**Phase 2: Strapi Loader (Future - BFF Ready)**

```typescript
// ONLY change loader, schema stays same!
export const collections = {
  services: defineCollection({
    loader: strapiLoader({ endpoint: "services" }),
    schema: z.object({
      /* SAME SCHEMA! */
    }),
  }),
};

// Tests UNCHANGED - still use getCollection('services')
```

**Phase 3: Custom BFF Endpoint (If Needed)**

```typescript
// src/pages/api/services.ts
export async function GET() {
  const services = await getCollection("services");
  // Add custom business logic
  return new Response(JSON.stringify(services));
}

// Tests still work with getCollection()
```

**Key Insight:** Content Layer abstracts data source. Tests work unchanged across all phases!

---

## Testing Pyramid (60-80% Coverage)

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

**Distribution:**

- ~40% Unit tests (mappers, schemas, utils)
- ~40% Integration tests (use-cases, repositories)
- ~15% Component tests (complex components only)
- ~5% E2E tests (critical user flows)

---

## Test Organization Structure

```
src/
├── content/
│   ├── config.ts                          # Content Collections + Zod schemas
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
│       ├── strapiLoader.ts                # Future
│       └── strapiLoader.test.ts
├── domain/
│   └── entities/
│       ├── Service.ts
│       └── Service.test.ts                # Vitest (Zod validation)
├── components/
│   └── sections/
│       ├── HeroSection.astro
│       └── HeroSection.test.ts            # Vitest + Container API
└── test/
    ├── setup.ts                            # jest-dom setup
    └── fixtures/
        └── strapi-responses.ts             # Real Strapi format

tests/
├── integration/
│   └── content-collections.test.ts        # Content Layer tests
└── e2e/
    ├── language-switching.spec.ts         # Playwright
    ├── contact-form.spec.ts               # Playwright
    └── responsive-design.spec.ts          # Playwright
```

**Key Points:**

- ❌ No `src/test/mocks/` directory
- ❌ No MSW handlers
- ✅ Real JSON in `src/content/` = test data
- ✅ Test fixtures (not mocks) for Strapi responses
- ✅ Colocated unit tests
- ✅ Centralized integration/E2E tests

---

## Packages Identified (Not Yet Installed)

```bash
npm install -D vitest happy-dom @testing-library/dom @testing-library/jest-dom @vitest/coverage-v8
```

**No MSW needed!**

| Package                     | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `vitest`                    | Test framework                                  |
| `happy-dom`                 | Lightweight DOM (faster than jsdom)             |
| `@testing-library/dom`      | Query methods (getByText, getByRole)            |
| `@testing-library/jest-dom` | DOM assertions (toBeVisible, toHaveTextContent) |
| `@vitest/coverage-v8`       | Code coverage (optional)                        |

**For Playwright (future session):**

```bash
npm install -D @playwright/test
```

---

## Technical Highlights

### Vitest Configuration Pattern

```typescript
/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: { lines: 60, functions: 60, branches: 60, statements: 60 },
    },
  },
});
```

**Uses Astro's `getViteConfig()`** - shares Vite config between Astro and Vitest (no duplication)

---

### Container API for Astro Components

```typescript
import { experimental_AstroContainer as AstroContainer } from "astro/container";

test("Button renders correctly", async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Button, {
    props: { variant: "primary" },
    slots: { default: "Click me" },
  });

  expect(html).toContain("Click me");
  expect(html).toContain("bg-primary");
});
```

**Official way to test Astro components** - renders on server without dev server

---

### Testing Content Collections

```typescript
import { getCollection } from "astro:content";

test("Services collection loads and validates", async () => {
  const services = await getCollection("services");

  // If this passes, Zod validated all data!
  expect(services.length).toBeGreaterThan(0);
  expect(services[0].data).toHaveProperty("title");
});
```

**No mocks!** Tests load real JSON files through Content Collections API

---

## Current Project State

### Technology Stack (Updated)

- **Framework:** Astro 5.16.6
- **Node.js:** 20.19.6
- **TypeScript:** Strict mode with path aliases
- **Styling:** Tailwind CSS 4.1.18
- **UI Components:** Starwind UI 2.2.0 (Button)
- **Code Quality:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged + commitlint
- **Testing (Documented):** Vitest + Playwright strategy ready
- **Testing (Pending Install):** Vitest, Testing Library, Playwright

### AGENTS.md Checklist Status

**✅ Completed (7/15 items):**

- Repository & Astro init
- ESLint + Prettier
- VSCode workspace
- Git hooks (Husky, lint-staged, commitlint)
- .nvmrc + path aliases
- Tailwind CSS v4
- Starwind UI (Button component)
- **Testing Strategy Documentation** ← NEW

**⏳ Remaining for v1.0.0:**

- Vitest + Testing Library (ready to install)
- Playwright (ready to install)
- Zod (schema validation)
- Clean Architecture folder structure
- i18n configuration
- Content Collections
- semantic-release
- GitHub Actions (CI/CD)

---

## Next Session: Ready to Implement

### Immediate Next Steps

**Option 1: Install Vitest + Testing Library**

```bash
npm install -D vitest happy-dom @testing-library/dom @testing-library/jest-dom @vitest/coverage-v8
```

**Option 2: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install
```

**Option 3: Set Up Zod + Content Collections**

```bash
npm install zod
# Create src/content/config.ts
# Create example JSON data
```

**Recommended Order:**

1. Vitest + Testing Library (foundation for all other testing)
2. Content Collections + Zod (enables testing with real data)
3. Write example tests (mapper, use-case, component)
4. Playwright (E2E testing)

---

## Documentation Resources Created

### Quick Reference Links

**For Next Session:**

- [Vitest Setup Guide](docs/setup-resources/vitest-setup.md) - Complete installation & configuration
- [Testing Strategy](docs/setup-resources/testing-strategy.md) - Master reference for all phases
- [AGENTS.md Testing Section](AGENTS.md#testing-strategy) - Quick reference

**Previous Sessions:**

- [Foundation Setup](docs/progress/2025-12-26-foundation-complete.md)
- [Tailwind & Starwind](docs/progress/2025-12-26-tailwind-starwind-complete.md)
- [Session Summary](docs/progress/SESSION-SUMMARY.md)

---

## Key Patterns Established

### 1. Testing Philosophy

**Test real data flows, not mocked approximations**

- Use Astro Content Collections for test data
- Avoid mocking internal APIs
- Only mock external APIs (Stripe, SendGrid, etc.)
- Fixtures over mocks

### 2. Test Naming Convention

| Test Type         | File Pattern | Location              |
| ----------------- | ------------ | --------------------- |
| Unit tests        | `*.test.ts`  | Colocated with source |
| Integration tests | `*.test.ts`  | `tests/integration/`  |
| E2E tests         | `*.spec.ts`  | `tests/e2e/`          |

### 3. Migration Path Pattern

```
JSON → Content Collections → Strapi Loader → Custom BFF
(All phases use same getCollection() API - tests unchanged!)
```

---

## Session Handoff Checklist

- [x] Testing strategy researched (Vitest + Playwright)
- [x] 2025 best practices documented
- [x] No-mocks approach defined
- [x] vitest-setup.md created (~1,188 lines)
- [x] testing-strategy.md created (~700 lines)
- [x] AGENTS.md updated with Testing Strategy section
- [x] All work committed (da8e61c)
- [x] Migration path documented (JSON → Strapi → BFF)
- [x] Coverage targets defined (60-80%)
- [x] E2E test priorities identified
- [x] Next steps clearly defined
- [x] Progress document created (this file)

---

## Commit Details

```bash
Commit: da8e61c
Message: docs(test): add comprehensive Vitest/Playwright testing strategy

- Update vitest-setup.md with Content Collections approach (no mocks)
- Create testing-strategy.md as master testing reference
- Add testing strategy section to AGENTS.md
- Document 3-phase migration path (JSON → Strapi → BFF)
- Define 60-80% coverage targets
- Prioritize E2E tests: lang switching, forms, responsive

Files changed: 3 files, 1990 insertions(+)
```

---

## Summary for Next Agent

**Context:** Testing strategy research and documentation complete. No code written yet, only comprehensive documentation created based on 2025 best practices.

**What was done:**

- Researched Vitest + Astro integration (Container API, getViteConfig)
- Researched Playwright E2E testing best practices
- Decided AGAINST mocking (use Content Collections instead)
- Created 3 comprehensive documentation files
- Defined 3-phase migration strategy (JSON → Strapi → BFF)
- Set coverage targets (60-80%)
- Prioritized E2E tests (language switching, forms, responsive)

**What's ready:**

- Complete installation instructions in vitest-setup.md
- Package list (Vitest, happy-dom, Testing Library, jest-dom)
- Configuration examples (vitest.config.ts, setup file)
- Code examples for testing mappers, use-cases, schemas, components
- Playwright E2E test examples
- Migration strategy that doesn't require test rewrites

**Next actions:**

1. Install Vitest + Testing Library packages
2. Create vitest.config.ts
3. Create src/test/setup.ts
4. Update tsconfig.json
5. Set up Content Collections with Zod
6. Write example tests
7. Install Playwright
8. Write E2E tests

**Critical files:**

- `docs/setup-resources/vitest-setup.md` - Setup guide
- `docs/setup-resources/testing-strategy.md` - Master reference
- `AGENTS.md` - Quick reference in Testing Strategy section

---

**End of Session Handoff**
**Status:** ✅ Testing Strategy Documentation Complete
**Ready for:** Vitest + Testing Library Installation & Implementation
**Context Preserved:** All research and decisions documented
