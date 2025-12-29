# ADR 0001: Adopt Clean Architecture for Frontend

**Date:** 2025-12-29
**Status:** Accepted
**Deciders:** Development Team
**Tags:** architecture, patterns, frontend

---

## Context

We are building a corporate landing page for GlobalCore Consulting Group using Astro. The project will start with static content (JSON files) but will migrate to a headless CMS (Strapi) in the future. We need an architecture that:

1. **Supports data source migration** - Switch from Content Collections to Strapi without rewriting business logic
2. **Maintains testability** - Test business logic independently of frameworks and data sources
3. **Preserves Astro DX** - Don't sacrifice Astro's excellent developer experience
4. **Scales gradually** - Start simple, add complexity only when needed
5. **Remains maintainable** - Clear separation of concerns, easy for new developers to understand

The question: **Should we adopt Clean Architecture principles for a frontend Astro project?**

---

## Decision

**We will adopt Clean Architecture**, adapted to frontend and Astro conventions.

### Our Layer Structure

```
src/
  domain/              ← Business entities, validation (Zod)
  application/         ← Use-cases, repository interfaces (ports)
  infrastructure/      ← Data access, mappers (adapters)

  pages/               ← Astro pages (orchestration only)
  components/          ← UI components (presentational)
  content/             ← Content Collections (data)
  i18n/                ← Translations (shared)
```

### Key Principles

1. **Pages orchestrate, don't contain business logic**
   - Pages call use-cases
   - Pass data to presentational components
   - No data transformation in pages

2. **Use-cases contain business logic**
   - Single responsibility
   - Framework-agnostic
   - Testable without mocks

3. **Repositories abstract data sources**
   - Content Collections today
   - Strapi tomorrow
   - Swap implementations without touching use-cases

4. **Mappers normalize external data**
   - Transform API responses to domain entities
   - Validate with Zod schemas
   - Handle inconsistencies

5. **Components are presentational**
   - Receive data via props
   - No data fetching
   - Reusable and testable

---

## Rationale

### Why Clean Architecture?

**1. Future-proof for CMS migration**

When we switch from Content Collections to Strapi, only the infrastructure layer changes:

```typescript
// Before (Content Collections)
export class ContentCollectionServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    const entries = await getCollection("services", (entry) => entry.id.startsWith(`${locale}/`));
    return entries.map(toService);
  }
}

// After (Strapi)
export class StrapiServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    const response = await fetch(`${STRAPI_URL}/api/services?locale=${locale}`);
    const json = await response.json();
    return toServices(json.data);
  }
}
```

**Use-cases, domain entities, and UI components remain unchanged.**

**2. Testability without mocks**

Business logic can be tested independently:

```typescript
// Test use-case with mock repository
const mockRepository: ServiceRepository = {
  findAll: vi.fn().mockResolvedValue([{ id: "1", title: "Service 1", category: "consulting" }]),
};

const result = await getServices(mockRepository, { locale: "en" });

expect(result).toHaveLength(1);
```

No need to mock Astro, Content Collections, or Strapi - just the repository interface.

**3. Clear separation of concerns**

Each layer has a single responsibility:

- **Domain:** Business entities and validation
- **Application:** Business logic and use-cases
- **Infrastructure:** Data fetching and external services
- **Pages:** Orchestration
- **Components:** Presentation

New developers can understand the codebase quickly.

**4. Scalable complexity**

Start simple:

```astro
---
// Phase 1: Direct Content Collections usage (acceptable for MVP)
const heroContent = await getEntry("hero", `${locale}/home`);
---
```

Add layers when needed:

```astro
---
// Phase 2: Add repository layer when migrating to Strapi
const repository = new StrapiHeroRepository();
const heroContent = await getHeroContent(repository, { locale });
---
```

**We don't need all layers from day one.**

---

## Alternatives Considered

### Alternative 1: No Architecture (Direct Astro Patterns)

**Approach:**

- Fetch data directly in pages using `getCollection()`
- No abstraction layers
- Mix data fetching, business logic, and presentation

**Pros:**

- Simplest to start
- Follows basic Astro examples
- Fewer files

**Cons:**

- ❌ **Hard to migrate data sources** - Change Astro Content Collections to Strapi = rewrite every page
- ❌ **Hard to test business logic** - Must mock Astro and Content Collections
- ❌ **Code duplication** - Same data fetching logic repeated across pages
- ❌ **Tight coupling** - Pages depend directly on data source implementation

**Verdict:** Rejected. Migration would require massive refactoring.

---

### Alternative 2: Service Layer Pattern

**Approach:**

- Create a `services/` folder with data fetching functions
- Pages call services, services call Content Collections

**Example:**

```typescript
// src/services/heroService.ts
export async function getHeroContent(locale: string) {
  return await getEntry("hero", `${locale}/home`);
}
```

**Pros:**

- Simpler than Clean Architecture
- Some abstraction from data source
- Easier to understand for beginners

**Cons:**

- ❌ **No clear boundaries** - "Service" is vague, can become dumping ground
- ❌ **Still coupled to Astro** - Services use `getCollection()` directly
- ❌ **Hard to swap implementations** - No interface/port pattern
- ❌ **Limited testability** - Still need to mock Astro

**Verdict:** Rejected. Halfway solution that doesn't fully solve migration problem.

---

