import { z } from "zod";
import {
  COUNTIES,
  TIME_NEEDED,
  CATERING_BROKERAGE,
  FREQUENCY,
  PROVISIONS,
  HEAD_COUNT,
} from "./ui/FormData";

const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const getValues = <T extends readonly (string | { value: string })[]>(
  options: T,
) =>
  options.map((option) =>
    typeof option === "string" ? option : option.value,
  ) as [string, ...string[]];

const arrayToTuple = <T extends string>(arr: T[]): [T, ...T[]] => {
  if (arr.length === 0) {
    throw new Error("Array must have at least one element");
  }
  return arr as [T, ...T[]];
};

export const baseSchema = z.object({
  contact_name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => phoneRegex.test(value), {
      message: "Invalid phone number format",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[@$!%*?&]).{8,}$/,
      "Password must be at least 8 characters long and contain at least one special character",
    ),
  website: z.string().optional(),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
});

export const vendorSchema = baseSchema.extend({
  contact_name: z.string().min(1, "Contact name is required"),
  userType: z.literal("vendor"),
  parking: z.string().optional(),
  countiesServed: z
    .array(z.enum(getValues(COUNTIES)))
    .min(1, "Select at least one county"),
  timeNeeded: z
    .array(z.enum(getValues(TIME_NEEDED)))
    .min(1, "Select at least one time"),
  cateringBrokerage: z.array(z.enum(getValues(CATERING_BROKERAGE))).optional(),
  frequency: z.enum(getValues(FREQUENCY)),
  provisions: z.array(z.enum(getValues(PROVISIONS))).optional(),
  company: z.string().nonempty("Company name is required"),
});

export const clientSchema = z.object({
  userType: z.literal("client"),
  email: z.string().email("Invalid email address"),
  website: z
    .union([z.string().url("Invalid website URL"), z.string().max(0)])
    .optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  contact_name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company name is required"),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Zip code is required"),
  parking: z.string().optional(),
  countiesServed: z
    .array(z.enum(getValues(COUNTIES)))
    .min(1, "Please select at least one county"),
  timeNeeded: z
    .array(z.enum(getValues(TIME_NEEDED)))
    .min(1, "Please select at least one time"),
  frequency: z.enum(getValues(FREQUENCY)),
  head_count: z.string().min(1, "Please select a headcount"),
});

export const driverSchema = z.object({
  userType: z.literal("driver"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => phoneRegex.test(value), {
      message: "Invalid phone number format",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[@$!%*?&]).{8,}$/,
      "Password must be at least 8 characters long and contain at least one special character",
    ),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
});

// New helpdesk schema
export const helpdeskSchema = z.object({
  userType: z.literal("helpdesk"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => phoneRegex.test(value), {
      message: "Invalid phone number format",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[@$!%*?&]).{8,}$/,
      "Password must be at least 8 characters long and contain at least one special character",
    ),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
});

export const userTypes = ["vendor", "client", "driver", "helpdesk"] as const;
export type UserType = (typeof userTypes)[number];

export const formSchema = z.discriminatedUnion("userType", [
  clientSchema,
  driverSchema,
  helpdeskSchema,
]);

export type FormDataUnion = VendorFormData | ClientFormData | DriverFormData | HelpdeskFormData;

export type DriverFormData = z.infer<typeof driverSchema>;
export type VendorFormData = z.infer<typeof vendorSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type HelpdeskFormData = z.infer<typeof helpdeskSchema>;

export type UserFormValues = {
  type: "vendor" | "client" | "driver" | "helpdesk";
} & (VendorFormData | ClientFormData | DriverFormData | HelpdeskFormData);