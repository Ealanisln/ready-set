// src/components/User/UserProfile/types.ts

import { FileWithPath } from "react-dropzone";
import { UploadedFile } from "@/hooks/use-upload-file";

export interface User {
    id: string;
    name?: string | null;
    contact_name?: string | null;
    email: string | null;
    contact_number: string | null;
    role:
      | "client"
      | "vendor"
      | "driver"
      | "helpdesk"
      | "admin"
      | "super_admin"
      | null;
    company_name?: string | null;
    website?: string | null;
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    location_number?: string | null;
    parking_loading?: string | null;
    countiesServed?: string[];
    counties?: string | null;
    timeNeeded?: string[];
    time_needed?: string | null;
    cateringBrokerage?: string[];
    catering_brokerage?: string | null;
    frequency?: string | null;
    provisions?: string[];
    provide?: string | null;
    head_count?: string | null;
    status?: "active" | "pending" | "deleted";
  }
  
  export interface UserFormValues extends Omit<User, "role"> {
    displayName: string;
    // Use 'type' to match the form field name used in Controller/useForm
    type:
      | "client"
      | "vendor"
      | "driver"
      | "helpdesk"
      | "admin"
      | "super_admin"
      | null;
    // Array versions used in the form's multi-select/checkbox groups
    countiesServed: string[];
    timeNeeded: string[];
    cateringBrokerage: string[];
    provisions: string[];
  }
  
  export interface UploadHook {
    onUpload: (files: any[]) => Promise<void>;
    progresses: Record<string, number>;
    isUploading: boolean;
    uploadedFiles: UploadedFile[];
    category: string;
    entityType: string;
    entityId: string;
  }
  
  export type UploadHooks = {
    driver_photo: UploadHook;
    insurance_photo: UploadHook;
    vehicle_photo: UploadHook;
    license_photo: UploadHook;
    general_files: UploadHook;
  };
  
  // Configuration and constants
  export const USER_TYPE_COLORS: Record<
    Exclude<UserFormValues["type"], null>,
    string
  > = {
    vendor: "bg-blue-100 text-blue-800 border-blue-200",
    client: "bg-emerald-100 text-emerald-800 border-emerald-200",
    driver: "bg-amber-100 text-amber-800 border-amber-200",
    helpdesk: "bg-purple-100 text-purple-800 border-purple-200",
    admin: "bg-indigo-100 text-indigo-800 border-indigo-200",
    super_admin: "bg-rose-100 text-rose-800 border-rose-200",
  };
  
  export const USER_STATUS_COLORS: Record<
    NonNullable<UserFormValues["status"]>,
    string
  > = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    deleted: "bg-red-100 text-red-800 border-red-200",
  };
  
  export const COUNTIES = [
    "Alameda",
    "Contra Costa",
    "Marin",
    "Napa",
    "San Francisco",
    "San Mateo",
    "Santa Clara",
    "Santa Cruz",
    "Solano",
    "Sonoma",
  ];
  
  export const TIME_NEEDED = ["Breakfast", "Lunch", "Dinner", "All Day"];
  
  export const CATERING_BROKERAGES = [
    "Foodee",
    "Grubhub",
    "Cater2me",
    "Platterz",
    "Ez Cater",
    "Cater Cow",
    "Zero Cater",
    "Direct Delivery",
    "Other",
  ];
  
  export const PROVISIONS = [
    "Utensils",
    "Napkins",
    "Place Settings",
    "Labels",
    "Serving Utensils",
  ];
  
  export const FREQUENCIES = [
    "1-5 per week",
    "6-15 per week",
    "16-25 per week",
    "over 25 per week",
  ];