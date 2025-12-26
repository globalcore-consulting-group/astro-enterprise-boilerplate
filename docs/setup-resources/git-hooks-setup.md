# Git Hooks Setup Resources

**Setup Date:** 2025-12-26
**Last Updated:** 2025-12-26

This document contains the resources and references used to configure Husky, lint-staged, and commitlint for this project.

---

## Official Documentation

### Husky

- [Husky Official Documentation](https://typicode.github.io/husky/)
  - Modern git hooks made easy
  - v9 improvements: leaner, faster, more reliable

### lint-staged

- [lint-staged GitHub Repository](https://github.com/lint-staged/lint-staged)
  - Run linters and formatters on staged git files only
  - Prevents running tools on all files unnecessarily

### commitlint

- [commitlint Official Documentation](https://commitlint.js.org/)
  - Lint commit messages
  - [Configuration Reference](https://commitlint.js.org/reference/configuration.html)
  - [@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional)

### Conventional Commits

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/)
  - Structured commit message convention
  - Enables automated versioning and changelog generation

---

## Community Guides

### Husky + lint-staged + commitlint Integration

- [Prevent Bad Commits with Husky and lint-staged](https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/)
  - Complete setup guide for Husky v9
  - Integration patterns with lint-staged

- [Guide: Local setup | commitlint](https://commitlint.js.org/guides/local-setup.html)
  - Official guide for setting up commitlint with Husky

- [Husky, Commitlint, and Prettier Configuration](https://theodorusclarence.com/shorts/husky-commitlint-prettier)
  - Practical configuration examples

---

## Packages Installed

```json
{
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7",
    "@commitlint/cli": "^19.6.2",
    "@commitlint/config-conventional": "^19.6.2"
  }
}
```

### Package Purposes

- **husky**: Manages git hooks for the team (auto-installed via prepare script)
- **lint-staged**: Runs tasks on staged files only (faster than running on entire codebase)
- **@commitlint/cli**: Command-line tool for commit message linting
- **@commitlint/config-conventional**: Shareable config enforcing Conventional Commits

---

## Configuration Files Created

### `commitlint.config.mjs`

- Uses `.mjs` extension for ES module compatibility (project has `"type": "module"`)
- Extends `@commitlint/config-conventional`
- Enforces commit format: `type(scope): description`

### `.husky/pre-commit`

- Runs `lint-staged` before every commit
- Automatically formats and lints staged files

### `.husky/commit-msg`

- Runs `commitlint` to validate commit messages
- Enforces Conventional Commits format

### `package.json` - lint-staged configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,astro}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

---

## How It Works

### Pre-commit Hook Flow

1. Developer runs `git commit`
2. Husky triggers `.husky/pre-commit` hook
3. `lint-staged` runs on staged files:
   - ESLint fixes issues in code files
   - Prettier formats all files
4. If successful, commit proceeds
5. If errors occur, commit is blocked

### Commit-msg Hook Flow

1. Developer enters commit message
2. Husky triggers `.husky/commit-msg` hook
3. `commitlint` validates message format
4. If valid (follows Conventional Commits), commit proceeds
5. If invalid, commit is blocked with error message

---

## Conventional Commit Types

Based on [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional):

| Type       | Description                                      | Example                                       |
| ---------- | ------------------------------------------------ | --------------------------------------------- |
| `feat`     | New feature                                      | `feat: add user authentication`               |
| `fix`      | Bug fix                                          | `fix: resolve navigation overlap on mobile`   |
| `docs`     | Documentation changes                            | `docs: update README with setup instructions` |
| `style`    | Code style changes (formatting, no logic change) | `style: format code with prettier`            |
| `refactor` | Code refactoring (no feature/fix)                | `refactor: extract validation to use-case`    |
| `perf`     | Performance improvements                         | `perf: optimize image loading`                |
| `test`     | Adding or updating tests                         | `test: add unit tests for date formatter`     |
| `build`    | Build system or dependencies                     | `build: upgrade Astro to v5.16.6`             |
| `ci`       | CI/CD changes                                    | `ci: add GitHub Actions workflow`             |
| `chore`    | Other changes (tooling, config)                  | `chore: configure ESLint`                     |
| `revert`   | Revert previous commit                           | `revert: undo feature X`                      |

**Optional scope:** `feat(auth): add login form`

---

## ES Module Compatibility

### Why `.mjs` for commitlint.config?

Our project uses `"type": "module"` in package.json, which treats all `.js` files as ES modules. This can cause issues with tools expecting CommonJS.

**Solution:**

- Use `.mjs` extension for ES module configs (explicit ESM)
- Use `.cjs` extension for CommonJS if needed (explicit CommonJS)

**Resources:**

- [Configuration | commitlint](https://commitlint.js.org/reference/configuration.html)
- [Getting started | commitlint](https://commitlint.js.org/guides/getting-started)
- [ERR_REQUIRE_ESM Issue #3251](https://github.com/conventional-changelog/commitlint/issues/3251)

---

## Testing the Setup

### Test lint-staged (pre-commit hook)

1. Make changes to a file
2. Stage the file: `git add <file>`
3. Try to commit: `git commit -m "test: validate hooks"`
4. Observe lint-staged running and formatting files

### Test commitlint (commit-msg hook)

```bash
# Invalid commit (should fail)
git commit -m "bad commit message"

# Valid commit (should succeed)
git commit -m "feat: add new feature"
```

---

## Troubleshooting

### Hooks not running?

```bash
# Reinstall hooks
npm run prepare
```

### Permission errors?

```bash
# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Skip hooks (emergency only - NOT recommended)

```bash
git commit --no-verify
```

---

## Related GitHub Issues & Discussions

- [Husky v9 Modern Git Hooks Best Practices](https://stackdevflow.com/posts/husky-modern-git-hooks-best-practices-and-whats-new-n72u)
- [commitlint ES Module Issues](https://github.com/conventional-changelog/commitlint/issues/902)

---

## Notes

- **Prepare script**: Husky auto-installs hooks when team members run `npm install`
- **Atomic commits**: Each tool was committed separately for clear git history
- **Staged files only**: lint-staged only runs on staged files for performance
- **CI/CD ready**: commitlint can also be used in CI to validate PR titles
- **Conventional Commits**: Enables future automation (semantic-release, changelog generation)

---

## Next Steps

After this setup is complete:

- [ ] Consider adding `semantic-release` for automated versioning
- [ ] Add commitlint to CI/CD pipeline for PR validation
- [ ] Consider additional hooks (pre-push for tests, post-merge for cleanup)
