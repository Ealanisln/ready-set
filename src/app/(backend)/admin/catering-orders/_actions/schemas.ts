import { z } from 'zod';

// Define a simple type for the client list
export interface ClientListItem {
  id: string;
  name: string;
}

// Define potential error types
export interface ActionError {
  error: string;
}

// Enum definitions mirroring Prisma schema
const CateringNeedHostEnum = z.enum(['YES', 'NO']);

// Base address schema
export const addressSchema = z.object({
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required").max(2, "State must be 2 characters"),
  zip: z.string().min(5, "Zip code is required").regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format"),
  county: z.string().optional().nullable(),
});

// Schema for the create catering order form
export const createCateringOrderSchema = z.object({
  userId: z.string().uuid("Invalid client ID"),
  orderNumber: z.string().optional(),
  brokerage: z.string().optional().nullable(),
  pickupDateTime: z.date({ required_error: "Pickup date and time are required" }),
  arrivalDateTime: z.date({ required_error: "Arrival date and time are required" }),
  completeDateTime: z.date().optional().nullable(),
  headcount: z.number().int().positive("Headcount must be a positive number").optional().nullable(),
  needHost: CateringNeedHostEnum,
  hoursNeeded: z.number().positive("Hours must be positive").optional().nullable(),
  numberOfHosts: z.number().int().positive("Number of hosts must be positive").optional().nullable(),
  clientAttention: z.string().optional().nullable(),
  pickupNotes: z.string().optional().nullable(),
  specialNotes: z.string().optional().nullable(),
  orderTotal: z.number().positive("Order total must be positive").optional().nullable(),
  tip: z.number().nonnegative("Tip cannot be negative").optional().nullable(),
  pickupAddress: addressSchema,
  deliveryAddress: addressSchema,
});

// Type inferred from the schema
export type CreateCateringOrderInput = z.infer<typeof createCateringOrderSchema>;

// Define success/error return type for the action
export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
  fieldErrors?: z.ZodFormattedError<CreateCateringOrderInput>;
} 