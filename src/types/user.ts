// src/types/user.ts

// --- Enums ---
// These should match your Prisma schema's users_type and users_status enums

export enum UserType {
  VENDOR = 'vendor',
  CLIENT = 'client',
  DRIVER = 'driver',
  ADMIN = 'admin',
  HELPDESK = 'helpdesk',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  DELETED = 'deleted',
}

// --- Interfaces ---

// Base User interface mirroring relevant fields from Prisma's `public.user` model
export interface User {
  id: string;
  guid?: string;
  name?: string; // Use this for driver/admin names
  email?: string;
  emailVerified?: Date;
  image?: string;
  type: UserType | string; // Ideally use UserType, allow string for potential flexibility
  company_name?: string;
  contact_name?: string; // Use this for vendor/client contact names
  contact_number?: string;
  website?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  location_number?: string;
  parking_loading?: string;
  counties?: string; // Comma-separated string from DB
  time_needed?: string; // Comma-separated string from DB
  catering_brokerage?: string; // Comma-separated string from DB
  frequency?: string;
  provide?: string; // Comma-separated string from DB
  head_count?: string;
  status?: UserStatus | string; // Ideally use UserStatus, allow string for potential flexibility
  side_notes?: string;
  // confirmation_code?: string; // Likely not needed in frontend models often
  created_at?: string | Date; // Allow string for JSON parsing flexibility
  updated_at?: string | Date; // Allow string for JSON parsing flexibility
  // isTemporaryPassword?: boolean; // Likely handled during auth/login flows
}

// Interface representing the data structure within the User Profile Form
export interface UserFormValues {
  id: string; // Always need the ID

  // Form-specific combined name field
  displayName: string;

  // Fields directly mapping to User interface, using enums where applicable
  email: string | null;
  contact_number: string | null;
  type: UserType | null; // Use the UserType enum for the form state
  status: UserStatus | null; // Use the UserStatus enum for the form state

  company_name?: string | null;
  website?: string | null;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  location_number?: string | null;
  parking_loading?: string | null;
  frequency?: string | null;
  head_count?: string | null;
  side_notes?: string | null; // Include if this is editable in the form

  // Array representations for multi-select/checkbox form controls
  countiesServed: string[]; // Corresponds to User.counties (string)
  timeNeeded: string[]; // Corresponds to User.time_needed (string)
  cateringBrokerage: string[]; // Corresponds to User.catering_brokerage (string)
  provisions: string[]; // Corresponds to User.provide (string)
}

// Type for catering orders (as provided by you)
export interface CateringOrder {
  id: string;
  guid?: string;
  user_id?: string;
  address_id?: string;
  delivery_address_id?: string;
  order_number: string;
  date?: string | Date;
  pickup_time?: string | Date;
  arrival_time?: string | Date;
  complete_time?: string | Date;
  status: string; // Consider defining an enum if status values are fixed
  order_total: string | number;
  order_type?: string;
  tip?: string | number;
  brokerage?: string;
  headcount?: string;
  need_host?: string; // Consider enum ('yes'/'no') based on schema
  hours_needed?: string;
  number_of_host?: string;
  client_attention?: string;
  pickup_notes?: string;
  special_notes?: string;
  image?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  driver_status?: string; // Consider enum based on schema
}

// For file uploads (as provided by you)
export interface FileUpload {
  id: string;
  userId?: string;
  fileName: string;
  fileType: string;
  fileSize?: number; // Prisma schema has Int, ensure compatibility
  fileUrl: string;
  uploadedAt?: Date; // Prisma schema has DateTime
  updatedAt?: Date; // Prisma schema has DateTime
  entityType?: string; // Prisma schema has String
  entityId?: string; // Prisma schema has String
  category?: string; // Prisma schema has String?
}