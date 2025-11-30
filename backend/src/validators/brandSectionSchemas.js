import { z } from 'zod';

const BRANDS = [
  "Beverly Hills Polo Club",
  "FILA",
  "Converse",
  "Havaianas",
  "Gigi",
  "MLB",
  "Nike",
  "Pedro"
];

export const createBrandSectionSchema = z.object({
  sectionName: z.string().min(1, 'Section name is required'),
  brand: z.enum(BRANDS),
  bannerImage: z.string().url('Invalid banner image URL'),
  productIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID')).max(8, 'Maximum 8 products allowed').optional().default([]),
  order: z.number().int().min(0).optional().default(0),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export const updateBrandSectionSchema = createBrandSectionSchema.partial();

