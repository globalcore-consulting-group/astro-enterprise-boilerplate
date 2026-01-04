# Enterprise Astro Boilerplate

Production-ready Astro website boilerplate with Clean Architecture, internationalization, comprehensive testing, and modern development tooling.

**Status:** 90% to v1.0.0 | **Build:** ✅ Passing | **Tests:** 67 passing (52 unit + 15 E2E) | **Coverage:** 83%

---

## 📖 Overview

Enterprise-grade Astro boilerplate implementing Clean Architecture principles, comprehensive testing infrastructure, type-safe internationalization, and automated code quality enforcement.

**Perfect for:**

- Multilingual corporate websites
- Content-heavy sites requiring CMS integration
- Projects requiring scalable architecture and high code quality
- Teams that value testing, documentation, and maintainability

---

## ✨ Key Features

- ✅ **Clean Architecture** - Domain/Application/Infrastructure layers
- ✅ **i18n Ready** - EN/DE with type-safe translations, localized routes
- ✅ **Testing Infrastructure** - Vitest (83% coverage) + Playwright E2E
- ✅ **Tailwind CSS v4** - Latest utility-first CSS + Starwind UI components
- ✅ **Type-Safe** - TypeScript strict, Zod validation, zero-dependency domain
- ✅ **Code Quality** - ESLint, Prettier, Husky hooks, commitlint
- ✅ **Content Collections** - CMS-ready with modular structure
- ✅ **Production Ready** - SEO optimized, responsive, accessible

---

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repo-url> my-project
cd my-project

# Use correct Node version (20.19.6)
fnm use  # or: nvm use

# Install and run
npm install
npm run dev
```

Visit **http://localhost:4321** (EN) or **http://localhost:4321/de** (DE)

**First Steps:**

1. Read [AGENTS.md](./AGENTS.md) for comprehensive project overview
2. Run tests: `npm run test && npm run test:e2e`
3. Build: `npm run build`
4. Customize content in `src/content/`
5. Update translations in `src/i18n/translations.ts`

---

## 📦 Tech Stack

| Category       | Technologies                                 | Version                |
| -------------- | -------------------------------------------- | ---------------------- |
| **Framework**  | Astro, TypeScript, Node.js                   | 5.16.6, 5.x, 20.19.6   |
| **UI**         | Tailwind CSS, Starwind UI, tailwind-variants | 4.1.18, 2.2.0, 3.2.2   |
| **Testing**    | Vitest, Playwright, @testing-library/dom     | 4.0.16, 1.57.0, 10.4.1 |
| **Quality**    | ESLint, Prettier, Husky, commitlint          | Latest                 |
| **Validation** | Zod (via Astro)                              | 3.25.76                |

---

## 📂 Project Structure

```
src/
├── pages/              # Routes (Astro file-based routing)
├── layouts/            # Page layouts with SEO
├── components/         # UI components (ui/, sections/, common/, starwind/)
├── content/            # Content Collections (_schemas/, _collections/, data/)
├── domain/             # Clean Architecture - Domain layer (value objects)
├── application/        # Clean Architecture - Application layer (use-cases, ports)
├── infrastructure/     # Clean Architecture - Infrastructure layer (repositories, mappers)
├── i18n/              # Internationalization (translations, config)
└── lib/               # Generic utilities

docs/
├── adr/               # Architecture Decision Records (4 ADRs)
├── setup-resources/   # Detailed setup guides
└── progress/          # Session summaries

tests/
├── e2e/               # Playwright E2E tests
└── fixtures/          # Test fixtures

.husky/                # Git hooks (pre-commit, pre-push)
```

---

## 🛠️ Available Commands

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start dev server at localhost:4321 |
| `npm run build`         | Build production site to `./dist/` |
| `npm run preview`       | Preview production build           |
| `npm run test`          | Run unit tests (Vitest)            |
| `npm run test:watch`    | Run tests in watch mode            |
| `npm run test:coverage` | Generate coverage report           |
| `npm run test:e2e`      | Run E2E tests (Playwright)         |
| `npm run lint`          | Lint code with ESLint              |
| `npm run lint:fix`      | Fix ESLint errors                  |
| `npm run format`        | Format with Prettier               |
| `npm run typecheck`     | TypeScript compiler check          |

**Git Hooks (Automatic):**

- **Pre-commit:** Lints and formats staged files
- **Pre-push:** Runs typecheck + unit tests + E2E tests (~9s)

---

## 📚 Documentation

### Essential Reading

Start with **[AGENTS.md](./AGENTS.md)** (~1,220 lines) - Complete project overview, conventions, architecture, testing strategy.

**Other Key Docs:**

- **[STAKEHOLDER-SUMMARY.md](./docs/STAKEHOLDER-SUMMARY.md)** - Project status, progress, features
- **Architecture Layers:**
  - [Domain Layer](./src/domain/README.md) - Entities, value objects, business rules
  - [Application Layer](./src/application/README.md) - Use-cases, ports
  - [Infrastructure Layer](./src/infrastructure/README.md) - Repositories, mappers
  - [i18n System](./src/i18n/README.md) - Translation strategy
- **[ADRs](./docs/adr/)** - Architecture Decision Records (4 decisions documented)
- **[Setup Guides](./docs/setup-resources/)** - ESLint, Prettier, Tailwind, Vitest, Testing Strategy

---

## 🎯 What's Included

**Completed (90% to v1.0.0):**

- Foundation tooling (ESLint, Prettier, Husky, commitlint)
- Tailwind CSS v4 + Starwind UI design system
- Comprehensive test suite (67 tests, 83% coverage)
- Clean Architecture implementation
- i18n system (EN/DE with route translation)
- Content Collections (hero, seo, pageSections)
- Zero-dependency domain value objects (Locale, Slug, Url)
- Production homepage (responsive, SEO-optimized)
- Navigation system (Navbar, Footer, language switcher)

**Pending for v1.0.0:**

- semantic-release (automated versioning)
- GitHub Actions CI/CD pipeline

---

## 🔧 Using as Boilerplate

Clone and customize for new projects. Current GlobalCore content serves as **reference implementation**.

**Quick Customization:**

1. Update content in `src/content/`
2. Modify components in `src/components/`
3. Adjust translations in `src/i18n/translations.ts`
4. Configure languages in `astro.config.mjs`
5. Update project metadata in `package.json`

**Keep:** Architecture, testing infrastructure, code quality tools, domain patterns
**Customize:** Content files, UI components, translations, routes, styles

See [AGENTS.md](./AGENTS.md) for detailed conventions and guidelines.

---

## 📝 Development Workflow

**Git Conventions:** Conventional Commits enforced via commitlint

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `test:` add tests
- `refactor:` code restructure

**Quality Standards:**

- TypeScript strict mode - all code must pass `npm run typecheck`
- ESLint - no errors allowed
- Prettier - auto-formatted on save and pre-commit
- 60% coverage threshold enforced (currently 83%)
- Pre-push hook prevents broken code from reaching remote

**Testing Requirements:**

- Unit tests for domain value objects, use-cases, mappers
- E2E tests for critical user flows
- All tests must pass before pushing

See [AGENTS.md](./AGENTS.md) → Code Conventions and Testing Strategy for complete details.

---

## 🎓 Learning Resources

- [Astro Documentation](https://docs.astro.build)
- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Starwind UI](https://starwind.dev)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📞 Support

1. Check [AGENTS.md](./AGENTS.md) for detailed guidance
2. Review [ADRs](./docs/adr/) for architectural decisions
3. Consult [setup guides](./docs/setup-resources/) for tooling help

---

**Built with ❤️ & ☕️ by MMa**
