import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  
  try {
    // Fetch the dispatch with the specific service_id (orderId)
    const dispatch = await prisma.dispatch.findFirst({
      where: {
        service_id: BigInt(orderId),
        service_type: 'catering', // Assuming this is for a catering request
      },
    });

    if (!dispatch) {
      return NextResponse.json({ error: "Dispatch not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...dispatch,
      id: dispatch.id.toString(),
      service_id: dispatch.service_id.toString(),
    });
  } catch (error) {
    console.error("Error fetching dispatch:", error);
    return NextResponse.json({ error: "Failed to fetch dispatch information" }, { status: 500 });
  }
}