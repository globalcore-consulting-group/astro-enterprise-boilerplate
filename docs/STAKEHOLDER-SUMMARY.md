# GlobalCore Website Boilerplate - Stakeholder Summary

**Project:** GlobalCore Astro Website Boilerplate
**Status:** Production-Ready Homepage Complete (87% Progress to v1.0.0)
**Last Updated:** 2026-01-03

---

## Executive Summary

We're building a **production-ready, enterprise-grade Astro website boilerplate** that will serve as the foundation for GlobalCore's web presence and future projects. The boilerplate prioritizes **code quality, maintainability, testing, and developer experience** while following industry best practices.

**Current Progress:** 13 of 15 core components complete
**Next Milestone:** v1.0.0 Reusable Boilerplate Template

**Latest Achievement:** ✅ **All homepage links now work - placeholder pages created with proper i18n routing**

---

## ✅ What We Have (Completed Features)

### 1. **Foundation Infrastructure** ✅

**Purpose:** Establish production-ready development environment with automated quality enforcement

**Completed:**

- ✅ **Astro 5.16.6** - Modern web framework with hybrid rendering (static-first with SSR capability)
- ✅ **Node.js 20.19.6** - Version locked via `.nvmrc` for team consistency
- ✅ **TypeScript** - Strict mode with path aliases (`@/*` imports)
- ✅ **ESLint + Prettier** - Automated code quality and consistent formatting
- ✅ **VSCode Workspace** - Team settings with format-on-save, lint-on-save
- ✅ **Git Hooks (Husky)** - Automated quality checks before commits
- ✅ **lint-staged** - Only lint changed files (performance optimization)
- ✅ **commitlint** - Enforce conventional commit messages for clear git history

**Business Value:**

- Prevents bugs before they reach production
- Consistent code quality across team members
- Clear git history for auditing and debugging
- Faster onboarding for new developers

**Documentation:** `docs/setup-resources/eslint-prettier-setup.md`, `docs/setup-resources/git-hooks-setup.md`

---

### 2. **UI Framework & Design System** ✅

**Purpose:** Modern, responsive, accessible design system with light/dark mode support

**Completed:**

- ✅ **Tailwind CSS v4.1.18** - Latest utility-first CSS framework
  - CSS-based configuration (no JS config needed)
  - Vite plugin for optimal performance
  - Smaller bundle size than v3
- ✅ **Starwind UI 2.2.0** - Professional component library
  - Button component installed (9 variants, 6 sizes)
  - Type-safe variant system with `tailwind-variants`
  - Accessibility-first approach
- ✅ **Complete Theming System**
  - CSS variables for all theme colors
  - Light/dark mode support via `.dark` class
  - Semantic color tokens (primary, secondary, success, warning, error)
  - Custom animations and design tokens
- ✅ **Base Layout Component** - Reusable page layout with SEO meta tags

**Business Value:**

- Professional, modern UI matches industry standards
- Faster development with pre-built components
- Accessibility compliance (WCAG 2.1)
- Brand consistency across all pages
- Mobile-responsive out of the box

**Documentation:** `docs/setup-resources/tailwind-setup.md`, `docs/setup-resources/starwind-ui-setup.md`

---

### 3. **Testing Infrastructure** ✅

**Purpose:** Ensure code quality, catch bugs early, enable confident refactoring

**Completed:**

- ✅ **Vitest 4.0.16** - Vite-native test runner
  - Configured with Astro's `getViteConfig()` helper
  - happy-dom environment for fast DOM testing
  - 60% coverage thresholds enforced (lines/functions/branches/statements)
  - V8 coverage provider for accurate reporting
- ✅ **Playwright 1.57.0** - E2E testing framework
  - Chromium browser installed and configured
  - CI-optimized settings (retries, sequential execution)
  - Automatic dev server startup
  - HTML reporter for test results
- ✅ **Testing Library Integration**
  - @testing-library/dom for DOM utilities
  - @testing-library/jest-dom for custom matchers
  - Container API pattern for testing Astro components
