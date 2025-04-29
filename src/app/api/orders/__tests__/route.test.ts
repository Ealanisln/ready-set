// --- Adjusted Mock for next/server ---

import { POST } from '../route';
import { PrismaClient, CateringNeedHost, DriverStatus, CateringStatus } from '@prisma/client';
import { OrderStatus } from '@/types/order';
import { Decimal } from '@prisma/client/runtime/library';
// Import the *real* function type if needed for casting, but we'll mock the module
// import { createClient as actualCreateClient } from '@/utils/supabase/server'; 
import { NextRequest, NextResponse } from 'next/server';
import { vi, Mock, beforeEach, describe, it, expect, afterEach } from 'vitest'; // Import vi and lifecycle hooks
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { ZodError } from "zod";
import { Prisma } from '@prisma/client'; // Import Prisma namespace for types

// --- Mock Prisma --- 
// Define the type for the transaction callback
type PrismaTransactionCallback<T> = (tx: Prisma.TransactionClient) => Promise<T>;

// Create a deep mock of the PrismaClient
const prismaMock = mockDeep<PrismaClient>();

// Use a specific type for the mock that includes the transaction method signature
// and explicitly type the mocked $transaction method on the base mock.
type MockPrisma = DeepMockProxy<PrismaClient> & {
  $transaction: Mock<(callback: PrismaTransactionCallback<any>) => Promise<any>>;
};

// Cast the deep mock to our specific type
const prisma = prismaMock as MockPrisma;

// --- Mock Prisma Module ---
// Mock the module export to return our specifically typed and prepared mock instance
vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: prisma, // Use the already created and typed mock
}));

// --- Mock Supabase Server Client --- 
// Mock the entire module
vi.mock('@/utils/supabase/server');

// --- Mock email sender --- 
vi.mock('@/utils/emailSender', () => ({
  sendOrderEmail: vi.fn(),
}));

// Dynamically import the mocked createClient after setting up the mock
// We need to assert the type to help TypeScript understand it's mocked
import { createClient } from '@/utils/supabase/server';
const mockedCreateClient = createClient as Mock;

// Define UUIDs for testing
const pickupAddressUUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const deliveryAddressUUID = 'a3b8d54f-7e6a-4b0d-8f3c-7a1b9e0d1c2e';

