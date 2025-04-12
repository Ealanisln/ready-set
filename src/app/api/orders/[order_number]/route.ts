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
  return JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  ));
}

// Using a simpler approach with generic parameter type
export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orderNumber = params.order_number;

    let order: Order | null = null;

    // Try to find catering request
    const cateringRequest = await prisma.cateringRequest.findUnique({
      where: { orderNumber },
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
      // If not found, try to find on-demand order
      const onDemandOrder = await prisma.onDemand.findUnique({
        where: { orderNumber },
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
  req: NextRequest,
  { params }: any
) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orderNumber = params.order_number;
    const body = await req.json();
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
      where: { orderNumber },
    });

    if (cateringRequest) {
      const updated = await prisma.cateringRequest.update({
        where: { orderNumber },
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
        where: { orderNumber },
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