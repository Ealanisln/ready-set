import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { CateringRequest, OnDemand, Decimal } from "@/types/prisma";
import { notFound } from "next/navigation";

// Custom types for cleaner data structure
export interface OrderData {
  id: string;
  orderNumber: string;
  orderType: "catering" | "on_demand";
  status: string;
  pickupDateTime: string;
  arrivalDateTime: string;
  completeDateTime?: string | null;
  orderTotal: number;
  tip?: number;
  clientAttention?: string | null;
  pickupAddress: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
  };
  deliveryAddress: {
    id: string;
    street1: string;
    street2?: string | null;
    city: string;
    state: string;
    zip: string;
  };
}

export interface VendorMetrics {
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  orderGrowth: number;
}

// Helper function to get the current authenticated user's ID
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { email: user.email },
    select: { id: true, type: true }
  });

  return profile ? profile.id : null;
}

export async function checkVendorAccess() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return false;
  }

  const profile = await prisma.profile.findUnique({
    where: { email: user.email },
    select: { id: true, type: true }
  });

  if (!profile || profile.type !== 'VENDOR') {
    return false;
  }

  return true;
}

// Get vendor's orders
export async function getVendorOrders(limit = 10) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch catering requests
  const cateringRequests = await prisma.cateringRequest.findMany({
    where: {
      userId: userId,
      deletedAt: null
    },
    include: {
      pickupAddress: true,
      deliveryAddress: true,
    },
    orderBy: { pickupDateTime: 'desc' },
    take: limit
  });

  // Fetch on-demand requests
  const onDemandRequests = await prisma.onDemand.findMany({
    where: {
      userId: userId,
      deletedAt: null
    },
    include: {
      pickupAddress: true,
      deliveryAddress: true,
    },
    orderBy: { pickupDateTime: 'desc' },
    take: limit
  });

  // Transform the data to a unified format
  const cateringOrders: OrderData[] = cateringRequests.map((order: {
    id: string;
    orderNumber: string;
    status: CateringRequest['status'];
    pickupDateTime: Date | null;
    arrivalDateTime: Date | null;
    completeDateTime: Date | null;
    orderTotal: Decimal | null;
    tip: Decimal | null;
    clientAttention: string | null;
    pickupAddress: {
      id: string;
      name: string | null;
      street1: string;
      street2: string | null;
      city: string;
      state: string;
      zip: string;
      locationNumber: string | null;
      parkingLoading: string | null;
      longitude: number | null;
      latitude: number | null;
    };
    deliveryAddress: {
      id: string;
      name: string | null;
      street1: string;
      street2: string | null;
      city: string;
      state: string;
      zip: string;
      locationNumber: string | null;
      parkingLoading: string | null;
      longitude: number | null;
      latitude: number | null;
    };
  }) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    orderType: "catering",
    status: order.status,
    pickupDateTime: order.pickupDateTime?.toISOString() || new Date().toISOString(),
    arrivalDateTime: order.arrivalDateTime?.toISOString() || "",
    completeDateTime: order.completeDateTime?.toISOString() || null,
    orderTotal: Number(order.orderTotal) || 0,
    tip: Number(order.tip) || 0,
    clientAttention: order.clientAttention,
    pickupAddress: {
      id: order.pickupAddress.id,
      street1: order.pickupAddress.street1,
      street2: order.pickupAddress.street2,
      city: order.pickupAddress.city,
      state: order.pickupAddress.state,
      zip: order.pickupAddress.zip
    },
    deliveryAddress: {
      id: order.deliveryAddress.id,
      street1: order.deliveryAddress.street1,
      street2: order.deliveryAddress.street2,
      city: order.deliveryAddress.city,
      state: order.deliveryAddress.state,
      zip: order.deliveryAddress.zip
    }
  }));

  const onDemandOrders: OrderData[] = onDemandRequests.map((order: {
    id: string;
    orderNumber: string;
    status: OnDemand['status'];
    pickupDateTime: Date | null;
    arrivalDateTime: Date | null;
    completeDateTime: Date | null;
    orderTotal: Decimal | null;
    tip: Decimal | null;
    clientAttention: string | null;
    pickupAddress: {
      id: string;
      name: string | null;
      street1: string;
      street2: string | null;
      city: string;
      state: string;
      zip: string;
      locationNumber: string | null;
      parkingLoading: string | null;
      longitude: number | null;
      latitude: number | null;
    };
    deliveryAddress: {
      id: string;
      name: string | null;
      street1: string;
      street2: string | null;
      city: string;
      state: string;
      zip: string;
      locationNumber: string | null;
      parkingLoading: string | null;
      longitude: number | null;
      latitude: number | null;
    };
  }) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    orderType: "on_demand",
    status: order.status,
    pickupDateTime: order.pickupDateTime?.toISOString() || new Date().toISOString(),
    arrivalDateTime: order.arrivalDateTime?.toISOString() || "",
    completeDateTime: order.completeDateTime?.toISOString() || null,
    orderTotal: Number(order.orderTotal) || 0,
    tip: Number(order.tip) || 0,
    clientAttention: order.clientAttention,
    pickupAddress: {
      id: order.pickupAddress.id,
      street1: order.pickupAddress.street1,
      street2: order.pickupAddress.street2,
      city: order.pickupAddress.city,
      state: order.pickupAddress.state,
      zip: order.pickupAddress.zip
    },
    deliveryAddress: {
      id: order.deliveryAddress.id,
      street1: order.deliveryAddress.street1,
      street2: order.deliveryAddress.street2,
      city: order.deliveryAddress.city,
      state: order.deliveryAddress.state,
      zip: order.deliveryAddress.zip
    }
  }));

  // Combine and sort all orders by pickup date
  return [...cateringOrders, ...onDemandOrders]
    .sort((a, b) => new Date(b.pickupDateTime).getTime() - new Date(a.pickupDateTime).getTime())
    .slice(0, limit);
}

