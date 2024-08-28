import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  
  try {
    // Fetch the dispatch with the specific cateringRequestId or on_demandId
    const dispatch = await prisma.dispatch.findFirst({
      where: {
        OR: [
          { cateringRequestId: BigInt(orderId) },
          { on_demandId: BigInt(orderId) }
        ]
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
        cateringRequest: true,
        on_demand: true,
      },
    });

    if (!dispatch) {
      return NextResponse.json({ error: "Dispatch not found" }, { status: 404 });
    }

    // Determine which type of order it is
    const orderType = dispatch.cateringRequestId ? 'catering' : 'onDemand';
    const order = orderType === 'catering' ? dispatch.cateringRequest : dispatch.on_demand;

    return NextResponse.json({
      id: dispatch.id,
      orderType,
      orderId: orderType === 'catering' ? dispatch.cateringRequestId?.toString() : dispatch.on_demandId?.toString(),
      driverId: dispatch.driverId,
      driver: dispatch.driver ? {
        id: dispatch.driver.id,
        name: dispatch.driver.name,
        email: dispatch.driver.email,
        contactNumber: dispatch.driver.contact_number,
      } : null,
      order: order ? {
        id: order.id.toString(),
        orderNumber: order.order_number,
        date: order.date,
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