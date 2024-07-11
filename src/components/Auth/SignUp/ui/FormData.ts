// FormData.ts

export interface Option {
  label: string;
  value: string;
}

// Define the constants for enum-like fields
export const COUNTIES: readonly Option[] = [
  { label: "Alameda", value: "Alameda" },
  { label: "Contra Costa", value: "Contra Costa" },
  { label: "Marin", value: "Marin" },
  { label: "Napa", value: "Napa" },
  { label: "San Francisco", value: "San Francisco" },
  { label: "San Mateo", value: "San Mateo" },
  { label: "Santa Clara", value: "Santa Clara" },
  { label: "Solano", value: "Solano" },
  { label: "Sonoma", value: "Sonoma" },
] as const;

export const TIME_NEEDED: readonly Option[] = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "All Day", value: "All Day" },

  // Add other time options
] as const;

export const CATERING_BROKERAGE: readonly Option[] = [
  { label: "Foodee", value: "Foodee" },
  { label: "Ez Cater", value: "Ez Cater" },
  { label: "Grubhub", value: "Grubhub" },
  { label: "Cater Cow", value: "Cater Cow" },
  { label: "Zero Cater", value: "Zero Cater" },
  { label: "Platterz", value: "Platterz" },
  { label: "Direct Delivery", value: "Direct Delivery" },
  { label: "Other", value: "Other" },
] as const;

export const FREQUENCY = [
  { label: "1-5 per week", value: "1-5 per week" },
  { label: "6-15 per week", value: "6-15 per week" },
  { label: "16-25 per week", value: "16-25 per week" },
  { label: "over 25 per week", value: "over 25 per week" },
] as const;

export const PROVISIONS: readonly Option[] = [
  { label: "Utensils", value: "Utensils" },
  { label: "Labels", value: "Labels" },
  { label: "Napkins", value: "Napkins" },
  { label: "Serving Utencils", value: "Serving Utencils" },
  { label: "Place Settings", value: "Place Settings" },
  // Add other provisions
] as const;

export const HEADCOUNT = ['1-10', '11-50', '51-100', '101-500', '500+'] as const;

// Define the form data structure
export interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: "vendor" | "client" | "driver";
  company: string;
  parking?: string;
  countiesServed?: (typeof COUNTIES)[number][];
  countyLocation?: (typeof COUNTIES)[number][];
  timeNeeded: (typeof TIME_NEEDED)[number][];
  cateringBrokerage?: (typeof CATERING_BROKERAGE)[number][];
  frequency: (typeof FREQUENCY)[number];
  provisions?: (typeof PROVISIONS)[number][];
  headcount?: (typeof HEADCOUNT)[number];
  // Add the new fields here
  contact_name?: string;
  contact_number?: string;
  website?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  location_number?: string;
}
// You can also create type-specific interfaces if needed
export interface VendorFormData extends FormData {
  userType: "vendor";
  countiesServed: (typeof COUNTIES)[number][];
  cateringBrokerage?: (typeof CATERING_BROKERAGE)[number][];
  provisions: (typeof PROVISIONS)[number][];
  // Add any vendor-specific fields here
}
export interface ClientFormData extends FormData {
  userType: "client";
  countyLocation: (typeof COUNTIES)[number][];
  headcount: (typeof HEADCOUNT)[number];
}

export interface DriverFormData extends FormData {
  userType: "driver";
  countyLocation: (typeof COUNTIES)[number][];
  headcount: (typeof HEADCOUNT)[number];
}
