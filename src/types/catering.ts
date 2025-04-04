// src/types/catering.ts
// Updated based on Prisma Schema provided on 2025-04-03

// Import the enum if not already globally available or defined here
import { CateringNeedHost } from './order'; // Assuming it's defined in order.ts

// Address subset - No changes needed based on comparison
export interface Address {
  id: string;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  locationNumber?: string | null;
  parkingLoading?: string | null;
  isRestaurant: boolean;
  isShared: boolean;
}

// Form data for creating/editing a Catering Request
// Field names updated to camelCase matching Prisma model where applicable
// Types remain strings as expected for form inputs before parsing/conversion
export interface CateringFormData {
  brokerage?: string; // Optional in Prisma
  orderNumber: string; // camelCase
  pickupAddressId: string; // Use ID for selection (camelCase)
  deliveryAddressId: string; // Use ID for selection (camelCase)

  // Representing combined DateTime fields - adjust based on actual form inputs
  // Option 1: Combined input
  // pickupDateTime: string; // e.g., "YYYY-MM-DDTHH:mm"
  // arrivalDateTime?: string;
  // completeDateTime?: string;
  // Option 2: Separate inputs (more common in forms)
  pickupDate: string; // e.g., "YYYY-MM-DD"
  pickupTime: string; // e.g., "HH:mm"
  arrivalDate?: string;
  arrivalTime?: string;
  completeDate?: string;
  completeTime?: string;
  // date: string; // Removed, use specific fields above
  // pickup_time: string; // Removed
  // arrival_time: string; // Removed
  // complete_time?: string; // Removed

  headcount?: string; // Keep as string for form input (Prisma Int?)
  needHost: CateringNeedHost; // Use enum (camelCase)
  hoursNeeded?: string; // Keep as string for form input (Prisma Float?) (camelCase)
  numberOfHosts?: string; // Keep as string for form input (Prisma Int?) (camelCase)
  clientAttention?: string; // Optional in Prisma (camelCase)
  pickupNotes?: string; // (camelCase)
  specialNotes?: string; // (camelCase)
  orderTotal?: string; // Keep as string for form input (Prisma Decimal?) (camelCase)
  tip?: string; // Keep as string for form input (Prisma Decimal?)

  // These might represent NEW address data entered in the form,
  // or could be removed if only selecting existing addresses via IDs above.
  pickupAddress?: Address; // Keep if allowing creation of new address via this form
  deliveryAddress?: Address; // Keep if allowing creation of new address via this form

  // If pickup/delivery address data is only for display after selecting an ID,
  // then pickupAddressId/deliveryAddressId are sufficient in the form data itself.
}