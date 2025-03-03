import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

// Updated type definitions
type CateringOrder = Prisma.catering_requestGetPayload<{
  include: { 
    user: { select: { name: true, email: true } }, 
    address: true, 
    delivery_address: true 
  }
}>;

type OnDemandOrder = Prisma.on_demandGetPayload<{
  include: { 
    user: { select: { name: true, email: true } }, 
    address: true
  }
}>;

type Order = CateringOrder | (OnDemandOrder & { delivery_address: null });

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    // Check authentication
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const type = url.searchParams.get('type');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    let cateringOrders: CateringOrder[] = [];
    let onDemandOrders: OnDemandOrder[] = [];

    if (type === 'all' || type === 'catering' || !type) {
      cateringOrders = await prisma.catering_request.findMany({
        where: { user_id: user.id },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { 
          user: { select: { name: true, email: true } },
          address: true,
          delivery_address: true
        },
      });
    }

    if (type === 'all' || type === 'on_demand' || !type) {
      onDemandOrders = await prisma.on_demand.findMany({
        where: { user_id: user.id },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { 
          user: { select: { name: true, email: true } },
          address: true
        },
      });
    }

    const allOrders: Order[] = [
      ...cateringOrders,
      ...onDemandOrders.map(order => ({ ...order, delivery_address: null }))
    ]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);

    const serializedOrders = allOrders.map(order => ({
      ...JSON.parse(JSON.stringify(order, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
      )),
      order_type: 'brokerage' in order ? 'catering' : 'on_demand',
    }));

    return NextResponse.json(serializedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json({ message: "Error fetching user orders" }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}