// src/types/order.ts
// Updated based on Prisma Schema provided on 2025-04-03

// --- Enums (Matching Prisma Schema Names/Values) ---
export enum DriverStatus {
  ASSIGNED = "ASSIGNED", // Match Prisma values
  ARRIVED_AT_VENDOR = "ARRIVED_AT_VENDOR",
  EN_ROUTE_TO_CLIENT = "EN_ROUTE_TO_CLIENT",
  ARRIVED_TO_CLIENT = "ARRIVED_TO_CLIENT",
  COMPLETED = "COMPLETED"
}

// Combined enum for order status. Ensure values cover both CateringStatus and OnDemandStatus from Prisma.
export enum OrderStatus {
  ACTIVE = 'ACTIVE', // Match Prisma values
  ASSIGNED = 'ASSIGNED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// Define literal type based on the discriminator field we'll use
export type OrderType = 'catering' | 'on_demand';

export enum VehicleType { // Match Prisma names/values
  CAR = "CAR",
  VAN = "VAN",
  TRUCK = "TRUCK"
}

export enum CateringNeedHost { // Renamed and matching Prisma names/values
  YES = "YES",
  NO = "NO"
}

// --- Interfaces (Updated based on Prisma Schema) ---

// Define the FileUpload type based on the Prisma schema
// NOTE: Ideally, import this from a central types file (e.g., src/types/prisma.ts or src/types/user.ts)
export interface FileUpload {
  id: string; // Prisma: String @id
  userId?: string | null; // Prisma: String?
  fileName: string; // Prisma: String
  fileType: string; // Prisma: String
  fileSize: number; // Prisma: Int
  fileUrl: string; // Prisma: String
  uploadedAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  updatedAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  // Relation IDs are Strings (UUIDs) in Prisma
  cateringRequestId?: string | null; // Prisma: String? @db.Uuid
  onDemandId?: string | null; // Prisma: String? @db.Uuid
  jobApplicationId?: string | null; // Prisma: String? @db.Uuid (Added from schema)
  // entityType: string; // Removed, use specific relation IDs
  // entityId: string; // Removed, use specific relation IDs
  category?: string | null; // Prisma: String?
  isTemporary: boolean; // Prisma: Boolean (Added from schema)
}

// Represents a view/subset of the Profile model where type is DRIVER
export interface Driver {
  id: string; // Prisma: Profile.id (String)
  name?: string | null; // Prisma: Profile.name (String?)
  email?: string | null; // Prisma: Profile.email (String - required in Profile, maybe optional here?)
  contactNumber?: string | null; // Prisma: Profile.contactNumber (String?, camelCase)
}

// Represents the Address model
export interface Address {
  id: string; // Prisma: String @id
  name?: string | null; // Prisma: String?
  street1: string; // Prisma: String
  street2?: string | null; // Prisma: String?
  city: string; // Prisma: String
  state: string; // Prisma: String
  zip: string; // Prisma: String
  county?: string | null; // Prisma: String?
  locationNumber?: string | null; // Prisma: String?
  parkingLoading?: string | null; // Prisma: String?
  isRestaurant: boolean; // Prisma: Boolean
  isShared: boolean; // Prisma: Boolean
  createdAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  updatedAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  createdBy?: string | null; // Prisma: String? @db.Uuid
  latitude?: number | null; // Prisma: Float? (Added from schema)
  longitude?: number | null; // Prisma: Float? (Added from schema)
  deletedAt?: Date | string | null; // Prisma: DateTime? (Added from schema)
}

// Represents a view/subset of the Profile model
export interface User {
  id: string; // Prisma: Profile.id (String)
  name?: string | null; // Prisma: Profile.name (String?)
  email?: string | null; // Prisma: Profile.email (String - required in Profile, maybe optional here?)
  contactNumber?: string | null; // Prisma: Profile.contactNumber (String?, camelCase)
}

// Represents the Dispatch model
export interface Dispatch {
  id: string; // Prisma: String @id
  // Relation IDs are Strings (UUIDs) in Prisma
  cateringRequestId?: string | null; // Prisma: String? @db.Uuid
  onDemandId?: string | null; // Prisma: String? @db.Uuid (camelCase)
  driverId?: string | null; // Prisma: String? @db.Uuid
  userId?: string | null; // Prisma: String? @db.Uuid
  createdAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  updatedAt: Date | string; // Prisma: DateTime. Allow string for JSON.
  driver?: Driver | null; // Relation to Driver (Profile subset)
}

// Use 'number' for simplicity unless Decimal precision is strictly required frontend.
// export type PrismaDecimal = Decimal | { toFixed: (digits?: number) => string };
export type PrismaDecimal = number;

// Base interface merging CateringRequest and OnDemand properties (camelCase, updated types)
interface BaseOrder {
  id: string; // Prisma: String @id
  guid?: string | null; // Prisma: String?
  userId: string; // Prisma: String @db.Uuid (camelCase)
  pickupAddressId: string; // Prisma: String @db.Uuid (camelCase)
  deliveryAddressId: string; // Prisma: String @db.Uuid (camelCase)
  orderNumber: string; // Prisma: String (camelCase)

