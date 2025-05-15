import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientInitializationError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Decimal } from '@prisma/client/runtime/library';
import { 
  UserType, 
  UserStatus, 
  DriverStatus, 
  CateringNeedHost, 
  CateringStatus, 
  OnDemandStatus,
  VehicleType,
  ApplicationStatus
} from './user';

// Export errors and Decimal for use in other files
export { 
  PrismaClientKnownRequestError, 
  PrismaClientInitializationError, 
  PrismaClientValidationError, 
  Decimal 
};

// Define constants for Prisma enum values
export const PRISMA_USER_TYPE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  VENDOR: 'VENDOR',
  CLIENT: 'CLIENT',
  DRIVER: 'DRIVER',
  HELPDESK: 'HELPDESK',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export const PRISMA_USER_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  DELETED: 'DELETED'
} as const;

export const PRISMA_DRIVER_STATUS = {
  ARRIVED_AT_VENDOR: 'ARRIVED_AT_VENDOR',
  EN_ROUTE_TO_CLIENT: 'EN_ROUTE_TO_CLIENT',
  ARRIVED_TO_CLIENT: 'ARRIVED_TO_CLIENT',
  ASSIGNED: 'ASSIGNED',
  COMPLETED: 'COMPLETED'
} as const;

export const PRISMA_CATERING_NEED_HOST = {
  YES: 'YES',
  NO: 'NO'
} as const;

export const PRISMA_CATERING_STATUS = {
  ACTIVE: 'ACTIVE',
  ASSIGNED: 'ASSIGNED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED'
} as const;

export const PRISMA_ON_DEMAND_STATUS = {
  ACTIVE: 'ACTIVE',
  ASSIGNED: 'ASSIGNED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED'
} as const;

export const PRISMA_VEHICLE_TYPE = {
  CAR: 'CAR',
  VAN: 'VAN',
  TRUCK: 'TRUCK'
} as const;

export const PRISMA_APPLICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  INTERVIEWING: 'INTERVIEWING'
} as const;

export const PRISMA_FORM_TYPE = {
  FOOD: 'FOOD',
  FLOWER: 'FLOWER',
  BAKERY: 'BAKERY',
  SPECIALTY: 'SPECIALTY'
} as const;

// Type definitions for Prisma enum values
export type PrismaUserTypeValue = typeof PRISMA_USER_TYPE[keyof typeof PRISMA_USER_TYPE];
export type PrismaUserStatusValue = typeof PRISMA_USER_STATUS[keyof typeof PRISMA_USER_STATUS];
export type PrismaDriverStatusValue = typeof PRISMA_DRIVER_STATUS[keyof typeof PRISMA_DRIVER_STATUS];
export type PrismaCateringNeedHostValue = typeof PRISMA_CATERING_NEED_HOST[keyof typeof PRISMA_CATERING_NEED_HOST];
export type PrismaCateringStatusValue = typeof PRISMA_CATERING_STATUS[keyof typeof PRISMA_CATERING_STATUS];
export type PrismaOnDemandStatusValue = typeof PRISMA_ON_DEMAND_STATUS[keyof typeof PRISMA_ON_DEMAND_STATUS];
export type PrismaVehicleTypeValue = typeof PRISMA_VEHICLE_TYPE[keyof typeof PRISMA_VEHICLE_TYPE];
export type PrismaApplicationStatusValue = typeof PRISMA_APPLICATION_STATUS[keyof typeof PRISMA_APPLICATION_STATUS];
export type PrismaFormTypeValue = typeof PRISMA_FORM_TYPE[keyof typeof PRISMA_FORM_TYPE];

// Helper functions to convert between application enums and Prisma enums
export function convertToPrismaUserType(type: UserType): PrismaUserTypeValue {
  switch(type) {
    case UserType.ADMIN: return PRISMA_USER_TYPE.ADMIN;
    case UserType.VENDOR: return PRISMA_USER_TYPE.VENDOR;
    case UserType.CLIENT: return PRISMA_USER_TYPE.CLIENT;
    case UserType.DRIVER: return PRISMA_USER_TYPE.DRIVER;
    case UserType.HELPDESK: return PRISMA_USER_TYPE.HELPDESK;
    case UserType.SUPER_ADMIN: return PRISMA_USER_TYPE.SUPER_ADMIN;
    default: return PRISMA_USER_TYPE.USER;
  }
}

