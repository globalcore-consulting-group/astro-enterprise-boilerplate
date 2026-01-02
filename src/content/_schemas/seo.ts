import { z } from "astro:content";

/**
 * SEO metadata schema
 * Used for page-level SEO configuration
 */
export const seoSchema = z.object({
  title: z.string().min(1, "SEO title is required"),
  description: z.string().min(1, "SEO description is required"),
  noIndex: z.boolean().default(false),
});

export type SeoMetadata = z.infer<typeof seoSchema>;