### Alternative 3: Full DDD with Value Objects, Aggregates, Domain Events

**Approach:**

- Implement full Domain-Driven Design
- Value Objects for Email, URL, Money
- Aggregates with consistency boundaries
- Domain events for state changes

**Pros:**

- Rich domain model
- Enforces business rules at domain level
- Excellent for complex business logic

**Cons:**

- ❌ **Overkill for landing page** - Too complex for our use-case
- ❌ **More files, more boilerplate** - Slower development
- ❌ **Higher learning curve** - Harder for new developers
- ❌ **Not needed** - We don't have complex business rules yet

**Verdict:** Rejected. We may add these patterns later if complexity justifies it, but not initially.

---

## Consequences

### Positive

✅ **Migration-friendly**

- Switching from Content Collections to Strapi requires minimal changes
- Only infrastructure layer changes, rest untouched

✅ **Testable**

- Business logic can be tested independently
- Mock repository interfaces, not frameworks

✅ **Maintainable**

- Clear separation of concerns
- New developers can navigate codebase easily

✅ **Reusable**

- Use-cases can be called from pages, API routes, or CLI tools
- Domain entities work anywhere in codebase

✅ **Framework-agnostic domain**

- Business logic doesn't depend on Astro
- Could reuse in Node.js API or different frontend

### Negative

❌ **More files initially**

- Three layers (domain, application, infrastructure) vs one (pages)
- Boilerplate for simple CRUD operations

❌ **Learning curve**

- Team needs to understand Clean Architecture principles
- New developers need onboarding

❌ **Over-engineering risk**

- Must resist temptation to add unnecessary abstractions
- "Keep it simple" requires discipline

### Mitigation Strategies

**1. Gradual adoption**

- Don't add layers until needed
- Start with direct Content Collections usage
- Refactor to layers when migrating to Strapi

**2. Documentation**

- Layer READMEs explain purpose and patterns
- ADRs document architectural decisions
- Code examples in READMEs

**3. Pragmatism over purity**

- Skip use-cases for simple one-line fetches
- Add repository only when abstraction provides value
- Astro DX is priority - architecture serves DX, not vice versa

**4. Code review standards**

- Enforce "business logic in use-cases, not pages"
- Ensure mappers transform external data
- Validate domain entities with Zod

---

## Migration Path

### Phase 1: Foundation (Current - MVP)

✅ **Scaffold folders:**

```
src/domain/
src/application/
src/infrastructure/
```

✅ **Add domain entities with Zod:**

```typescript
// src/domain/entities/Locale.ts
export const LocaleSchema = z.enum(["en", "de"]);
export type Locale = z.infer<typeof LocaleSchema>;
```

✅ **Use Content Collections directly in pages:**

```astro
---
const heroContent = await getEntry("hero", `${locale}/home`);
---
```

**Goal:** Structure in place, minimal overhead

---

### Phase 2: Add Use-Cases (When adding complex logic)

**When:**

- Business logic appears (filtering, sorting, calculations)
- Multiple pages need same data fetching logic
- Testing business logic becomes important

**Add:**

```typescript
// src/application/use-cases/getServices.ts
export async function getServices(repository: ServiceRepository, params: GetServicesParams): Promise<Service[]> {
  const services = await repository.findAll(params.locale);

  if (params.category) {
    return services.filter((s) => s.category === params.category);
  }

  return services;
}
```

---

### Phase 3: Add Repositories (When migrating to Strapi)

**When:**

- Switching from Content Collections to Strapi
- Need to support multiple data sources
- Want to test use-cases independently

**Add:**

```typescript
// src/application/ports/ServiceRepository.ts
export interface ServiceRepository {
  findAll(locale: string): Promise<Service[]>;
  findBySlug(locale: string, slug: string): Promise<Service | null>;
}

// src/infrastructure/repositories/StrapiServiceRepository.ts
export class StrapiServiceRepository implements ServiceRepository {
  async findAll(locale: string): Promise<Service[]> {
    const response = await fetch(`${STRAPI_URL}/api/services?locale=${locale}`);
    return toServices(await response.json());
  }
}
```

**Update pages (one line):**

```diff
- const repository = new ContentCollectionServiceRepository();
+ const repository = new StrapiServiceRepository();
```

---

## Success Metrics

We'll know Clean Architecture was the right choice if:

1. **Strapi migration is smooth**
   - Less than 20% of files change
   - Use-cases and components untouched
   - Migration completed in < 1 day

2. **Test coverage is high**
   - 80%+ coverage for application layer
   - Business logic tested without framework mocks

3. **Developer onboarding is fast**
   - New developers understand architecture in < 1 hour
   - Clear folder structure and READMEs guide them

4. **Codebase stays maintainable**
   - No spaghetti code in pages
   - Business logic is reusable
   - Easy to add new features

---

## References

- [The Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture on Frontend](https://dev.to/bespoyasov/clean-architecture-on-frontend-4311)
- [Hexagonal Architecture (Ports & Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

---

## Related ADRs

- [ADR 0002: Content Collections & i18n Strategy](./0002-content-collections-i18n.md)
- [ADR 0003: UI Translations vs CMS Content](./0003-translations-vs-content.md)

---

## Revision History

| Date       | Author | Changes                                     |
| ---------- | ------ | ------------------------------------------- |
| 2025-12-29 | MMA    | Initial draft - Clean Architecture decision |
