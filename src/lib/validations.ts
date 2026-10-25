import { z } from 'zod';

export const customerDetailsSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  address: z.string().optional(),
});

export const vehicleDetailsSchema = z.object({
  make: z.string().min(1, 'Vehicle make is required'),
  model: z.string().min(1, 'Vehicle model is required'),
  registrationNo: z.string().min(1, 'Registration number is required'),
  odometer: z.string().optional(),
  serviceDate: z.string().min(1, 'Service date is required'),
});

export const invoiceItemSchema = z.object({
  id: z.string(),
  sNo: z.number().int().positive(),
  description: z.string().min(1, 'Service description is required'),
  category: z.string().optional(),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().min(0, 'Price cannot be negative'),
  amount: z.number().min(0),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  customer: customerDetailsSchema,
  vehicle: vehicleDetailsSchema,
  items: z.array(invoiceItemSchema).min(1, 'At least one service item is required'),
});

export type CustomerFormValues = z.infer<typeof customerDetailsSchema>;
export type VehicleFormValues = z.infer<typeof vehicleDetailsSchema>;
export type InvoiceItemFormValues = z.infer<typeof invoiceItemSchema>;
