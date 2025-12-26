# Tailwind CSS v4 Setup

**Date:** 2025-12-26
**Version:** 4.1.18
**Integration:** Vite Plugin

---

## Installation

```bash
npm install tailwindcss @tailwindcss/vite @tailwindcss/forms tailwind-merge tailwind-variants tw-animate-css @tabler/icons
```

**Packages:**

- `tailwindcss` + `@tailwindcss/vite` - Core framework with Vite integration
- `@tailwindcss/forms` - Form styling plugin
- `tailwind-merge` - Merge class names safely
- `tailwind-variants` - Type-safe variant system
- `tw-animate-css` - Additional animations
- `@tabler/icons` - Icon library

---

## Configuration

### 1. Astro Config

**File:** `astro.config.mjs`

```javascript
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### 2. CSS Configuration

**File:** `src/styles/starwind.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/forms";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Custom animations */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--starwind-accordion-content-height);
    }
  }
}

@theme inline {
  /* Map CSS variables to Tailwind utilities */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  /* Custom radius utilities */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 0.125rem);
}

:root {
  /* Light mode */
  --background: var(--color-white);
  --foreground: var(--color-neutral-950);
  --primary: var(--color-blue-700);
  --primary-foreground: var(--color-neutral-50);
  --border: var(--color-neutral-200);
  --radius: 0.625rem;
}

.dark {
  /* Dark mode */
  --background: var(--color-neutral-950);
  --foreground: var(--color-neutral-50);
  --primary: var(--color-blue-700);
  --primary-accent: var(--color-blue-400);
  --border: --alpha(var(--color-neutral-50) / 10%);
}

@layer base {
  * {
    @apply border-border outline-outline/50;
  }
  body {
    @apply bg-background text-foreground scheme-light dark:scheme-dark;
  }
  button {
    @apply cursor-pointer;
  }
}
```

### 3. Import in Layout

**File:** `src/layouts/Layout.astro`

```astro
---
import "@/styles/starwind.css";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Usage Examples

### Basic Utilities

```astro
<div class="container mx-auto px-4 py-16">
  <h1 class="text-4xl font-bold">Welcome to GlobalCore</h1>
  <p class="mt-4 text-muted-foreground">Using semantic color tokens</p>
</div>
```

### With tailwind-merge

```astro
---
import { twMerge } from "tailwind-merge";

interface Props {
  class?: string;
}

const { class: className } = Astro.props;
const classes = twMerge("default-styles p-4", className);
---

<div class={classes}>
  <slot />
</div>
```

### With tailwind-variants

```astro
---
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center rounded-md",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      outline: "border border-input bg-background",
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-base",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

interface Props extends VariantProps<typeof button> {}
const { variant, size } = Astro.props;
---

<button class={button({ variant, size })}>
  <slot />
</button>
```

---

## Customizing Brand Colors

### Change Primary Color

**File:** `src/styles/starwind.css`

```css
:root {
  /* Change from blue to purple */
  --primary: var(--color-purple-700);
  --primary-foreground: var(--color-neutral-50);
}

.dark {
  --primary: var(--color-purple-700);
  --primary-accent: var(--color-purple-400);
}
```

### Change Secondary Color

```css
:root {
  /* Change from fuchsia to green */
  --secondary: var(--color-green-700);
  --secondary-foreground: var(--color-neutral-50);
}
```

### Adjust Border Radius

```css
:root {
  /* More rounded */
  --radius: 1rem;

  /* Less rounded */
  --radius: 0.375rem;

  /* Sharp corners */
  --radius: 0;
}
```

### Add Custom Brand Color

```css
:root {
  /* Define custom color */
  --brand: oklch(60% 0.2 200);
}

@theme inline {
  /* Make available as Tailwind utility */
  --color-brand: var(--brand);
}
```

Usage: `bg-brand`, `text-brand`, `border-brand`

---

## Dark Mode

### Toggle Dark Mode

```javascript
// Toggle
const isDark = document.documentElement.classList.toggle("dark");

// Save preference
localStorage.setItem("theme", isDark ? "dark" : "light");
```

### Load Saved Theme

```javascript
// On page load
const theme = localStorage.getItem("theme") || "light";
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}
```

### Dark Mode Aware Styles

```astro
<div class="bg-white dark:bg-neutral-900">
  <p class="text-neutral-900 dark:text-white">Adapts to theme</p>
</div>
```

---

## Best Practices

### 1. Use Semantic Colors

```astro
<!-- ✅ Good - semantic, themeable -->
<div class="bg-primary text-primary-foreground">
  <!-- ❌ Avoid - hardcoded colors -->
  <div class="bg-blue-700 text-white"></div>
</div>
```

### 2. Use Path Aliases

```astro
<!-- ✅ Good -->import "@/styles/starwind.css";

<!-- ❌ Avoid -->
import "../../styles/starwind.css";
```

### 3. Keep Components Clean

```astro
<!-- ✅ Good - component with variants -->
<Button variant="primary">Click me</Button>

<!-- ❌ Too many utilities inline -->
<button class="inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap..."></button>
```

### 4. Mobile-First

```astro
<!-- ✅ Correct - mobile default, larger overrides -->
<div class="text-sm md:text-base lg:text-lg">
  <!-- ❌ Desktop-first -->
  <div class="text-lg md:text-base sm:text-sm"></div>
</div>
```

---

## VS Code IntelliSense

### Install Extension

**Extension:** Tailwind CSS IntelliSense

### Configure

**File:** `.vscode/settings.json`

```json
{
  "tailwindCSS.includeLanguages": {
    "astro": "html"
  },
  "tailwindCSS.experimental.classRegex": [["tv\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]]
}
```

**Features:**

- Autocomplete in `.astro` files
- Works with `tv()` variants
- Color previews on hover
- Invalid class warnings

---

## Troubleshooting

### Styles Not Loading

```bash
# Clear cache and restart
rm -rf .astro dist node_modules/.vite
npm run dev
```

### IntelliSense Not Working

1. Install Tailwind CSS IntelliSense extension
2. Add settings above to `.vscode/settings.json`
3. Reload VS Code: `Cmd+Shift+P` → "Developer: Reload Window"

### Dark Mode Not Switching

Check:

```javascript
// Verify class is applied
console.log(document.documentElement.classList.contains("dark"));
```

---

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind v4 Beta Announcement](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [Vite Plugin Integration](https://tailwindcss.com/docs/installation/using-vite)

---

**Key Differences from v3:**

- No `tailwind.config.js` needed
- CSS-based configuration
- Vite plugin instead of Astro integration
- Faster builds and better performance
