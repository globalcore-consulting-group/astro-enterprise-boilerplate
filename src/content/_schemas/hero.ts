import { z } from "astro:content";
import { ctaSchema } from "./shared";

/**
 * Hero section schema
 * Used for hero sections on pages
 */
export const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  image: z.string().optional(),
});

export type Hero = z.infer<typeof heroSchema>;
