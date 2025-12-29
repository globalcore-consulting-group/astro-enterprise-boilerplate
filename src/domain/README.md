# Domain Layer

The **Domain Layer** is the innermost layer of our Clean Architecture implementation. It contains the core business logic and entities that are completely independent of any framework, UI, database, or external service.

---

## Purpose

The domain layer represents the **heart of the application** - the business concepts and rules that would exist regardless of technology choices. This layer:

- Defines business entities and their validation rules
- Contains domain-specific types and interfaces
- Implements pure business logic with no external dependencies
- Provides type safety and runtime validation using Zod

---

## Architecture Principle

> **The domain layer should have ZERO dependencies on outer layers.**

This means:

- ✅ **Can use:** TypeScript, Zod (for validation)
- ❌ **Cannot use:** Astro, React, databases, HTTP clients, external APIs
- ❌ **Cannot import from:** `application/`, `infrastructure/`, `components/`, `pages/`

---

## What Goes Here?

### 1. Entities (`entities/`)

**Entities** are core business objects with:

- Clear business meaning
- Validation rules (using Zod schemas)
- Type definitions
- Helper functions and type guards

**Example:** [Locale.ts](./entities/Locale.ts)

```typescript
// Domain entity with Zod validation
export const LocaleSchema = z.enum(["en", "de"]);
export type Locale = z.infer<typeof LocaleSchema>;

// Business constants
export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: Locale[] = ["en", "de"];

// Type guards
export function isValidLocale(value: unknown): value is Locale {
  return LocaleSchema.safeParse(value).success;
}
```

### 2. Value Objects

**Value Objects** are immutable objects defined by their values (not identity):

- Email, URL, Money, DateRange
- Validation in constructor
- Immutable by design
- Equality based on value, not reference

**Example (future):**

```typescript
// src/domain/value-objects/Email.ts
export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    const schema = z.string().email();
    const result = schema.safeParse(value);

    if (!result.success) {
      throw new Error(`Invalid email: ${value}`);
    }

    return new Email(result.data);
  }

  toString(): string {
    return this.value;
  }
}
```

### 3. Business Rules

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

## Current Entities

### Locale Entity

**File:** [entities/Locale.ts](./entities/Locale.ts)

**Purpose:** Defines supported languages and locale validation

**Features:**

- Zod enum schema for compile-time and runtime safety
- Type guard: `isValidLocale()`
- Helper: `getLocaleOrDefault()` with fallback
- Constants: `DEFAULT_LOCALE`, `SUPPORTED_LOCALES`

**Usage:**

```typescript
import { Locale, isValidLocale, getLocaleOrDefault } from "@/domain/entities/Locale";

// Type-safe locale
const locale: Locale = "en";

// Runtime validation
if (isValidLocale(userInput)) {
  // userInput is now typed as Locale
}

// Safe fallback
const safeLocale = getLocaleOrDefault(Astro.params.lang);
```

---

## Guidelines for New Entities

### 1. Use Zod for Validation

Always define a Zod schema for runtime validation:

```typescript
import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  category: z.enum(["consulting", "development", "training"]),
  icon: z.string().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;
```

### 2. Export Helper Functions

Provide convenience functions for common operations:

```typescript
export function isService(value: unknown): value is Service {
  return ServiceSchema.safeParse(value).success;
}

export function validateService(value: unknown): Service {
  return ServiceSchema.parse(value); // Throws if invalid
}
```

### 3. Keep It Pure

Domain functions should be:

- **Pure** - same input always produces same output
- **Side-effect free** - no API calls, no mutations
- **Testable** - easy to unit test without mocks

```typescript
// ✅ GOOD: Pure function
export function calculateServicePrice(service: Service, hours: number): number {
  return service.hourlyRate * hours;
}

// ❌ BAD: Side effects, external dependencies
export async function calculateServicePrice(serviceId: string): Promise<number> {
  const service = await fetch(`/api/services/${serviceId}`); // NO!
  return service.hourlyRate * 10;
}
```

### 4. Framework Agnostic

The domain layer should work in **any JavaScript environment**:

- Node.js server
- Browser
- Edge runtime
- Tests

Avoid Astro-specific APIs, React hooks, or browser APIs.

---

## File Structure

```
src/domain/
├── README.md (this file)
├── entities/
│   ├── Locale.ts           ← Current: Locale entity
│   ├── Service.ts          ← Future: Service entity
│   ├── Project.ts          ← Future: Project entity
│   └── index.ts            ← Barrel export
├── value-objects/          ← Future: Email, URL, Money...
│   └── .gitkeep
└── rules/                  ← Future: Business logic functions
    └── .gitkeep
```

---

## Testing Domain Entities

Domain entities are the **easiest to test** because they have no dependencies:

```typescript
// src/domain/entities/Locale.test.ts
import { describe, it, expect } from "vitest";
import { isValidLocale, getLocaleOrDefault, DEFAULT_LOCALE } from "./Locale";

describe("Locale Entity", () => {
  it("validates supported locales", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("de")).toBe(true);
    expect(isValidLocale("fr")).toBe(false);
  });

  it("falls back to default locale for invalid input", () => {
    expect(getLocaleOrDefault("invalid")).toBe(DEFAULT_LOCALE);
    expect(getLocaleOrDefault(null)).toBe(DEFAULT_LOCALE);
    expect(getLocaleOrDefault(undefined)).toBe(DEFAULT_LOCALE);
  });
});
```

**Testing principles:**

- No mocks needed - pure functions
- Fast execution - no I/O
- High coverage target (>80%)
- Test edge cases and validation

---

## When to Add New Entities

Add a new entity when you have a **core business concept** that:

1. Has clear validation rules
2. Represents business domain knowledge
3. Will be used across multiple layers
4. Needs type safety and runtime validation

**Examples:**

- ✅ `Service` - Core business offering
- ✅ `Project` - Portfolio item
- ✅ `Testimonial` - Customer feedback
- ✅ `ContactMessage` - Contact form submission
- ❌ `ButtonProps` - UI-specific, belongs in components
- ❌ `ApiResponse` - Infrastructure concern

---

## Resources

**Clean Architecture:**

- [The Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture on Frontend](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)

**Zod Documentation:**

- [Zod](https://zod.dev)
- [Zod Schema Composition](https://zod.dev/?id=composition)

**TypeScript:**

- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

---

## Summary

The domain layer is the **foundation** of our application:

- **Pure business logic** - No framework dependencies
- **Type-safe** - TypeScript + Zod validation
- **Testable** - Easy to unit test
- **Reusable** - Can be used anywhere in the codebase
- **Stable** - Changes rarely, mostly additions

**Key Rule:** If it's a core business concept that exists independent of technology, it belongs in the domain layer.
