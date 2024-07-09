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

const createEnum = <T extends string>(values: readonly T[]) =>
  z.enum(values as [T, ...T[]]);

export const baseSchema = z.object({
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  parking: z
    .string()
    .min(1, "If provided, parking information must not be empty")
    .optional(),
  company: z.string().min(1, "Company name is required"),
  contactname: z.string().min(1, "Contact name is required"),
});

export const vendorSchema = baseSchema.extend({
  userType: z.literal("vendor"),
  company: z.string().min(1, "Company name is required"),
  countiesServed: z
    .array(z.enum(COUNTIES))
    .min(1, "Please select at least one county"),
  timeNeeded: z
    .array(z.enum(TIME_NEEDED))
    .min(1, "Please select at least one time"),
  cateringBrokerage: z
    .array(z.enum(CATERING_BROKERAGE))
    .min(1, "Please select at least one option"),
  frequency: z.enum(FREQUENCY),
  provisions: z.array(z.enum(PROVISIONS)),
});

export const clientSchema = z.object({
  userType: z.literal("client"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().min(1, "Company name is required"),
  countyLocation: z.array(createEnum(COUNTIES)).min(1, "Please select at least one county"),
  timeNeeded: z.array(createEnum(TIME_NEEDED)).min(1, "Please select at least one time"),
  headcount: createEnum(HEADCOUNT),
  frequency: createEnum(FREQUENCY),
});

export const driverSchema = baseSchema.extend({
  userType: z.literal("driver"),
  company: z.string().min(1, "Company name is required"),
  countyLocation: z
    .array(createEnum(COUNTIES))
    .min(1, "Please select at least one county"),
  timeNeeded: z
    .array(createEnum(TIME_NEEDED))
    .min(1, "Please select at least one time"),
  headcount: createEnum(HEADCOUNT),
  frequency: createEnum(FREQUENCY),
});

export const userTypes = ["vendor", "client", "driver"] as const;
export type UserType = (typeof userTypes)[number];

export const formSchema = z.discriminatedUnion("userType", [
  vendorSchema,
  clientSchema,
  driverSchema,
]);

export type VendorFormData = z.infer<typeof vendorSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
export type DriverFormData = z.infer<typeof driverSchema>;
export type FormData = z.infer<typeof formSchema>;
