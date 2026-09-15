import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

const categorySlugs = [
  "shops",
  "bakeries-cafes",
  "food",
  "beauty",
  "health",
  "animals",
  "kids-education",
  "sport",
  "home-repairs",
  "small-services",
  "automotive",
  "garden",
  "post-parcels",
  "institutions",
] as const;

const places = defineCollection({
  loader: file("src/data/places.yaml"),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "id musi być slugiem: małe litery, cyfry, myślniki"),
    name: z.string().min(1),
    category: z.enum(categorySlugs),
    location: z.enum(["ksieze", "nearby", "mobile"]),
    address: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    website: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).optional(),
    needs_verification: z.boolean().optional().default(false),
  }),
});

const categories = defineCollection({
  loader: file("src/data/categories.yaml"),
  schema: z.object({
    id: z.string(),
    slug: z.enum(categorySlugs),
    name: z.string().min(1),
    emoji: z.string().min(1),
  }),
});

const emergency = defineCollection({
  loader: file("src/data/emergency.yaml"),
  schema: z.object({
    id: z.string(),
    label: z.string().min(1),
    phones: z
      .array(
        z.object({
          note: z.string().min(1).optional(),
          number: z.string().min(1),
        }),
      )
      .optional()
      .default([]),
  }),
});

export const collections = { places, categories, emergency };
