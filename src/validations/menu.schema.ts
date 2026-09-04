import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  price: z.number().positive('Price must be positive').max(10000, 'Price seems too high'),
  categoryId: z.string().min(1, 'Category is required'),
  isVeg: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  prepTime: z.number().int().positive().max(120).default(20),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  image: z.string().optional(),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
