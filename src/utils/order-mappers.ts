// src/utils/order-mappers.ts

import { Prisma } from "@prisma/client";
import {
  CateringRequest,
  OnDemand,
  Order,
  OrderStatus,
  DriverStatus,
  VehicleType,
  CateringNeedHost,
  FileUpload,
  Dispatch,
  Address,
  User,
} from "../types/order";

// Type to represent a catering_request from Prisma with related fields included
type PrismaCateringRequest = Prisma.CateringRequestGetPayload<{
  include: {
    user: true;
    pickupAddress: true;
    deliveryAddress: true;
    dispatches: {
      include: {
        driver: true;
      };
    };
    fileUploads: true;
  };
}>;

// Type to represent an on_demand from Prisma with related fields included
type PrismaOnDemand = Prisma.OnDemandGetPayload<{
  include: {
    user: true;
    pickupAddress: true;
    deliveryAddress: true;
    dispatches: {
      include: {
        driver: true;
      };
    };
    fileUploads: true;
  };
}>;

// Helper function to convert Prisma Decimal to number
function convertDecimalToNumber(decimal: Prisma.Decimal | null): number | null {
  return decimal ? Number(decimal) : null;
}

/**
 * Maps a Prisma catering_request to our application CateringRequest type
 */
export function mapPrismaCateringRequestToAppType(
  prismaRequest: PrismaCateringRequest,
): CateringRequest {
  return {
    id: prismaRequest.id,
    guid: prismaRequest.guid,
    userId: prismaRequest.userId,
    pickupAddressId: prismaRequest.pickupAddressId,
    deliveryAddressId: prismaRequest.deliveryAddressId,
    orderNumber: prismaRequest.orderNumber,
    pickupDateTime: prismaRequest.pickupDateTime ?? new Date(),
    arrivalDateTime: prismaRequest.arrivalDateTime,
    completeDateTime: prismaRequest.completeDateTime,
    clientAttention: prismaRequest.clientAttention ?? "",
    pickupNotes: prismaRequest.pickupNotes,
    specialNotes: prismaRequest.specialNotes,
    image: prismaRequest.image,
    status: (prismaRequest.status as OrderStatus) ?? OrderStatus.ACTIVE,
    orderTotal: convertDecimalToNumber(prismaRequest.orderTotal),
    tip: convertDecimalToNumber(prismaRequest.tip),
    driverStatus: prismaRequest.driverStatus as DriverStatus,
    createdAt: prismaRequest.createdAt,
    updatedAt: prismaRequest.updatedAt,
    user: {
      id: prismaRequest.user.id,
      name: prismaRequest.user.name,
      email: prismaRequest.user.email,
    },
    pickupAddress: {
      id: prismaRequest.pickupAddress.id,
      name: prismaRequest.pickupAddress.name,
      street1: prismaRequest.pickupAddress.street1,
      street2: prismaRequest.pickupAddress.street2,
      city: prismaRequest.pickupAddress.city,
      state: prismaRequest.pickupAddress.state,
      zip: prismaRequest.pickupAddress.zip,
      county: prismaRequest.pickupAddress.county,
      locationNumber: prismaRequest.pickupAddress.locationNumber,
      parkingLoading: prismaRequest.pickupAddress.parkingLoading,
      isRestaurant: prismaRequest.pickupAddress.isRestaurant,
      isShared: prismaRequest.pickupAddress.isShared,
      createdAt: prismaRequest.pickupAddress.createdAt,
      updatedAt: prismaRequest.pickupAddress.updatedAt,
      createdBy: prismaRequest.pickupAddress.createdBy,
    },
    deliveryAddress: {
      id: prismaRequest.deliveryAddress.id,
      name: prismaRequest.deliveryAddress.name,
      street1: prismaRequest.deliveryAddress.street1,
      street2: prismaRequest.deliveryAddress.street2,
      city: prismaRequest.deliveryAddress.city,
      state: prismaRequest.deliveryAddress.state,
      zip: prismaRequest.deliveryAddress.zip,
      county: prismaRequest.deliveryAddress.county,
      locationNumber: prismaRequest.deliveryAddress.locationNumber,
      parkingLoading: prismaRequest.deliveryAddress.parkingLoading,
      isRestaurant: prismaRequest.deliveryAddress.isRestaurant,
      isShared: prismaRequest.deliveryAddress.isShared,
      createdAt: prismaRequest.deliveryAddress.createdAt,
      updatedAt: prismaRequest.deliveryAddress.updatedAt,
      createdBy: prismaRequest.deliveryAddress.createdBy,
    },
    dispatches: prismaRequest.dispatches.map((d: Prisma.DispatchGetPayload<{ include: { driver: true } }>) => ({
      id: d.id,
      cateringRequestId: d.cateringRequestId,
      onDemandId: d.onDemandId,
      driverId: d.driverId,
      userId: d.userId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      driver: d.driver
        ? {
            id: d.driver.id,
            name: d.driver.name,
            email: d.driver.email,
            contactNumber: d.driver.contactNumber,
          }
        : undefined,
    })),
    fileUploads: prismaRequest.fileUploads?.map((f: Prisma.FileUploadGetPayload<{}>) => ({
      id: f.id,
      fileName: f.fileName,
      fileType: f.fileType,
      fileSize: f.fileSize,
      fileUrl: f.fileUrl,
      entityType: "catering",
      entityId: f.cateringRequestId ?? "",
      category: f.category,
      uploadedAt: f.uploadedAt,
      updatedAt: f.updatedAt,
      userId: f.userId,
      cateringRequestId: f.cateringRequestId,
      onDemandId: f.onDemandId,
      isTemporary: f.isTemporary,
    })),

    // Specific catering fields
    order_type: "catering",
    brokerage: prismaRequest.brokerage,
    headcount: prismaRequest.headcount,
    needHost: (prismaRequest.needHost as CateringNeedHost) ?? CateringNeedHost.NO,
    hoursNeeded: prismaRequest.hoursNeeded,
    numberOfHosts: prismaRequest.numberOfHosts,
  };
}

