import '@testing-library/jest-dom'
import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { beforeEach } from '@jest/globals'
// jest.setup.ts

import '@testing-library/jest-dom';
import 'jest-environment-jsdom';

// Mock PrismaClient
export type Context = {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  }
}

// Mock modules
jest.mock('./src/utils/prismaDB', () => ({
  prisma: mockDeep<PrismaClient>(),
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn(() => Promise.resolve(true)),
  hash: jest.fn(() => Promise.resolve('hashedPassword')),
}))

jest.mock('next-auth/providers/google', () => ({
  default: jest.fn(() => ({
    id: 'google',
    name: 'Google',
    type: 'oauth',
  })),
}))

jest.mock('next-auth/providers/email', () => ({
  default: jest.fn(() => ({
    id: 'email',
    name: 'Email',
    type: 'email',
  })),
}))

// Mock next-auth
jest.mock('next-auth', () => ({
  ...jest.requireActual('next-auth'),
  getServerSession: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
}))

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})