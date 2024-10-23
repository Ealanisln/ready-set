// src/types/order.ts
import { UploadThingFile } from "@/hooks/use-upload-file";

// Enum types from Prisma schema
export enum DriverStatus {
  assigned = "assigned",
  arrived_at_vendor = "arrived_at_vendor",
  en_route_to_client = "en_route_to_client",
  arrived_to_client = "arrived_to_client",
  completed = "completed"
}

export enum OrderStatus {
  active = 'active',
  assigned = 'assigned',
  cancelled = 'cancelled',
  completed = 'completed'
}

export type OrderType = 'catering' | 'on_demand';  

export enum VehicleType {
  Car = "Car",
  Van = "Van",
  Truck = "Truck"
}

export enum NeedHost {
  yes = "yes",
  no = "no"
}


export interface Driver {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
}

export interface Address {
  id: string; // Changed to string based on Prisma schema (cuid)
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
  name: string | null;
  email: string | null;
}

export interface Dispatch {
  id: string;
  cateringRequestId?: number | null;
  onDemandId?: number | null;
  driverId?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  driver: Driver;
}

// Base interface for shared properties between order types
interface BaseOrder {
  id: number; // Changed to BigInt/number based on Prisma schema
  guid: string | null;
  user_id: string;
  address_id: string;
  delivery_address_id: string;
  order_number: string;
  date: string | Date;
  pickup_time: string | Date;
  arrival_time: string | Date;
  complete_time: string | Date | null;
  client_attention: string | null;
  pickup_notes: string | null;
  special_notes: string | null;
  image: string | null;
  status: OrderStatus;
  order_total: string | number | null;  
  tip: string | number | null;  
  driver_status: DriverStatus | null;
  created_at: string | Date;
  updated_at: string | Date;
  user: User;
  address: Address;
  delivery_address: Address;
  dispatch: Dispatch[];
  fileUploads?: UploadThingFile[];
}

// Update the interfaces
export interface CateringRequest extends BaseOrder {
  order_type: "catering";  // changed from "catering_request"
  brokerage?: string | null;
  headcount?: string | null;
  need_host?: NeedHost;
  hours_needed?: string | null;
  number_of_host?: string | null;
}

export interface OnDemand extends BaseOrder {
  order_type: "on_demand";
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

// Update the type guards
export function isCateringRequest(order: Order): order is CateringRequest {
  return order.order_type === "catering";  // changed from "catering_request"
}

export function isOnDemand(order: Order): order is OnDemand {
  return order.order_type === "on_demand";
}