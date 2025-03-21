// src/utils/order-mappers.ts

import { Prisma } from "@prisma/client";
import {
  Order,
  CateringRequest,
  OnDemand,
  OrderType,
  DriverStatus,
  OrderStatus,
  VehicleType,
  NeedHost,
} from "../types/order";

// Type to represent a catering_request from Prisma with related fields included
type PrismaCateringRequest = Prisma.catering_requestGetPayload<{
  include: {
    user: true;
    address: true;
    delivery_address: true;
    dispatch: {
      include: {
        driver: true;
      };
    };
    fileUploads: true;
  };
}>;

// Type to represent an on_demand from Prisma with related fields included
type PrismaOnDemand = Prisma.on_demandGetPayload<{
  include: {
    user: true;
    address: true;
    delivery_address: true;
    dispatch: {
      include: {
        driver: true;
      };
    };
    fileUploads: true;
  };
}>;

/**
 * Maps a Prisma catering_request to our application CateringRequest type
 */
export function mapPrismaCateringRequestToAppType(
  prismaRequest: PrismaCateringRequest,
): CateringRequest {
  return {
    id: prismaRequest.id,
    guid: prismaRequest.guid,
    user_id: prismaRequest.user_id,
    address_id: prismaRequest.address_id,
    delivery_address_id: prismaRequest.delivery_address_id,
    order_number: prismaRequest.order_number,
    date: prismaRequest.date ?? new Date(),
    pickup_time: prismaRequest.pickup_time,
    arrival_time: prismaRequest.arrival_time,
    complete_time: prismaRequest.complete_time,
    client_attention: prismaRequest.client_attention ?? "",
    pickup_notes: prismaRequest.pickup_notes,
    special_notes: prismaRequest.special_notes,
    image: prismaRequest.image,
    status: (prismaRequest.status as OrderStatus) ?? OrderStatus.ACTIVE,
    order_total: prismaRequest.order_total,
    tip: prismaRequest.tip,
    driver_status: prismaRequest.driver_status as DriverStatus,
    created_at: prismaRequest.created_at,
    updated_at: prismaRequest.updated_at,
    user: {
      id: prismaRequest.user.id,
      name: prismaRequest.user.name,
      email: prismaRequest.user.email,
    },
    address: {
      id: prismaRequest.address.id,
      name: prismaRequest.address.name,
      street1: prismaRequest.address.street1,
      street2: prismaRequest.address.street2,
      city: prismaRequest.address.city,
      state: prismaRequest.address.state,
      zip: prismaRequest.address.zip,
      county: prismaRequest.address.county,
      locationNumber: prismaRequest.address.locationNumber,
      parkingLoading: prismaRequest.address.parkingLoading,
      isRestaurant: prismaRequest.address.isRestaurant,
      isShared: prismaRequest.address.isShared,
      createdAt: prismaRequest.address.createdAt,
      updatedAt: prismaRequest.address.updatedAt,
      createdBy: prismaRequest.address.createdBy,
    },
    delivery_address: {
      id: prismaRequest.delivery_address.id,
      name: prismaRequest.delivery_address.name,
      street1: prismaRequest.delivery_address.street1,
      street2: prismaRequest.delivery_address.street2,
      city: prismaRequest.delivery_address.city,
      state: prismaRequest.delivery_address.state,
      zip: prismaRequest.delivery_address.zip,
      county: prismaRequest.delivery_address.county,
      locationNumber: prismaRequest.delivery_address.locationNumber,
      parkingLoading: prismaRequest.delivery_address.parkingLoading,
      isRestaurant: prismaRequest.delivery_address.isRestaurant,
      isShared: prismaRequest.delivery_address.isShared,
      createdAt: prismaRequest.delivery_address.createdAt,
      updatedAt: prismaRequest.delivery_address.updatedAt,
      createdBy: prismaRequest.delivery_address.createdBy,
    },
    dispatch: prismaRequest.dispatch.map((d) => ({
      id: d.id,
      cateringRequestId: d.cateringRequestId,
      on_demandId: d.on_demandId,
      driverId: d.driverId,
      userId: d.userId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      driver: d.driver
        ? {
            id: d.driver.id,
            name: d.driver.name,
            email: d.driver.email,
            contact_number: d.driver.contact_number,
          }
        : undefined,
    })),
    fileUploads: prismaRequest.fileUploads?.map((f) => ({
      id: f.id,
      userId: f.userId,
      fileName: f.fileName,
      fileType: f.fileType,
      fileSize: f.fileSize,
      fileUrl: f.fileUrl,
      uploadedAt: f.uploadedAt,
      updatedAt: f.updatedAt,
      cateringRequestId: f.cateringRequestId,
      onDemandId: f.onDemandId,
      entityType: f.entityType,
      entityId: f.entityId,
      category: f.category,
    })),

    // Specific catering fields
    order_type: "catering",
    brokerage: prismaRequest.brokerage,
    headcount: prismaRequest.headcount,
    need_host: (prismaRequest.need_host as NeedHost) ?? NeedHost.NO,
    hours_needed: prismaRequest.hours_needed,
    number_of_host: prismaRequest.number_of_host,
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
    user_id: prismaOnDemand.user_id,
    address_id: prismaOnDemand.address_id,
    delivery_address_id: prismaOnDemand.delivery_address_id,
    order_number: prismaOnDemand.order_number,
    date: prismaOnDemand.date ?? new Date(),
    pickup_time: prismaOnDemand.pickup_time,
    arrival_time: prismaOnDemand.arrival_time,
    complete_time: prismaOnDemand.complete_time,
    client_attention: prismaOnDemand.client_attention,
    pickup_notes: prismaOnDemand.pickup_notes,
    special_notes: prismaOnDemand.special_notes,
    image: prismaOnDemand.image,
    status: (prismaOnDemand.status as OrderStatus) ?? OrderStatus.ACTIVE,
    order_total: prismaOnDemand.order_total,
    tip: prismaOnDemand.tip,
    driver_status: prismaOnDemand.driver_status as DriverStatus,
    created_at: prismaOnDemand.created_at,
    updated_at: prismaOnDemand.updated_at,
    user: {
      id: prismaOnDemand.user.id,
      name: prismaOnDemand.user.name,
      email: prismaOnDemand.user.email,
    },
    address: {
      id: prismaOnDemand.address.id,
      name: prismaOnDemand.address.name,
      street1: prismaOnDemand.address.street1,
      street2: prismaOnDemand.address.street2,
      city: prismaOnDemand.address.city,
      state: prismaOnDemand.address.state,
      zip: prismaOnDemand.address.zip,
      county: prismaOnDemand.address.county,
      locationNumber: prismaOnDemand.address.locationNumber,
      parkingLoading: prismaOnDemand.address.parkingLoading,
      isRestaurant: prismaOnDemand.address.isRestaurant,
      isShared: prismaOnDemand.address.isShared,
      createdAt: prismaOnDemand.address.createdAt,
      updatedAt: prismaOnDemand.address.updatedAt,
      createdBy: prismaOnDemand.address.createdBy,
    },
    delivery_address: {
      id: prismaOnDemand.delivery_address.id,
      name: prismaOnDemand.delivery_address.name,
      street1: prismaOnDemand.delivery_address.street1,
      street2: prismaOnDemand.delivery_address.street2,
      city: prismaOnDemand.delivery_address.city,
      state: prismaOnDemand.delivery_address.state,
      zip: prismaOnDemand.delivery_address.zip,
      county: prismaOnDemand.delivery_address.county,
      locationNumber: prismaOnDemand.delivery_address.locationNumber,
      parkingLoading: prismaOnDemand.delivery_address.parkingLoading,
      isRestaurant: prismaOnDemand.delivery_address.isRestaurant,
      isShared: prismaOnDemand.delivery_address.isShared,
      createdAt: prismaOnDemand.delivery_address.createdAt,
      updatedAt: prismaOnDemand.delivery_address.updatedAt,
      createdBy: prismaOnDemand.delivery_address.createdBy,
    },
    dispatch: prismaOnDemand.dispatch.map((d) => ({
      id: d.id,
      cateringRequestId: d.cateringRequestId,
      on_demandId: d.on_demandId,
      driverId: d.driverId,
      userId: d.userId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      driver: d.driver
        ? {
            id: d.driver.id,
            name: d.driver.name,
            email: d.driver.email,
            contact_number: d.driver.contact_number,
          }
        : undefined,
    })),
    fileUploads: prismaOnDemand.fileUploads?.map((f) => ({
      id: f.id,
      userId: f.userId,
      fileName: f.fileName,
      fileType: f.fileType,
      fileSize: f.fileSize,
      fileUrl: f.fileUrl,
      uploadedAt: f.uploadedAt,
      updatedAt: f.updatedAt,
      cateringRequestId: f.cateringRequestId,
      onDemandId: f.onDemandId,
      entityType: f.entityType,
      entityId: f.entityId,
      category: f.category,
    })),

    // Specific on_demand fields
    order_type: "on_demand",
    item_delivered: prismaOnDemand.item_delivered,
    vehicle_type: prismaOnDemand.vehicle_type as VehicleType,
    hours_needed: prismaOnDemand.hours_needed,
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
