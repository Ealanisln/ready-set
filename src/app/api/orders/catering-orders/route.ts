// src/app/api/orders/catering-orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { OrderStatus } from "@/types/order";

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  try {
    console.log('Catering orders API called');
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.id) {
      console.log('Unauthorized request - no user found');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log('Authenticated user:', user.id);

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || `${ITEMS_PER_PAGE}`, 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;
    const status = url.searchParams.get('status');
    const searchTerm = url.searchParams.get('search') || '';
    const sortField = url.searchParams.get('sort') || 'pickupDateTime';
    const sortDirection = url.searchParams.get('direction') || 'desc';

    console.log('Query params:', { limit, page, skip, status, searchTerm, sortField, sortDirection });

    let whereClause: Prisma.CateringRequestWhereInput = {
      // Add soft delete filter
      deletedAt: null
    };

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

    console.log('Where clause:', whereClause);

    // Order By Clause
    let orderByClause: Prisma.CateringRequestOrderByWithRelationInput = {};
    if (sortField === 'user.name') {
      orderByClause = { user: { name: sortDirection as Prisma.SortOrder } };
    } else if (['pickupDateTime', 'orderTotal', 'orderNumber'].includes(sortField)) {
      orderByClause = { [sortField]: sortDirection as Prisma.SortOrder };
    } else {
      orderByClause = { pickupDateTime: 'desc' };
    }

    console.log('Order by clause:', orderByClause);

    // Fetch Data and Count
    const [cateringOrders, totalCount] = await Promise.all([
      prisma.cateringRequest.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
        include: {
          user: {
            select: { 
              id: true,
              name: true, 
              email: true,
              contactNumber: true
            }
          },
          pickupAddress: true,
          deliveryAddress: true,
          dispatches: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contactNumber: true
                }
              }
            }
          }
        },
      }),
      prisma.cateringRequest.count({ where: whereClause }),
    ]);

    console.log(`Found ${cateringOrders.length} orders out of ${totalCount} total`);

    // Calculate Total Pages
    const totalPages = Math.ceil(totalCount / limit);

    // Format the orders for the response
    const formattedOrders = cateringOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      order_number: order.orderNumber,
      status: order.status,
      pickupDateTime: order.pickupDateTime,
      date: order.pickupDateTime || order.createdAt,
      orderTotal: order.orderTotal || 0,
      order_total: order.orderTotal?.toString() || "0.00",
      user: {
        id: order.user.id,
        name: order.user.name || 'Unknown Client',
        email: order.user.email,
        contactNumber: order.user.contactNumber
      },
      pickup_address: order.pickupAddress,
      delivery_address: order.deliveryAddress,
      client_attention: order.clientAttention,
      special_notes: order.specialNotes,
      pickup_notes: order.pickupNotes,
      driver_status: order.driverStatus,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      dispatches: order.dispatches
    }));

    // Serialize and return response
    const response = {
      orders: formattedOrders,
      totalPages,
      totalCount,
      currentPage: page
    };

    console.log('Sending response with metadata:', {
      totalOrders: formattedOrders.length,
      totalPages,
      totalCount,
      currentPage: page
    });

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error) {
    console.error("Error fetching catering orders:", error);
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred";
    return NextResponse.json({ 
      message: "Error fetching catering orders", 
      error: errorMessage 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}