import { z } from "astro:content";

/**
 * Shared CTA button schema
 * Used across all components for call-to-action buttons
 */
export const ctaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
});

export type Cta = z.infer<typeof ctaSchema>;
