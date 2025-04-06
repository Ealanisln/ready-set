import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const { orderId } = params;

  try {
    // Fetch the dispatch with the specific cateringRequestId or onDemandId
    const dispatch = await prisma.dispatch.findFirst({
      where: {
        OR: [
          { cateringRequestId: orderId },
          { onDemandId: orderId }
        ]
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
          },
        },
        cateringRequest: true,
        onDemand: true,
      },
    });

    if (!dispatch) {
      return NextResponse.json({ error: "Dispatch not found" }, { status: 404 });
    }

    // Determine which type of order it is
    const orderType = dispatch.cateringRequestId ? 'catering' : 'onDemand';
    const order = orderType === 'catering' ? dispatch.cateringRequest : dispatch.onDemand;

    return NextResponse.json({
      id: dispatch.id,
      orderType,
      orderId: orderType === 'catering' ? dispatch.cateringRequestId?.toString() : dispatch.onDemandId?.toString(),
      driverId: dispatch.driverId,
      driver: dispatch.driver ? {
        id: dispatch.driver.id,
        name: dispatch.driver.name,
        email: dispatch.driver.email,
        contactNumber: dispatch.driver.contactNumber,
      } : null,
      order: order ? {
        id: order.id.toString(),
        orderNumber: order.orderNumber,
        pickupDateTime: order.pickupDateTime,
        status: order.status,
      } : null,
      createdAt: dispatch.createdAt,
      updatedAt: dispatch.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching dispatch:", error);
    return NextResponse.json({ error: "Failed to fetch dispatch information" }, { status: 500 });
  }
}