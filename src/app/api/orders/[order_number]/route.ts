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
}> & {
  delivery_address?: Prisma.addressGetPayload<{}> | null;
};

type Order =
  | (CateringRequest & { order_type: "catering" })
  | (OnDemandOrder & { order_type: "on_demand" });

function serializeBigInt(data: any): any {
  return JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  ));
}

export async function GET(
  req: NextRequest,
  { params }: { params: { order_number: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { order_number } = params;

    let order: Order | null = null;

    // Try to find catering request
    const cateringRequest = await prisma.catering_request.findUnique({
      where: { order_number },
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
        where: { order_number },
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
        // Fetch the delivery address if delivery_address_id exists
        let delivery_address = null;
        if (onDemandOrder.delivery_address_id) {
          delivery_address = await prisma.address.findUnique({
            where: { id: onDemandOrder.delivery_address_id },
          });
        }

        order = { ...onDemandOrder, delivery_address, order_type: "on_demand" };
      }
    }

    if (order) {
      const serializedOrder = serializeBigInt(order);
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
  { params }: { params: { order_number: string } },
) {
  try {
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


    let updatedOrder: Order | null = null;

    // Try updating catering request
    const cateringRequest = await prisma.catering_request.findUnique({
      where: { order_number },
    });

    if (cateringRequest) {
      const updated = await prisma.catering_request.update({
        where: { order_number },
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
        where: { order_number },
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
      const serializedOrder = serializeBigInt(updatedOrder);
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