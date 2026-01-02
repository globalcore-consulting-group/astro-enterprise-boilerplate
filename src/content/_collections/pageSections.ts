import { defineCollection } from "astro:content";
import { pageSectionsSchema } from "../_schemas/pageSections";

/**
 * Page sections collection
 * Used for structured page content sections (cards, CTAs, one-liners)
 */
export const pageSectionsCollection = defineCollection({
  type: "data",
  schema: pageSectionsSchema,
});
