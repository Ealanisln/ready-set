// src/app/api/orders/on-demand-orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// Import Prisma namespace, PrismaClient AND the $Enums helper
import { Prisma, PrismaClient, $Enums } from "@prisma/client";

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
    const status = url.searchParams.get('status'); // This is 'string | null'
    const searchTerm = url.searchParams.get('search') || '';
    const sortField = url.searchParams.get('sort') || 'date';
    const sortDirection = url.searchParams.get('direction') || 'desc';

    let whereClause: Prisma.on_demandWhereInput = {};

    // Status filter
    if (status && status !== 'all') {
      // Assert that the 'status' string is one of the valid enum members
      whereClause.status = status as $Enums.on_demand_status;
    }

    // Search filter
    // ... (rest of the whereClause logic remains the same) ...
     if (searchTerm) {
        whereClause.OR = [
            {
            order_number: {
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
    // ... (orderByClause logic remains the same) ...
    let orderByClause: Prisma.on_demandOrderByWithRelationInput = {};
    if (sortField === 'user.name') {
      orderByClause = { user: { name: sortDirection as Prisma.SortOrder } };
    } else if (['date', 'order_total', 'order_number', 'pickup_time'].includes(sortField)) {
       orderByClause = { [sortField]: sortDirection as Prisma.SortOrder };
    } else {
       orderByClause = { date: 'desc' };
    }


    // Fetch Data and Count
    // ... (data fetching logic remains the same) ...
     const [onDemandOrders, totalCount] = await Promise.all([
        prisma.on_demand.findMany({
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
        prisma.on_demand.count({ where: whereClause }),
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
      totalPages: totalPages,
      totalCount: totalCount,
    }, { status: 200 });

  } catch (error) {
      console.error("Error fetching on-demand orders:", error);
      const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
      return NextResponse.json({ message: "Error fetching on-demand orders", error: errorMessage }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}