// Get vendor metrics
export async function getVendorMetrics() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Count active catering orders
  const activeCateringCount = await prisma.cateringRequest.count({
    where: {
      userId: userId,
      status: "ACTIVE",
      deletedAt: null
    }
  });

  // Count active on-demand orders
  const activeOnDemandCount = await prisma.onDemand.count({
    where: {
      userId: userId,
      status: "ACTIVE",
      deletedAt: null
    }
  });

  // Count completed catering orders
  const completedCateringCount = await prisma.cateringRequest.count({
    where: {
      userId: userId,
      status: "COMPLETED",
      deletedAt: null
    }
  });

  // Count completed on-demand orders
  const completedOnDemandCount = await prisma.onDemand.count({
    where: {
      userId: userId,
      status: "COMPLETED",
      deletedAt: null
    }
  });

  // Count cancelled catering orders
  const cancelledCateringCount = await prisma.cateringRequest.count({
    where: {
      userId: userId,
      status: "CANCELLED",
      deletedAt: null
    }
  });

  // Count cancelled on-demand orders
  const cancelledOnDemandCount = await prisma.onDemand.count({
    where: {
      userId: userId,
      status: "CANCELLED",
      deletedAt: null
    }
  });

  // Count assigned catering orders (treated as pending)
  const assignedCateringCount = await prisma.cateringRequest.count({
    where: {
      userId: userId,
      status: "ASSIGNED",
      deletedAt: null
    }
  });

  // Count assigned on-demand orders (treated as pending)
  const assignedOnDemandCount = await prisma.onDemand.count({
    where: {
      userId: userId,
      status: "ASSIGNED",
      deletedAt: null
    }
  });

  // Calculate total revenue from completed orders
  const completedOrders = await prisma.$queryRaw`
    SELECT 
      COALESCE(SUM(CAST("orderTotal" AS DECIMAL(10,2))), 0) as total 
    FROM 
      (
        SELECT "orderTotal" FROM "catering_requests" 
        WHERE "userId" = ${userId}::uuid AND "status" = 'COMPLETED' AND "deletedAt" IS NULL
        UNION ALL
        SELECT "orderTotal" FROM "on_demand_requests" 
        WHERE "userId" = ${userId}::uuid AND "status" = 'COMPLETED' AND "deletedAt" IS NULL
      ) as combined
  `;

  // Calculate order growth (comparing current month to previous month)
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Current month orders
  const currentMonthOrders = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM (
      SELECT id FROM "catering_requests" 
      WHERE "userId" = ${userId}::uuid AND "createdAt" >= ${currentMonthStart} AND "deletedAt" IS NULL
      UNION ALL
      SELECT id FROM "on_demand_requests" 
      WHERE "userId" = ${userId}::uuid AND "createdAt" >= ${currentMonthStart} AND "deletedAt" IS NULL
    ) as combined
  `;

  // Previous month orders
  const previousMonthOrders = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM (
      SELECT id FROM "catering_requests" 
      WHERE "userId" = ${userId}::uuid AND "createdAt" >= ${lastMonthStart} AND "createdAt" < ${currentMonthStart} AND "deletedAt" IS NULL
      UNION ALL
      SELECT id FROM "on_demand_requests" 
      WHERE "userId" = ${userId}::uuid AND "createdAt" >= ${lastMonthStart} AND "createdAt" < ${currentMonthStart} AND "deletedAt" IS NULL
    ) as combined
  `;

  // Calculate growth percentage
  const currentCount = Number((currentMonthOrders as any)[0]?.count || 0);
  const previousCount = Number((previousMonthOrders as any)[0]?.count || 0);
  
  let orderGrowth = 0;
  if (previousCount > 0) {
    orderGrowth = Math.round(((currentCount - previousCount) / previousCount) * 100);
  } else if (currentCount > 0) {
    orderGrowth = 100; // If there were 0 orders last month and some this month, that's 100% growth
  }

  // Combine all metrics
  return {
    activeOrders: activeCateringCount + activeOnDemandCount,
    completedOrders: completedCateringCount + completedOnDemandCount,
    cancelledOrders: cancelledCateringCount + cancelledOnDemandCount,
    pendingOrders: assignedCateringCount + assignedOnDemandCount,
    totalRevenue: Number((completedOrders as any)[0]?.total || 0),
    orderGrowth
  };
}