- ✅ **Test Suite Written**
  - 15 unit tests for Button component (83% coverage)
  - 8 unit tests for domain value objects (Locale, Slug, Url)
  - 15 E2E tests for homepage (11 EN, 4 DE - responsive, interactive, i18n)
  - All 38 tests passing in ~4.5 seconds
- ✅ **No-Mocks Approach Implemented**
  - Uses Astro Container API to render real components
  - No mocking libraries needed
  - Future-proof for data migration (JSON → Strapi → BFF)

**Business Value:**

- Catch bugs before users encounter them
- Confident refactoring without breaking existing features
- Fast feedback loop enables Test-Driven Development
- Documentation through tests (demonstrates component usage)
- CI-ready test suite (automated quality assurance)

**Documentation:** [vitest-setup.md](setup-resources/vitest-setup.md), [testing-strategy.md](setup-resources/testing-strategy.md), [2025-12-28-testing-infrastructure-complete.md](progress/2025-12-28-testing-infrastructure-complete.md)

---

### 4. **Clean Architecture & Internationalization** ✅

**Purpose:** Scalable architecture with multilingual support for global reach

**Completed:**

- ✅ **Clean Architecture Layers**
  - **Domain layer with value objects** - Zero dependencies, pure TypeScript
  - **Locale value object** - Language validation with Set-based type guards
  - **Slug value object** - URL-safe slug validation and normalization
  - **Url value object** - Safe URL validation (rejects XSS vectors like `javascript:`)
  - Modular structure: Each value object in folder with colocated tests
  - Application layer scaffolded (use-cases/, ports/)
  - Infrastructure layer scaffolded (repositories/, mappers/)
- ✅ **Type-Safe i18n System**
  - Astro i18n routing configured (EN default, DE with /de prefix)
  - Type-safe translation helper with full TypeScript autocomplete
  - Namespace pattern for organizing translations
  - Date format configuration per locale
- ✅ **Content Collections**
  - Hero collection with Zod schema validation
  - Locale-based folder organization (en/, de/)
  - Type-safe content queries
  - Ready for CMS migration (JSON → Strapi)
- ✅ **Hero Section Implementation**
  - Responsive Hero component with Starwind UI Button
  - EN homepage at `/` with Content Collections
  - DE homepage at `/de` with localized content
  - Mobile-first design (stacked on mobile, inline on desktop)
- ✅ **E2E Testing for i18n**
  - 15 E2E tests covering EN and DE homepages
  - Responsive layout tests (mobile, tablet, desktop)
  - data-testid convention for layout testing
  - Playwright selector priority pattern established

**Business Value:**

- Swappable data sources enable future CMS migration
- Multilingual support targets global markets
- Type-safe translations prevent translation key errors
- Clean Architecture enables confident refactoring
- Testable business logic isolated from UI

**Documentation:** [src/domain/README.md](../src/domain/README.md), [src/application/README.md](../src/application/README.md), [src/infrastructure/README.md](../src/infrastructure/README.md), [src/i18n/README.md](../src/i18n/README.md), [ADR 0001](adr/0001-clean-architecture.md), [ADR 0002](adr/0002-content-collections-i18n.md), [ADR 0003](adr/0003-translations-vs-content.md)

---

### 5. **Modular Content Collections** ✅

**Purpose:** Maintainable, reusable content structure ready for CMS migration

**Completed:**

- ✅ **Modular Schema Organization**
  - `_schemas/` folder for Zod schemas (underscore = Astro ignores)
  - `_collections/` folder for collection definitions
  - Clean `config.ts` with imports only (no inline schemas)
  - Shared `ctaSchema` reused across collections
- ✅ **Three Collections Configured**
  - **hero** - Hero sections with CTAs (✅ in use)
  - **seo** - Page-level SEO metadata (📝 data only)
  - **pageSections** - Structured content with discriminated unions (📝 data only)
