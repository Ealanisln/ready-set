import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Decimal } from '@prisma/client/runtime/library';
import { UserType, UserStatus } from './user';

// Export these types for use in other files
export { PrismaClientKnownRequestError, Decimal };

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

export type PrismaUserTypeValue = typeof PRISMA_USER_TYPE[keyof typeof PRISMA_USER_TYPE];
export type PrismaUserStatusValue = typeof PRISMA_USER_STATUS[keyof typeof PRISMA_USER_STATUS];

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

// Other Prisma helper types
export type PrismaError = Error | PrismaClientKnownRequestError; 