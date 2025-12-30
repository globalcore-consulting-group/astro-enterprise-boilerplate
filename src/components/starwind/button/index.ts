/**
 * Button component utilities
 *
 * Import the component directly:
 * import Button from '@/components/starwind/button/Button.astro'
 *
 * This file exports variants and types only (not the component).
 * Reason: Astro components don't support barrel exports.
 */

export { button } from "./Button.variants";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";