- ✅ **Standardized CTA Structure**
  - Unified `label` field across all collections
  - Hero component updated to use shared schema
  - All content files updated to new structure
- ✅ **Content Data Created**
  - SEO metadata for EN/DE homepages
  - PageSections with 5 section types (What we do, Offerings, Domains, FRAS™, CTA strip)
  - All content available in EN and DE

**Business Value:**

- Easy to maintain and extend schemas
- Reusable components reduce duplication
- Ready for Strapi loader integration (just swap implementations)
- Type-safe content with full autocomplete
- Clean separation of schema logic from data

**Structure:**

```
src/content/
├── _schemas/         # Modular Zod schemas
├── _collections/     # Collection definitions
├── config.ts         # Clean imports
└── hero/, seo/, pageSections/  # Content data (EN/DE)
```

---

### 6. **Domain Value Objects** ✅

**Purpose:** Type-safe, validated domain primitives with zero external dependencies

**Completed:**

- ✅ **Zero-Dependency Philosophy**
  - Pure TypeScript with native JavaScript APIs only
  - No npm packages (not even Zod) in domain layer
  - Maximum portability across all JavaScript runtimes
  - Lightweight and fast runtime validation

- ✅ **Three Value Objects Implemented**
  - **Locale** - Supported language codes with O(1) Set-based validation
  - **Slug** - URL-safe identifiers with normalization (`toSlug()`)
  - **Url** - Safe URLs rejecting dangerous schemes (XSS prevention)

- ✅ **Modular Architecture**
  - Each value object in own folder with colocated tests
  - Barrel exports for clean imports: `import { Locale, Slug, Url } from "@/domain"`
  - 8 unit tests covering validation, edge cases, security

- ✅ **Security-First Design**
  - Url value object rejects `javascript:`, `data:`, `vbscript:` schemes
  - Prevents XSS attacks from user-provided URLs
  - Fail-fast assertions for boundary validation

**Business Value:**

- **Type safety without runtime cost** - Native type guards are fast
- **Security by design** - Dangerous inputs rejected at domain level
- **Maximum portability** - Works in any JavaScript environment
- **Zero dependency risk** - Never breaks due to package updates
- **Easy to test** - Pure functions with no mocks needed

**Structure:**

```
src/domain/
├── value-objects/
│   ├── Locale/
│   │   ├── Locale.ts       # Implementation
│   │   ├── Locale.test.ts  # 3 tests
│   │   └── index.ts
│   ├── Slug/
│   │   ├── Slug.ts         # Implementation
│   │   ├── Slug.test.ts    # 2 tests
│   │   └── index.ts
│   └── Url/
│       ├── Url.ts          # Implementation
│       ├── Url.test.ts     # 3 tests
│       └── index.ts
```

**Documentation:** [src/domain/README.md](../src/domain/README.md)

---

### 7. **Production-Ready Homepage** ✅

**Purpose:** Fully functional homepage with all content sections, navigation, and SEO

**Completed:**

- ✅ **Page Sections Rendering**
  - CardsSection component for grid layouts (3 instances)
  - OneLinerSection for highlighted statements (FRAS™)
  - CtaStripSection for call-to-action buttons
  - All sections use Starwind UI Card component
  - Responsive layouts (1/2/3 columns based on screen size)
  - Hover effects and smooth transitions
- ✅ **Navigation System**
  - Responsive Navbar with mobile menu toggle
  - Language switcher (EN ⟷ DE) in navigation
  - Footer with navigation and legal links
  - Semantic HTML with ARIA labels
  - Mobile hamburger menu with smooth animation
- ✅ **SEO Implementation**
  - Dynamic meta tags from Content Collections
  - Open Graph and Twitter card meta tags
  - Canonical URLs for all pages
  - hreflang links for language alternatives
  - noIndex support for staging environments
  - Locale-aware fallback descriptions
