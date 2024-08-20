import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CateringDelivery = Prisma.catering_requestGetPayload<{
  include: { 
    user: { select: { name: true, email: true } },
    address: true,
    delivery_address: true
  }
}>;

type OnDemandDelivery = Prisma.on_demandGetPayload<{
  include: { 
    user: { select: { name: true, email: true } },
    address: true
  }
}>;

type Delivery = (CateringDelivery | OnDemandDelivery) & { delivery_type: 'catering' | 'on_demand' };

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const skip = (page - 1) * limit;

  try {
    // Fetch dispatches for the current driver
    const driverDispatches = await prisma.dispatch.findMany({
      where: {
        driver_id: session.user.id
      },
      select: {
        service_id: true,
        service_type: true
      }
    });

    // Separate catering and on-demand service IDs
    const cateringIds = driverDispatches
      .filter(d => d.service_type === 'catering')
      .map(d => d.service_id);
    const onDemandIds = driverDispatches
      .filter(d => d.service_type === 'ondemand')
      .map(d => d.service_id);

    // Fetch catering deliveries
    const cateringDeliveries = await prisma.catering_request.findMany({
      where: {
        id: { in: cateringIds.map(id => BigInt(id.toString())) }
      },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        delivery_address: true
      }
    });

    // Fetch on-demand deliveries
    const onDemandDeliveries = await prisma.on_demand.findMany({
      where: {
        id: { in: onDemandIds.map(id => BigInt(id.toString())) }
      },
      include: {
        user: { select: { name: true, email: true } },
        address: true
      }
    });

    // Combine and sort deliveries
    const allDeliveries: Delivery[] = [
      ...cateringDeliveries.map(d => ({ ...d, delivery_type: 'catering' as const })),
      ...onDemandDeliveries.map(d => ({ ...d, delivery_type: 'on_demand' as const }))
    ].sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
     .slice(skip, skip + limit);

    const serializedDeliveries = allDeliveries.map(delivery => ({
      ...JSON.parse(JSON.stringify(delivery, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
      )),
    }));

    return NextResponse.json(serializedDeliveries, { status: 200 });
  } catch (error) {
    console.error("Error fetching driver deliveries:", error);
    return NextResponse.json({ message: "Error fetching driver deliveries" }, { status: 500 });
  }
}