  // Use combined DateTime fields from Prisma (camelCase)
  pickupDateTime?: Date | string | null; // Prisma: DateTime? (Catering), DateTime (OnDemand)
  arrivalDateTime?: Date | string | null; // Prisma: DateTime?
  completeDateTime?: Date | string | null; // Prisma: DateTime?

  clientAttention?: string | null; // Prisma: String? (Catering), String (OnDemand) - Keep optional here
  pickupNotes?: string | null; // Prisma: String? @db.Text (camelCase)
  specialNotes?: string | null; // Prisma: String? @db.Text (camelCase)
  image?: string | null; // Prisma: String?
  status: OrderStatus; // Use the combined OrderStatus enum (ensure it covers CateringStatus/OnDemandStatus)
  orderTotal?: PrismaDecimal | null; // Prisma: Decimal? (camelCase). Use number or Decimal.js type.
  tip?: PrismaDecimal | null; // Prisma: Decimal? Use number or Decimal.js type.
  driverStatus?: DriverStatus | null; // Prisma: DriverStatus? (camelCase) - Use Enum
  createdAt: Date | string; // Prisma: DateTime (camelCase). Allow string for JSON.
  updatedAt: Date | string; // Prisma: DateTime (camelCase). Allow string for JSON.
  deletedAt?: Date | string | null; // Prisma: DateTime? (Added from schema)

  // Relations (camelCase names)
  user: User; // Relation to User (Profile subset)
  pickupAddress: Address; // Relation to Address
  deliveryAddress: Address; // Relation to Address
  dispatches: Dispatch[]; // Relation to Dispatch (pluralized)
  fileUploads?: FileUpload[]; // Relation to FileUpload

  // Discriminator field to determine the type at runtime
  order_type: OrderType;
}

// Updated CateringRequest interface (based on Prisma CateringRequest)
export interface CateringRequest extends BaseOrder {
  order_type: 'catering';
  brokerage?: string | null; // Prisma: String?
  headcount?: number | null; // Prisma: Int?
  needHost: CateringNeedHost; // Prisma: CateringNeedHost (camelCase) - Use Enum
  hoursNeeded?: number | null; // Prisma: Float? (camelCase)
  numberOfHosts?: number | null; // Prisma: Int? (camelCase)
}

// Updated OnDemand interface (based on Prisma OnDemand)
export interface OnDemand extends BaseOrder {
  order_type: 'on_demand';
  itemDelivered?: string | null; // Prisma: String? (camelCase)
  vehicleType: VehicleType; // Prisma: VehicleType - Use Enum
  // hoursNeeded is also present in Prisma OnDemand
  hoursNeeded?: number | null; // Prisma: Float? (camelCase)
  // Dimensions/Weight are Floats in Prisma
  length?: number | null; 
  width?: number | null; 
  height?: number | null; 
  weight?: number | null;
}

// --- Union Type & Helpers ---

// Union type for all order types
export type Order = CateringRequest | OnDemand;

// Type guards (no changes needed, rely on updated interfaces)
export function isCateringRequest(order: Order): order is CateringRequest {
  return order.order_type === 'catering';
}

export function isOnDemand(order: Order): order is OnDemand {
  return order.order_type === 'on_demand';
}

// Type-safe order factory function (no changes needed, rely on updated interfaces)
export function createOrder(type: 'catering', data: Omit<CateringRequest, 'order_type'>): CateringRequest;
export function createOrder(type: 'on_demand', data: Omit<OnDemand, 'order_type'>): OnDemand;
export function createOrder(type: OrderType, data: any): Order {
  return {
    ...data,
    order_type: type
  };
}