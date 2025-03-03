// src/types/user.ts

// This enum should match your Prisma schema's users_type enum
export enum UserType {
    VENDOR = 'vendor',
    CLIENT = 'client',
    DRIVER = 'driver',
    ADMIN = 'admin',
    HELPDESK = 'helpdesk',
    SUPER_ADMIN = 'super_admin'
  }
  
  // This enum should match your Prisma schema's users_status enum
  export enum UserStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    DELETED = 'deleted'
  }
  
  // Comprehensive User interface that includes all fields from your Prisma schema
  export interface User {
    id: string;
    guid?: string;
    name?: string;
    email?: string;
    emailVerified?: Date;
    image?: string;
    type: UserType | string; // Using string union type for compatibility
    company_name?: string;
    contact_name?: string;
    contact_number?: string;
    website?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    location_number?: string;
    parking_loading?: string;
    counties?: string;
    time_needed?: string;
    catering_brokerage?: string;
    frequency?: string;
    provide?: string;
    head_count?: string;
    status?: UserStatus | string;
    side_notes?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
  }
  
  // Type for catering orders
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
    status: string;
    order_total: string | number;
    order_type?: string;
    tip?: string | number;
    brokerage?: string;
    headcount?: string;
    need_host?: string;
    hours_needed?: string;
    number_of_host?: string;
    client_attention?: string;
    pickup_notes?: string;
    special_notes?: string;
    image?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
    driver_status?: string;
  }
  
  // For file uploads
  export interface FileUpload {
    id: string;
    userId?: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
    fileUrl: string;
    uploadedAt?: Date;
    updatedAt?: Date;
    entityType?: string;
    entityId?: string;
    category?: string;
  }