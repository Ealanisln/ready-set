// src/app/api/dispatch/[orderId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  
  try {
    // Fetch the dispatch with the specific ID
    const dispatch = await prisma.dispatch.findUnique({
      where: {
        id: BigInt(orderId),  // Assuming 'id' is of type BigInt
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
