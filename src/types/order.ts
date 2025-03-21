// src/types/order.ts

import { Decimal } from 'decimal.js';

// Enum types from Prisma schema
export enum DriverStatus {
  ASSIGNED = "assigned",
  ARRIVED_AT_VENDOR = "arrived_at_vendor",
  EN_ROUTE_TO_CLIENT = "en_route_to_client",
  ARRIVED_TO_CLIENT = "arrived_to_client",
  COMPLETED = "completed"
}

export enum OrderStatus {
  ACTIVE = 'active',
  ASSIGNED = 'assigned',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Define literal type based on the discriminator field we'll use
export type OrderType = 'catering' | 'on_demand';

export enum VehicleType {
  CAR = "Car",
  VAN = "Van",
  TRUCK = "Truck"
}

export enum NeedHost {
  YES = "yes",
  NO = "no"
}

// Define the FileUpload type based on the Prisma schema
export interface FileUpload {
  id: string;
  userId?: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: Date;
  updatedAt: Date;
  cateringRequestId?: bigint | null;
  onDemandId?: bigint | null;
  entityType: string;
  entityId: string;
  category?: string | null;
}

export interface Driver {
  id: string;
  name?: string | null;
  email?: string | null;
  contact_number?: string | null;
}

export interface Address {
  id: string;
  name?: string | null;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  county?: string | null;
  locationNumber?: string | null;
  parkingLoading?: string | null;
  isRestaurant: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

export interface Dispatch {
  id: string;
  cateringRequestId?: bigint | null;
  on_demandId?: bigint | null;  
  driverId?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  driver?: Driver | null;
}

// Using PrismaDecimal type to better handle Prisma's Decimal
export type PrismaDecimal = Decimal | { toFixed: (digits?: number) => string };

// Base interface for shared properties between order types
interface BaseOrder {
  id: bigint;
  guid?: string | null;
  user_id: string;
  address_id: string;
  delivery_address_id: string;
  order_number: string;
  date: Date | null;
  pickup_time: Date | null;
  arrival_time: Date | null;
  complete_time?: Date | null;
  client_attention: string;
  pickup_notes?: string | null;
  special_notes?: string | null;
  image?: string | null;
  status: OrderStatus;
  order_total?: PrismaDecimal | null;
  tip?: PrismaDecimal | null;
  driver_status?: DriverStatus | null;
  created_at: Date;
  updated_at: Date;
  user: User;
  address: Address;
  delivery_address: Address;
  dispatch: Dispatch[];
  fileUploads?: FileUpload[];
  
  // Discriminator field to determine the type at runtime
  order_type: OrderType;
}

// Update the interfaces
export interface CateringRequest extends BaseOrder {
  order_type: 'catering';
  brokerage?: string | null;
  headcount?: string | null;
  need_host: NeedHost;
  hours_needed?: string | null;
  number_of_host?: string | null;
}

export interface OnDemand extends BaseOrder {
  order_type: 'on_demand';
  item_delivered?: string | null;
  vehicle_type: VehicleType;
  hours_needed?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  weight?: string | null;
}

// Union type for all order types
export type Order = CateringRequest | OnDemand;

// Type guards
export function isCateringRequest(order: Order): order is CateringRequest {
  return order.order_type === 'catering';
}

export function isOnDemand(order: Order): order is OnDemand {
  return order.order_type === 'on_demand';
}

// Type-safe order factory function
export function createOrder(type: 'catering', data: Omit<CateringRequest, 'order_type'>): CateringRequest;
export function createOrder(type: 'on_demand', data: Omit<OnDemand, 'order_type'>): OnDemand;
export function createOrder(type: OrderType, data: any): Order {
  return {
    ...data,
    order_type: type
  };
}