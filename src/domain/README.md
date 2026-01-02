# Domain Layer

The **Domain Layer** is the innermost layer of our Clean Architecture implementation. It contains the core business logic and value objects that are completely independent of any framework, UI, database, or external service.

---

## Purpose

The domain layer represents the **heart of the application** - the business concepts and rules that would exist regardless of technology choices. This layer:

- Defines value objects and business types
- Contains domain-specific validation logic
- Implements pure business logic with **ZERO external dependencies**
- Provides type safety with TypeScript and runtime validation with lightweight type guards

---

## Architecture Principle

> **The domain layer has ZERO dependencies - not even npm packages.**

This means:

- ✅ **Can use:** Pure TypeScript, native JavaScript APIs (Set, Map, RegExp, URL)
- ❌ **Cannot use:** Zod, Astro, React, databases, HTTP clients, external APIs, **any npm packages**
- ❌ **Cannot import from:** `application/`, `infrastructure/`, `components/`, `pages/`

**Why zero dependencies?**

1. **Maximum portability** - Domain logic works in any JavaScript runtime
2. **No version conflicts** - Never breaks due to dependency updates
3. **Lightweight** - No bundle bloat from validation libraries
4. **Fast** - Runtime guards are simple and performant

**Where does validation happen?**

- **Domain layer:** Defines validity through lightweight type guards (e.g., `isValidLocale()`)
- **Boundary layer (mappers/adapters):** Enforces validation on external data using schema tools if needed
- **Principle:** Domain defines "what is valid" with zero dependencies; boundaries normalize/validate external data and decide fail-fast vs fallback strategies

---

## What Goes Here?

### 1. Value Objects (`value-objects/`)

**Value Objects** are immutable types defined by their values (not identity):

- Simple types representing domain concepts (Locale, Slug, Url, Email)
- Zero dependencies - pure TypeScript with native APIs
- Type guards for runtime validation
- Immutable by design
- Equality based on value, not reference

**Pattern:**

```typescript
// src/domain/value-objects/Email/Email.ts
export type Email = string;

// Simple regex for basic validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is Email {
  return typeof value === "string" && EMAIL_RE.test(value);
}

export function assertEmail(value: unknown, message = "Invalid email"): Email {
  if (!isValidEmail(value)) throw new Error(message);
  return value;
}
```

**Note:** Domain validation is intentionally simple. For complex email validation, use schema libraries at boundaries (infrastructure/mappers).

### 2. Entities (`entities/`) - Future

**Entities** are business objects with **identity and lifecycle**:

- Have unique IDs (not defined by their values)
- Can have mutable state
- Represent core business concepts with behavior
- Maintain invariants through methods

**When to use:**

- Object has a unique identifier
- Object's state changes over time
- Identity matters more than attributes
- Has business rules that must be enforced

**Example (future):**

```typescript
// src/domain/entities/Article.ts
export type ArticleId = string;
export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: ArticleId;
  title: string;
  slug: Slug; // Value object
  status: ArticleStatus;
  publishedAt: Date | null;
  updatedAt: Date;
}

// Type guard
export function isArticle(value: unknown): value is Article {
  return typeof value === "object" && value !== null && "id" in value && "title" in value && "status" in value;
}
```

**Key difference:** Entities have identity (ID), value objects don't.

### 3. Business Rules (future)

Pure functions that encapsulate business logic:

```typescript
// src/domain/rules/pricing.ts
export function calculateDiscount(price: number, customerType: CustomerType): number {
  if (customerType === "enterprise") {
    return price * 0.2; // 20% discount
  }
  if (customerType === "standard") {
    return price * 0.1; // 10% discount
  }
  return 0;
}
```

---

## What Doesn't Go Here?

❌ **Data fetching** → Goes in `infrastructure/repositories/`
❌ **API calls** → Goes in `infrastructure/`
❌ **UI components** → Goes in `components/`
❌ **Page orchestration** → Goes in `pages/`
❌ **Use-case logic** → Goes in `application/use-cases/`

---

## Current Value Objects

### Locale

**File:** [value-objects/Locale/Locale.ts](./value-objects/Locale/Locale.ts)

