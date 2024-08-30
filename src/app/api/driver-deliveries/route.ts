import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CateringDelivery = Prisma.catering_requestGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    address: true;
    delivery_address: true;
  };
}>;

type OnDemandDelivery = Prisma.on_demandGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    address: true;
  };
}>;

type Delivery = (CateringDelivery | OnDemandDelivery) & {
  delivery_type: "catering" | "on_demand";
  delivery_address: {
    street1?: string | null;
    street2?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null;
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  try {
    // Fetch dispatches for the current driver
    const driverDispatches = await prisma.dispatch.findMany({
      where: {
        driverId: session.user.id,
      },
      select: {
        cateringRequestId: true,
        on_demandId: true,
      },
    });

    // Separate catering and on-demand IDs
    const cateringIds = driverDispatches
      .filter((d) => d.cateringRequestId !== null)
      .map((d) => d.cateringRequestId!);
    const onDemandIds = driverDispatches
      .filter((d) => d.on_demandId !== null)
      .map((d) => d.on_demandId!);

    // Fetch catering deliveries
    const cateringDeliveries = await prisma.catering_request.findMany({
      where: {
        id: { in: cateringIds },
      },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        delivery_address: true,
      },
    });

    // Fetch on-demand deliveries
    const onDemandDeliveries = await prisma.on_demand.findMany({
      where: {
        id: { in: onDemandIds },
      },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
      },
    });

    // Fetch delivery addresses for on-demand deliveries
    const onDemandDeliveryAddresses = await prisma.address.findMany({
      where: {
        id: { in: onDemandDeliveries.map((d) => d.delivery_address_id) },
      },
    });

    // Combine and sort deliveries
    const allDeliveries: Delivery[] = [
      ...cateringDeliveries.map((d) => ({
        ...d,
        delivery_type: "catering" as const,
      })),
      ...onDemandDeliveries.map((d) => {
        const deliveryAddress = onDemandDeliveryAddresses.find(
          (addr) => addr.id === d.delivery_address_id,
        );
        return {
          ...d,
          delivery_type: "on_demand" as const,
          delivery_address: deliveryAddress
            ? {
                street1: deliveryAddress.street1,
                street2: deliveryAddress.street2,
                city: deliveryAddress.city,
                state: deliveryAddress.state,
                zip: deliveryAddress.zip,
              }
            : null,
        };
      }),
    ]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + limit);

    const serializedDeliveries = allDeliveries.map((delivery) => ({
      ...JSON.parse(
        JSON.stringify(delivery, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      ),
    }));

    return NextResponse.json(serializedDeliveries, { status: 200 });
  } catch (error) {
    console.error("Error fetching driver deliveries:", error);
    return NextResponse.json(
      { message: "Error fetching driver deliveries" },
      { status: 500 },
    );
  }
}