- ✅ **Content Delivered**
  - Hero section with dual CTAs
  - "What we do" - 3 pillars cards
  - "Offerings" - 4 productized services with links
  - "Domains" - 6 domain expertise cards with links
  - "How we work" - FRAS™ methodology oneLiner
  - Final CTA strip with primary/secondary actions
  - Full EN/DE translations for all content

**Business Value:**

- Ready for demo and stakeholder review
- Professional, modern design with brand consistency
- SEO-optimized for search engines
- Multilingual support for global reach
- Mobile-responsive for all devices
- Accessible navigation with keyboard support

**Technical Stack:**

- Starwind UI Card component (v1.3.0)
- Astro Content Collections for content management
- i18n routing with language switcher
- Responsive breakpoints (mobile/tablet/desktop)

---

### 8. **Placeholder Pages & Route Translation System** ✅

**Purpose:** Prevent 404 errors and establish proper i18n routing structure

**Completed:**

- ✅ **EN Placeholder Pages (6 pages)**
  - `/about` - About page with `#how-we-work` anchor section
  - `/services` - Services page with 4 service anchor sections
  - `/contact` - Contact page
  - `/domains` - Domains page with 6 domain anchor sections
  - `/privacy` - Privacy Policy page
  - `/imprint` - Imprint/Legal page
  - All show "Coming Soon" message with back-to-home link
- ✅ **DE Placeholder Pages (6 pages via catch-all route)**
  - `/de/ueber-uns` - About (Über uns)
  - `/de/dienstleistungen` - Services (Dienstleistungen)
  - `/de/kontakt` - Contact (Kontakt)
  - `/de/domaenen` - Domains (Domänen)
  - `/de/datenschutz` - Privacy Policy (Datenschutz)
  - `/de/impressum` - Imprint (Impressum)
  - All show "Diese Seite kommt bald" message
- ✅ **Route Translation System**
  - Bidirectional EN↔DE slug mapping in Navbar component
  - Language switcher properly translates routes (not just adds `/de` prefix)
  - Navigation links use translated slugs for each locale
  - Consistent route translations across all components
- ✅ **Content Naming Standardization**
  - Renamed "Offerings" to "Services" for consistency
  - Updated all content files and links
  - Hero CTA now links to `/about#how-we-work`

**Business Value:**

- No 404 errors - all homepage links now work
- Professional user experience with proper navigation
- Scalable i18n routing structure for future expansion
- Clear route naming conventions established
- Foundation for adding actual page content

**Build Results:**

- 14 total pages generated (2 homepages + 6 EN + 6 DE)
- All pages build successfully with no errors
- TypeScript validation passes

**Route Translations:**

| EN Route    | DE Route               | Page     |
| ----------- | ---------------------- | -------- |
| `/`         | `/de`                  | Homepage |
| `/about`    | `/de/ueber-uns`        | About    |
| `/services` | `/de/dienstleistungen` | Services |
| `/contact`  | `/de/kontakt`          | Contact  |
| `/domains`  | `/de/domaenen`         | Domains  |
| `/privacy`  | `/de/datenschutz`      | Privacy  |
| `/imprint`  | `/de/impressum`        | Imprint  |

---

## 📊 Current Standards & Features

### Code Quality Standards

| Standard              | Status | Purpose                                      |
| --------------------- | ------ | -------------------------------------------- |
| TypeScript Strict     | ✅     | Type safety prevents runtime errors          |
| ESLint                | ✅     | Catch code issues automatically              |
| Prettier              | ✅     | Consistent formatting across team            |
| Conventional Commits  | ✅     | Clear git history, automated changelog       |
| Pre-commit Hooks      | ✅     | Quality checks before code enters repository |
| Path Aliases          | ✅     | Clean imports (`@/components` vs `../../`)   |
| Testing Strategy      | ✅     | Vitest + Playwright operational              |
| Coverage Requirements | ✅     | 60% threshold enforced, 83% achieved         |

### Architecture Standards