**Purpose:** Defines supported languages and locale validation

**Features:**

- Zero dependencies, pure TypeScript
- Set-based type guard for O(1) lookup performance
- Type guard: `isValidLocale()`
- Helper: `getLocaleOrDefault()` with fallback
- Constants: `DEFAULT_LOCALE`, `SUPPORTED_LOCALES`

**Implementation:**

```typescript
/** Runtime type guard with Set for O(1) lookup */
export const SUPPORTED_LOCALES = ["en", "de"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

const SUPPORTED_LOCALE_SET: ReadonlySet<string> = new Set(SUPPORTED_LOCALES);

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && SUPPORTED_LOCALE_SET.has(value);
}

export function getLocaleOrDefault(value: unknown): Locale {
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}
```

**Usage:**

```typescript
import { Locale, isValidLocale, getLocaleOrDefault } from "@/domain";

// Type-safe locale
const locale: Locale = "en";

// Runtime validation
if (isValidLocale(userInput)) {
  // userInput is now typed as Locale
}

// Safe fallback
const safeLocale = getLocaleOrDefault(Astro.params.lang);
```

### Slug

**File:** [value-objects/Slug/Slug.ts](./value-objects/Slug/Slug.ts)

**Purpose:** URL-safe slug validation and normalization

**Features:**

- Validates slugs: lowercase, digits, hyphens only
- Normalizes strings into slugs with `toSlug()`
- Fail-fast assertion with `assertSlug()` for boundaries

**Implementation:**

```typescript
export type Slug = string;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(value: unknown): value is Slug {
  return typeof value === "string" && SLUG_RE.test(value);
}

export function toSlug(value: string): Slug {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function assertSlug(value: unknown, errorMessage = "Invalid slug"): Slug {
  if (!isValidSlug(value)) throw new Error(errorMessage);
  return value;
}
```

**Usage:**

```typescript
import { toSlug, isValidSlug, assertSlug } from "@/domain";

// Normalize user input
const slug = toSlug("How We Work"); // "how-we-work"

// Validate existing slug
if (isValidSlug(params.slug)) {
  // Safe to use
}

// Fail-fast at boundaries (mappers)
const validSlug = assertSlug(externalData.slug); // throws if invalid
```

### Url

**File:** [value-objects/Url/Url.ts](./value-objects/Url/Url.ts)

**Purpose:** Safe URL validation (rejects dangerous schemes)

**Features:**

- Validates internal paths (`/about`, `/services`) - single slash only
- Validates http/https absolute URLs only
- **Security:** Rejects `javascript:`, `data:`, `vbscript:` to prevent XSS
- **Security:** Rejects protocol-relative URLs (`//example.com`) to prevent ambiguity
- **Security:** Rejects URLs with whitespace
- Fail-fast assertion with `assertUrl()` for boundaries

**Implementation:**

```typescript
export type Url = string;

const INTERNAL_PATH_RE = /^\/(?!\/).*/; // starts with single "/" (not "//")
const HAS_WHITESPACE_RE = /\s/;

export function isInternalPath(value: unknown): value is Url {
  return typeof value === "string" && INTERNAL_PATH_RE.test(value) && !HAS_WHITESPACE_RE.test(value);
}

export function isHttpUrl(value: unknown): value is Url {
  if (typeof value !== "string" || HAS_WHITESPACE_RE.test(value)) return false;

  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidUrl(value: unknown): value is Url {
  return isInternalPath(value) || isHttpUrl(value);
}

export function assertUrl(value: unknown, errorMessage = "Invalid URL"): Url {
  if (!isValidUrl(value)) throw new Error(errorMessage);
  return value;
}
```

**Usage:**

```typescript
import { isValidUrl, isInternalPath, assertUrl } from "@/domain";

// Validate CTA hrefs from content
if (isValidUrl(cta.href)) {
  // Safe to use in links
}

// Check if internal vs external
if (isInternalPath(url)) {
  // Use Astro routing
} else {
  // External link, add rel="noopener"
}

// Fail-fast at boundaries (mappers)
const validUrl = assertUrl(externalData.url); // throws if invalid or dangerous
```

---

## Guidelines for New Value Objects

