import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

type CateringRequest = Prisma.CateringRequestGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    pickupAddress: true;
    deliveryAddress: true;
    dispatches: {
      include: {
        driver: {
          select: {
            id: true;
            name: true;
            email: true;
            contactNumber: true;
          };
        };
      };
    };
  };
}>;

type OnDemandOrder = Prisma.OnDemandGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    pickupAddress: true;
    deliveryAddress: true;
    dispatches: {
      include: {
        driver: {
          select: {
            id: true;
            name: true;
            email: true;
            contactNumber: true;
          };
        };
      };
    };
  };
}>;

type Order =
  | (CateringRequest & { order_type: "catering" })
  | (OnDemandOrder & { order_type: "on_demand" });

function serializeBigInt(data: any): any {
  return JSON.parse(JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? value.toString() : 
    value === null ? null : value
  ));
}

export async function GET(req: NextRequest, props: { params: Promise<{ order_number: string }> }) {
  const params = await props.params;
  try {
    // Create Supabase client
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    // Check authentication
    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { order_number } = params;

    let order: Order | null = null;

    // Try to find catering request
    const cateringRequest = await prisma.cateringRequest.findUnique({
      where: { orderNumber: order_number },
      include: {
        user: { select: { name: true, email: true } },
        pickupAddress: true,
        deliveryAddress: true,
        dispatches: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
              },
            },
          },
        },
      },
    });

    if (cateringRequest) {
      order = {
        ...cateringRequest,
        order_type: "catering",
      };
    } else {
      // If not found, try to find on-demand order
      const onDemandOrder = await prisma.onDemand.findUnique({
        where: { orderNumber: order_number },
        include: {
          user: { select: { name: true, email: true } },
          pickupAddress: true,
          deliveryAddress: true,
          dispatches: {
            include: {
              driver: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contactNumber: true,
                },
              },
            },
          },
        },
      });

      if (onDemandOrder) {
        order = { ...onDemandOrder, order_type: "on_demand" };
      }
    }

    if (order) {
      const serializedOrder = serializeBigInt(order);
      return NextResponse.json(serializedOrder);
    }

    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Error fetching order", error: (error as Error).message },
      { status: 500 },
    );
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}