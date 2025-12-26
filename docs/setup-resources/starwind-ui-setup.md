# Starwind UI Setup

**Date:** 2025-12-26
**Component Version:** Button 2.2.0
**Depends On:** Tailwind CSS v4, tailwind-variants

---

## Installation

### 1. Initialize Starwind UI

```bash
npx starwind@latest init
```

This command:

- Creates `starwind.config.json`
- Configures `astro.config.mjs`
- Installs required dependencies

### 2. Add Components

**Interactive selection:**

```bash
npx starwind@latest add
```

**Add specific component:**

```bash
npx starwind@latest add button
npx starwind@latest add input
npx starwind@latest add card
```

Components are installed to `src/components/starwind/` by default.

---

## Configuration

**File:** `starwind.config.json`

```json
{
  "$schema": "https://starwind.dev/config-schema.json",
  "tailwind": {
    "css": "src/styles/starwind.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "componentDir": "src/components",
  "components": [
    {
      "name": "button",
      "version": "2.2.0"
    }
  ]
}
```

**Settings:**

- `css`: Path to Tailwind CSS file
- `baseColor`: Neutral color palette (neutral, slate, zinc, gray)
- `cssVariables`: Enable CSS variables for theming
- `components`: Track installed components

---

## Button Component

### File Structure

```
src/components/starwind/button/
├── Button.astro      # Component implementation
└── index.ts          # Barrel export
```

### Implementation

**Key Features:**

- 9 variants (default, primary, secondary, outline, ghost, info, success, warning, error)
- 6 sizes (sm, md, lg, icon, icon-sm, icon-lg)
- Renders `<button>` or `<a>` based on props
- Full TypeScript support
- Accessibility built-in

---

## Usage Examples

### Basic Usage

```astro
---
import { Button } from "@/components/starwind/button";
---

<Button>Click me</Button>
```

### Variants

```astro
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="error">Delete</Button>
```

### Sizes

```astro
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### As Link

```astro
<Button href="/about">Go to About</Button>
<Button href="https://example.com" target="_blank"> External Link </Button>
```

### Icon Button

```astro
<Button variant="ghost" size="icon">
  <svg><!-- icon --></svg>
</Button>
```

### Disabled

```astro
<Button disabled>Disabled</Button>
```

### Custom Classes

```astro
<Button variant="primary" size="lg" class="w-full"> Full Width </Button>
```

---

## Available Variants

| Variant     | Purpose            | Use Case               |
| ----------- | ------------------ | ---------------------- |
| `default`   | High contrast      | Generic actions        |
| `primary`   | Main action        | Primary CTA            |
| `secondary` | Secondary action   | Alternative CTA        |
| `outline`   | Subtle bordered    | Secondary actions      |
| `ghost`     | Minimal            | Tertiary actions       |
| `info`      | Informational      | Info messages          |
| `success`   | Positive action    | Confirm, save          |
| `warning`   | Caution            | Warnings               |
| `error`     | Destructive action | Delete, remove, cancel |

---

## Customizing Colors

### Change Primary Color

**File:** `src/styles/starwind.css`

```css
:root {
  --primary: var(--color-purple-700);
  --primary-foreground: var(--color-neutral-50);
}

.dark {
  --primary: var(--color-purple-700);
  --primary-accent: var(--color-purple-400);
}
```

### Add Custom Variant

**File:** `src/components/starwind/button/Button.astro`

```typescript
variants: {
  variant: {
    // ... existing variants
    brand: "bg-brand text-brand-foreground hover:bg-brand/90",
  },
}
```

Define color in CSS:

```css
:root {
  --brand: oklch(55% 0.25 320);
  --brand-foreground: var(--color-white);
}

@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
}
```

---

## Best Practices

### 1. Semantic Variants

```astro
<!-- ✅ Good -->
<Button variant="error">Delete Account</Button>

<!-- ❌ Unclear -->
<Button variant="primary">Delete Account</Button>
```

### 2. Consistent Sizing

```astro
<!-- ✅ Good -->
<Input size="md" />
<Button size="md">Submit</Button>

<!-- ❌ Inconsistent -->
<Input size="lg" />
<Button size="sm">Submit</Button>
```

### 3. Path Aliases

```astro
<!-- ✅ Good -->import {Button} from "@/components/starwind/button";

<!-- ❌ Avoid -->
import {Button} from "../../components/starwind/button";
```

---

## Common Use Cases

### Call-to-Action

```astro
<Button variant="primary" size="lg" class="w-full md:w-auto"> Get Started </Button>
```

### Form Actions

```astro
<div class="flex gap-2">
  <Button type="submit" variant="primary">Save</Button>
  <Button type="button" variant="ghost">Cancel</Button>
</div>
```

### Destructive Action

```astro
<Button variant="error" size="sm">
  <svg><!-- trash icon --></svg>
  Delete
</Button>
```

### Loading State

```astro
<Button disabled>
  <svg class="animate-spin"><!-- spinner --></svg>
  Loading...
</Button>
```

---

## Accessibility

Built-in features:

- ✅ Semantic `<button>` or `<a>` tags
- ✅ Focus visible ring indicators
- ✅ Disabled state handling
- ✅ Accepts all HTML attributes

**Examples:**

```astro
<!-- Icon button with label -->
<Button aria-label="Close dialog" size="icon">
  <svg><!-- X icon --></svg>
</Button>

<!-- Loading state -->
<Button disabled aria-busy="true"> Loading... </Button>

<!-- External link -->
<Button href="https://example.com" target="_blank" rel="noopener noreferrer"> Learn More </Button>
```

---

## Adding More Components

### Using CLI (Recommended)

```bash
# Interactive selection
npx starwind@latest add

# Specific components
npx starwind@latest add input
npx starwind@latest add card
npx starwind@latest add modal
```

### Common Next Components

- **Input** - Form inputs
- **Card** - Content containers
- **Modal/Dialog** - Overlays
- **Select** - Dropdowns
- **Badge** - Labels/status indicators

---

## Resources

- [Starwind UI Documentation](https://starwind.dev/)
- [CLI Documentation](https://starwind.dev/docs/getting-started/cli/)
- [Component Library](https://starwind.dev/components)
- [tailwind-variants Docs](https://www.tailwind-variants.org/)

Sources:

- [Command Line Interface - Starwind UI](https://starwind.dev/docs/getting-started/cli/)
- [Initial Setup](https://starwind.dev/docs/getting-started/installation/)
