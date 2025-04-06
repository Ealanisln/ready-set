// src/types/user.ts
// Updated based on Prisma Schema provided on 2025-04-03

// --- Enums ---
// These should match your Prisma schema's enums

export enum UserType {
  VENDOR = 'vendor',
  CLIENT = 'client',
  DRIVER = 'driver',
  ADMIN = 'admin',
  HELPDESK = 'helpdesk',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',   // Use lowercase
  PENDING = 'pending', // Use lowercase
  DELETED = 'deleted', // Use lowercase
}

export enum DriverStatus { // Added from Prisma Schema
  ARRIVED_AT_VENDOR = 'ARRIVED_AT_VENDOR',
  EN_ROUTE_TO_CLIENT = 'EN_ROUTE_TO_CLIENT',
  ARRIVED_TO_CLIENT = 'ARRIVED_TO_CLIENT',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
}

export enum CateringNeedHost { // Added from Prisma Schema
  YES = 'YES',
  NO = 'NO',
}

export enum CateringStatus { // Added from Prisma Schema
  ACTIVE = 'ACTIVE',
  ASSIGNED = 'ASSIGNED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

// --- Interfaces ---

// Base User interface mirroring relevant fields from Prisma's `Profile` model
export interface User {
  id: string;
  guid?: string | null; // Prisma: String?
  name?: string | null; // Prisma: String? Use this for driver/admin names
  email: string; // Prisma: String (Required)
  // emailVerified?: Date; // Removed, not in Profile model
  image?: string | null; // Prisma: String?
  type: UserType; // Prisma: UserType (Required)
  companyName?: string | null; // Prisma: String? (camelCase)
  contactName?: string | null; // Prisma: String? (camelCase) Use this for vendor/client contact names
  contactNumber?: string | null; // Prisma: String? (camelCase)
  website?: string | null; // Prisma: String?
  street1?: string | null; // Prisma: String?
  street2?: string | null; // Prisma: String?
  city?: string | null; // Prisma: String?
  state?: string | null; // Prisma: String?
  zip?: string | null; // Prisma: String?
  locationNumber?: string | null; // Prisma: String? (camelCase)
  parkingLoading?: string | null; // Prisma: String? (camelCase)
  counties?: any | null; // Prisma: Json? - Use 'any' or a specific interface if the structure is known, e.g., string[]
  timeNeeded?: string | null; // Prisma: String? (camelCase) - Note: Form uses string[]
  cateringBrokerage?: string | null; // Prisma: String? (camelCase) - Note: Form uses string[]
  frequency?: string | null; // Prisma: String?
  provide?: string | null; // Prisma: String? - Note: Form uses string[]
  headCount?: number | null; // Prisma: Int? (camelCase)
  status: UserStatus; // Prisma: UserStatus (Required)
  sideNotes?: string | null; // Prisma: String? @db.Text (camelCase)
  confirmationCode?: string | null; // Prisma: String? (camelCase)
  createdAt: string | Date; // Prisma: DateTime (Required, camelCase). Allow string for JSON parsing.
  updatedAt: string | Date; // Prisma: DateTime (Required, camelCase). Allow string for JSON parsing.
  isTemporaryPassword: boolean; // Prisma: Boolean (Required)
  deletedAt?: string | Date | null; // Prisma: DateTime? (Added for soft delete)
}

// Interface representing the data structure within the User Profile Form
// Updated to match camelCase and types where applicable from the new User interface
export interface UserFormValues {
  id: string; // Always need the ID

  // Form-specific combined name field (assuming this maps from User.name or User.contactName)
  displayName: string;

  // Fields directly mapping to User interface, using enums where applicable
  email: string; // Required field
  contactNumber: string | null; // Optional field (maps to User.contactNumber)
  type: UserType | null; // Use the UserType enum for the form state (allow null for initial state)
  status: UserStatus | null; // Use the UserStatus enum for the form state (allow null for initial state)

