import { defineCollection, z } from "astro:content";

/**
 * Hero collection schema
 * Used for hero sections on pages
 */
const heroCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    primaryCta: z.object({
      text: z.string().min(1),
      href: z.string().min(1),
    }),
    secondaryCta: z
      .object({
        text: z.string().min(1),
        href: z.string().min(1),
      })
      .optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  hero: heroCollection,
};
