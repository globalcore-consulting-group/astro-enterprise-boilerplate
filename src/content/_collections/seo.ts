import { defineCollection } from "astro:content";
import { seoSchema } from "../_schemas/seo";

/**
 * SEO collection
 * Used for page-level SEO metadata
 */
export const seoCollection = defineCollection({
  type: "data",
  schema: seoSchema,
});
