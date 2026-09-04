import { z } from 'zod';

export const reservationSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().int().min(1, 'At least 1 guest').max(20, 'Maximum 20 guests'),
  seatingPreference: z.enum(['INDOOR', 'OUTDOOR', 'BALCONY']).default('INDOOR'),
  specialRequest: z.string().max(500).optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
