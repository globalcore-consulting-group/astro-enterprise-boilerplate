# Infrastructure Layer

The **Infrastructure Layer** is the outermost layer of our Clean Architecture. It contains all the **adapters** that connect the application to external systems - databases, APIs, file systems, and frameworks.

---

## Purpose

The infrastructure layer:

- **Implements ports** - Concrete implementations of repository interfaces
- **Handles external I/O** - API calls, database queries, file operations
- **Maps external data** - Transforms raw data to domain entities
- **Adapts frameworks** - Integrates with Astro, Strapi, external services

---

## Architecture Principle

> **The infrastructure layer depends on ALL other layers but NO other layer depends on infrastructure.**

**Dependency flow:**

```
Infrastructure → Application → Domain
(Implements)     (Defines)      (Uses)
```

**This layer:**

- ✅ **Can import:** `application/ports`, `domain/entities`
- ✅ **Can use:** Astro APIs, `fetch`, database clients, external libraries
- ✅ **Implements:** Repository interfaces defined in `application/ports`
- ⚠️ **Should NOT be imported by:** `application/`, `domain/`

---

## What Goes Here?

### 1. Repositories (`repositories/`)

**Repositories** implement data access logic defined by port interfaces:

- Fetch data from external sources
- Use mappers to transform to domain entities
- Handle errors and edge cases
- One repository per entity/collection

**Example (future):**

```typescript
// src/infrastructure/repositories/ContentCollectionServiceRepository.ts
import { getCollection } from "astro:content";
import type { ServiceRepository } from "@/application/ports/ServiceRepository";
import type { Service } from "@/domain/entities/Service";
import { toService } from "@/infrastructure/mappers/ServiceMapper";

/**
 * Repository implementation using Astro Content Collections
 */
export class ContentCollectionServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    const entries = await getCollection("services", (entry) => {
      return entry.id.startsWith(`${locale}/`);
    });

    return entries.map((entry) => toService(entry));
  }

  async findBySlug(locale: string, slug: string): Promise<Service | null> {
    const entries = await getCollection("services", (entry) => {
      return entry.id === `${locale}/${slug}`;
    });

    if (entries.length === 0) {
      return null;
    }

    return toService(entries[0]);
  }
}
```

**Future Strapi implementation:**

```typescript
// src/infrastructure/repositories/StrapiServiceRepository.ts
import type { ServiceRepository } from "@/application/ports/ServiceRepository";
import type { Service } from "@/domain/entities/Service";
import { toServices } from "@/infrastructure/mappers/StrapiServiceMapper";

const STRAPI_URL = import.meta.env.STRAPI_URL;

export class StrapiServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    const response = await fetch(`${STRAPI_URL}/api/services?locale=${locale}&populate=*`);

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }

    const json = await response.json();
    return toServices(json.data);
  }

  async findBySlug(locale: string, slug: string): Promise<Service | null> {
    const response = await fetch(`${STRAPI_URL}/api/services?filters[slug][$eq]=${slug}&locale=${locale}&populate=*`);

    if (!response.ok) {
      return null;
    }

    const json = await response.json();

    if (json.data.length === 0) {
      return null;
    }

    return toServices(json.data)[0];
  }
}
```

### 2. Mappers (`mappers/`)

**Mappers** transform external data formats to domain entities:

- Handle different API response structures
- Normalize data inconsistencies
- Apply default values
- Validate with Zod schemas

**Example (future):**

```typescript
// src/infrastructure/mappers/StrapiServiceMapper.ts
import type { Service } from "@/domain/entities/Service";
import { ServiceSchema } from "@/domain/entities/Service";

interface StrapiService {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    category: string;
    icon?: string;
    priority: number;
    isFeatured: boolean;
  };
}

/**
 * Maps Strapi API response to domain Service entity
 */
export function toService(raw: StrapiService): Service {
  const { id, attributes } = raw;

  // Map Strapi structure to domain entity
  const mapped = {
    id: id.toString(),
    title: attributes.title,
    description: attributes.description,
    slug: attributes.slug,
    category: attributes.category,
    icon: attributes.icon ?? null,
    priority: attributes.priority,
    isFeatured: attributes.isFeatured,
  };

  // Validate with Zod schema
  return ServiceSchema.parse(mapped);
}

/**
 * Maps array of Strapi services
 */
export function toServices(raw: StrapiService[]): Service[] {
  return raw.map(toService);
}
```

**Content Collection mapper:**

```typescript
// src/infrastructure/mappers/ContentCollectionServiceMapper.ts
import type { CollectionEntry } from "astro:content";
import type { Service } from "@/domain/entities/Service";
import { ServiceSchema } from "@/domain/entities/Service";

/**
 * Maps Astro Content Collection entry to domain Service entity
 */
export function toService(entry: CollectionEntry<"services">): Service {
  const [locale, slug] = entry.id.split("/");

  const mapped = {
    id: entry.id,
    slug: slug,
    locale: locale,
    title: entry.data.title,
    description: entry.data.description,
    category: entry.data.category,
    icon: entry.data.icon ?? null,
    priority: entry.data.priority ?? 0,
    isFeatured: entry.data.isFeatured ?? false,
  };

  return ServiceSchema.parse(mapped);
}
```

