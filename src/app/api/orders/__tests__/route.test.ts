// Add Request polyfill for testing
import { Request, Response } from 'node-fetch';
global.Request = Request as any;
global.Response = Response as any;

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any) => new Response(JSON.stringify(data)),
  },
}));

import { POST } from '../route';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@/utils/supabase/server';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $transaction: jest.fn(),
    cateringRequest: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    onDemand: {
      findUnique: jest.fn(),
    },
    address: {
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Mock Supabase client
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      })
    }
  }),
}));

// Mock email sender
jest.mock('@/utils/emailSender', () => ({
  sendOrderEmail: jest.fn(),
}));

describe('Orders API', () => {
  let prisma: PrismaClient;
  let mockRequest: Request;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockRequest = new Request('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create a catering order successfully', async () => {
      // Mock request body
      const requestBody = {
        order_type: 'catering',
        userId: 'user-123',
        addressId: 'address-1',
        eventName: 'Test Event',
        eventDate: '2024-04-12',
        eventTime: '10:00',
        guests: 50,
        budget: 1000.00,
        specialInstructions: 'No nuts',
        status: 'ACTIVE',
      };

      // Mock Prisma transaction
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(prisma);
      });

      // Mock Prisma findUnique to return null (no existing order)
      (prisma.cateringRequest.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.onDemand.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock Prisma create
      (prisma.cateringRequest.create as jest.Mock).mockResolvedValue({
        id: 'order-123',
        ...requestBody,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create request with body
      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Call the API
      const response = await POST(request);
      const data = await response.json();

      // Verify response
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data.eventName).toBe('Test Event');
      expect(data.status).toBe('ACTIVE');

      // Verify Prisma calls
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.cateringRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventName: 'Test Event',
          guests: 50,
          budget: 1000.00,
        }),
        include: expect.any(Object),
      });
    });

    it('should reject duplicate order numbers', async () => {
      // Mock request body
      const requestBody = {
        order_type: 'catering',
        userId: 'user-123',
        addressId: 'address-1',
        eventName: 'Test Event',
        eventDate: '2024-04-12',
        eventTime: '10:00',
        guests: 50,
        budget: 1000.00,
        specialInstructions: 'No nuts',
        status: 'ACTIVE',
      };

      // Mock Prisma findUnique to return existing order
      (prisma.cateringRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-order',
        eventName: 'Test Event',
      });

      // Create request with body
      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Call the API
      const response = await POST(request);
      const data = await response.json();

      // Verify response
      expect(response.status).toBe(400);
      expect(data.message).toBe('Order number already exists');
    });

    it('should validate required fields', async () => {
      // Mock request body with missing required fields
      const requestBody = {
        order_type: 'catering',
        // Missing required fields
      };

      // Create request with body
      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Call the API
      const response = await POST(request);
      const data = await response.json();

      // Verify response
      expect(response.status).toBe(400);
      expect(data.message).toBe('Missing required fields');
    });
  });
}); 