/**
 * Prisma type definitions extracted for direct use
 * This helps avoid dynamic imports from @prisma/client during build time
 */

// Define as const objects first to use as values
export const UserType = {
  VENDOR: 'VENDOR',
  CLIENT: 'CLIENT',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
  HELPDESK: 'HELPDESK',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  DELETED: 'DELETED'
} as const;

export const DriverStatus = {
  ARRIVED_AT_VENDOR: 'ARRIVED_AT_VENDOR',
  EN_ROUTE_TO_CLIENT: 'EN_ROUTE_TO_CLIENT',
  ARRIVED_TO_CLIENT: 'ARRIVED_TO_CLIENT',
  ASSIGNED: 'ASSIGNED',
  COMPLETED: 'COMPLETED'
} as const;

export const CateringNeedHost = {
  YES: 'YES',
  NO: 'NO'
} as const;

export const CateringStatus = {
  ACTIVE: 'ACTIVE',
  ASSIGNED: 'ASSIGNED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
} as const;

export const OnDemandStatus = {
  ACTIVE: 'ACTIVE',
  ASSIGNED: 'ASSIGNED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
} as const;

export const VehicleType = {
  CAR: 'CAR',
  VAN: 'VAN',
  TRUCK: 'TRUCK'
} as const;

export const ApplicationStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  INTERVIEWING: 'INTERVIEWING'
} as const;

export const FormType = {
  FOOD: 'FOOD',
  FLOWER: 'FLOWER',
  BAKERY: 'BAKERY',
  SPECIALTY: 'SPECIALTY'
} as const;

// Type definitions derived from the const objects
export type UserType = typeof UserType[keyof typeof UserType];
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];
export type DriverStatus = typeof DriverStatus[keyof typeof DriverStatus];
export type CateringNeedHost = typeof CateringNeedHost[keyof typeof CateringNeedHost];
export type CateringStatus = typeof CateringStatus[keyof typeof CateringStatus];
export type OnDemandStatus = typeof OnDemandStatus[keyof typeof OnDemandStatus];
export type VehicleType = typeof VehicleType[keyof typeof VehicleType];
export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];
export type FormType = typeof FormType[keyof typeof FormType];

// Re-export from Prisma for compatibility
export const Prisma = {
  UserTypeEnum: UserType
} as const; 