---

## Current Status

The infrastructure layer is currently **scaffolded** but not yet in use.

**Current approach (direct in pages):**

```astro
---
import { getEntry } from "astro:content";

const heroContent = await getEntry("hero", `${locale}/home`);
---
```

**Future approach (with repositories):**

```astro
---
import { getHeroContent } from "@/application/use-cases/getHeroContent";
import { ContentCollectionHeroRepository } from "@/infrastructure/repositories/ContentCollectionHeroRepository";

const repository = new ContentCollectionHeroRepository();
const heroContent = await getHeroContent(repository, { locale });
---
```

---

## When to Add Repositories

Add repositories when:

1. **Abstraction provides value:**
   - You'll switch data sources (Content Collections → Strapi)
   - Multiple pages fetch the same data
   - Business logic needs testing independently

2. **Complexity justifies it:**
   - Data fetching has error handling
   - Multiple collections/endpoints need coordination
   - Caching or performance optimizations needed

**Don't add repositories for:**

- ❌ One-off, simple data fetches
- ❌ Static content that never changes source
- ❌ Over-engineering simple use-cases

---

## Repository Patterns

### Pattern 1: Collection-based Repository

```typescript
// One repository per Content Collection
export class ContentCollectionProjectRepository implements ProjectRepository {
  async findAll(locale: string): Promise<Project[]> {
    const entries = await getCollection("projects", (entry) => entry.id.startsWith(`${locale}/`));
    return entries.map(toProject);
  }

  async findBySlug(locale: string, slug: string): Promise<Project | null> {
    try {
      const entry = await getEntry("projects", `${locale}/${slug}`);
      return entry ? toProject(entry) : null;
    } catch {
      return null;
    }
  }
}
```

### Pattern 2: API-based Repository

```typescript
// One repository per API resource
export class StrapiProjectRepository implements ProjectRepository {
  private baseUrl = import.meta.env.STRAPI_URL;

  async findAll(locale: string): Promise<Project[]> {
    const url = `${this.baseUrl}/api/projects?locale=${locale}&populate=*`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const json = await response.json();
    return toProjects(json.data);
  }

  async findBySlug(locale: string, slug: string): Promise<Project | null> {
    const url = `${this.baseUrl}/api/projects?filters[slug][$eq]=${slug}&locale=${locale}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const json = await response.json();
    return json.data.length > 0 ? toProjects(json.data)[0] : null;
  }
}
```

### Pattern 3: Hybrid Repository (Multiple Sources)

```typescript
// Combines data from multiple sources
export class HybridTestimonialRepository implements TestimonialRepository {
  async findAll(locale: string): Promise<Testimonial[]> {
    // Try Strapi first
    try {
      const strapiData = await this.fetchFromStrapi(locale);
      return strapiData;
    } catch {
      // Fallback to Content Collections
      return this.fetchFromContentCollections(locale);
    }
  }

  private async fetchFromStrapi(locale: string): Promise<Testimonial[]> {
    // Strapi implementation
  }

  private async fetchFromContentCollections(locale: string): Promise<Testimonial[]> {
    // Content Collection implementation
  }
}
```

---

## Error Handling

Repositories should handle errors gracefully:

```typescript
export class StrapiServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/services?locale=${locale}`);

      if (!response.ok) {
        console.error(`Strapi API error: ${response.status} ${response.statusText}`);
        return []; // Return empty array instead of throwing
      }

      const json = await response.json();
      return toServices(json.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      return []; // Graceful degradation
    }
  }

  async findBySlug(locale: string, slug: string): Promise<Service | null> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/services?filters[slug][$eq]=${slug}&locale=${locale}`);

      if (!response.ok) {
        return null;
      }

      const json = await response.json();
      return json.data.length > 0 ? toServices(json.data)[0] : null;
    } catch (error) {
      console.error(`Failed to fetch service ${slug}:`, error);
      return null;
    }
  }
}
```

---

## Testing Infrastructure

### Testing Repositories

Repositories should be tested with **real data sources** when possible:

```typescript
// tests/integration/repositories/ContentCollectionServiceRepository.test.ts
import { describe, it, expect } from "vitest";
import { ContentCollectionServiceRepository } from "@/infrastructure/repositories/ContentCollectionServiceRepository";