// Get a specific order by orderNumber
export async function getOrderByNumber(orderNumber: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Try to find it in catering requests
  const cateringRequest = await prisma.cateringRequest.findFirst({
    where: {
      orderNumber: orderNumber,
      userId: userId,
      deletedAt: null
    },
    include: {
      pickupAddress: true,
      deliveryAddress: true,
      dispatches: {
        include: {
          driver: true
        }
      },
      fileUploads: true
    }
  });

  if (cateringRequest) {
    return {
      id: cateringRequest.id,
      orderNumber: cateringRequest.orderNumber,
      orderType: "catering",
      status: cateringRequest.status,
      pickupDateTime: cateringRequest.pickupDateTime?.toISOString() || null,
      arrivalDateTime: cateringRequest.arrivalDateTime?.toISOString() || null,
      completeDateTime: cateringRequest.completeDateTime?.toISOString() || null,
      orderTotal: Number(cateringRequest.orderTotal) || 0,
      tip: Number(cateringRequest.tip) || 0,
      brokerage: cateringRequest.brokerage,
      clientAttention: cateringRequest.clientAttention,
      pickupNotes: cateringRequest.pickupNotes,
      specialNotes: cateringRequest.specialNotes,
      headcount: cateringRequest.headcount,
      needHost: cateringRequest.needHost,
      hoursNeeded: cateringRequest.hoursNeeded,
      numberOfHosts: cateringRequest.numberOfHosts,
      image: cateringRequest.image,
      driverStatus: cateringRequest.driverStatus,
      pickupAddress: cateringRequest.pickupAddress,
      deliveryAddress: cateringRequest.deliveryAddress,
      dispatches: cateringRequest.dispatches,
      fileUploads: cateringRequest.fileUploads
    };
  }

  // If not found in catering, try on-demand
  const onDemandRequest = await prisma.onDemand.findFirst({
    where: {
      orderNumber: orderNumber,
      userId: userId,
      deletedAt: null
    },
    include: {
      pickupAddress: true,
      deliveryAddress: true,
      dispatches: {
        include: {
          driver: true
        }
      },
      fileUploads: true
    }
  });

  if (onDemandRequest) {
    return {
      id: onDemandRequest.id,
      orderNumber: onDemandRequest.orderNumber,
      orderType: "on_demand",
      status: onDemandRequest.status,
      pickupDateTime: onDemandRequest.pickupDateTime?.toISOString() || null,
      arrivalDateTime: onDemandRequest.arrivalDateTime?.toISOString() || null,
      completeDateTime: onDemandRequest.completeDateTime?.toISOString() || null,
      orderTotal: Number(onDemandRequest.orderTotal) || 0,
      tip: Number(onDemandRequest.tip) || 0,
      clientAttention: onDemandRequest.clientAttention,
      pickupNotes: onDemandRequest.pickupNotes,
      specialNotes: onDemandRequest.specialNotes,
      hoursNeeded: onDemandRequest.hoursNeeded,
      vehicleType: onDemandRequest.vehicleType,
      itemDelivered: onDemandRequest.itemDelivered,
      image: onDemandRequest.image,
      driverStatus: onDemandRequest.driverStatus,
      length: onDemandRequest.length,
      width: onDemandRequest.width,
      height: onDemandRequest.height,
      weight: onDemandRequest.weight,
      pickupAddress: onDemandRequest.pickupAddress,
      deliveryAddress: onDemandRequest.deliveryAddress,
      dispatches: onDemandRequest.dispatches,
      fileUploads: onDemandRequest.fileUploads
    };
  }

  // If order is not found in either table
  notFound();
} 