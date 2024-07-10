// FormData.ts

// Define the constants for enum-like fields
export const COUNTIES = [
  "Alameda",
  "Contra Costa",
  "Marin",
  "Napa",
  "San Francisco",
  "San Mateo",
  "Santa Clara",
  "Solano",
  "Sonoma",
  // Add more counties as needed
] as const;

export const TIME_NEEDED = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "All Day",
  // Add more options as needed
] as const;

export const CATERING_BROKERAGE = [
  "Foodee",
  "Ez Cater",
  "Grubhub",
  "Cater Cow",
  "Zero Cater",
  "Platterz",
  "Direct Delivery",
  "Other"
] as const;

export const FREQUENCY = [
  { label: "1-5 per week", value: "1-5 per week" },
  { label: "6-15 per week", value: "6-15 per week" },
  { label: "16-25 per week", value: "16-25 per week" },
  { label: "over 25 per week", value: "over 25 per week" },
] as const;

export const PROVISIONS = [
  "Napkins",
  "Labels",
  "Utensils",
  "Serving Utencils",
  "Place Settings",
  // Add more options as needed
] as const;

export const HEADCOUNT = [
  "1-10",
  "11-50",
  "51-100",
  "101-500",
  "500+",
  // Add more options as needed
] as const;

// Define the form data structure
export interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: "vendor" | "client" | "driver";
  company: string;
  parking?: string;
  countiesServed?: typeof COUNTIES[number][];
  countyLocation?: typeof COUNTIES[number][];
  timeNeeded: typeof TIME_NEEDED[number][];
  cateringBrokerage?: typeof CATERING_BROKERAGE[number][];
  frequency: typeof FREQUENCY[number];
  provisions?: typeof PROVISIONS[number][];
  headcount?: typeof HEADCOUNT[number];
}

// You can also create type-specific interfaces if needed
export interface VendorFormData extends FormData {
  userType: "vendor";
  countiesServed: typeof COUNTIES[number][];
  cateringBrokerage?: typeof CATERING_BROKERAGE[number][];
  provisions: typeof PROVISIONS[number][];
}

export interface ClientFormData extends FormData {
  userType: "client";
  countyLocation: typeof COUNTIES[number][];
  headcount: typeof HEADCOUNT[number];
}

export interface DriverFormData extends FormData {
  userType: "driver";
  countyLocation: typeof COUNTIES[number][];
  headcount: typeof HEADCOUNT[number];
}