| Standard               | Status | Purpose                                 |
| ---------------------- | ------ | --------------------------------------- |
| Clean Architecture     | ✅     | Folder structure implemented            |
| Separation of Concerns | ✅     | Domain / Application / Infrastructure   |
| Dependency Inversion   | ✅     | Swappable data sources (JSON → Strapi)  |
| Component Colocation   | ✅     | Tests next to source code               |
| Type-Safe i18n         | ✅     | EN/DE with autocomplete implemented     |
| Content Collections    | ✅     | CMS-like content management operational |

### Developer Experience

| Feature                | Status | Impact                              |
| ---------------------- | ------ | ----------------------------------- |
| Format on Save         | ✅     | No manual formatting needed         |
| Lint on Save           | ✅     | Instant feedback on errors          |
| Hot Module Replacement | ✅     | Instant browser updates during dev  |
| Path Aliases           | ✅     | Cleaner imports, easier refactoring |
| VSCode Extensions      | ✅     | Astro, Tailwind, Prettier support   |
| Node Version Lock      | ✅     | Consistent environment across team  |
| Conventional Commits   | ✅     | Clear commit message format         |
| Pre-commit Validation  | ✅     | Catch issues before pushing         |

---

## 📈 Progress Tracking

### Overall Progress: 87% (13/15 Items)

```
Foundation Setup:           ████████████████████████ 100% (6/6 items)
UI Framework:               ████████████████████████ 100% (2/2 items)
Testing Infrastructure:     ████████████████████████ 100% (2/2 items)
Architecture:               ████████████████████████ 100% (3/3 items)
Automation:                 ░░░░░░░░░░░░░░░░░░░░░░░░   0% (0/2 items)
```

### Completed (13/15)

1. ✅ Repository & Astro initialization
2. ✅ ESLint + Prettier configuration
3. ✅ VSCode workspace settings
4. ✅ Git hooks (Husky + lint-staged + commitlint)
5. ✅ Node version management (.nvmrc)
6. ✅ Path aliases (@/\*)
7. ✅ Tailwind CSS v4 integration
8. ✅ Starwind UI component library (Button)
9. ✅ Vitest + Testing Library installation (15 unit tests, 83% coverage)
10. ✅ Playwright E2E testing setup (15 E2E tests)
11. ✅ Zod schema validation (Locale entity)
12. ✅ Clean Architecture folder structure (domain/, application/, infrastructure/)
13. ✅ Content Collections setup (Hero with EN/DE)
14. ✅ i18n configuration (EN/DE routing with type-safe translations)
15. ✅ Documentation (Layer READMEs + 3 ADRs)

### In Progress (0/15)

- None (all previous work completed and documented)

### Pending for v1.0.0 (2/15)

**Automation (2 items):** 16. ⏳ semantic-release (automated versioning & changelog) 17. ⏳ GitHub Actions CI/CD pipeline

---

## 🎯 What's Next (Immediate Priorities)

### Priority 1: Clean Architecture Setup

**Why First:** Establish scalable folder structure before adding features (testing infrastructure now complete)

**Tasks:**

1. Create folder structure (domain/, application/, infrastructure/)
2. Set up Zod validation schemas
3. Configure Content Collections
4. Create example entities, use-cases, and mappers
5. Integrate with testing setup

**Deliverables:**

- Production-ready folder structure
- Type-safe data validation
- Example Clean Architecture implementation

---

### Priority 2: Internationalization

**Why Next:** Core requirement for GlobalCore's bilingual site

**Tasks:**

1. Configure Astro i18n routing
2. Create type-safe translation system
3. Set up EN/DE route structure
4. Implement language switcher component
5. Add E2E tests for language switching

**Deliverables:**

- Working EN/DE routing
- Type-safe translation helper
- Language switcher in navigation

---

### Priority 3: Automation

**Why Last:** Requires all above infrastructure to be in place

**Tasks:**

