// src/types/catering.ts
// Updated based on Prisma Schema provided on 2025-04-03

import { CateringNeedHost } from './order'; 

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

export interface CateringFormData {
  brokerage?: string; 
  orderNumber: string; 
  pickupAddressId: string;
  deliveryAddressId: string; 


  pickupDate: string;
  pickupTime: string; 
  arrivalDate?: string;
  arrivalTime?: string;
  completeDate?: string;
  completeTime?: string;
  

  headcount?: string;
  needHost: CateringNeedHost; 
  hoursNeeded?: string;
  numberOfHosts?: string; 
  clientAttention?: string; 
  pickupNotes?: string; 
  specialNotes?: string; 
  orderTotal?: string; 
  tip?: string; 


  pickupAddress?: Address; 
  deliveryAddress?: Address; 

}