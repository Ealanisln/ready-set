// src/app/api/orders/on-demand-orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { OrderStatus } from "@/types/order";

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || `${ITEMS_PER_PAGE}`, 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;
    const status = url.searchParams.get('status');
    const searchTerm = url.searchParams.get('search') || '';
    const sortField = url.searchParams.get('sort') || 'pickupDateTime';
    const sortDirection = url.searchParams.get('direction') || 'desc';

    let whereClause: Prisma.OnDemandWhereInput = {};

    // Status filter
    if (status && status !== 'all') {
      whereClause.status = status as OrderStatus;
    }

    // Search filter
    if (searchTerm) {
      whereClause.OR = [
        {
          orderNumber: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Order By Clause
    let orderByClause: Prisma.OnDemandOrderByWithRelationInput = {};
    if (sortField === 'user.name') {
      orderByClause = { user: { name: sortDirection as Prisma.SortOrder } };
    } else if (['pickupDateTime', 'orderTotal', 'orderNumber'].includes(sortField)) {
      orderByClause = { [sortField]: sortDirection as Prisma.SortOrder };
    } else {
      orderByClause = { pickupDateTime: 'desc' };
    }

    // Fetch Data and Count
    const [onDemandOrders, totalCount] = await Promise.all([
      prisma.onDemand.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
        include: {
          user: {
            select: { name: true }
          },
        },
      }),
      prisma.onDemand.count({ where: whereClause }),
    ]);

    // Calculate Total Pages
    const totalPages = Math.ceil(totalCount / limit);

    // Serialize BigInt
    const serializedOrders = JSON.parse(JSON.stringify(onDemandOrders, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    ));

    // Return Response
    return NextResponse.json({
      orders: serializedOrders,
      totalPages,
      totalCount,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching on-demand orders:", error);
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
    return NextResponse.json({ message: "Error fetching on-demand orders", error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}