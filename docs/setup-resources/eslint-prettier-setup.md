# ESLint and Prettier Setup Resources

**Setup Date:** 2025-12-25
**Last Updated:** 2025-12-25

This document contains the resources and references used to configure ESLint and Prettier for this Astro project.

---

## Official Documentation

### Astro
- [Astro Editor Setup - Official Docs](https://docs.astro.build/en/editor-setup/)
  - Official recommendations for setting up code editors with Astro
  - Prettier plugin configuration for `.astro` files

### ESLint Plugin for Astro
- [eslint-plugin-astro User Guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/)
  - Installation and configuration instructions
  - Flat config format setup (`eslint.config.mjs`)
  - Accessibility rules integration
  - TypeScript parser setup

### Prettier
- [Prettier Installation Guide](https://prettier.io/docs/install.html)
  - Official installation instructions
  - Configuration options

---

## Community Guides

### ESLint + Prettier Integration
- [How to setup ESLint and Prettier in your Astro projects](https://cosmicthemes.com/blog/astro-eslint-prettier-setup/)
  - Complete setup guide with all required packages
  - `eslint-config-prettier` integration to prevent conflicts
  - Configuration examples for both tools

- [Get VSCode, eslint & prettier working with Astro](https://patheticgeek.dev/blog/astro-prettier-eslint-vscode)
  - VSCode-specific integration
  - Format on save configuration
  - Validation setup for `.astro` files

- [Prettier vs ESLint: Choosing the Right Tool for Code Quality](https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/)
  - Understanding the difference between the tools
  - Integration patterns

---

## Packages Installed

```json
{
  "devDependencies": {
    "@typescript-eslint/parser": "^8.50.1",
    "eslint": "^9.39.2",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-astro": "^1.5.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-prettier": "^5.5.4",
    "prettier": "^3.7.4",
    "prettier-plugin-astro": "^0.14.1"
  }
}
```

### Package Purposes

- **eslint**: Core ESLint linter
- **eslint-plugin-astro**: ESLint rules specific to Astro components
- **@typescript-eslint/parser**: TypeScript support for ESLint
- **eslint-plugin-jsx-a11y**: Accessibility rules for JSX elements
- **eslint-config-prettier**: Disables ESLint rules that conflict with Prettier
- **eslint-plugin-prettier**: Runs Prettier as an ESLint rule
- **prettier**: Core Prettier formatter
- **prettier-plugin-astro**: Prettier support for `.astro` files

---

## Configuration Files Created

### `eslint.config.mjs`
- Uses flat config format (ESLint 9.x)
- Includes Astro recommended rules
- Includes accessibility rules
- Integrates with Prettier via `eslint-config-prettier`

### `.prettierrc.mjs`
- Line width: 120 characters
- Semicolons: yes
- Quotes: double
- Indentation: 2 spaces
- Trailing commas: ES5
- Astro parser for `.astro` files

### `.eslintignore` & `.prettierignore`
- Excludes `node_modules/`, `dist/`, `.astro/`
- Excludes lock files and generated files

---

## Key Integration Points

### Avoiding ESLint/Prettier Conflicts
- `eslint-config-prettier` disables all ESLint formatting rules
- Prettier handles all code formatting
- ESLint focuses on code quality and error detection

### Format on Save (VSCode)
Requires VSCode settings for `.astro` files:
- Set `eslint.validate` to include `astro`
- Set `prettier.documentSelectors` for Astro files
- Set default formatter for Astro files

---

## Related GitHub Issues & Discussions

- [Offer to set up ESLint in create-astro](https://github.com/withastro/roadmap/discussions/621)
  - Discussion about adding ESLint to Astro's CLI setup (not yet implemented)

---

## Notes

- **No init command**: Astro doesn't have a built-in ESLint/Prettier init command
- **Manual setup required**: All packages and config files must be created manually
- **Flat config format**: Using modern ESLint flat config (`eslint.config.mjs`) instead of legacy `.eslintrc`
- **ES modules**: Both config files use `.mjs` extension for explicit ES module support
