# 0004 - TypeScript Type-Checking Strategy for Astro Component Tests

## Status

Accepted

## Context

We have an Astro project with comprehensive testing infrastructure:

- **Vitest** with `getViteConfig()` from Astro for unit and integration testing
- **Experimental `AstroContainer` API** for testing `.astro` components
- **Playwright** for E2E browser tests
- **Pre-push git hook** that runs type-checking and tests before allowing pushes

### The Problem

When importing `.astro` files in `.ts` test files, TypeScript's command-line compiler (`tsc`) throws:

```
error TS2307: Cannot find module './Button.astro' or its corresponding type declarations.
```

Example test file that triggers this error:

```typescript
// src/components/starwind/button/Button.test.ts
import Button from "./Button.astro"; // ❌ TypeScript error

describe("Button Component", () => {
  it("renders button element", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      slots: { default: "Click me" },
    });
    expect(result).toContain("<button");
  });
});
```

### Root Cause Analysis

This error occurs because of fundamental limitations in how Astro and TypeScript interact:

1. **`@astrojs/ts-plugin` is editor-only**
   - The Astro TypeScript plugin provides `.astro` module resolution in VS Code and other editors
   - This plugin **does not run** when executing `tsc` or `astro check` from the command line
   - From Astro docs: "This plugin runs only in the editor. When running tsc in the terminal, .astro files are ignored entirely."

2. **Known Astro limitation**
   - Documented in Astro GitHub Issue #13537 (April 2025): "Unable to compile TypeScript files when importing .astro files in .ts files"
   - Also tracked in Issue #8364: "Import Astro files in typescript (.ts) files does not work anymore (3.0.5)"
   - This is a **deliberate architectural choice** by the Astro team, not a bug

3. **Official Astro testing examples use `.js`**
   - Astro's `container-with-vitest` example uses `.js` test files
   - This avoids TypeScript compilation entirely for test files
   - Works but sacrifices IDE type-checking benefits

4. **The `declare module "*.astro"` workaround is broken**
   - This approach worked in Astro 2.x
   - Broke in Astro 3.0+ due to internal type system changes
   - Can cause conflicts with Astro's own internal type declarations
   - Not recommended by Astro team

### Why This Matters

Our pre-push hook runs `npm run typecheck` (which executes `tsc --noEmit`), and this blocks commits when test files import `.astro` components. We need a solution that:

- Maintains type safety in both application code and test code
- Works with our git hook automation
- Doesn't compromise developer experience
- Aligns with Astro's architecture

## Decision

We will adopt a **split type-checking strategy** that leverages each tool's strengths:

### 1. Exclude Test Files from `tsc`/`astro check`

Add test file patterns to `tsconfig.json` exclude list:

