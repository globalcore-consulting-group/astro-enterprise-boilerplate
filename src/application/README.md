# Application Layer

The **Application Layer** contains the **use-cases** and **ports** (interfaces) that orchestrate the application's business logic. This layer coordinates between the domain layer and the infrastructure layer.

---

## Purpose

The application layer:

- **Defines use-cases** - Application-specific business rules (e.g., "Get all services for a locale")
- **Declares ports** - Interfaces that infrastructure must implement (Repository pattern)
- **Orchestrates domain entities** - Coordinates domain objects to fulfill use-cases
- **Stays framework-agnostic** - No Astro, React, or UI dependencies

---

## Architecture Principle

> **The application layer depends on the domain layer but NOT on the infrastructure layer.**

**Dependency flow:**

```
Infrastructure → Application → Domain
(Adapters)       (Use-cases)    (Entities)
```

**This layer:**

- ✅ **Can import:** `domain/entities`, `domain/value-objects`
- ✅ **Can define:** Interfaces (ports) for repositories
- ❌ **Cannot import:** `infrastructure/`, `components/`, `pages/`
- ❌ **Cannot use:** Astro APIs, database clients, HTTP libraries

---

## What Goes Here?

### 1. Use-Cases (`use-cases/`)

**Use-cases** implement application-specific business logic:

- One use-case per file
- Single Responsibility Principle
- Coordinates domain entities and repositories
- Returns domain entities or primitives

**Example (future):**

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
 *
 * Use-case: As a user, I want to see services in my language
 */
export async function getServices(repository: ServiceRepository, params: GetServicesParams): Promise<Service[]> {
  const { locale, category } = params;

  // Fetch all services for the locale
  const services = await repository.findAll(locale);

  // Filter by category if provided
  if (!category) {
    return services;
  }

  return services.filter((service) => service.category === category);
}
```

**Usage in pages:**

```astro
---
// src/pages/services.astro
import { getServices } from "@/application/use-cases/getServices";
import { ContentCollectionServiceRepository } from "@/infrastructure/repositories/ContentCollectionServiceRepository";

const repository = new ContentCollectionServiceRepository();
const services = await getServices(repository, {
  locale: Astro.currentLocale,
  category: Astro.url.searchParams.get("category") ?? undefined,
});
---

<ServicesList services={services} />
```

### 2. Ports (`ports/`)

**Ports** are **interfaces** that define contracts for external dependencies:

- Repository interfaces
- API client interfaces
- External service interfaces

These are implemented by the **infrastructure layer**.

**Example (future):**

```typescript
// src/application/ports/ServiceRepository.ts
import type { Service } from "@/domain/entities/Service";

/**
 * Port (interface) for service data access
 *
 * Infrastructure layer provides concrete implementations:
 * - ContentCollectionServiceRepository (current)
 * - StrapiServiceRepository (future)
 */
export interface ServiceRepository {
  /**
   * Find all services for a given locale
   */
  findAll(locale: string): Promise<Service[]>;

  /**
   * Find a single service by slug
   */
  findBySlug(locale: string, slug: string): Promise<Service | null>;
}
```

---

## Current Status

The application layer is currently **scaffolded** but not yet in use. Content is fetched directly in pages using Astro's Content Collections API.

**When to add use-cases:**

We'll add use-cases when:

1. Pages have complex data fetching logic
2. Business rules need to be tested independently
3. We want to swap data sources (JSON → Strapi)

**Current approach (acceptable for MVP):**

```astro
---
// src/pages/index.astro
import { getEntry } from "astro:content";

const heroContent = await getEntry("hero", `${locale}/home`);
---
```

**Future with use-cases:**

```astro
---
// src/pages/index.astro
import { getHeroContent } from "@/application/use-cases/getHeroContent";
import { ContentCollectionRepository } from "@/infrastructure/repositories/ContentCollectionRepository";

const repository = new ContentCollectionRepository();
const heroContent = await getHeroContent(repository, { locale });
---
```

---

## When to Add Use-Cases

Add a use-case when:

1. **Business logic exists**
   - Filtering, sorting, calculations
   - Complex data transformations
   - Multi-step operations

2. **Testability matters**
   - You want to unit test the logic
   - Mocking infrastructure is needed

3. **Reusability across pages**
   - Multiple pages need the same logic
   - API endpoints + pages share logic

4. **Future migration planned**
   - You'll switch from Content Collections to Strapi
   - Repository abstraction helps migration

**Don't add use-cases for:**

- ❌ Simple, one-line data fetches
- ❌ Pure UI state management
- ❌ One-off operations with no business logic

---

## Use-Case Patterns

### Pattern 1: Simple Query

```typescript
// src/application/use-cases/getServiceBySlug.ts
import type { Service } from "@/domain/entities/Service";
import type { ServiceRepository } from "@/application/ports/ServiceRepository";

export async function getServiceBySlug(
  repository: ServiceRepository,
  slug: string,
  locale: string
): Promise<Service | null> {
  return repository.findBySlug(locale, slug);
}
```

### Pattern 2: Business Logic

```typescript
// src/application/use-cases/getFeaturedServices.ts
import type { Service } from "@/domain/entities/Service";
import type { ServiceRepository } from "@/application/ports/ServiceRepository";

/**
 * Get top 3 services by priority for homepage
 */
export async function getFeaturedServices(repository: ServiceRepository, locale: string): Promise<Service[]> {
  const services = await repository.findAll(locale);

  // Business logic: Filter and sort
  return services
    .filter((service) => service.isFeatured)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
}
```

### Pattern 3: Multi-Repository Coordination

```typescript
// src/application/use-cases/getProjectWithTestimonials.ts
import type { Project } from "@/domain/entities/Project";
import type { Testimonial } from "@/domain/entities/Testimonial";
import type { ProjectRepository } from "@/application/ports/ProjectRepository";
import type { TestimonialRepository } from "@/application/ports/TestimonialRepository";

