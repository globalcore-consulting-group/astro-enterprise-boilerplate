# Vitest + Testing Library Setup

**Last Updated:** 2025-12-28
**Status:** ✅ Implemented and Operational
**Target:** Unit and Integration Testing for Astro Components

---

## Overview

**Vitest** is a blazing-fast unit test framework powered by Vite, providing native ESM support, TypeScript integration, and Jest-compatible APIs. Combined with **Testing Library** and Astro's **Container API**, it enables comprehensive testing of Astro components and application logic.

### Why Vitest?

- **Speed:** HMR-powered watch mode only reruns affected tests
- **Native ESM:** First-class support for modern JavaScript
- **Vite Integration:** Shares config with your Astro project via `getViteConfig()`
- **Jest Compatible:** Familiar API with expect, describe, it, etc.
- **TypeScript:** Built-in TypeScript support, no additional configuration
- **UI Mode:** Visual test interface for interactive development

---

## Official Documentation

- [Vitest Documentation](https://vitest.dev/)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
- [Astro Container API](https://docs.astro.build/en/reference/container-reference/)
- [Testing Library](https://testing-library.com/)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)

---

## Packages to Install

```bash
npm install -D vitest happy-dom @testing-library/dom @testing-library/jest-dom @vitest/coverage-v8
```

> **Note:** No MSW (Mock Service Worker) needed! This project uses **Astro Content Collections** for test data, avoiding mocks entirely. See [Testing Strategy](#testing-strategy-vitest-vs-playwright) for details.

### Package Breakdown

| Package                     | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `vitest`                    | Test framework                                  |
| `happy-dom`                 | Lightweight DOM environment (faster than jsdom) |
| `@testing-library/dom`      | Query methods (getByText, getByRole, etc.)      |
| `@testing-library/jest-dom` | DOM assertions (toBeVisible, toHaveTextContent) |
| `@vitest/coverage-v8`       | Code coverage with V8 provider (optional)       |

---

## DOM Environment: happy-dom vs jsdom

### Performance Comparison (2025)

| Feature               | happy-dom                            | jsdom                              |
| --------------------- | ------------------------------------ | ---------------------------------- |
| **Speed**             | ⚡ Much faster (lightweight)         | Slower (full browser simulation)   |
| **API Completeness**  | ⚠️ Lacks some browser APIs           | ✅ More complete browser standards |
| **Best For**          | Unit tests, simple DOM operations    | Complex browser features, E2E-like |
| **Astro Recommended** | ✅ Yes (unless advanced APIs needed) | Use for edge cases only            |

### Decision: Use happy-dom

**Reason:** For Astro component unit testing, `happy-dom` provides the best balance of speed and functionality. Reserve `jsdom` for advanced scenarios requiring full browser API compliance.

**Sources:**

- [jsdom vs happy-dom Discussion](https://github.com/vitest-dev/vitest/discussions/1607)
- [Vitest Test Environment Guide](https://vitest.dev/guide/environment)

---

## Configuration

### 1. Create `vitest.config.ts`

Use Astro's `getViteConfig()` helper to share Vite configuration with your Astro project:

```typescript
/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // Test environment
    environment: "happy-dom",

    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Setup file for test utilities
    setupFiles: ["./src/test/setup.ts"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.test.ts", "**/*.config.*"],
    },

    // Watch mode (automatically enabled in development)
    // Run mode (automatically enabled in CI)
  },
});
```

### 2. Create `src/test/setup.ts`

Setup file for Testing Library matchers:

```typescript
// Import jest-dom matchers for Vitest
import "@testing-library/jest-dom/vitest";

// Global test utilities can be added here
// Example: Custom matchers, mocks, etc.
```

### 3. Update `tsconfig.json`

Add Vitest types for global test APIs:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

### 4. Add npm scripts to `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

**Sources:**

- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
- [How to set up unit tests for Astro components](https://angelika.me/2025/02/01/astro-component-unit-tests/)
- [Vitest Config Reference](https://vitest.dev/config/)

---

## Testing Astro Components with Container API

### Overview

Astro's **Container API** (experimental) is the official way to render Astro components in test environments. It provides server-side rendering capabilities without starting a full dev server.

### Basic Example

```typescript
// src/components/ui/Button/Button.test.ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import Button from "./Button.astro";

test("Button renders with default variant", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Button, {
    props: { variant: "primary" },
    slots: { default: "Click me" },
  });

  expect(result).toContain("Click me");
  expect(result).toContain("bg-primary");
});
```

### Testing with DOM Queries

```typescript
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import { screen } from "@testing-library/dom";
import HeroSection from "./HeroSection.astro";

test("HeroSection displays heading and CTA", async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(HeroSection, {
    props: {
      title: "Welcome to GlobalCore",
      ctaText: "Get Started",
    },
  });

  // Parse HTML into happy-dom document
  document.body.innerHTML = html;

  // Use Testing Library queries
  const heading = screen.getByRole("heading", { name: /welcome to globalcore/i });
  const button = screen.getByRole("button", { name: /get started/i });

  expect(heading).toBeInTheDocument();
  expect(button).toBeVisible();
});
```

### Container API with Custom Astro Config

Customize Astro configuration for tests (e.g., i18n):

```typescript
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getViteConfig } from "astro/config";

const container = await AstroContainer.create({
  // Override Astro config for tests
  astroConfig: {
    i18n: {
      defaultLocale: "en",
      locales: ["en", "de"],
    },
  },
});
```

**Sources:**

- [Astro Container API Reference](https://docs.astro.build/en/reference/container-reference/)
- [Astro 4.9 Release Notes](https://astro.build/blog/astro-490/)

---

## Testing Utilities & Use Cases

### Testing Mappers (domain/infrastructure)

```typescript
// src/infrastructure/mappers/ServiceMapper.test.ts
import { describe, it, expect } from "vitest";
import { toService } from "./ServiceMapper";
import type { StrapiService } from "../types/strapi";

describe("ServiceMapper", () => {
  it("should map Strapi service to domain entity", () => {
    const strapiService: StrapiService = {
      id: 1,
      attributes: {
        title: "Consulting",
        description: "Expert consulting services",
        slug: "consulting",
        category: "business",
        icon: "briefcase",
      },
    };

    const result = toService(strapiService);

    expect(result).toEqual({
      id: 1,
      title: "Consulting",
      description: "Expert consulting services",
      slug: "consulting",
      category: "business",
      icon: "briefcase",
    });
  });

  it("should handle null icon", () => {
    const strapiService: StrapiService = {
      id: 2,
      attributes: {
        title: "Development",
        description: "Software development",
        slug: "development",
        category: "tech",
        icon: null,
      },
    };

    const result = toService(strapiService);

    expect(result.icon).toBeNull();
  });
});
```

### Testing Use Cases (application layer)

```typescript
// src/application/use-cases/getServices.test.ts
import { describe, it, expect, vi } from "vitest";
import { getServices } from "./getServices";
import type { ServiceRepository } from "../ports/ServiceRepository";

describe("getServices", () => {
  it("should return all services for locale", async () => {
    const mockRepository: ServiceRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: 1, title: "Service 1", category: "business" },
        { id: 2, title: "Service 2", category: "tech" },
      ]),
    };

    const result = await getServices(mockRepository, { locale: "en" });

    expect(result).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalledWith("en");
  });

  it("should filter services by category", async () => {
    const mockRepository: ServiceRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: 1, title: "Service 1", category: "business" },
        { id: 2, title: "Service 2", category: "tech" },
      ]),
    };

    const result = await getServices(mockRepository, {
      locale: "en",
      category: "business",
    });

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("business");
  });
});
```

### Testing Zod Schemas

```typescript
// src/domain/entities/Service.test.ts
import { describe, it, expect } from "vitest";
import { ServiceSchema } from "./Service";

describe("ServiceSchema", () => {
  it("should validate correct service data", () => {
    const validService = {
      id: 1,
      title: "Consulting",
      description: "Expert consulting",
      slug: "consulting",
      category: "business",
      icon: "briefcase",
    };

    const result = ServiceSchema.safeParse(validService);

    expect(result.success).toBe(true);
  });

  it("should reject service without required fields", () => {
    const invalidService = {
      id: 1,
      title: "Consulting",
      // Missing required fields
    };

    const result = ServiceSchema.safeParse(invalidService);

    expect(result.success).toBe(false);
  });
});
```

---

## Coverage Configuration

### V8 vs Istanbul (2025 Update)

As of **Vitest v3.2.0**, V8 coverage uses AST-based remapping, producing identical accuracy to Istanbul while maintaining superior performance.

| Provider     | Speed  | Accuracy | Best For                           |
| ------------ | ------ | -------- | ---------------------------------- |
| **v8**       | ⚡⚡⚡ | ✅       | All projects (recommended)         |
| **istanbul** | ⚡     | ✅       | Non-V8 environments (Firefox, Bun) |

### Coverage Configuration Example

```typescript
export default getViteConfig({
  test: {
    coverage: {
      provider: "v8", // Recommended (faster + accurate)
      reporter: ["text", "json", "html"],

      // Thresholds
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },

      // Files to exclude
      exclude: ["node_modules/", "src/test/", "**/*.test.ts", "**/*.config.*", "**/types/**"],

      // Files to include
      include: ["src/**/*.{ts,tsx,astro}"],
    },
  },
});
```

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

**Sources:**

- [Vitest Coverage Guide](https://vitest.dev/guide/coverage)
- [Coverage Config Reference](https://vitest.dev/config/coverage)

---

## Vitest UI & Watch Mode

### UI Mode (Interactive Testing)

Vitest UI provides a visual interface for running and debugging tests:

```bash
npm run test:ui
```

**Features:**

- Visual test tree
- Filter by file, test name, or status
- Real-time test execution
- Detailed error messages
- Console output per test

### Watch Mode (Default in Development)

Vitest automatically enables watch mode in development and run mode in CI:

```bash
# Watch mode (re-runs tests on file changes)
npm run test:watch

# Run mode (single pass, exit after completion)
npm run test:run
```

**Watch Mode Benefits:**

- HMR-powered: Only reruns affected tests
- Instant feedback on code changes
- Interactive filtering (press 'f' to filter failing tests)

**Sources:**

- [Vitest UI Guide](https://vitest.dev/guide/ui)
- [Vitest CLI Reference](https://vitest.dev/guide/cli)

---

## Testing Strategy: Vitest vs Playwright

**Philosophy:** Test real data flows, not mocked approximations.

This project uses a layered testing approach with **clear separation** between unit/integration tests (Vitest) and end-to-end tests (Playwright).

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

### Testing Pyramid (60-80% Coverage Target)

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

**Coverage Targets:**

- **Goal:** 60-80% overall coverage
- **Focus:** `application/`, `infrastructure/`, `domain/` layers
- **Skip:** Simple presentational components

**Test Priority:**

1. **HIGH (Must Test):** Domain entities, use-cases, mappers, Zod schemas
2. **MEDIUM (Should Test):** Content Collections, complex components
3. **LOW (Optional):** Simple presentational components, utilities

> **For complete testing strategy details**, see [testing-strategy.md](./testing-strategy.md)

---

## Testing with Astro Content Collections (No Mocks!)

**Core Philosophy:** Use real data from Astro Content Collections instead of mocks.

### Why No Mocks?

**Problems with Mocks:**

- ❌ Maintenance burden - Mocks drift out of sync with real APIs
- ❌ False confidence - Tests pass with mocks but fail in production
- ❌ Additional complexity - MSW, nock, etc. add dependencies and setup

**Content Collections Solution:**

- ✅ Real data validation via Zod schemas
- ✅ Tests fail when data format changes (catches real issues!)
- ✅ Simple, Astro-native approach
- ✅ Zero mocking libraries needed
- ✅ JSON files serve as both production data AND test data

### How Content Collections Work as Test Data

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

export const collections = {
  services: defineCollection({
    type: "data", // Loads from JSON files
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
// src/content/services/consulting.json (Real data!)
{
  "title": "Consulting",
  "description": "Expert consulting services",
  "slug": "consulting",
  "category": "business",
  "icon": "briefcase"
}
```

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

    // If this passes, Zod validated all data at build time
    services.forEach((service) => {
      expect(service.data.title).toBeTruthy();
      expect(service.data.slug).toBeTruthy();
    });
  });
});
```

### Testing Mappers with Real Fixtures

Instead of mocking API responses, use real Strapi response format in test fixtures:

```typescript
// src/infrastructure/mappers/ServiceMapper.test.ts
import { describe, it, expect } from "vitest";
import { toService } from "./ServiceMapper";

describe("ServiceMapper", () => {
  it("should map Strapi response to domain entity", () => {
    // REAL Strapi response format (from documentation/API)
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
        icon: null, // Test null handling
      },
    };

    const service = toService(strapiResponse);

    expect(service.icon).toBeNull();
  });
});
```

**No mocks!** Just test fixtures matching the real API format.

---

## Data Layer Migration Strategy

The Content Collections approach supports seamless migration from JSON → Strapi → BFF without changing tests.

### Phase 1: JSON with Content Collections (Current)

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

export const collections = {
  services: defineCollection({
    type: "data", // Loads from JSON files
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
      // Swap loader only
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
- API tests: Vitest can test API endpoints directly
- E2E tests: Playwright tests full user flow

**Key Insight:** Content Layer abstracts the data source. Tests stay the same across all phases!

---

## Testing Without Mocks

### When to Use Real Data vs Mocks

| Scenario          | Approach                       | Rationale                                                           |
| ----------------- | ------------------------------ | ------------------------------------------------------------------- |
| **Mappers**       | Real fixtures (no mocks)       | Use actual Strapi response format in test data                      |
| **Use-cases**     | Content Collections (no mocks) | Test with `getCollection()` using real JSON files                   |
| **Zod Schemas**   | Real data (no mocks)           | Validate actual Content Collection data                             |
| **Components**    | Container API (no mocks)       | Pass real domain entities as props                                  |
| **External APIs** | Rarely mock                    | Only mock external APIs outside your control (payment, email, etc.) |

### Test Fixtures vs Mocks

**Fixtures (✅ Recommended):**

```typescript
// src/test/fixtures/strapi-responses.ts
export const mockStrapiService = {
  id: 1,
  attributes: {
    title: "Consulting",
    description: "Expert consulting",
    slug: "consulting",
    category: "business",
    icon: "briefcase",
  },
};

// Use in tests
import { mockStrapiService } from "@/test/fixtures/strapi-responses";
const service = toService(mockStrapiService);
```

**Network Mocks (❌ Avoid):**

```typescript
// ❌ DON'T: Mock network requests
server.use(
  http.get('/api/services', () => {
    return HttpResponse.json({ data: [...] });
  })
);
```

**Why fixtures are better:**

- ✅ No mocking library needed
- ✅ Fixtures serve as documentation of real API format
- ✅ Easy to update when API changes
- ✅ Can be shared across tests
- ✅ No network interception complexity

### When to Use Mocks (Rarely)

Use mocks **only** for external APIs outside your control:

```typescript
// ✅ OK: Mock external payment API
vi.mock('stripe', () => ({
  charges: {
    create: vi.fn().mockResolvedValue({ id: 'ch_123', status: 'succeeded' }),
  },
}));

// ✅ OK: Mock external email service
vi.mock('sendgrid', () => ({
  send: vi.fn().mockResolvedValue({ statusCode: 202 }),
}));

// ❌ DON'T: Mock your own API
vi.mock('@/api/services', () => ({
  getServices: vi.fn().mockResolvedValue([...]),
}));
```

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

**Key Points:**

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

## Testing Library Matchers

### jest-dom Setup (Vitest Compatible)

As of 2025, `@testing-library/jest-dom` officially supports Vitest via the `/vitest` import:

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

### Available Matchers

| Matcher                   | Description               |
| ------------------------- | ------------------------- |
| `toBeDisabled()`          | Element is disabled       |
| `toBeEnabled()`           | Element is enabled        |
| `toBeVisible()`           | Element is visible        |
| `toBeInTheDocument()`     | Element exists in DOM     |
| `toHaveTextContent(text)` | Element contains text     |
| `toHaveAttribute(attr)`   | Element has attribute     |
| `toHaveClass(className)`  | Element has CSS class     |
| `toHaveStyle(css)`        | Element has inline styles |

### Example Usage

```typescript
import { screen } from "@testing-library/dom";

test("button is disabled when loading", () => {
  const button = screen.getByRole("button");

  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-disabled", "true");
  expect(button).toHaveClass("opacity-50");
});
```

**Sources:**

- [Using Testing Library jest-dom with Vitest](https://markus.oberlehner.net/blog/using-testing-library-jest-dom-with-vitest)
- [jest-dom GitHub Repository](https://github.com/testing-library/jest-dom)

---

## Per-File Environment Override

Override test environment for specific files:

```typescript
// @vitest-environment node
import { describe, it, expect } from "vitest";

describe("Server-side utility", () => {
  it("should run in Node environment", () => {
    expect(typeof window).toBe("undefined");
  });
});
```

**Use Cases:**

- Test server-side utilities with `node` environment
- Test browser-specific code with `happy-dom` or `jsdom`
- Mix environments within the same test suite

---

## Best Practices

### 1. Test Organization

```
src/
  components/
    ui/
      Button/
        Button.astro
        Button.test.ts       # Colocated component test
  application/
    use-cases/
      getServices.ts
      getServices.test.ts    # Colocated use-case test
  infrastructure/
    mappers/
      ServiceMapper.ts
      ServiceMapper.test.ts  # Colocated mapper test

tests/
  integration/
    repositories.test.ts     # Integration tests
```

### 2. Test Naming Convention

```typescript
// ✅ Descriptive test names
describe("ServiceMapper", () => {
  it("should map Strapi service to domain entity", () => {});
  it("should handle null optional fields", () => {});
});

// ❌ Vague test names
describe("ServiceMapper", () => {
  it("works", () => {});
  it("test 2", () => {});
});
```

### 3. Testing Priority (from AGENTS.md)

| Priority   | What to Test                        |
| ---------- | ----------------------------------- |
| **High**   | Domain entities, use-cases, mappers |
| **Medium** | Complex components with logic       |
| **Low**    | Pure presentational components      |

### 4. Use Container API for Astro Components

```typescript
// ✅ Use Container API
import { experimental_AstroContainer as AstroContainer } from "astro/container";

const container = await AstroContainer.create();
const html = await container.renderToString(Component);

// ❌ Don't manually render strings
const html = `<div>${Component()}</div>`; // Won't work
```

### 5. Mock External Dependencies

```typescript
import { vi } from "vitest";

// Mock API calls
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: [] }),
});

global.fetch = mockFetch;
```

---

## Troubleshooting

### Issue: `getViteConfig is not a function`

**Solution:** Ensure you're using Astro 4.8+ which includes `getViteConfig()`:

```bash
npm install astro@latest
```

### Issue: Tests fail with "window is not defined"

**Solution:** Set correct test environment:

```typescript
// Add to top of test file
// @vitest-environment happy-dom
```

Or set globally in `vitest.config.ts`:

```typescript
test: {
  environment: 'happy-dom',
}
```

### Issue: Coverage shows 0% for .astro files

**Solution:** Ensure `.astro` files are included in coverage config:

```typescript
coverage: {
  include: ['src/**/*.{ts,tsx,astro}'],
}
```

### Issue: jest-dom matchers not recognized

**Solution:**

1. Import in setup file:

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

2. Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@testing-library/jest-dom"]
  }
}
```

### Issue: Container API not working

**Solution:** Container API is experimental. Enable in `astro.config.mjs`:

```javascript
export default defineConfig({
  experimental: {
    container: true,
  },
});
```

---

## Advanced: Vitest Workspace (Multi-Environment)

For projects with both Astro and React components requiring different test setups:

```typescript
// vitest.workspace.ts
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vitest.config.ts",
    test: {
      name: "astro",
      environment: "node",
      include: ["src/**/*.astro.test.ts"],
    },
  },
  {
    extends: "./vitest.config.ts",
    test: {
      name: "react",
      environment: "happy-dom",
      include: ["src/**/*.tsx.test.ts"],
    },
  },
]);
```

**Sources:**

- [Vitest Workspace Configuration](https://raphberube.com/technotes/vitest-setup-astro-react/)
- [Astro + React + Vitest Config](https://dreamdevourer.com/astro-react-vitest-the-config-that-actually-works-after-ai-failed-me/)

---

## Next Steps After Setup

1. **Write first test:** Create a simple mapper test to verify setup
2. **Test coverage baseline:** Run `npm run test:coverage` to establish baseline
3. **Add tests incrementally:** Focus on high-priority code (mappers, use-cases)
4. **Integrate with CI:** Add `npm run test:run` to GitHub Actions workflow
5. **Enforce coverage thresholds:** Gradually increase coverage requirements

---

## Resources

### Official Documentation

- [Vitest](https://vitest.dev/)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
- [Astro Container API](https://docs.astro.build/en/reference/container-reference/)
- [Testing Library](https://testing-library.com/)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)

### Community Guides (2025)

- [How to set up unit tests for Astro components](https://angelika.me/2025/02/01/astro-component-unit-tests/)
- [Testing My Static Site with Vitest](https://randomgeekery.org/post/2025/01/testing-my-static-site-with-vitest/)
- [Using Testing Library jest-dom with Vitest](https://markus.oberlehner.net/blog/using-testing-library-jest-dom-with-vitest)
- [Vitest Workspace for Astro + React](https://raphberube.com/technotes/vitest-setup-astro-react/)

### Additional Tools

- [vitest-browser-astro](https://github.com/ascorbic/vitest-browser-astro) - Browser testing with Vitest
- [Vitest UI](https://vitest.dev/guide/ui) - Interactive test interface

---

**Setup Status:** ✅ Research Complete | ⏳ Implementation Pending
**Next Action:** Install packages and configure `vitest.config.ts`