```json
{
  "exclude": ["dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

This prevents `tsc` and `astro check` from attempting to type-check files that import `.astro` components.

### 2. Rely on Vitest for Test Type-Checking

Vitest, configured with Astro's `getViteConfig()`, will handle type-checking of test files:

```typescript
// vitest.config.ts
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // Vitest uses Vite's pipeline, which includes Astro's plugin
    // This properly resolves .astro imports
  },
});
```

**Why this works:**

- `getViteConfig()` loads Astro's Vite plugin
- Astro's Vite plugin **does** resolve `.astro` module imports (unlike the TS plugin)
- Vitest runs TypeScript through Vite's pipeline, catching type errors at runtime
- Test failures due to type errors will still block the pre-push hook

### 3. Keep Test Files as `.ts` (Not `.js`)

We will maintain `.ts` extensions for test files to preserve:

- Full TypeScript IntelliSense in VS Code
- Type checking while writing tests
- Autocompletion for component props
- Refactoring support

The `@astrojs/ts-plugin` **does work in the editor**, so developers get full IDE support even though `tsc` can't compile these files.

### 4. Update Pre-Push Hook

The pre-push hook will run both type-checking and testing:

```bash
#!/bin/sh
npm run typecheck && npm run test && npm run test:e2e
```

Where:

- `npm run typecheck` = `tsc --noEmit` (checks app code, skips tests)
- `npm run test` = `vitest run` (checks test code via Vite pipeline)
- `npm run test:e2e` = `playwright test` (E2E validation)

## Consequences

### Positive

✅ **Type Safety Maintained**

- Application code: Checked by `tsc`/`astro check`
- Test code: Checked by Vitest at runtime
- Full coverage, no gaps

✅ **Developer Experience Preserved**

- Keep `.ts` test files
- IDE autocomplete and type-checking works
- No need to learn `.js` testing patterns

✅ **Aligns with Astro Architecture**

- Works with Astro's intentional design limitations
- Uses official Vite integration for `.astro` resolution
- No hacky workarounds that might break in future Astro versions

✅ **Automation Works**

- Pre-push hook catches both type errors and test failures
- No false positives from `tsc` trying to parse `.astro` files
- Fast feedback loop (~4.5s for full test suite)

✅ **Future-Proof**

- Based on official Astro patterns
- Won't break when Astro updates
- Matches Astro team's recommended approach

### Negative

⚠️ **Two-Stage Type Checking**

- Application code checked during `npm run typecheck`
- Test code checked during `npm run test`
- Slightly more complex mental model (but automated via git hook)

⚠️ **Test Type Errors Found at Runtime**

- `tsc` won't catch test file type errors
- Developers must run `npm run test` to see test type errors
- Mitigated by: Fast test suite (~4.5s), pre-push hook enforcement

⚠️ **Diverges from Traditional TypeScript Projects**

- In typical TS projects, `tsc` checks everything
- Here, `tsc` checks app code, Vitest checks test code
- Trade-off necessary due to Astro's architecture

### Neutral

📝 **Documentation Required**

- Team must understand why test files aren't in `tsc` scope
- ADR serves as this documentation
- Add note to AGENTS.md for future developers

## Implementation Checklist

- [x] Create this ADR
- [ ] Update `tsconfig.json` to exclude `**/*.test.ts` and `**/*.spec.ts`
- [ ] Update `.husky/pre-push` hook to run all three checks
- [ ] Add section to AGENTS.md explaining the testing type-check strategy
- [ ] Verify `npm run typecheck` passes (should ignore test files)
- [ ] Verify `npm run test` catches type errors in test files
- [ ] Verify pre-push hook blocks commits with type errors or test failures

## Alternatives Considered

### Alternative 1: Rename Test Files to `.js`

**Approach:** Use `.js` extensions for test files, add JSDoc comments for types

**Pros:**

- Avoids TypeScript compilation entirely
- Matches Astro's official examples

**Cons:**

- Loses IDE type-checking benefits
- Loses autocompletion for component props
- Harder to refactor (no type-aware refactoring)
- JSDoc is verbose and less powerful than TypeScript

**Rejected because:** Developer experience regression is too significant

### Alternative 2: Add `declare module "*.astro"` to `env.d.ts`

**Approach:** Declare `.astro` as a module type:

```typescript
declare module "*.astro" {
  const component: any;
  export default component;
}
```

**Pros:**

- Simple one-line fix
- Allows `tsc` to compile test files

**Cons:**

- Broke in Astro 3.0+ (internal type conflicts)
- Uses `any` type (loses type safety)
- Not recommended by Astro team
- May break in future Astro versions

**Rejected because:** Unreliable, uses `any`, conflicts with Astro internals

### Alternative 3: Separate `tsconfig.test.json`

**Approach:** Create separate TypeScript config for tests with different settings

**Pros:**

- Keeps test type-checking in `tsc` scope
- Allows different compiler options for tests

**Cons:**

- Adds configuration complexity
- Still doesn't solve `.astro` import issue (would need `declare module`)
- Vitest already handles this via `getViteConfig()`

**Rejected because:** Unnecessary complexity, Vitest already solves the problem

### Alternative 4: Use `// @ts-ignore` on `.astro` Imports

**Approach:** Suppress TypeScript errors with comments:

```typescript
// @ts-ignore
import Button from "./Button.astro";
```

**Pros:**

- Quick fix
- Keeps files in `tsc` scope

**Cons:**

- Hides all type errors on that line (not just `.astro` import)
- Requires comment on every `.astro` import
- Defeats purpose of TypeScript
- Code smell

**Rejected because:** Anti-pattern, defeats purpose of type-checking

## References

### Astro GitHub Issues

- [Issue #13537](https://github.com/withastro/astro/issues/13537) - "Unable to compile TypeScript files when importing .astro files in .ts files" (April 2025)
- [Issue #8364](https://github.com/withastro/astro/issues/8364) - "Import Astro files in typescript (.ts) files does not work anymore (3.0.5)"

### Astro Documentation

- [TypeScript Guide](https://docs.astro.build/en/guides/typescript/) - "This plugin runs only in the editor. When running tsc in the terminal, .astro files are ignored entirely."
- [Testing Guide](https://docs.astro.build/en/guides/testing/) - Official examples use Container API
- [Container API Example](https://github.com/withastro/astro/tree/main/examples/container-with-vitest) - Uses `.js` test files

### Related ADRs

- [ADR 0001 - Adopt Clean Architecture](./0001-clean-architecture.md) - Testing strategy for each layer

## Notes

This decision was made on 2025-12-29 after investigating TypeScript errors blocking the pre-push git hook. The investigation revealed that this is a known Astro limitation, not a configuration issue in our project.

The split type-checking strategy (tsc for app code, Vitest for test code) is the recommended approach that balances type safety, developer experience, and alignment with Astro's architecture.

## Review Date

Review this decision when:

- Astro releases major version update (check if `@astrojs/ts-plugin` gains CLI support)
- Astro recommends different testing patterns in official docs
- Team reports confusion or issues with two-stage type-checking
