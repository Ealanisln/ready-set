// app/api/orders/assignDriver/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: Request) {
  const { orderId, driverId } = await request.json();

  if (!orderId || !driverId) {
    return NextResponse.json({ error: "Missing orderId or driverId" }, { status: 400 });
  }

  function serializeBigInt(obj: any): any {
    if (typeof obj === "bigint") {
      return obj.toString();
    } else if (Array.isArray(obj)) {
      return obj.map(serializeBigInt);
    } else if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          serializeBigInt(value),
        ]),
      );
    }
    return obj;
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Determine order type and get order details
      let order: any;
      let orderType: 'catering' | 'ondemand';

      order = await prisma.catering_request.findUnique({
        where: { id: BigInt(orderId) },
        select: { user_id: true },
      });

      if (order) {
        orderType = 'catering';
      } else {
        order = await prisma.on_demand.findUnique({
          where: { id: BigInt(orderId) },
          select: { user_id: true },
        });
        
        if (order) {
          orderType = 'ondemand';
        } else {
          throw new Error("Order not found");
        }
      }

      // Check if a dispatch exists
      let dispatch = await prisma.dispatch.findFirst({
        where: {
          service_id: BigInt(orderId),
          service_type: orderType,
        },
      });

      if (dispatch) {
        // Update existing dispatch
        dispatch = await prisma.dispatch.update({
          where: { id: dispatch.id },
          data: { driver_id: driverId },
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
        });
      } else {
        // Create new dispatch
        dispatch = await prisma.dispatch.create({
          data: {
            user_id: order.user_id,
            service_id: BigInt(orderId),
            service_type: orderType,
            driver_id: driverId,
          },
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
        });
      }

      // Update the order status to 'assigned'
      let updatedOrder;
      if (orderType === 'catering') {
        updatedOrder = await prisma.catering_request.update({
          where: { id: BigInt(orderId) },
          data: { status: "assigned" },
        });
      } else {
        updatedOrder = await prisma.on_demand.update({
          where: { id: BigInt(orderId) },
          data: { status: "assigned" },
        });
      }

      return { updatedOrder, dispatch };
    });

    // Serialize the result before sending the response
    const serializedResult = serializeBigInt(result);
    return NextResponse.json(serializedResult);
  } catch (error: unknown) {
    console.error("Error in POST /api/orders/assignDriver:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}