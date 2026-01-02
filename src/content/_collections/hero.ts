import { defineCollection } from "astro:content";
import { heroSchema } from "../_schemas/hero";

/**
 * Hero collection
 * Used for hero sections on pages
 */
export const heroCollection = defineCollection({
  type: "data",
  schema: heroSchema,
});