export function convertToPrismaUserStatus(status: UserStatus): PrismaUserStatusValue {
  switch(status) {
    case UserStatus.ACTIVE: return PRISMA_USER_STATUS.ACTIVE;
    case UserStatus.PENDING: return PRISMA_USER_STATUS.PENDING;
    case UserStatus.DELETED: return PRISMA_USER_STATUS.DELETED;
    default: return PRISMA_USER_STATUS.PENDING;
  }
}

export function convertToPrismaDriverStatus(status: DriverStatus): PrismaDriverStatusValue {
  switch(status) {
    case DriverStatus.ARRIVED_AT_VENDOR: return PRISMA_DRIVER_STATUS.ARRIVED_AT_VENDOR;
    case DriverStatus.EN_ROUTE_TO_CLIENT: return PRISMA_DRIVER_STATUS.EN_ROUTE_TO_CLIENT;
    case DriverStatus.ARRIVED_TO_CLIENT: return PRISMA_DRIVER_STATUS.ARRIVED_TO_CLIENT;
    case DriverStatus.ASSIGNED: return PRISMA_DRIVER_STATUS.ASSIGNED;
    case DriverStatus.COMPLETED: return PRISMA_DRIVER_STATUS.COMPLETED;
    default: return PRISMA_DRIVER_STATUS.ASSIGNED;
  }
}

export function convertToPrismaCateringStatus(status: CateringStatus): PrismaCateringStatusValue {
  switch(status) {
    case CateringStatus.ACTIVE: return PRISMA_CATERING_STATUS.ACTIVE;
    case CateringStatus.ASSIGNED: return PRISMA_CATERING_STATUS.ASSIGNED;
    case CateringStatus.CANCELLED: return PRISMA_CATERING_STATUS.CANCELLED;
    case CateringStatus.COMPLETED: return PRISMA_CATERING_STATUS.COMPLETED;
    default: return PRISMA_CATERING_STATUS.ACTIVE;
  }
}

export function convertToPrismaOnDemandStatus(status: OnDemandStatus): PrismaOnDemandStatusValue {
  switch(status) {
    case OnDemandStatus.ACTIVE: return PRISMA_ON_DEMAND_STATUS.ACTIVE;
    case OnDemandStatus.ASSIGNED: return PRISMA_ON_DEMAND_STATUS.ASSIGNED;
    case OnDemandStatus.CANCELLED: return PRISMA_ON_DEMAND_STATUS.CANCELLED;
    case OnDemandStatus.COMPLETED: return PRISMA_ON_DEMAND_STATUS.COMPLETED;
    default: return PRISMA_ON_DEMAND_STATUS.ACTIVE;
  }
}

export function convertToPrismaVehicleType(type: VehicleType): PrismaVehicleTypeValue {
  switch(type) {
    case VehicleType.CAR: return PRISMA_VEHICLE_TYPE.CAR;
    case VehicleType.VAN: return PRISMA_VEHICLE_TYPE.VAN;
    case VehicleType.TRUCK: return PRISMA_VEHICLE_TYPE.TRUCK;
    default: return PRISMA_VEHICLE_TYPE.CAR;
  }
}

export function convertToPrismaApplicationStatus(status: ApplicationStatus): PrismaApplicationStatusValue {
  switch(status) {
    case ApplicationStatus.PENDING: return PRISMA_APPLICATION_STATUS.PENDING;
    case ApplicationStatus.APPROVED: return PRISMA_APPLICATION_STATUS.APPROVED;
    case ApplicationStatus.REJECTED: return PRISMA_APPLICATION_STATUS.REJECTED;
    case ApplicationStatus.INTERVIEWING: return PRISMA_APPLICATION_STATUS.INTERVIEWING;
    default: return PRISMA_APPLICATION_STATUS.PENDING;
  }
}

// Other Prisma helper types
export type PrismaError = Error | PrismaClientKnownRequestError | PrismaClientInitializationError | PrismaClientValidationError;

