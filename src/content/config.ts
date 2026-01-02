/**
 * Content Collections Configuration
 *
 * Collections are defined in ./_collections/
 * Schemas are defined in ./_schemas/
 */
import { heroCollection } from "./_collections/hero";
import { seoCollection } from "./_collections/seo";
import { pageSectionsCollection } from "./_collections/pageSections";

export const collections = {
  hero: heroCollection,
  seo: seoCollection,
  pageSections: pageSectionsCollection,
};
