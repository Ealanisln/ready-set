import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { Prisma } from "@prisma/client";

function serializeData(obj: any): any {
  if (typeof obj === "bigint") {
    return Number(obj);
  } else if (obj instanceof Date) {
    return obj.toISOString();
  } else if (obj instanceof Prisma.Decimal) {
    return obj.toNumber();
  } else if (Array.isArray(obj)) {
    return obj.map(serializeData);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        serializeData(value),
      ]),
    );
  }
  return obj;
}

export async function POST(request: Request) {
  const { orderId, driverId, orderType } = await request.json();

  if (!orderId || !driverId || !orderType) {
    return NextResponse.json(
      { error: "Missing orderId, driverId, or orderType" },
      { status: 400 },
    );
  }

  console.log("Order ID:", orderId);
  console.log("Driver ID:", driverId);
  console.log("Order Type:", orderType);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      let order;
      let dispatch;

      // Fetch the order based on orderType
      if (orderType === "catering") {
        order = await prisma.catering_request.findUnique({
          where: { id: BigInt(orderId) },
        });
      } else if (orderType === "on_demand") {
        order = await prisma.on_demand.findUnique({
          where: { id: BigInt(orderId) },
        });
      } else {
        throw new Error("Invalid order type");
      }

      if (!order) {
        throw new Error(`${orderType} order not found`);
      }

      console.log("Order:", serializeData(order));

      // Check if a dispatch already exists
      dispatch = await prisma.dispatch.findFirst({
        where: orderType === "catering"
          ? { cateringRequestId: BigInt(orderId) }
          : { on_demandId: BigInt(orderId) },
      });

      console.log("Existing Dispatch:", serializeData(dispatch));

      if (dispatch) {
        // Update existing dispatch
        dispatch = await prisma.dispatch.update({
          where: { id: dispatch.id },
          data: { driverId: driverId },
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
        const dispatchData = {
          driverId: driverId,
          userId: order.user_id,
          ...(orderType === "catering"
            ? { cateringRequestId: BigInt(orderId) }
            : { on_demandId: BigInt(orderId) }),
        };

        dispatch = await prisma.dispatch.create({
          data: dispatchData,
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

      console.log("Updated/Created Dispatch:", serializeData(dispatch));

      // Update the order status
      const updatedOrder = await (orderType === "catering"
        ? prisma.catering_request.update({
            where: { id: BigInt(orderId) },
            data: { status: "assigned" },
          })
        : prisma.on_demand.update({
            where: { id: BigInt(orderId) },
            data: { status: "assigned" },
          }));

      return { updatedOrder, dispatch };
    });

    // Serialize the result before sending the response
    const serializedResult = serializeData(result);
    return NextResponse.json(serializedResult);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error:", error.message);
      console.error("Error Code:", error.code);
      console.error("Meta:", error.meta);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 },
      );
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}