export async function getProjectWithTestimonials(
  projectRepo: ProjectRepository,
  testimonialRepo: TestimonialRepository,
  slug: string,
  locale: string
): Promise<{ project: Project; testimonials: Testimonial[] } | null> {
  const project = await projectRepo.findBySlug(locale, slug);

  if (!project) {
    return null;
  }

  const testimonials = await testimonialRepo.findByProjectId(project.id);

  return { project, testimonials };
}
```

---

## Dependency Injection

Use-cases receive dependencies (repositories) as parameters - **dependency injection**:

```typescript
// ✅ GOOD: Dependencies injected
export async function getServices(
  repository: ServiceRepository, // ← Injected
  params: GetServicesParams
): Promise<Service[]> {
  return repository.findAll(params.locale);
}

// ❌ BAD: Hard-coded dependency
import { getCollection } from "astro:content";

export async function getServices(params: GetServicesParams): Promise<Service[]> {
  const services = await getCollection("services"); // ← Tight coupling
  return services;
}
```

**Benefits:**

- Testable - inject mocks in tests
- Swappable - switch implementations easily
- Clear dependencies - explicit in function signature

---

## Testing Use-Cases

Use-cases should be tested with **mock repositories**:

```typescript
// src/application/use-cases/getServices.test.ts
import { describe, it, expect, vi } from "vitest";
import { getServices } from "./getServices";
import type { ServiceRepository } from "@/application/ports/ServiceRepository";

describe("getServices", () => {
  it("returns all services when no category filter", async () => {
    // Mock repository
    const mockRepository: ServiceRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: "1", category: "consulting", title: "Service 1" },
        { id: "2", category: "development", title: "Service 2" },
      ]),
      findBySlug: vi.fn(),
    };

    const result = await getServices(mockRepository, { locale: "en" });

    expect(result).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalledWith("en");
  });

  it("filters services by category", async () => {
    const mockRepository: ServiceRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: "1", category: "consulting", title: "Service 1" },
        { id: "2", category: "development", title: "Service 2" },
      ]),
      findBySlug: vi.fn(),
    };

    const result = await getServices(mockRepository, {
      locale: "en",
      category: "consulting",
    });

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("consulting");
  });
});
```

---

## File Structure

```
src/application/
├── README.md (this file)
├── use-cases/
│   ├── getServices.ts          ← Future: Fetch services
│   ├── getServiceBySlug.ts     ← Future: Single service
│   ├── getFeaturedServices.ts  ← Future: Homepage services
│   ├── getHeroContent.ts       ← Future: Hero section data
│   └── index.ts                ← Barrel export
└── ports/
    ├── ServiceRepository.ts    ← Future: Service data port
    ├── ProjectRepository.ts    ← Future: Project data port
    ├── HeroRepository.ts       ← Future: Hero content port
    └── index.ts                ← Barrel export
```

---

## Integration with Astro Pages

Pages act as **controllers** - they orchestrate use-cases and pass data to components:

```astro
---
// src/pages/services.astro
import Layout from "@/layouts/Layout.astro";
import ServicesList from "@/components/sections/ServicesList.astro";
import { getServices } from "@/application/use-cases/getServices";
import { ContentCollectionServiceRepository } from "@/infrastructure/repositories/ContentCollectionServiceRepository";

const locale = Astro.currentLocale as "en" | "de";

// Instantiate repository
const repository = new ContentCollectionServiceRepository();

// Execute use-case
const services = await getServices(repository, { locale });
---

<Layout title="Services">
  <main>
    <ServicesList services={services} />
  </main>
</Layout>
```

**Key principles:**

- Pages have **no business logic** - only orchestration
- Use-cases are **reusable** - can be called from API routes too
- Components are **presentational** - receive data via props

---

## Migration Strategy

When we migrate from Content Collections to Strapi:

1. **Create new repository implementation:**

   ```typescript
   // src/infrastructure/repositories/StrapiServiceRepository.ts
   export class StrapiServiceRepository implements ServiceRepository {
     async findAll(locale: string): Promise<Service[]> {
       const response = await fetch(`${STRAPI_URL}/services?locale=${locale}`);
       const data = await response.json();
       return toServices(data.data); // Mapper
     }
   }
   ```

2. **Swap in pages (ONE line change):**

   ```diff
   ---
   - import { ContentCollectionServiceRepository } from "@/infrastructure/repositories/ContentCollectionServiceRepository";
   + import { StrapiServiceRepository } from "@/infrastructure/repositories/StrapiServiceRepository";

   - const repository = new ContentCollectionServiceRepository();
   + const repository = new StrapiServiceRepository();

   const services = await getServices(repository, { locale });
   ---
   ```

3. **Use-cases and components unchanged** - zero changes needed!

---

## Resources

**Clean Architecture:**

- [Hexagonal Architecture (Ports & Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

**Testing:**

- [Vitest Mocking](https://vitest.dev/guide/mocking.html)
- [Test Doubles](https://martinfowler.com/bliki/TestDouble.html)

---

## Summary

The application layer is the **orchestration layer**:

- **Use-cases** - Application-specific business logic
- **Ports** - Interfaces for infrastructure dependencies
- **Dependency Injection** - Repositories passed as parameters
- **Framework-agnostic** - Can be tested without Astro
- **Migration-friendly** - Swap implementations easily

**Key Rule:** If it coordinates domain entities and infrastructure to fulfill a user goal, it belongs in the application layer.
