import { Prisma } from "@prisma/client";

// Export type definitions for Prisma models
export type CateringRequest = Prisma.CateringRequestGetPayload<{}>;
export type OnDemand = Prisma.OnDemandGetPayload<{}>;
export type Profile = Prisma.ProfileGetPayload<{}>;
export type Address = Prisma.AddressGetPayload<{}>;
export type UserAddress = Prisma.UserAddressGetPayload<{}>;
export type Dispatch = Prisma.DispatchGetPayload<{}>;
export type FileUpload = Prisma.FileUploadGetPayload<{}>;
export type FormSubmission = Prisma.FormSubmissionGetPayload<{}>;
export type LeadCapture = Prisma.LeadCaptureGetPayload<{}>;
export type JobApplication = Prisma.JobApplicationGetPayload<{}>;
export type Account = Prisma.AccountGetPayload<{}>;
export type Session = Prisma.SessionGetPayload<{}>;
export type VerificationToken = Prisma.VerificationTokenGetPayload<{}>; 