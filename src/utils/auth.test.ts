import { render, screen } from '@testing-library/react';
import { useSession } from "next-auth/react";
import "@testing-library/jest-dom";
import { authOptions } from '../utils/auth';
import { prisma } from '../utils/prismaDB';
import { RequestInternal } from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

type UsersType = "vendor" | "client" | "driver" | "admin" | "helpdesk" | "super_admin";

// Define PrismaUser type based on your schema
type PrismaUser = {
  id: string;
  email: string | null;
  guid: string | null;
  name: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  passwordResetToken: string | null;
  passwordResetTokenExp: Date | null;
  company_name: string | null;
  position: string | null;
  phone: string | null;
  type: UsersType;
  isTemporaryPassword: boolean;
  created_at: Date;
  updated_at: Date;
  contact_name: string | null;
  contact_number: string | null;
  website: string | null;
  street1: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  phone_extension: string | null;
  fax: string | null;
  notes: string | null;
  is_active: boolean;
  last_login: Date | null;
  last_password_change: Date | null;
  failed_login_attempts: number;
  lockout_time: Date | null;
  is_locked: boolean;
  is_deleted: boolean;
  location_number: string | null;
  parking_loading: string | null;
  counties: string | null;
  time_needed: string | null;
  catering_brokerage: string | null;
  frequency: string | null;
  provide: string | null;
  head_count: string | null;
  event_date: Date | null;
  event_time: string | null;
  event_location: string | null;
  status: 'active'; // Define the correct type for status
  side_notes: string | null;
  confirmation_code: string | null;
  remember_token: string | null;
};

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn()
}));

// Mock PrismaDB
jest.mock('../utils/prismaDB', () => {
  return {
    prisma: {
      user: {
        findUnique: jest.fn().mockImplementation(() => Promise.resolve(null)),
        update: jest.fn().mockImplementation(() => Promise.resolve(null)),
      },
    },
  };
});