### 1. Zero Dependencies - Use Native APIs

Always use pure TypeScript and native JavaScript APIs:

```typescript
// ✅ GOOD: Native Set for O(1) lookup
const VALID_VALUES = new Set(["value1", "value2"]);

export function isValid(value: unknown): value is MyType {
  return typeof value === "string" && VALID_VALUES.has(value);
}

// ✅ GOOD: Native RegExp for pattern matching
const PATTERN = /^[a-z0-9-]+$/;

export function isValidFormat(value: unknown): value is MyType {
  return typeof value === "string" && PATTERN.test(value);
}

// ✅ GOOD: Native URL API for validation
export function isValidUrl(value: unknown): value is Url {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

// ❌ BAD: External dependencies
import { z } from "zod"; // NO! Domain layer has zero dependencies
```

### 2. Provide Type Guards and Assertions

Export helper functions for runtime validation:

```typescript
// Type guard for safe narrowing
export function isValidType(value: unknown): value is MyType {
  return typeof value === "string" && /* validation logic */;
}

// Assertion for fail-fast at boundaries (mappers/adapters)
export function assertType(value: unknown, message = "Invalid type"): MyType {
  if (!isValidType(value)) throw new Error(message);
  return value;
}
```

### 3. Keep It Pure

Domain functions should be:

- **Pure** - same input always produces same output
- **Side-effect free** - no API calls, no mutations, no external dependencies
- **Testable** - easy to unit test without mocks

```typescript
// ✅ GOOD: Pure function, zero dependencies
export function toSlug(value: string): Slug {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

// ❌ BAD: Side effects, external dependencies
export async function toSlug(value: string): Promise<Slug> {
  const response = await fetch("/api/slugify"); // NO!
  return response.text();
}
```

### 4. Framework Agnostic

The domain layer should work in **any JavaScript environment**:

- Node.js server
- Browser
- Deno
- Bun
- Edge runtime
- Tests

Avoid framework-specific APIs:

- ❌ Astro-specific APIs
- ❌ React hooks
- ❌ Browser-only APIs (without polyfill strategy)
- ❌ Node.js-only APIs (without runtime checks)

---

## File Structure

**Modular pattern:** Each value object in its own folder with colocated tests and barrel exports.

```
src/domain/
├── README.md (this file)
├── index.ts                         ← Root barrel export
├── value-objects/
│   ├── index.ts                     ← Value objects barrel export
│   ├── Locale/
│   │   ├── Locale.ts                ← ✅ Implementation
│   │   ├── Locale.test.ts           ← ✅ Tests (colocated)
│   │   └── index.ts                 ← Barrel export
│   ├── Slug/
│   │   ├── Slug.ts                  ← ✅ Implementation
│   │   ├── Slug.test.ts             ← ✅ Tests (colocated)
│   │   └── index.ts                 ← Barrel export
│   ├── Url/
│   │   ├── Url.ts                   ← ✅ Implementation
│   │   ├── Url.test.ts              ← ✅ Tests (colocated)
│   │   └── index.ts                 ← Barrel export
│   └── Email/                       ← Future: Email value object
│       └── Email.ts
├── entities/                        ← Future: Business entities
│   ├── Service.ts                   ← Future: Service entity
│   ├── Project.ts                   ← Future: Project entity
│   └── index.ts
└── rules/                           ← Future: Business logic functions
    └── .gitkeep
```

**Import pattern:**

```typescript
// ✅ CORRECT: Import from domain public API
import { Locale, isValidLocale, Slug, toSlug, Url, isValidUrl } from "@/domain";

// ❌ WRONG: Don't import from subfolders
import { Locale } from "@/domain/value-objects/Locale/Locale";
```

**Why use the public API?**

- **Encapsulation** - Internal structure can change without breaking consumers
- **Stable imports** - Refactoring value objects doesn't affect import statements
- **Clean dependency graph** - Single entry point for domain concepts
- **Easier to mock** - Testing can stub entire domain module if needed

---

## Testing Value Objects

Value objects are the **easiest to test** because they have zero dependencies:

