import { CateringRequest, OrderStatus, CateringNeedHost } from '../order';

describe('Order Types', () => {
  describe('CateringRequest', () => {
    it('should create a valid catering request', () => {
      const validCateringRequest: CateringRequest = {
        id: 'order-123',
        userId: 'user-123',
        pickupAddressId: 'address-1',
        deliveryAddressId: 'address-2',
        orderNumber: 'ORDER-123',
        pickupDateTime: new Date('2024-04-12T10:00:00Z'),
        arrivalDateTime: new Date('2024-04-12T11:00:00Z'),
        headcount: 50,
        needHost: CateringNeedHost.YES,
        hoursNeeded: 4,
        numberOfHosts: 2,
        clientAttention: 'Special attention needed',
        pickupNotes: 'Pickup at back door',
        specialNotes: 'No nuts',
        orderTotal: 1000.00,
        tip: 100.00,
        brokerage: 'Test Brokerage',
        status: OrderStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        order_type: 'catering',
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
        pickupAddress: {
          id: 'address-1',
          street1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          county: 'Test County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        deliveryAddress: {
          id: 'address-2',
          street1: '456 Delivery St',
          city: 'Delivery City',
          state: 'DS',
          zip: '67890',
          county: 'Delivery County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dispatches: [],
      };

      expect(validCateringRequest).toBeDefined();
      expect(validCateringRequest.orderNumber).toBe('ORDER-123');
      expect(validCateringRequest.needHost).toBe(CateringNeedHost.YES);
      expect(validCateringRequest.status).toBe(OrderStatus.ACTIVE);
    });

    it('should allow optional fields to be null', () => {
      const minimalCateringRequest: CateringRequest = {
        id: 'order-123',
        userId: 'user-123',
        pickupAddressId: 'address-1',
        deliveryAddressId: 'address-2',
        orderNumber: 'ORDER-123',
        pickupDateTime: new Date(),
        needHost: CateringNeedHost.NO,
        status: OrderStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        order_type: 'catering',
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
        pickupAddress: {
          id: 'address-1',
          street1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          county: 'Test County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        deliveryAddress: {
          id: 'address-2',
          street1: '456 Delivery St',
          city: 'Delivery City',
          state: 'DS',
          zip: '67890',
          county: 'Delivery County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dispatches: [],
      };

      expect(minimalCateringRequest).toBeDefined();
      expect(minimalCateringRequest.headcount).toBeUndefined();
      expect(minimalCateringRequest.hoursNeeded).toBeUndefined();
      expect(minimalCateringRequest.orderTotal).toBeUndefined();
    });

    it('should enforce required fields', () => {
      // @ts-expect-error - Testing type validation
      const invalidCateringRequest: CateringRequest = {
        id: 'order-123',
        // Missing required fields
      };

      expect(invalidCateringRequest).toBeDefined();
    });

    it('should validate order status enum', () => {
      const cateringRequest: CateringRequest = {
        id: 'order-123',
        userId: 'user-123',
        pickupAddressId: 'address-1',
        deliveryAddressId: 'address-2',
        orderNumber: 'ORDER-123',
        pickupDateTime: new Date(),
        needHost: CateringNeedHost.NO,
        status: OrderStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        order_type: 'catering',
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
        pickupAddress: {
          id: 'address-1',
          street1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          county: 'Test County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        deliveryAddress: {
          id: 'address-2',
          street1: '456 Delivery St',
          city: 'Delivery City',
          state: 'DS',
          zip: '67890',
          county: 'Delivery County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dispatches: [],
      };

      // @ts-expect-error - Testing type validation
      cateringRequest.status = 'INVALID_STATUS';

      expect(cateringRequest).toBeDefined();
    });

    it('should validate needHost enum', () => {
      const cateringRequest: CateringRequest = {
        id: 'order-123',
        userId: 'user-123',
        pickupAddressId: 'address-1',
        deliveryAddressId: 'address-2',
        orderNumber: 'ORDER-123',
        pickupDateTime: new Date(),
        needHost: CateringNeedHost.NO,
        status: OrderStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        order_type: 'catering',
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
        },
        pickupAddress: {
          id: 'address-1',
          street1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          county: 'Test County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        deliveryAddress: {
          id: 'address-2',
          street1: '456 Delivery St',
          city: 'Delivery City',
          state: 'DS',
          zip: '67890',
          county: 'Delivery County',
          isRestaurant: false,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        dispatches: [],
      };

      // @ts-expect-error - Testing type validation
      cateringRequest.needHost = 'INVALID_NEED_HOST';

      expect(cateringRequest).toBeDefined();
    });
  });
}); 