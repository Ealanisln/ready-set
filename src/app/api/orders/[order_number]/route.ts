// src/app/api/orders/[order_number]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";
import { Prisma } from "@prisma/client";

type CateringRequest = Prisma.CateringRequestGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    pickupAddress: true;
    deliveryAddress: true;
    dispatches: {
      include: {
        driver: {
          select: {
            id: true;
            name: true;
            email: true;
            contactNumber: true;
          };
        };
      };
    };
    fileUploads: true;
  };
}>;

type OnDemandOrder = Prisma.OnDemandGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    pickupAddress: true;
    deliveryAddress: true;
    dispatches: {
      include: {
        driver: {
          select: {
            id: true;
            name: true;
            email: true;
            contactNumber: true;
          };
        };
      };
    };
    fileUploads: true;
  };
}>;

type Order = 
  | (CateringRequest & { orderType: "catering" })
  | (OnDemandOrder & { orderType: "onDemand" });

function serializeOrder(data: any): any {
  // Helper function to format dates with timezone
  const formatDate = (date: string | Date | null, state: string | null) => {
    if (!date) return null;
    
    // Create a date object from the input
    const utcDate = new Date(date);
    
    // Determine timezone based on state
    let timezone = 'America/Los_Angeles'; // Default to PST
    if (state === 'TX') {
      timezone = 'America/Chicago'; // CST for Texas
    }
    
    // Format the date in the correct timezone
    return utcDate.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Get the state from the delivery address
  const state = data.deliveryAddress?.state || null;

  // Create a copy of the data with formatted dates
  const formattedData = {
    ...data,
    pickupDateTime: formatDate(data.pickupDateTime, state),
    arrivalDateTime: formatDate(data.arrivalDateTime, state),
    completeDateTime: formatDate(data.completeDateTime, state),
    createdAt: formatDate(data.createdAt, state),
    updatedAt: formatDate(data.updatedAt, state)
  };

  // Convert any BigInt values to strings
  return JSON.parse(JSON.stringify(formattedData, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  ));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ order_number: string }> }
) {
  try {
    // Await params before accessing its properties
    const resolvedParams = await params;
    console.log(`GET request for order: ${resolvedParams.order_number}`);
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user || !user.id) {
      console.error("Unauthorized access attempt to order API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`Authenticated user: ${user.id}`);
    
    // Extract order_number from params
    const { order_number } = resolvedParams;

    let order: Order | null = null;

    // Try to find catering request using case-insensitive search and check soft delete
    const cateringRequest = await prisma.cateringRequest.findFirst({
      where: { 
        orderNumber: {
          equals: order_number,
          mode: 'insensitive'
        },
        deletedAt: null // Add soft delete check
      },
      include: {
        user: { select: { name: true, email: true } },
        pickupAddress: true,
        deliveryAddress: true,
        dispatches: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
              },
            },
          },
        },
        fileUploads: true,
      },
    });

    if (cateringRequest) {
      order = { ...cateringRequest, orderType: "catering" };
    } else {
      // If not found, try to find on-demand order using case-insensitive search and check soft delete
      const onDemandOrder = await prisma.onDemand.findFirst({
        where: { 
          orderNumber: {
            equals: order_number,
            mode: 'insensitive'
          },
          // Assuming onDemand table also has a deletedAt field for soft deletes
          // If not, this line might need adjustment based on your schema
          deletedAt: null // Add soft delete check 
        },
        include: {
          user: { select: { name: true, email: true } },
          pickupAddress: true,
          deliveryAddress: true,
          dispatches: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contactNumber: true,
                },
              },
            },
          },
          fileUploads: true,
        },
      });

      if (onDemandOrder) {
        order = { ...onDemandOrder, orderType: "onDemand" };
      }
    }

    if (order) {
      const serializedOrder = serializeOrder(order);
      return NextResponse.json(serializedOrder);
    }

    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Error fetching order", error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ order_number: string }> }
) {
  try {
    // Await params before accessing its properties
    const resolvedParams = await params;
    console.log(`PATCH request for order: ${resolvedParams.order_number}`);
    
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user || !user.id) {
      console.error("Unauthorized access attempt to order PATCH API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`Authenticated user: ${user.id}`);
    
    // Extract order_number from params
    const { order_number } = resolvedParams;
    
    const body = await request.json();
    const { status, driverStatus } = body;

    if (!status && !driverStatus) {
      return NextResponse.json(
        { message: "No update data provided" },
        { status: 400 },
      );
    }

    let updatedOrder: Order | null = null;

    // Try updating catering request
    const cateringRequest = await prisma.cateringRequest.findUnique({
      where: { orderNumber: order_number },
    });

    if (cateringRequest) {
      const updated = await prisma.cateringRequest.update({
        where: { orderNumber: order_number },
        data: {
          ...(status && { status: status as any }),
          ...(driverStatus && { driverStatus: driverStatus as any }),
        },
        include: {
          user: { select: { name: true, email: true } },
          pickupAddress: true,
          deliveryAddress: true,
          dispatches: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contactNumber: true,
                },
              },
            },
          },
          fileUploads: true,
        },
      });
      updatedOrder = { ...updated, orderType: "catering" };
    } else {
      // If not found, try updating on-demand order
      const updated = await prisma.onDemand.update({
        where: { orderNumber: order_number },
        data: {
          ...(status && { status: status as any }),
          ...(driverStatus && { driverStatus: driverStatus as any }),
        },
        include: {
          user: { select: { name: true, email: true } },
          pickupAddress: true,
          deliveryAddress: true,
          dispatches: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contactNumber: true,
                },
              },
            },
          },
          fileUploads: true,
        },
      });
      updatedOrder = { ...updated, orderType: "onDemand" };
    }

    if (updatedOrder) {
      const serializedOrder = serializeOrder(updatedOrder);
      return NextResponse.json(serializedOrder);
    }

    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Error updating order", error: (error as Error).message },
      { status: 500 },
    );
  }
}