import { z } from "zod";

export type UserType = "vendor" | "client" | "driver";

const baseFields = {
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .refine((phoneNumber) => phoneNumber.replace(/-/g, "").length >= 10, {
      message: "Phone number must be at least 10 digits (excluding dashes)",
    })
    .refine((phoneNumber) => /^\d+$/.test(phoneNumber.replace(/-/g, "")), {
      message: "Phone number must contain only digits",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
};

export const vendorSchema = z.object({
  ...baseFields,
  userType: z.literal("vendor"),
  company: z.string().min(1, { message: "Company name is required" }),
});

export const clientSchema = z.object({
  ...baseFields,
  userType: z.literal("client"),
});

export const driverSchema = z.object({
  ...baseFields,
  userType: z.literal("driver"),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
});

export const formSchema = z.discriminatedUnion("userType", [
  vendorSchema,
  clientSchema,
  driverSchema,
]);

export type FormData = z.infer<typeof formSchema>;

export const baseSchema = z.object(baseFields);
