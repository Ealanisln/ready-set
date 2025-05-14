// Base types for all models
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Order related types
export interface BaseOrder extends BaseModel {
  orderNumber: string;
  status: string;
  pickupDateTime: Date | null;
  arrivalDateTime: Date | null;
  orderTotal: number | null;
  pickupNotes?: string | null;
  specialNotes?: string | null;
  clientAttention?: string | null;
  userId: string;
  pickupAddressId: string;
  deliveryAddressId: string;
}

export interface CateringOrder extends BaseOrder {
  type: 'catering';
  brokerage: string;
  headcount: number;
  needHost: string;
  hoursNeeded?: number;
  numberOfHosts?: number;
}

export interface OnDemandOrder extends BaseOrder {
  type: 'on_demand';
  itemDelivered?: string;
  vehicleType?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
}

// User related types
export interface User extends BaseModel {
  email: string;
  name?: string | null;
  type: string;
  phone?: string | null;
}

// Address related types
export interface Address extends BaseModel {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  userId: string;
}

// Helper type for combined orders
export type CombinedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  pickupDateTime: Date | null;
  arrivalDateTime: Date | null;
  orderTotal: number | null;
  orderType: 'catering' | 'on_demand';
}; 