```typescript
// src/domain/value-objects/Locale/Locale.test.ts
import { describe, it, expect } from "vitest";
import { isValidLocale, getLocaleOrDefault, DEFAULT_LOCALE } from "./Locale";

describe("Locale value object", () => {
  it("validates supported locales", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("de")).toBe(true);
    expect(isValidLocale("fr")).toBe(false);
    expect(isValidLocale(null)).toBe(false);
    expect(isValidLocale(undefined)).toBe(false);
  });

  it("falls back to default locale for invalid input", () => {
    expect(getLocaleOrDefault("invalid")).toBe(DEFAULT_LOCALE);
    expect(getLocaleOrDefault(null)).toBe(DEFAULT_LOCALE);
    expect(getLocaleOrDefault(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("returns valid locale as-is", () => {
    expect(getLocaleOrDefault("en")).toBe("en");
    expect(getLocaleOrDefault("de")).toBe("de");
  });
});
```

**Testing principles:**

- **Zero dependencies** - No mocks, no setup, pure functions
- **Fast execution** - No I/O, no async
- **High coverage target** - >90% for value objects (they're simple!)
- **Test edge cases** - null, undefined, invalid types, empty strings
- **Colocated tests** - Tests live next to implementation for easy discovery

**Current test coverage:**

- ✅ Locale: 3 tests (validation, fallback, valid passthrough)
- ✅ Slug: 2 tests (validation patterns, normalization edge cases)
- ✅ Url: 3 tests (internal paths, http/https, security)

---

## When to Add New Value Objects

Add a new value object when you have a **domain-specific type** that:

1. Needs validation beyond TypeScript's type system
2. Has a specific format or pattern (e.g., email, phone, currency)
3. Should reject invalid values at runtime
4. Is used across multiple layers
5. Represents a domain concept, not infrastructure

**Examples:**

**Value Objects (✅ Belongs in domain layer):**

- ✅ `Email` - Valid email format validation
- ✅ `PhoneNumber` - Valid phone format validation
- ✅ `Money` - Currency + amount with precision rules
- ✅ `DateRange` - Valid date range validation
- ✅ `Locale` - Supported language codes
- ✅ `Slug` - URL-safe identifier
- ✅ `Url` - Safe URL (rejects dangerous schemes)

**NOT Value Objects (❌ Doesn't belong in domain):**

- ❌ `ButtonProps` - UI-specific, belongs in components
- ❌ `ApiResponse` - Infrastructure concern
- ❌ `RouteConfig` - Framework-specific

## When to Add Entities

Add an entity when you have a **business object with identity**:

1. Has a unique ID
2. Has mutable state
3. Represents a core business concept
4. Has lifecycle and behavior

**Examples:**

- ✅ `Service` - Core business offering (has ID, can be updated)
- ✅ `Project` - Portfolio item (has ID, lifecycle)
- ✅ `Testimonial` - Customer feedback (has ID, approval status)
- ✅ `ContactMessage` - Contact form submission (has ID, status)

---

## Resources

**Clean Architecture:**

- [The Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture on Frontend](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)
- [Domain-Driven Design Distilled](https://www.amazon.com/Domain-Driven-Design-Distilled-Vaughn-Vernon/dp/0134434420)

**Value Objects Pattern:**

- [Value Objects (Martin Fowler)](https://martinfowler.com/bliki/ValueObject.html)
- [Implementing Value Objects](https://enterprisecraftsmanship.com/posts/value-objects-explained/)

**TypeScript:**

- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [Const Assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

---

## Summary

The domain layer is the **foundation** of our application:

- **Zero dependencies** - Pure TypeScript, no npm packages
- **Pure business logic** - No framework coupling
- **Type-safe** - TypeScript + runtime type guards
- **Testable** - Easy to unit test without mocks
- **Reusable** - Can be used anywhere in the codebase
- **Portable** - Works in any JavaScript runtime
- **Stable** - Changes rarely, mostly additions
- **Secure** - Value objects reject dangerous inputs (XSS prevention)

**Key Rule:** If it's a core business concept that exists independent of technology choices, it belongs in the domain layer.

**Philosophy:** Keep the domain layer lightweight, pure, and dependency-free. Heavy validation with tools like Zod happens at boundaries (mappers/adapters), not in the domain core.