describe('Orders API', () => {
  // Mock address data - Ensure these match the full Prisma Address type
  const mockPickupAddress: PrismaClient['address']['findUnique'] extends (args: any) => Promise<infer R> ? R : never = {
    id: pickupAddressUUID,
    street1: '1 Pickup St',
    street2: null,
    city: 'Pickupton',
    state: 'CA',
    zip: '12345',
    county: 'Test County',
    createdAt: new Date(),
    createdBy: null,
    isRestaurant: false,
    isShared: false,
    locationNumber: null,
    parkingLoading: null,
    updatedAt: new Date(),
    name: 'Pickup Location',
    latitude: null,
    longitude: null,
    deletedAt: null,
  };
  const mockDeliveryAddress: PrismaClient['address']['findUnique'] extends (args: any) => Promise<infer R> ? R : never = {
    id: deliveryAddressUUID,
    street1: '1 Delivery Ave',
    street2: null,
    city: 'Deliverville',
    state: 'CA',
    zip: '67890',
    county: 'Another County',
    createdAt: new Date(),
    createdBy: null,
    isRestaurant: false,
    isShared: false,
    locationNumber: null,
    parkingLoading: null,
    updatedAt: new Date(),
    name: 'Delivery Location',
    latitude: null,
    longitude: null,
    deletedAt: null,
  };

  beforeEach(() => {
    vi.resetAllMocks();

    // --- Mock Supabase Auth --- 
    mockedCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }) },
    });

    // --- Clear previous specific mocks thoroughly --- 
    prisma.address.findUnique.mockClear();
    prisma.cateringRequest.findUnique.mockClear();
    prisma.onDemand.findUnique.mockClear();
    prisma.cateringRequest.create.mockClear();
    prisma.onDemand.create.mockClear();
    prisma.$transaction.mockClear(); // Clear transaction mock

    // --- Setup Baseline Mocks --- 
    // Default: Orders NOT found (can be mocked within transaction now)
    // prisma.cateringRequest.findUnique.mockResolvedValue(null); // REMOVED - will mock inside transaction
    // prisma.onDemand.findUnique.mockResolvedValue(null); // REMOVED - will mock inside transaction

    // --- Default Mock Transaction Implementation ---
    // The default implementation is now less relevant as each test will define its own transaction mock outcome.
    // We keep a basic mock to avoid errors if a test doesn't explicitly mock it.
    prisma.$transaction.mockImplementation(async (callback: PrismaTransactionCallback<any>) => {
      // This default should ideally not be hit by the main tests now.
      // It could simulate a generic success or failure if needed for other tests.
      console.warn('[TEST] Default $transaction mock executed. Test might need specific $transaction mock.');
      // Let's simulate a generic success returning an empty object for safety.
      return {}; 
    });
  });

  // afterEach is good practice, though resetAllMocks in beforeEach might suffice
  // afterEach(() => {
  //   vi.restoreAllMocks(); // Use restore if you modify mocks within tests
  // });

  // Reusable valid payload for catering orders
  const validCateringPayload = {
    order_type: 'catering',
    userId: 'user-123',
    brokerage: 'Test Brokerage',
    orderNumber: `test-order-${Date.now()}`,
    pickupAddressId: pickupAddressUUID,
    deliveryAddressId: deliveryAddressUUID,
    pickupDateTime: new Date(Date.now() + 86400000).toISOString(),
    arrivalDateTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    clientAttention: 'Test Client Attention',
    orderTotal: 1000.00,
    status: OrderStatus.ACTIVE,
    headcount: 50,
    needHost: CateringNeedHost.NO,
    hoursNeeded: null,
    numberOfHosts: null,
    tip: 50.0,
    pickupNotes: 'Pickup notes here',
    specialNotes: 'Special catering notes',
    eventName: 'Test Event',
    eventDate: '2024-12-31',
    eventTime: '10:00',
    guests: 50,
    budget: 1000.00,
    specialInstructions: 'No nuts',
  };

  describe('POST /api/orders', () => {
    it('should create a catering order successfully', async () => {
      // Arrange
      const orderNum = `test-create-${Date.now()}`;
      const requestPayload = { ...validCateringPayload, orderNumber: orderNum };

      // --- Mock Successful Creation Data ---
      const createdOrderData = {
        id: 'new-order-id',
        guid: null,
        userId: 'user-123',
        pickupAddressId: pickupAddressUUID,
        deliveryAddressId: deliveryAddressUUID,
        brokerage: requestPayload.brokerage,
        orderNumber: orderNum,
        pickupDateTime: new Date(requestPayload.pickupDateTime),
        arrivalDateTime: new Date(requestPayload.arrivalDateTime),
        completeDateTime: null,
        headcount: requestPayload.headcount,
        needHost: requestPayload.needHost as CateringNeedHost,
        hoursNeeded: requestPayload.hoursNeeded,
        numberOfHosts: requestPayload.numberOfHosts,
        clientAttention: requestPayload.clientAttention,
        pickupNotes: requestPayload.pickupNotes,
        specialNotes: requestPayload.specialNotes,
        image: null,
        status: requestPayload.status as CateringStatus,
        orderTotal: new Decimal(requestPayload.orderTotal),
        tip: new Decimal(requestPayload.tip),
        createdAt: new Date(),
        updatedAt: new Date(),
        driverStatus: null,
        deletedAt: null,
      };

      // --- Mocks specific to THIS test run --- 
      // Mocks for checks *before* the transaction or if the transaction were to run (though we'll bypass callback)
      // REMOVED - These are now mocked on the transaction client below
      // prisma.address.findUnique
      //   .calledWith(expect.objectContaining({ where: { id: pickupAddressUUID } }))
      //   .mockResolvedValue(mockPickupAddress);
      // prisma.address.findUnique
      //   .calledWith(expect.objectContaining({ where: { id: deliveryAddressUUID } }))
      //   .mockResolvedValue(mockDeliveryAddress);
      // prisma.cateringRequest.findUnique
      //   .calledWith(expect.objectContaining({ where: { orderNumber: orderNum } }))
      //   .mockResolvedValue(null);
      // prisma.onDemand.findUnique
      //   .calledWith(expect.objectContaining({ where: { orderNumber: orderNum } }))
      //   .mockResolvedValue(null);
      // prisma.cateringRequest.create
      //   .calledWith(expect.objectContaining({ data: expect.objectContaining({ orderNumber: orderNum }) }))
      //   .mockResolvedValue(createdOrderData); // Still good practice to have the create mock ready

      // --- Mock $transaction Implementation ---
      // Mock the implementation to run the actual callback with a mocked tx client
      prisma.$transaction.mockImplementationOnce(async (callback: PrismaTransactionCallback<any>) => {
        // Create a mock transaction client instance
        const txMock = mockDeep<Prisma.TransactionClient>();
        // Robust address mock: always return the correct address for the right ID, using type cast for compatibility
        txMock.address.findUnique.mockImplementation(({ where }) => {
          if (where.id === pickupAddressUUID) return Promise.resolve(mockPickupAddress) as unknown as ReturnType<typeof txMock.address.findUnique>;
          if (where.id === deliveryAddressUUID) return Promise.resolve(mockDeliveryAddress) as unknown as ReturnType<typeof txMock.address.findUnique>;
          return Promise.resolve(null) as unknown as ReturnType<typeof txMock.address.findUnique>;
        });
        txMock.cateringRequest.findUnique
          .calledWith(expect.objectContaining({ where: { orderNumber: orderNum } }))
          .mockResolvedValue(null); // Simulate order not found
        txMock.onDemand.findUnique
          .calledWith(expect.objectContaining({ where: { orderNumber: orderNum } }))
          .mockResolvedValue(null); // Simulate order not found
        txMock.cateringRequest.create
          .calledWith(expect.objectContaining({ data: expect.objectContaining({ orderNumber: orderNum }) }))
          .mockResolvedValue(createdOrderData); // Simulate successful creation

        // Execute the actual callback function passed to $transaction with our mocked tx client
        const result = await callback(txMock);
        return result;
      });

      // Mock email sender
      const { sendOrderEmail } = await import('@/utils/emailSender');
      const mockedSendOrderEmail = sendOrderEmail as Mock;

      // Act
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(requestPayload),
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await POST(request);
      const responseBody = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(responseBody).toHaveProperty('id', 'new-order-id');
      
      // Check mocks were called as expected (inside the transaction)
      // Note: We now check calls on the *mocked transaction client* if needed, 
      // but verifying the overall outcome (status 201, responseBody) and the final 
      // create call on the main mock might be sufficient.
      // The specific calls on txMock are implicitly verified by the transaction completing successfully.
      expect(prisma.cateringRequest.create).toHaveBeenCalledTimes(1); // Verify the *original* mock was called by the transaction logic

      // Verify Supabase and Email mocks
      expect(mockedCreateClient).toHaveBeenCalledTimes(1); 
      const supabaseInstance = await mockedCreateClient.mock.results[0].value;
      expect(supabaseInstance.auth.getUser).toHaveBeenCalledTimes(1);
      expect(mockedSendOrderEmail).toHaveBeenCalledWith(
        expect.objectContaining({ order_number: orderNum }), 
        expect.any(String), 
        expect.any(String),
        expect.any(String)  
      );
    });

    it('should reject duplicate order numbers', async () => {
      // Arrange
      const existingOrderNumber = `duplicate-order-${Date.now()}`;
      const duplicatePayload = { ...validCateringPayload, orderNumber: existingOrderNumber };
      const existingCateringOrder = {
        id: 'existing-id',
        orderNumber: existingOrderNumber,
        userId: 'another-user',
        pickupAddressId: pickupAddressUUID,
        deliveryAddressId: deliveryAddressUUID,
        status: OrderStatus.ACTIVE as CateringStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        guid: null,
        image: null,
        driverStatus: null,
        deletedAt: null,
        brokerage: 'Old Brokerage',
        pickupDateTime: new Date(),
        arrivalDateTime: new Date(),
        completeDateTime: null,
        headcount: 10,
        needHost: CateringNeedHost.NO,
        hoursNeeded: null,
        numberOfHosts: null,
        clientAttention: 'Old Client',
        pickupNotes: null,
        specialNotes: null,
        orderTotal: new Decimal(10),
        tip: new Decimal(10),
      };

      // --- Mocks specific to THIS test run --- 
      // REMOVED Mocks - now handled inside tx mock
      // prisma.address.findUnique...
      // prisma.cateringRequest.findUnique...
      // prisma.onDemand.findUnique...
      // prisma.cateringRequest.create.mockClear(); 

      // --- Mock $transaction Implementation --- 
      prisma.$transaction.mockImplementationOnce(async (callback: PrismaTransactionCallback<any>) => {
        const txMock = mockDeep<Prisma.TransactionClient>();

        // Mock methods called *within* the transaction callback
        txMock.address.findUnique.mockImplementation(({ where }) => {
          if (where.id === pickupAddressUUID) return Promise.resolve(mockPickupAddress) as unknown as ReturnType<typeof txMock.address.findUnique>;
          if (where.id === deliveryAddressUUID) return Promise.resolve(mockDeliveryAddress) as unknown as ReturnType<typeof txMock.address.findUnique>;
          return Promise.resolve(null) as unknown as ReturnType<typeof txMock.address.findUnique>;
        });
        txMock.cateringRequest.findUnique
          .calledWith(expect.objectContaining({ where: { orderNumber: existingOrderNumber } }))
          .mockResolvedValue(existingCateringOrder); // Duplicate FOUND!
        // onDemand findUnique might not be called
        txMock.onDemand.findUnique
          .calledWith(expect.objectContaining({ where: { orderNumber: existingOrderNumber } }))
          .mockResolvedValue(null); 
        txMock.cateringRequest.create.mockClear(); 
        txMock.onDemand.create.mockClear(); 

        // Execute the callback and expect it to return the NextResponse directly
        const result = await callback(txMock);
        
        // Check if the result is the expected NextResponse object
        if (result instanceof NextResponse && result.status === 409) {
           return result; // Return the NextResponse as the transaction result
        } else {
           // If it's not the expected 409 response, something is wrong
           throw new Error('Transaction callback did not return the expected 409 NextResponse for duplicate order.');
        }
      });

      // Act
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(duplicatePayload),
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await POST(request); // The result of POST should be the NextResponse from the transaction

      // Assert
      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.message).toBe('Order number already exists');

      // Verify mocks (adjust as needed based on route logic)
      expect(prisma.cateringRequest.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { orderNumber: existingOrderNumber } }));
      expect(prisma.cateringRequest.create).not.toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const { brokerage, ...invalidPayload } = validCateringPayload;

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(invalidPayload),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Missing required fields: brokerage");
    });

    it('should return 400 for invalid request body (Zod validation failure)', async () => {
      // Arrange
      const invalidPayload = { ...validCateringPayload, orderNumber: null }; // Missing required field

      // Act
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(invalidPayload),
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      // Correctly expect orderNumber to be missing in *this* test
      expect(data.message).toBe("Missing required fields: orderNumber");
      // expect(data.error).toBeDefined(); // Removed assertion as API doesn't return error field here
      // Optionally check for the specific field if needed
      // expect(data.error.issues[0].path).toContain('orderNumber'); 
    });

    it('should return 500 for unexpected errors during transaction', async () => {
      // Arrange
      const errorPayload = { ...validCateringPayload, orderNumber: 'ERROR-001' };
      const errorMessage = 'Simulated database connection lost'; // Make error more specific
      const expectedApiErrorMessage = 'Failed to create order'; // Message from route's outer catch block

      // --- Mock $transaction Implementation --- 
      prisma.$transaction.mockImplementationOnce(async (callback: PrismaTransactionCallback<any>) => {
        const txMock = mockDeep<Prisma.TransactionClient>();

        // Mock methods called *within* the transaction callback
        txMock.address.findUnique.mockImplementation(({ where }) => {
          if (where.id === pickupAddressUUID) return Promise.resolve(mockPickupAddress) as unknown as ReturnType<typeof txMock.address.findUnique>;
          if (where.id === deliveryAddressUUID) return Promise.resolve(mockDeliveryAddress) as unknown as ReturnType<typeof txMock.address.findUnique>;
          return Promise.resolve(null) as unknown as ReturnType<typeof txMock.address.findUnique>;
        });
        txMock.cateringRequest.findUnique.mockResolvedValue(null); // Order not found
        txMock.onDemand.findUnique.mockResolvedValue(null); // Order not found
        // Mock create to REJECT to simulate the database error
        txMock.cateringRequest.create
            .calledWith(expect.objectContaining({ data: expect.objectContaining({ orderNumber: 'ERROR-001' }) }))
            .mockRejectedValue(new Error(errorMessage)); 

        // Execute the callback - it should throw due to the create rejection
        // The transaction mock should simply let the error propagate upwards
        return await callback(txMock); 
      });

      // Mock email sender (won't be called)
      const { sendOrderEmail } = await import('@/utils/emailSender');
      const mockedSendOrderEmail = sendOrderEmail as Mock;

      // Act
      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(errorPayload),
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await POST(request);
      const data = await response.json(); // Ensure we parse the JSON body for assertion

      // Assert
      expect(response.status).toBe(500);
      // Assert against the specific message returned by the API route's outer catch block
      expect(data.message).toBe(expectedApiErrorMessage); 
      expect(mockedSendOrderEmail).not.toHaveBeenCalled();
      // We can check that the create mock was called, even though it failed
      expect(prisma.cateringRequest.create).toHaveBeenCalledTimes(1);
    });
  });
}); 