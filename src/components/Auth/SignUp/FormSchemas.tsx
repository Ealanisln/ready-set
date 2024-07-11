import { z } from "zod";
import {
  COUNTIES,
  TIME_NEEDED,
  CATERING_BROKERAGE,
  FREQUENCY,
  PROVISIONS,
  HEADCOUNT,
} from "./ui/FormData";

const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const getValues = <T extends readonly (string | { value: string })[]>(options: T) =>
  options.map(option => typeof option === 'string' ? option : option.value) as [string, ...string[]];

const baseSchema = z.object({
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
  passwordConfirmation: z.string(),
  company: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  streetAddress1: z.string().min(1, "Street address is required"),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

const baseVendorSchema = baseSchema.extend({
  userType: z.literal("vendor"),
  parking: z.string().optional(),
  countiesServed: z.array(z.enum(getValues(COUNTIES))).min(1, "Select at least one county"),
  timeNeeded: z.array(z.enum(getValues(TIME_NEEDED))).min(1, "Select at least one time"),
  cateringBrokerage: z.array(z.enum(getValues(CATERING_BROKERAGE))).optional(),
  frequency: z.enum(getValues(FREQUENCY)),
  provisions: z.array(z.enum(getValues(PROVISIONS))).optional(),
});

export const vendorSchema = z.object({
  userType: z.literal("vendor"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  passwordConfirmation: z.string(),
  company: z.string().min(1, "Company name is required"),
  streetAddress1: z.string().min(1, "Street address is required"),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  parking: z.string().optional(),
  countiesServed: z.array(z.enum(getValues(COUNTIES))).min(1, "Select at least one county"),
  timeNeeded: z.array(z.enum(getValues(TIME_NEEDED))).min(1, "Select at least one time"),
  cateringBrokerage: z.array(z.enum(getValues(CATERING_BROKERAGE))).optional(),
  frequency: z.enum(getValues(FREQUENCY)),
  provisions: z.array(z.enum(getValues(PROVISIONS))).optional(),
}).refine(
  (data) => data.password === data.passwordConfirmation,
  {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  }
);

export const clientSchema = baseSchema.extend({
  userType: z.literal("client"),
  countyLocation: z.array(z.enum(getValues(COUNTIES))).min(1, "Please select at least one county"),
  timeNeeded: z.array(z.enum(getValues(TIME_NEEDED))).min(1, "Please select at least one time"),
  headcount: z.enum(HEADCOUNT),
  frequency: z.enum(getValues(FREQUENCY)),
});

export const driverSchema = baseSchema.extend({
  userType: z.literal("driver"),
  countyLocation: z.array(z.enum(getValues(COUNTIES))).min(1, "Please select at least one county"),
  timeNeeded: z.array(z.enum(getValues(TIME_NEEDED))).min(1, "Please select at least one time"),
  headcount: z.enum(HEADCOUNT),
  frequency: z.enum(getValues(FREQUENCY)),
});

export const userTypes = ["vendor", "client", "driver"] as const;
export type UserType = (typeof userTypes)[number];

export const formSchema = z.discriminatedUnion("userType", [
  baseVendorSchema,
  clientSchema,
  driverSchema,
]);

export type FormData = 
  | VendorFormData
  | ClientFormData
  | DriverFormData;export type VendorFormData = z.infer<typeof vendorSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type DriverFormData = z.infer<typeof driverSchema>;

