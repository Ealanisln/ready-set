import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function GET(
  req: NextRequest,
  { params }: { params: { order_number: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { order_number } = params;

  try {
    const cateringRequest = await prisma.catering_request.findFirst({
      where: {
        order_number: order_number
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        address: true,
        delivery_address: true
      }
    });

    if (!cateringRequest) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Convert BigInt to string for JSON serialization
    const serializedRequest = JSON.parse(JSON.stringify(cateringRequest, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    return NextResponse.json(serializedRequest);
  } catch (error) {
    console.error("Error fetching catering request:", error);
    return NextResponse.json({ message: "Error fetching catering request" }, { status: 500 });
  }
}