1. Configure semantic-release
2. Create GitHub Actions workflow
3. Set up automated testing in CI
4. Configure automated deployment
5. Test full CI/CD pipeline

**Deliverables:**

- Automated version bumps and changelog
- CI runs tests on every push
- Automated deployment to staging/production

---

## 📚 Documentation Created

### Setup Resources (`docs/setup-resources/`)

- **eslint-prettier-setup.md** - Code quality tooling
- **git-hooks-setup.md** - Automated quality checks
- **tailwind-setup.md** - CSS framework setup
- **starwind-ui-setup.md** - Component library usage
- **vitest-setup.md** - Testing framework guide (~1,188 lines)
- **testing-strategy.md** - Complete testing approach (~700 lines)

### Progress Tracking (`docs/progress/`)

- **2025-12-26-foundation-complete.md** - Foundation setup session
- **2025-12-26-tailwind-starwind-complete.md** - UI framework session
- **2025-12-28-testing-infrastructure-complete.md** - Testing infrastructure session (~487 lines)
- **SESSION-SUMMARY.md** - Current session overview

### Project Documentation

- **AGENTS.md** - Comprehensive project guidelines for AI agents and developers
- **STAKEHOLDER-SUMMARY.md** - This document

**Total Documentation:** ~6,000+ lines of comprehensive setup guides, architecture documentation, and progress tracking

---

## 💡 Key Technical Decisions

### 1. No-Mocks Testing Approach ✅

**Decision:** Use Astro Content Collections for test data instead of mocking libraries

**Rationale:**

- Mocks drift out of sync with real APIs (maintenance burden)
- Tests fail when real data format changes = catch real issues
- Simple, Astro-native approach
- Zero mocking libraries needed
- JSON files serve as both production data AND test data

**Impact:** Easier maintenance, more reliable tests, simpler codebase

---

### 2. Tailwind CSS v4 (Not v3) ✅

**Decision:** Use latest Tailwind CSS v4 instead of stable v3

**Rationale:**

- Better Vite integration
- CSS-based configuration (no JS config)
- Smaller bundle size
- Native CSS features support
- Latest best practices

**Impact:** Modern, performant, future-proof styling system

---

### 3. Clean Architecture for Frontend ✅

**Decision:** Implement Clean Architecture principles adapted to Astro

**Rationale:**

- Swappable data sources (JSON now, Strapi later)
- Testable business logic isolated from UI
- Clear separation of concerns
- Industry-proven pattern for scalability

**Impact:** Easier to maintain, test, and extend as project grows

---

### 4. Conventional Commits (Enforced) ✅

**Decision:** Require conventional commit format via commitlint

**Rationale:**

- Clear git history for debugging
- Automated changelog generation
- Enables semantic-release automation
- Industry standard

**Impact:** Professional git history, automated versioning ready when needed

---

## 🎁 Business Value Delivered

### Immediate Benefits

✅ **Reduced Development Time**

- Reusable component library
- Pre-configured tooling
- Automated code formatting
- Clear documentation

✅ **Higher Code Quality**

- Automated linting and formatting
- Type safety with TypeScript
- Pre-commit quality checks
- Comprehensive testing strategy

✅ **Better Collaboration**

- Consistent code style
- Clear commit messages
- VSCode team settings
- Documented conventions

✅ **Professional Standards**

- Industry best practices (Clean Architecture, Conventional Commits)
- Modern tech stack (Astro 5, Tailwind v4)
- Accessibility-first components
- Performance optimized

### Future Benefits (After v1.0.0)

🎯 **Reusable Template**

- Extract as standalone boilerplate
- Use for future GlobalCore projects
- Faster project kickoff (hours vs days)

🎯 **Confident Refactoring**

- Tests catch breaking changes
- Safe to improve and optimize
- Reduced fear of changes

🎯 **Easy Scaling**

- Clean Architecture supports growth
- Swappable data sources (JSON → Strapi)
- Internationalization ready
- Component library expandable

🎯 **Automated Releases**