describe("ContentCollectionServiceRepository", () => {
  const repository = new ContentCollectionServiceRepository();

  it("fetches all services for a locale", async () => {
    const services = await repository.findAll("en");

    expect(services.length).toBeGreaterThan(0);
    expect(services[0]).toHaveProperty("id");
    expect(services[0]).toHaveProperty("title");
  });

  it("fetches service by slug", async () => {
    const service = await repository.findBySlug("en", "consulting");

    expect(service).not.toBeNull();
    expect(service?.slug).toBe("consulting");
  });

  it("returns null for non-existent slug", async () => {
    const service = await repository.findBySlug("en", "non-existent");

    expect(service).toBeNull();
  });
});
```

### Testing Mappers

Mappers should be unit tested with fixture data:

```typescript
// src/infrastructure/mappers/StrapiServiceMapper.test.ts
import { describe, it, expect } from "vitest";
import { toService, toServices } from "./StrapiServiceMapper";

describe("StrapiServiceMapper", () => {
  it("maps Strapi response to Service entity", () => {
    const strapiData = {
      id: 1,
      attributes: {
        title: "Consulting",
        description: "Expert consulting services",
        slug: "consulting",
        category: "consulting",
        icon: "briefcase",
        priority: 1,
        isFeatured: true,
      },
    };

    const service = toService(strapiData);

    expect(service.id).toBe("1");
    expect(service.title).toBe("Consulting");
    expect(service.slug).toBe("consulting");
  });

  it("handles missing optional fields", () => {
    const strapiData = {
      id: 2,
      attributes: {
        title: "Development",
        description: "Software development",
        slug: "development",
        category: "development",
        priority: 2,
        isFeatured: false,
      },
    };

    const service = toService(strapiData);

    expect(service.icon).toBeNull();
  });

  it("throws on invalid data", () => {
    const invalidData = {
      id: 3,
      attributes: {
        title: "Invalid",
        // Missing required fields
      },
    };

    expect(() => toService(invalidData as any)).toThrow();
  });
});
```

---

## File Structure

```
src/infrastructure/
├── README.md (this file)
├── repositories/
│   ├── ContentCollectionServiceRepository.ts     ← Future: Services from Content Collections
│   ├── StrapiServiceRepository.ts                ← Future: Services from Strapi
│   ├── ContentCollectionProjectRepository.ts     ← Future: Projects from Content Collections
│   ├── StrapiProjectRepository.ts                ← Future: Projects from Strapi
│   └── index.ts                                  ← Barrel export
└── mappers/
    ├── ContentCollectionServiceMapper.ts         ← Future: Map Content Collections to Service
    ├── StrapiServiceMapper.ts                    ← Future: Map Strapi response to Service
    ├── StrapiProjectMapper.ts                    ← Future: Map Strapi response to Project
    └── index.ts                                  ← Barrel export
```

---

## Migration Example

### Phase 1: Content Collections (Current)

```astro
---
// src/pages/services.astro
import { getCollection } from "astro:content";

const services = await getCollection("services", (entry) => entry.id.startsWith(`${locale}/`));
---

<ServicesList services={services.map((e) => e.data)} />
```

### Phase 2: Add Repository Layer

**1. Create repository:**

```typescript
// src/infrastructure/repositories/ContentCollectionServiceRepository.ts
export class ContentCollectionServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    const entries = await getCollection("services", (entry) => entry.id.startsWith(`${locale}/`));
    return entries.map(toService);
  }
}
```

**2. Update page:**

```astro
---
// src/pages/services.astro
import { getServices } from "@/application/use-cases/getServices";
import { ContentCollectionServiceRepository } from "@/infrastructure/repositories/ContentCollectionServiceRepository";

const repository = new ContentCollectionServiceRepository();
const services = await getServices(repository, { locale });
---

<ServicesList services={services} />
```

### Phase 3: Migrate to Strapi

**1. Create Strapi repository:**

```typescript
// src/infrastructure/repositories/StrapiServiceRepository.ts
export class StrapiServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    const response = await fetch(`${STRAPI_URL}/api/services?locale=${locale}`);
    const json = await response.json();
    return toServices(json.data);
  }
}
```

**2. Swap in page (ONE line):**

```diff
---
- import { ContentCollectionServiceRepository } from "@/infrastructure/repositories/ContentCollectionServiceRepository";
+ import { StrapiServiceRepository } from "@/infrastructure/repositories/StrapiServiceRepository";

- const repository = new ContentCollectionServiceRepository();
+ const repository = new StrapiServiceRepository();

const services = await getServices(repository, { locale });
---
```

**Use-case, domain, and UI unchanged!** 🎉

---

## Resources

**Repository Pattern:**

- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Data Mapper Pattern](https://en.wikipedia.org/wiki/Data_mapper_pattern)

**Astro Content Collections:**

- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Collection Queries](https://docs.astro.build/en/guides/content-collections/#querying-collections)

**Strapi:**

- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Filtering](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)

---

## Summary

The infrastructure layer is the **adapter layer**:

- **Repositories** - Implement data access ports
- **Mappers** - Transform external data to domain entities
- **Framework integration** - Connects to Astro, Strapi, APIs
- **Swappable** - Change implementations without affecting other layers
- **Testable** - Integration tests with real data sources

**Key Rule:** If it talks to the outside world (API, database, file system), it belongs in the infrastructure layer.
