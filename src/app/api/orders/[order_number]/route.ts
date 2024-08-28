// src/app/api/orders/[order_number]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { Prisma } from "@prisma/client";

type CateringRequest = Prisma.catering_requestGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    address: true;
    delivery_address: true;
    dispatch: {
      include: {
        driver: {
          select: {
            id: true;
            name: true;
            email: true;
            contact_number: true;
          };
        };
      };
    };
  };
}>;

type OnDemandOrder = Prisma.on_demandGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    address: true;
    dispatch: {
      include: {
        driver: {
          select: {
            id: true;
            name: true;
            email: true;
            contact_number: true;
          };
        };
      };
    };
  };
}>;

type Order =
  | (CateringRequest & { order_type: "catering" })
  | (OnDemandOrder & { order_type: "on_demand" });

  export async function GET(
    req: NextRequest,
    { params }: { params: { order_number: string } },
  ) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const { order_number } = params;
  
    try {
      // Try to find catering request
      let order: Order | null = null;
      const cateringRequest = await prisma.catering_request.findUnique({
        where: { order_number: order_number },
        include: {
          user: { select: { name: true, email: true } },
          address: true,
          delivery_address: true,
          dispatch: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contact_number: true,
                },
              },
            },
          },
        },
      });
  
      if (cateringRequest) {
        order = { ...cateringRequest, order_type: "catering" };
      } else {
        // If not found, try to find on-demand order
        const onDemandOrder = await prisma.on_demand.findUnique({
          where: { order_number: order_number },
          include: {
            user: { select: { name: true, email: true } },
            address: true,
            dispatch: {
              include: {
                driver: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    contact_number: true,
                  },
                },
              },
            },
          },
        });
  
        if (onDemandOrder) {
          order = { ...onDemandOrder, order_type: "on_demand" };
        }
      }
  
      if (order) {
        const serializedOrder = JSON.parse(
          JSON.stringify(order, (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          ),
        );
        return NextResponse.json(serializedOrder);
      }
  
      // If no order found
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
  { params }: { params: { order_number: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { order_number } = params;
  const body = await req.json();
  const { status, driver_status } = body;

  if (!status && !driver_status) {
    return NextResponse.json(
      { message: "No update data provided" },
      { status: 400 },
    );
  }

  try {
    // Update catering request
    let updatedOrder: Order | null = null;
    const cateringRequest = await prisma.catering_request.findUnique({
      where: { order_number: order_number },
    });

    if (cateringRequest) {
      const updated = await prisma.catering_request.update({
        where: { order_number: order_number },
        data: {
          ...(status && { status: status as any }),
          ...(driver_status && { driver_status: driver_status as any }),
        },
        include: {
          user: { select: { name: true, email: true } },
          address: true,
          delivery_address: true,
          dispatch: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contact_number: true,
                },
              },
            },
          },
        },
      });
      updatedOrder = { ...updated, order_type: "catering" };
    } else {
      // If not found, try updating on-demand order
      const updated = await prisma.on_demand.update({
        where: { order_number: order_number },
        data: {
          ...(status && { status: status as any }),
          ...(driver_status && { driver_status: driver_status as any }),
        },
        include: {
          user: { select: { name: true, email: true } },
          address: true,
          dispatch: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contact_number: true,
                },
              },
            },
          },
        },
      });
      updatedOrder = { ...updated, order_type: "on_demand" };
    }

    if (updatedOrder) {
      const serializedOrder = JSON.parse(
        JSON.stringify(updatedOrder, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      );
      return NextResponse.json(serializedOrder);
    }

    // If no order found
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Error updating order" },
      { status: 500 },
    );
  }
}
