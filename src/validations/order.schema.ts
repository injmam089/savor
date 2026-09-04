import { z } from 'zod';

export const orderSchema = z.object({
  orderType: z.enum(['DELIVERY', 'PICKUP', 'DINE_IN']),
  addressId: z.string().optional(),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'ONLINE']),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const addressSchema = z.object({
  house: z.string().min(1, 'House/Building is required').max(200),
  street: z.string().min(1, 'Street is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postalCode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit postal code'),
  landmark: z.string().max(200).optional(),
  isDefault: z.boolean().default(false),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