describe("Auth Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authorization Flow', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockPrismaUser: PrismaUser = {
      id: '1',
      email: 'test@example.com',
      guid: null,
      name: 'Test User',
      emailVerified: null,
      image: null,
      password: 'hashedpassword',
      passwordResetToken: null,
      passwordResetTokenExp: null,
      company_name: null,
      position: null,
      phone: null,
      type: 'client',
      isTemporaryPassword: false,
      created_at: new Date(),
      updated_at: new Date(),
      contact_name: null,
      contact_number: null,
      website: null,
      street1: null,
      street2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      phone_extension: null,
      fax: null,
      notes: null,
      is_active: true,
      last_login: null,
      last_password_change: null,
      failed_login_attempts: 0,
      lockout_time: null,
      is_locked: false,
      is_deleted: false,
      location_number: null,
      parking_loading: null,
      counties: null,
      time_needed: null,
      catering_brokerage: null,
      frequency: null,
      provide: null,
      head_count: null,
      event_date: null,
      event_time: null,
      event_location: null,
      status: 'active',
      side_notes: null,
      confirmation_code: null,
      remember_token: null
    };

    it('should handle unauthenticated state', async () => {
      (useSession as jest.Mock).mockReturnValueOnce({
        data: null,
        status: "unauthenticated"
      });

      const credentialsProvider = authOptions.providers[0];
      const authorize = credentialsProvider.type === 'credentials' 
        ? credentialsProvider.authorize 
        : null;

      if (!authorize) {
        throw new Error('Credentials provider not found');
      }

      const mockFindUnique = prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>;
      mockFindUnique.mockResolvedValueOnce(null);
      
      const mockRequest: Pick<RequestInternal, "body" | "query" | "headers" | "method"> = {
        body: {},
        query: {},
        headers: new Headers(),
        method: 'POST'
      };

      const result = await authorize(mockCredentials, mockRequest);
      expect(result).toBeNull();
    });

    it('should handle authenticated state', async () => {
      const mockSession: Session = {
        user: {
          id: '1',
          email: 'test@example.com',
          type: 'client' as UsersType,
          isTemporaryPassword: false,
          name: mockPrismaUser.name || undefined,
          image: mockPrismaUser.image || undefined
        },
        expires: new Date(Date.now() + 2 * 86400).toISOString()
      };

      (useSession as jest.Mock).mockReturnValueOnce({
        data: mockSession,
        status: "authenticated"
      });

      const credentialsProvider = authOptions.providers[0];
      const authorize = credentialsProvider.type === 'credentials' 
        ? credentialsProvider.authorize 
        : null;

      if (!authorize) {
        throw new Error('Credentials provider not found');
      }

      const mockFindUnique = prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>;
      mockFindUnique.mockResolvedValueOnce(mockPrismaUser);
      
      const mockRequest: Pick<RequestInternal, "body" | "query" | "headers" | "method"> = {
        body: {},
        query: {},
        headers: new Headers(),
        method: 'POST'
      };

      const result = await authorize(mockCredentials, mockRequest);
      expect(result).toEqual(mockPrismaUser);
    });
  });

  describe('Session Management', () => {
    const mockPrismaUser: PrismaUser = {
      id: '1',
      email: 'test@example.com',
      guid: null,
      name: 'Test User',
      emailVerified: null,
      image: null,
      password: 'hashedpassword',
      passwordResetToken: null,
      passwordResetTokenExp: null,
      company_name: null,
      position: null,
      phone: null,
      type: 'client',
      isTemporaryPassword: false,
      created_at: new Date(),
      updated_at: new Date(),
      contact_name: null,
      contact_number: null,
      website: null,
      street1: null,
      street2: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      phone_extension: null,
      fax: null,
      notes: null,
      is_active: true,
      last_login: null,
      last_password_change: null,
      failed_login_attempts: 0,
      lockout_time: null,
      is_locked: false,
      is_deleted: false,
      location_number: null,
      parking_loading: null,
      counties: null,
      time_needed: null,
      catering_brokerage: null,
      frequency: null,
      provide: null,
      head_count: null,
      event_date: null,
      event_time: null,
      event_location: null,
      status: 'active',
      side_notes: null,
      confirmation_code: null,
      remember_token: null
    };

    it('should handle session updates', async () => {
      if (!authOptions.callbacks?.session) {
        throw new Error('Session callback not found');
      }

      const mockToken: JWT = {
        sub: '1',
        name: 'Test User',
        email: 'test@example.com',
        picture: null,
        id: '1',
        type: 'client' as UsersType,
        isTemporaryPassword: false,
      };

      const mockSession: Session = {
        user: {
          id: '1',
          email: 'test@example.com',
          type: 'client' as UsersType,
          isTemporaryPassword: false,
          name: 'Test User',
          image: null
        },
        expires: new Date(Date.now() + 2 * 86400).toISOString()
      };

      const result = await authOptions.callbacks.session({
        session: mockSession,
        token: mockToken,
        trigger: 'update',
        newSession: null,
        user: { ...mockPrismaUser, email: mockPrismaUser.email || '' }
      });

      expect(result.user).toMatchObject({
        id: '1',
        email: 'test@example.com',
        type: 'client'
      });
    });
  });

  describe('JWT Handling', () => {
    it('should manage token updates', async () => {
      if (!authOptions.callbacks?.jwt) {
        throw new Error('JWT callback not found');
      }

      const mockToken: JWT = {
        sub: '1',
        name: 'Test User',
        email: 'test@example.com',
        picture: null,
        id: '1',
        type: 'client' as UsersType,
        isTemporaryPassword: false,
      };

      const mockPrismaUser: PrismaUser = {
        id: '1',
        email: 'test@example.com',
        guid: null,
        name: 'Test User',
        emailVerified: null,
        image: null,
        password: 'hashedpassword',
        passwordResetToken: null,
        passwordResetTokenExp: null,
        company_name: null,
        position: null,
        phone: null,
        type: 'client',
        isTemporaryPassword: false,
        created_at: new Date(),
        updated_at: new Date(),
        contact_name: null,
        contact_number: null,
        website: null,
        street1: null,
        street2: null,
        city: null,
        state: null,
        zip: null,
        country: null,
        phone_extension: null,
        fax: null,
        notes: null,
        is_active: true,
        last_login: null,
        last_password_change: null,
        failed_login_attempts: 0,
        lockout_time: null,
        is_locked: false,
        is_deleted: false,
        location_number: null,
        parking_loading: null,
        counties: null,
        time_needed: null,
        catering_brokerage: null,
        frequency: null,
        provide: null,
        head_count: null,
        event_date: null,
        event_time: null,
        event_location: null,
        status: 'active',
        side_notes: null,
        confirmation_code: null,
        remember_token: null
      };

      const result = await authOptions.callbacks.jwt({
        token: mockToken,
        user: mockPrismaUser,
        account: null,
        trigger: 'update'
      });

      expect(result).toMatchObject({
        id: '1',
        type: 'client',
        isTemporaryPassword: false
      });
    });
  });
});