/**
 * Type for Prisma transaction client
 * This type can be used for the transaction callback parameter to avoid 'any' type errors
 */
export type PrismaTransaction = Omit<
  Prisma.TransactionClient, 
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// Commonly used Prisma payload types
export type ProfilePayload = Prisma.ProfileGetPayload<{
  include: {
    accounts: true;
    userAddresses: {
      include: {
        address: true;
      }
    }
  }
}>;

export type CateringRequestPayload = Prisma.CateringRequestGetPayload<{
  include: {
    dispatches: true;
    user: { include: { userAddresses: { include: { address: true } } } };
    pickupAddress: true;
    deliveryAddress: true;
    fileUploads: true;
  }
}>;

export type OnDemandPayload = Prisma.OnDemandGetPayload<{
  include: {
    dispatches: true;
    user: { include: { userAddresses: { include: { address: true } } } };
    pickupAddress: true;
    deliveryAddress: true;
    fileUploads: true;
  }
}>;

export type JobApplicationPayload = Prisma.JobApplicationGetPayload<{
  include: {
    fileUploads: true;
    profile: true;
  }
}>;

// Commonly used Prisma input types
export type ProfileCreateInput = Prisma.ProfileCreateInput;
export type ProfileUpdateInput = Prisma.ProfileUpdateInput;
export type ProfileWhereInput = Prisma.ProfileWhereInput;
export type ProfileOrderByWithRelationInput = Prisma.ProfileOrderByWithRelationInput;

export type AddressCreateInput = Prisma.AddressCreateInput;
export type AddressUpdateInput = Prisma.AddressUpdateInput;
export type AddressWhereInput = Prisma.AddressWhereInput;

export type CateringRequestCreateInput = Prisma.CateringRequestCreateInput;
export type CateringRequestUpdateInput = Prisma.CateringRequestUpdateInput;
export type CateringRequestWhereInput = Prisma.CateringRequestWhereInput;
export type CateringRequestOrderByWithRelationInput = Prisma.CateringRequestOrderByWithRelationInput;

export type OnDemandCreateInput = Prisma.OnDemandCreateInput;
export type OnDemandUpdateInput = Prisma.OnDemandUpdateInput;
export type OnDemandWhereInput = Prisma.OnDemandWhereInput;
export type OnDemandOrderByWithRelationInput = Prisma.OnDemandOrderByWithRelationInput;

export type FileUploadCreateInput = Prisma.FileUploadCreateInput;
export type FileUploadUpdateInput = Prisma.FileUploadUpdateInput;
export type FileUploadWhereInput = Prisma.FileUploadWhereInput;

export type JobApplicationCreateInput = Prisma.JobApplicationCreateInput;
export type JobApplicationUpdateInput = Prisma.JobApplicationUpdateInput;
export type JobApplicationWhereInput = Prisma.JobApplicationWhereInput;

// Model types without any relations
export type Profile = Prisma.ProfileGetPayload<{}>;
export type Address = Prisma.AddressGetPayload<{}>;
export type CateringRequest = Prisma.CateringRequestGetPayload<{}>;
export type OnDemand = Prisma.OnDemandGetPayload<{}>;
export type Dispatch = Prisma.DispatchGetPayload<{}>;
export type FileUpload = Prisma.FileUploadGetPayload<{}>;
export type UserAddress = Prisma.UserAddressGetPayload<{}>;
export type Account = Prisma.AccountGetPayload<{}>;
export type Session = Prisma.SessionGetPayload<{}>;
export type VerificationToken = Prisma.VerificationTokenGetPayload<{}>;
export type FormSubmission = Prisma.FormSubmissionGetPayload<{}>;
export type LeadCapture = Prisma.LeadCaptureGetPayload<{}>;
export type JobApplication = Prisma.JobApplicationGetPayload<{}>;

// Export Prisma's sort order enum
export const SortOrder = Prisma.SortOrder;

// Helper function for typesafe transactions
export function withTransaction<T>(
  callback: (tx: PrismaTransaction) => Promise<T>
): (tx: PrismaTransaction) => Promise<T> {
  return callback;
} 