  companyName: string | null; // Optional field (maps to User.companyName)
  website: string | null; // Optional field (maps to User.website)
  street1: string | null; // Optional field (maps to User.street1)
  street2: string | null; // Optional field (maps to User.street2)
  city: string | null; // Optional field (maps to User.city)
  state: string | null; // Optional field (maps to User.state)
  zip: string | null; // Optional field (maps to User.zip)
  locationNumber: string | null; // Optional field (maps to User.locationNumber)
  parkingLoading: string | null; // Optional field (maps to User.parkingLoading)
  frequency: string | null; // Optional field (maps to User.frequency)
  headCount: number | string | null; // Optional field (maps to User.headCount), allow string for form input flexibility before parsing
  sideNotes: string | null; // Optional field (maps to User.sideNotes)

  // Array representations for multi-select/checkbox form controls
  // These correspond to User fields that might be stored as JSON (counties) or String (others) in DB
  // The transformation (e.g., join/split) happens between the form and the data layer.
  countiesServed: string[]; // Corresponds to User.counties (Json? -> likely array)
  timeNeeded: string[]; // Corresponds to User.timeNeeded (String?)
  cateringBrokerage: string[]; // Corresponds to User.cateringBrokerage (String?)
  provisions: string[]; // Corresponds to User.provide (String?)
}

// Updated type for catering orders based on Prisma's `CateringRequest`
export interface CateringOrder {
  id: string;
  guid?: string | null; // Prisma: String?
  userId: string; // Prisma: String (Required)
  pickupAddressId: string; // Prisma: String (Required)
  deliveryAddressId: string; // Prisma: String (Required)
  orderNumber: string; // Prisma: String @unique (Required, camelCase)
  // Prisma uses DateTime fields (camelCase)
  pickupDateTime?: string | Date | null; // Prisma: DateTime?
  arrivalDateTime?: string | Date | null; // Prisma: DateTime?
  completeDateTime?: string | Date | null; // Prisma: DateTime?
  status: CateringStatus; // Prisma: CateringStatus (Required) - Use Enum
  orderTotal?: number | null; // Prisma: Decimal? (camelCase) - Use number
  // order_type?: string; // Removed, not in CateringRequest model
  tip?: number | null; // Prisma: Decimal? - Use number
  brokerage?: string | null; // Prisma: String?
  headcount?: number | null; // Prisma: Int?
  needHost: CateringNeedHost; // Prisma: CateringNeedHost (Required, camelCase) - Use Enum
  hoursNeeded?: number | null; // Prisma: Float? (camelCase) - Use number
  numberOfHosts?: number | null; // Prisma: Int? (camelCase)
  clientAttention?: string | null; // Prisma: String? (camelCase)
  pickupNotes?: string | null; // Prisma: String? @db.Text (camelCase)
  specialNotes?: string | null; // Prisma: String? @db.Text (camelCase)
  image?: string | null; // Prisma: String?
  createdAt: string | Date; // Prisma: DateTime (Required, camelCase)
  updatedAt: string | Date; // Prisma: DateTime (Required, camelCase)
  driverStatus?: DriverStatus | null; // Prisma: DriverStatus? (camelCase) - Use Enum
  deletedAt?: string | Date | null; // Prisma: DateTime? (Added for soft delete)
}

// Updated type for file uploads based on Prisma's `FileUpload`
export interface FileUpload {
  id: string;
  userId?: string | null; // Prisma: String?
  fileName: string; // Prisma: String (Required)
  fileType: string; // Prisma: String (Required)
  fileSize: number; // Prisma: Int (Required)
  fileUrl: string; // Prisma: String (Required)
  uploadedAt: string | Date; // Prisma: DateTime (Required) - Allow string for JSON
  updatedAt: string | Date; // Prisma: DateTime (Required) - Allow string for JSON
  // Relations added in Prisma
  cateringRequestId?: string | null; // Prisma: String?
  onDemandId?: string | null; // Prisma: String?
  jobApplicationId?: string | null; // Prisma: String?
  category?: string | null; // Prisma: String?
  isTemporary: boolean; // Prisma: Boolean (Required)
  // entityType?: string; // Removed, replaced by specific relation IDs
  // entityId?: string; // Removed, replaced by specific relation IDs
}