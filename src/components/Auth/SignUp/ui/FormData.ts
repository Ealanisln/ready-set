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

export const HEAD_COUNT: Option[] = [
  { value: "1-24", label: "1-24" },
  { value: "25-49", label: "25-49" },
  { value: "50-74", label: "50-74" },
  { value: "75-99", label: "75-99" },
  { value: "100-124", label: "100-124" },
  { value: "125-149", label: "125-149" },
  { value: "150-174", label: "150-174" },
  { value: "175-199", label: "175-199" },
  { value: "200-249", label: "200-249" },
  { value: "250-299", label: "250-299" },
  { value: "+300", label: "+300" },
];

export interface Option {
  value: string;
  label: string;
}

// Define the form data structure
export interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: "vendor" | "client" | "driver" | "helpdesk";
  company: string;
  parking?: string;
  countiesServed?: (typeof COUNTIES)[number][];
  countyLocation?: (typeof COUNTIES)[number][];
  timeNeeded: (typeof TIME_NEEDED)[number][];
  cateringBrokerage?: (typeof CATERING_BROKERAGE)[number][];
  frequency: (typeof FREQUENCY)[number];
  provisions?: (typeof PROVISIONS)[number][];
  head_count?: (typeof HEAD_COUNT)[number];
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

export interface VendorFormData {
  userType: "vendor";
  contact_name: string;
  email: string;
  phoneNumber: string;
  password: string;
  company: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  parking?: string;
  countiesServed: string[];
  timeNeeded: string[];
  cateringBrokerage?: string[];
  frequency: string;
  provisions?: string[];
  website?: string;
}
export interface ClientFormData {
  userType: "client";
  contact_name: string;
  email: string;
  phoneNumber: string;
  password: string;
  company: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  timeNeeded: string[];
  frequency: (typeof FREQUENCY)[number]["value"];  
  parking?: string;
  countiesServed: string[];
  head_count: string;
  website?: string;
}

export interface DriverFormData extends FormData {
  userType: "driver";
  name: string;  // Make sure this is included
}

export interface HelpDeskFormData extends FormData {
  userType: "helpdesk";
  name: string;  // Make sure this is included
}