/**
 * Maps a Prisma on_demand to our application OnDemand type
 */
export function mapPrismaOnDemandToAppType(
  prismaOnDemand: PrismaOnDemand,
): OnDemand {
  return {
    id: prismaOnDemand.id,
    guid: prismaOnDemand.guid,
    userId: prismaOnDemand.userId,
    pickupAddressId: prismaOnDemand.pickupAddressId,
    deliveryAddressId: prismaOnDemand.deliveryAddressId,
    orderNumber: prismaOnDemand.orderNumber,
    pickupDateTime: prismaOnDemand.pickupDateTime ?? new Date(),
    arrivalDateTime: prismaOnDemand.arrivalDateTime,
    completeDateTime: prismaOnDemand.completeDateTime,
    clientAttention: prismaOnDemand.clientAttention,
    pickupNotes: prismaOnDemand.pickupNotes,
    specialNotes: prismaOnDemand.specialNotes,
    image: prismaOnDemand.image,
    status: (prismaOnDemand.status as OrderStatus) ?? OrderStatus.ACTIVE,
    orderTotal: convertDecimalToNumber(prismaOnDemand.orderTotal),
    tip: convertDecimalToNumber(prismaOnDemand.tip),
    driverStatus: prismaOnDemand.driverStatus as DriverStatus,
    createdAt: prismaOnDemand.createdAt,
    updatedAt: prismaOnDemand.updatedAt,
    user: {
      id: prismaOnDemand.user.id,
      name: prismaOnDemand.user.name,
      email: prismaOnDemand.user.email,
    },
    pickupAddress: {
      id: prismaOnDemand.pickupAddress.id,
      name: prismaOnDemand.pickupAddress.name,
      street1: prismaOnDemand.pickupAddress.street1,
      street2: prismaOnDemand.pickupAddress.street2,
      city: prismaOnDemand.pickupAddress.city,
      state: prismaOnDemand.pickupAddress.state,
      zip: prismaOnDemand.pickupAddress.zip,
      county: prismaOnDemand.pickupAddress.county,
      locationNumber: prismaOnDemand.pickupAddress.locationNumber,
      parkingLoading: prismaOnDemand.pickupAddress.parkingLoading,
      isRestaurant: prismaOnDemand.pickupAddress.isRestaurant,
      isShared: prismaOnDemand.pickupAddress.isShared,
      createdAt: prismaOnDemand.pickupAddress.createdAt,
      updatedAt: prismaOnDemand.pickupAddress.updatedAt,
      createdBy: prismaOnDemand.pickupAddress.createdBy,
    },
    deliveryAddress: {
      id: prismaOnDemand.deliveryAddress.id,
      name: prismaOnDemand.deliveryAddress.name,
      street1: prismaOnDemand.deliveryAddress.street1,
      street2: prismaOnDemand.deliveryAddress.street2,
      city: prismaOnDemand.deliveryAddress.city,
      state: prismaOnDemand.deliveryAddress.state,
      zip: prismaOnDemand.deliveryAddress.zip,
      county: prismaOnDemand.deliveryAddress.county,
      locationNumber: prismaOnDemand.deliveryAddress.locationNumber,
      parkingLoading: prismaOnDemand.deliveryAddress.parkingLoading,
      isRestaurant: prismaOnDemand.deliveryAddress.isRestaurant,
      isShared: prismaOnDemand.deliveryAddress.isShared,
      createdAt: prismaOnDemand.deliveryAddress.createdAt,
      updatedAt: prismaOnDemand.deliveryAddress.updatedAt,
      createdBy: prismaOnDemand.deliveryAddress.createdBy,
    },
    dispatches: prismaOnDemand.dispatches.map((d: Prisma.DispatchGetPayload<{ include: { driver: true } }>) => ({
      id: d.id,
      cateringRequestId: d.cateringRequestId,
      onDemandId: d.onDemandId,
      driverId: d.driverId,
      userId: d.userId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      driver: d.driver
        ? {
            id: d.driver.id,
            name: d.driver.name,
            email: d.driver.email,
            contactNumber: d.driver.contactNumber,
          }
        : undefined,
    })),
    fileUploads: prismaOnDemand.fileUploads?.map((f: Prisma.FileUploadGetPayload<{}>) => ({
      id: f.id,
      fileName: f.fileName,
      fileType: f.fileType,
      fileSize: f.fileSize,
      fileUrl: f.fileUrl,
      entityType: "on_demand",
      entityId: f.onDemandId ?? "",
      category: f.category,
      uploadedAt: f.uploadedAt,
      updatedAt: f.updatedAt,
      userId: f.userId,
      cateringRequestId: f.cateringRequestId,
      onDemandId: f.onDemandId,
      isTemporary: f.isTemporary,
    })),

    // Specific on_demand fields
    order_type: "on_demand",
    itemDelivered: prismaOnDemand.itemDelivered,
    vehicleType: prismaOnDemand.vehicleType as VehicleType,
    hoursNeeded: prismaOnDemand.hoursNeeded,
    length: prismaOnDemand.length,
    width: prismaOnDemand.width,
    height: prismaOnDemand.height,
    weight: prismaOnDemand.weight,
  };
}

/**
 * Merges results from both order types and properly types them
 */
export function mergeOrderResults(
  cateringRequests: PrismaCateringRequest[],
  onDemands: PrismaOnDemand[],
): Order[] {
  const mappedCateringRequests = cateringRequests.map(
    mapPrismaCateringRequestToAppType,
  );
  const mappedOnDemands = onDemands.map(mapPrismaOnDemandToAppType);

  return [...mappedCateringRequests, ...mappedOnDemands];
}
