import { z } from "astro:content";
import { ctaSchema } from "./shared";

/**
 * Card item schema
 * Used in cards-type sections
 */
const cardItemSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  href: z.string().optional(),
});

/**
 * Cards section schema
 * Displays a grid of cards with title, intro, and items
 */
const cardsSectionSchema = z.object({
  type: z.literal("cards"),
  id: z.string().min(1),
  anchor: z.string().min(1),
  title: z.string().min(1),
  intro: z.string().min(1),
  items: z.array(cardItemSchema).min(1),
});

/**
 * One-liner section schema
 * Displays a title with a concise statement and optional body text
 */
const oneLinerSectionSchema = z.object({
  type: z.literal("oneLiner"),
  id: z.string().min(1),
  anchor: z.string().min(1),
  title: z.string().min(1),
  oneLiner: z.string().min(1),
  body: z.string().optional(),
});

/**
 * CTA strip section schema
 * Displays a title with primary and optional secondary CTA buttons
 */
const ctaStripSectionSchema = z.object({
  type: z.literal("ctaStrip"),
  id: z.string().min(1),
  title: z.string().min(1),
  primary: ctaSchema,
  secondary: ctaSchema.optional(),
});

/**
 * Page sections schema
 * Discriminated union of all section types
 */
export const pageSectionsSchema = z.object({
  sections: z.array(z.discriminatedUnion("type", [cardsSectionSchema, oneLinerSectionSchema, ctaStripSectionSchema])),
});

export type PageSections = z.infer<typeof pageSectionsSchema>;
export type CardsSection = z.infer<typeof cardsSectionSchema>;
export type OneLinerSection = z.infer<typeof oneLinerSectionSchema>;
export type CtaStripSection = z.infer<typeof ctaStripSectionSchema>;
export type CardItem = z.infer<typeof cardItemSchema>;
