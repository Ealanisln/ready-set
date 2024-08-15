// src/app/api/orders/[order_number]/route.ts
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
    // Check for catering request
    const cateringRequest = await prisma.catering_request.findUnique({
      where: { order_number: order_number },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        delivery_address: true,
      },
    });

    if (cateringRequest) {
      const serializedRequest = JSON.parse(JSON.stringify(cateringRequest, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ));
      return NextResponse.json({ ...serializedRequest, order_type: 'catering' });
    }

    // Check for on-demand order
    const onDemandOrder = await prisma.on_demand.findUnique({
      where: { order_number: order_number },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
      },
    });

    if (onDemandOrder) {
      const serializedOrder = JSON.parse(JSON.stringify(onDemandOrder, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      ));
      return NextResponse.json({ ...serializedOrder, order_type: 'on_demand' });
    }

    // If no order found
    return NextResponse.json({ message: "Order not found" }, { status: 404 });

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ message: "Error fetching order" }, { status: 500 });
  }
}