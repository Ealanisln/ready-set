import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  
  try {
    // Fetch the dispatch with the specific service_id (orderId) and include driver details
    const dispatch = await prisma.dispatch.findFirst({
      where: {
        service_id: BigInt(orderId),
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

    if (!dispatch) {
      return NextResponse.json({ error: "Dispatch not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...dispatch,
      id: dispatch.id.toString(),
      service_id: dispatch.service_id.toString(),
      driver_id: dispatch.driver_id.toString(),
      driver: {
        ...dispatch.driver,
        id: dispatch.driver.id.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching dispatch:", error);
    return NextResponse.json({ error: "Failed to fetch dispatch information" }, { status: 500 });
  }
}