- semantic-release for versioning
- Automated changelog generation
- CI/CD pipeline for deployments
- Reduced manual work

---

## 📊 Technology Stack

### Core Framework

| Technology | Version | Status | Purpose                      |
| ---------- | ------- | ------ | ---------------------------- |
| Astro      | 5.16.6  | ✅     | Web framework (static + SSR) |
| Node.js    | 20.19.6 | ✅     | Runtime environment          |
| TypeScript | 5.x     | ✅     | Type safety                  |
| npm        | Latest  | ✅     | Package manager              |

### UI & Styling

| Technology        | Version | Status | Purpose                  |
| ----------------- | ------- | ------ | ------------------------ |
| Tailwind CSS      | 4.1.18  | ✅     | Utility-first CSS        |
| Starwind UI       | 2.2.0   | ✅     | Component library        |
| tailwind-variants | 3.2.2   | ✅     | Type-safe variant system |
| Tabler Icons      | 3.36.0  | ✅     | Icon library             |

### Code Quality

| Technology  | Version | Status | Purpose                   |
| ----------- | ------- | ------ | ------------------------- |
| ESLint      | Latest  | ✅     | Code linting              |
| Prettier    | Latest  | ✅     | Code formatting           |
| Husky       | 9.1.7   | ✅     | Git hooks                 |
| lint-staged | 16.2.7  | ✅     | Staged files linting      |
| commitlint  | 19.6.2  | ✅     | Commit message validation |

### Testing

| Technology                | Version | Status | Purpose                     |
| ------------------------- | ------- | ------ | --------------------------- |
| Vitest                    | 4.0.16  | ✅     | Unit & integration tests    |
| Playwright                | 1.57.0  | ✅     | E2E browser tests           |
| @testing-library/dom      | 10.4.1  | ✅     | Component testing utils     |
| @testing-library/jest-dom | 6.9.1   | ✅     | DOM assertion matchers      |
| happy-dom                 | 20.0.11 | ✅     | Lightweight DOM environment |
| @vitest/coverage-v8       | 4.0.16  | ✅     | Coverage reporting          |

### Validation & Architecture

| Technology          | Version  | Status | Purpose                      |
| ------------------- | -------- | ------ | ---------------------------- |
| Zod                 | 3.25.76  | ✅     | Schema validation            |
| Content Collections | Built-in | ✅     | Type-safe content management |

### Automation (Pending)

| Technology       | Version | Status | Purpose              |
| ---------------- | ------- | ------ | -------------------- |
| semantic-release | TBD     | 📝     | Automated versioning |
| GitHub Actions   | N/A     | 📝     | CI/CD pipeline       |

---

## 🚀 Deployment Strategy

**Platform:** VPS with Docker
**Current Status:** Manual deployment
**Target:** Automated CI/CD via GitHub Actions

**Deployment Flow (Target):**

1. Push to `main` branch
2. GitHub Actions runs tests
3. If tests pass, build Docker image
4. Deploy to VPS at `/srv/stack/globalcore-website`
5. Automated rollback on failure

**Current:** Manual deployment until GitHub Actions workflow is created

---

## 🎯 Success Criteria for v1.0.0

### Must Have (Required for v1.0.0)

- ✅ Foundation tooling complete
- ✅ UI framework operational
- ✅ Test suite with 60%+ coverage (83% achieved)
- ✅ Clean Architecture folder structure
- ✅ Type-safe i18n (EN/DE)
- ✅ Content Collections configured
- ✅ Documentation complete
- ⏳ CI/CD pipeline operational

### Nice to Have (Post v1.0.0)

- Additional Starwind UI components
- Dark mode toggle UI
- SEO optimization
- Performance monitoring
- Analytics integration
- More comprehensive test coverage (80%+)

---

**Document Status:** ✅ Complete
**Next Update:** After CI/CD automation implementation (v1.0.0)
**Maintained By:** MMA
**For Questions:** Refer to AGENTS.md or project documentation
