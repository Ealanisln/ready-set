// src/app/api/orders/catering-orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
// Import correct Prisma types based on schema.prisma
import { 
    Prisma, 
    CateringRequest, 
    Dispatch, 
    Profile, // Use Profile instead of User/Driver
    Address, 
    CateringStatus, // Use CateringStatus for this route
    // DriverStatus // This exists, but isn't used directly in Dispatch status
} from "@prisma/client"; 
// Import error type from runtime library
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; 

import { prisma } from "@/lib/db/prisma"; 

const ITEMS_PER_PAGE = 10;

// Define types using Profile based on schema
interface EnrichedDispatch extends Dispatch {
    // Dispatch model has no 'status' field in schema
    // status: DispatchStatus; // Remove this line
    driver: Pick<Profile, 'id' | 'name' | 'email' | 'contactNumber'> | null; // Use Profile
}

interface CateringOrderWithDetails extends CateringRequest {
  status: CateringStatus; // Use the correct enum from CateringRequest
  user: Pick<Profile, 'id' | 'name' | 'email' | 'contactNumber'>; // Use Profile
  pickupAddress: Address | null;
  deliveryAddress: Address | null;
  dispatches: EnrichedDispatch[];
}

export async function GET(req: NextRequest) {
  try {
    console.log('Catering orders API called');
    
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Unauthorized request - invalid authorization header');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract the token from header
    const token = authHeader.split(' ')[1];
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Verify the token by passing it to getUser
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log('Unauthorized request - token validation failed');
      console.error('Auth error:', authError);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log('Authenticated user:', user.id);

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || `${ITEMS_PER_PAGE}`, 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;
    const statusParam = url.searchParams.get('status');
    const searchTerm = url.searchParams.get('search') || '';
    const sortField = url.searchParams.get('sort') || 'pickupDateTime';
    const sortDirection = url.searchParams.get('direction') || 'desc';

    console.log('Query params:', { limit, page, skip, status: statusParam, searchTerm, sortField, sortDirection });

    let whereClause: Prisma.CateringRequestWhereInput = {
      deletedAt: null
    };

    if (statusParam && statusParam !== 'all') {
      // Validate against the CateringStatus enum from Prisma
      if (Object.values(CateringStatus).includes(statusParam as CateringStatus)) {
         whereClause.status = statusParam as CateringStatus;
      } else {
         console.warn(`Invalid status filter provided: ${statusParam}. Ignoring.`);
      }
    }

    if (searchTerm) {
      // Adjust search fields to use Profile model relations
      whereClause.OR = [
        { orderNumber: { contains: searchTerm, mode: 'insensitive' } },
        { user: { name: { contains: searchTerm, mode: 'insensitive' } } }, // Search user (Profile) name
        { user: { email: { contains: searchTerm, mode: 'insensitive' } } }, // Search user (Profile) email
      ];
    }

    console.log('Where clause:', whereClause);

    let orderByClause: Prisma.CateringRequestOrderByWithRelationInput = {};
    // Adjust sort fields based on Profile relation
    const validSortFields: { [key: string]: Prisma.CateringRequestOrderByWithRelationInput } = {
      pickupDateTime: { pickupDateTime: 'desc' },
      date: { pickupDateTime: 'desc' }, // Add 'date' as an alias for pickupDateTime
      orderTotal: { orderTotal: 'desc' },
      orderNumber: { orderNumber: 'desc' },
      'user.name': { user: { name: 'desc' } }, // Sort by Profile name via relation
      createdAt: { createdAt: 'desc' },
    };

    const effectiveSortDirection = sortDirection === 'asc' ? 'asc' : 'desc';
    
    if (validSortFields[sortField]) {
        if (sortField === 'user.name') {
            orderByClause = { user: { name: effectiveSortDirection } }; // Sort by Profile name
        } else if (sortField === 'date') {
            // Map 'date' to 'pickupDateTime' for sorting
            orderByClause = { pickupDateTime: effectiveSortDirection };
        } else {
            // Ensure sortField is a valid key of CateringRequest
            const validKeys: (keyof CateringRequest)[] = ['pickupDateTime', 'orderTotal', 'orderNumber', 'createdAt', 'status'];
            if (validKeys.includes(sortField as keyof CateringRequest)) {
               orderByClause = { [sortField as keyof CateringRequest]: effectiveSortDirection };
            } else {
               orderByClause = { pickupDateTime: 'desc' }; 
               console.warn(`Sort field ${sortField} is not a direct sortable key. Defaulting.`);
            }
        }
    } else {
      orderByClause = { pickupDateTime: 'desc' }; 
      console.warn(`Invalid sort field provided: ${sortField}. Defaulting to pickupDateTime desc.`);
    }

    console.log('Order by clause:', orderByClause);

    // Fetch data using the corrected include/select structure
    const [cateringOrders, totalCount] = await Promise.all([
      prisma.cateringRequest.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
        include: {
          user: { // Include related Profile (user)
            select: { id: true, name: true, email: true, contactNumber: true }
          },
          pickupAddress: true,
          deliveryAddress: true,
          dispatches: {
            include: {
              driver: { // Include related Profile (driver)
                select: { id: true, name: true, email: true, contactNumber: true }
              }
            }
          }
        },
      }),
      prisma.cateringRequest.count({ where: whereClause }),
    ]) as [CateringOrderWithDetails[], number]; 

    console.log(`Found ${cateringOrders.length} orders out of ${totalCount} total`);

    const totalPages = Math.ceil(totalCount / limit);

    // Format response using correct types
    const formattedOrders = cateringOrders.map((order: CateringOrderWithDetails) => ({ 
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status, // This is CateringStatus
      pickupDateTime: order.pickupDateTime,
      date: order.pickupDateTime || order.createdAt, 
      orderTotal: order.orderTotal ?? 0, 
      user: { // User is a Profile
        id: order.user.id,
        name: order.user.name || 'N/A', 
        email: order.user.email,
        contactNumber: order.user.contactNumber
      },
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      clientAttention: order.clientAttention,
      specialNotes: order.specialNotes,
      pickupNotes: order.pickupNotes,
      driverStatus: order.driverStatus, // This exists on CateringRequest
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      dispatches: order.dispatches.map((dispatch: EnrichedDispatch) => ({ 
        id: dispatch.id,
        // Dispatch model has no status field, so remove this
        // status: dispatch.status,
        driver: dispatch.driver ? { // Driver is a Profile
          id: dispatch.driver.id,
          name: dispatch.driver.name || 'N/A',
          email: dispatch.driver.email,
          contactNumber: dispatch.driver.contactNumber,
        } : null,
      })),
    }));

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

  } catch (error: unknown) { 
    console.error("Error fetching catering orders:", error); 

    let errorMessage = "An internal server error occurred";
    let statusCode = 500;

    if (error instanceof PrismaClientKnownRequestError) { 
       const prismaError = error as PrismaClientKnownRequestError;
       console.error(`Prisma Error Code: ${prismaError.code}`);
       if (prismaError.code === 'P1001') {
          errorMessage = "Database connection issue. Please try again later.";
          statusCode = 503; 
       } else {
          errorMessage = `Database query failed: ${prismaError.message} (Code: ${prismaError.code}).`;
       }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
       errorMessage = "An unexpected error occurred.";
       try {
          errorMessage = `An unexpected error occurred: ${JSON.stringify(error)}`;
       } catch (_) { /* Ignore stringify errors */ }
    }
    
    return NextResponse.json({ 
      message: "Error fetching catering orders", 
      error: errorMessage 
    }, { status: statusCode });
  } 
}