import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DriverInfo = {
  id: string;
  name: string | null;
  email: string | null;
  contact_number: string | null;
};

type AddressInfo = {
  id: bigint;
  street1: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
};

type Order = {
  id: bigint;
  order_number: string;
  date: Date | null;
  status: string | null;  // Changed to allow null
  driver_status: string | null;
  order_total: Prisma.Decimal | null;
  special_notes: string | null;
  address: AddressInfo;
  delivery_address: AddressInfo | null;
  user: { name: string | null; email: string | null };
  created_at: Date;
  order_type: "catering" | "on_demand";
  driver: DriverInfo | null;
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
    // Fetch catering orders
    const cateringOrders = await prisma.catering_request.findMany({
      where: {
        user_id: session.user.id,
      },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        delivery_address: true,
        dispatch: {
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
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Fetch on-demand orders
    const onDemandOrders = await prisma.on_demand.findMany({
      where: {
        user_id: session.user.id,
      },
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        dispatch: {
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
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Fetch delivery addresses for on-demand orders
    const onDemandDeliveryAddresses = await prisma.address.findMany({
      where: {
        id: { in: onDemandOrders.map((d) => d.delivery_address_id).filter((id): id is bigint => id !== null) },
      },
    });

    // Combine and sort orders
    const allOrders: Order[] = [
      ...cateringOrders.map((o): Order => ({
        id: o.id,
        order_number: o.order_number,
        date: o.date,
        status: o.status,
        driver_status: o.driver_status,
        order_total: o.order_total,
        special_notes: o.special_notes,
        address: o.address,
        delivery_address: o.delivery_address,
        user: o.user,
        created_at: o.created_at,
        order_type: "catering",
        driver: o.dispatch[0]?.driver || null,
      })),
      ...onDemandOrders.map((o): Order => {
        const deliveryAddress = onDemandDeliveryAddresses.find(
          (addr) => addr.id === o.delivery_address_id
        );
        return {
          id: o.id,
          order_number: o.order_number,
          date: o.date,
          status: o.status,
          driver_status: o.driver_status,
          order_total: o.order_total,
          special_notes: o.special_notes,
          address: o.address,
          delivery_address: deliveryAddress || null,
          user: o.user,
          created_at: o.created_at,
          order_type: "on_demand",
          driver: o.dispatch[0]?.driver || null,
        };
      }),
    ]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(skip, skip + limit);

    const serializedOrders = allOrders.map((order) => ({
      ...JSON.parse(
        JSON.stringify(order, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
    }));

    return NextResponse.json(serializedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { message: "Error fetching user orders" },
      { status: 500 }
    );
  }
}