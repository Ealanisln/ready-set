// app/api/catering-requests/assignDriver/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: Request) {
  const { orderId, driverId } = await request.json();

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
      // First, get the catering request to retrieve the user_id
      const cateringRequest = await prisma.catering_request.findUnique({
        where: { id: BigInt(orderId) },
        select: { user_id: true },
      });

      if (!cateringRequest) {
        throw new Error("Catering request not found");
      }

      // Check if a dispatch exists
      let dispatch = await prisma.dispatch.findFirst({
        where: {
          service_id: BigInt(orderId),
          service_type: "catering",
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
            user_id: cateringRequest.user_id, // Use the user_id from the catering request
            service_id: BigInt(orderId),
            service_type: "catering",
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
      const updatedOrder = await prisma.catering_request.update({
        where: { id: BigInt(orderId) },
        data: { status: "assigned" },
      });

      return { updatedOrder, dispatch };
    });

    // Serialize the result before sending the response
    const serializedResult = serializeBigInt(result);
    return NextResponse.json(serializedResult);
  } catch (error: unknown) {
    console.error("Error assigning driver:", error);
    let errorMessage = "Failed to assign driver";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}