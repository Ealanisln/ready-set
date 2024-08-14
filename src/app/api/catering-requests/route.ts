import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      brokerage,
      order_number,
      address_id,
      delivery_address,
      date,
      pickup_time,
      arrival_time,
      complete_time,
      headcount,
      need_host,
      hours_needed,
      number_of_host,
      client_attention,
      pickup_notes,
      special_notes,
      order_total,
      tip,
    } = await req.json();

    // Validate required fields
    if (
      !brokerage ||
      !order_number ||
      !address_id ||
      !delivery_address ||
      !date ||
      !pickup_time ||
      !arrival_time ||
      !headcount
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (txPrisma) => {
      // Check for existing order number within the transaction
      const existingRequest = await txPrisma.catering_request.findUnique({
        where: { order_number: order_number },
      });

      if (existingRequest) {
        throw new Error("Order number already exists");
      }

      // Handle BigInt conversion
      const addressId = BigInt(address_id);
      if (isNaN(Number(address_id))) {
        throw new Error("Invalid address_id");
      }

      // Parse dates
      let parsedDate, parsedPickupTime, parsedArrivalTime, parsedCompleteTime;
      try {
        parsedDate = new Date(date);
        parsedPickupTime = new Date(`1970-01-01T${pickup_time}`);
        parsedArrivalTime = new Date(`1970-01-01T${arrival_time}`);
        parsedCompleteTime = complete_time
          ? new Date(`1970-01-01T${complete_time}`)
          : null;
      } catch (error) {
        throw new Error("Invalid date format");
      }

      // Parse numbers
      const parsedOrderTotal = parseFloat(order_total);
      let parsedTip: number | null = null;

      if (isNaN(parsedOrderTotal)) {
        throw new Error("Invalid order total");
      }

      if (tip !== null && tip !== undefined) {
        parsedTip = parseFloat(tip);
        if (isNaN(parsedTip)) {
          throw new Error("Invalid tip amount");
        }
      }

      // Create or update delivery address
      let deliveryAddressId;
      if (delivery_address.id) {
        // If an id is provided, update the existing address
        await txPrisma.address.update({
          where: { id: BigInt(delivery_address.id) },
          data: {
            street1: delivery_address.street1,
            street2: delivery_address.street2,
            city: delivery_address.city,
            state: delivery_address.state,
            zip: delivery_address.zip,
            user_id: session.user.id,
          },
        });
        deliveryAddressId = BigInt(delivery_address.id);
      } else {
        // If no id is provided, create a new address
        const newAddress = await txPrisma.address.create({
          data: {
            street1: delivery_address.street1,
            street2: delivery_address.street2,
            city: delivery_address.city,
            state: delivery_address.state,
            zip: delivery_address.zip,
            user_id: session.user.id,
            status: "active",
          },
        });
        deliveryAddressId = newAddress.id;
      }

      // Create catering request
      const newCateringRequest = await txPrisma.catering_request.create({
        data: {
          user_id: session.user.id,
          address_id: addressId, // Pickup address
          delivery_address_id: deliveryAddressId, // Delivery address
          brokerage,
          order_number,
          date: parsedDate,
          pickup_time: parsedPickupTime,
          arrival_time: parsedArrivalTime,
          complete_time: parsedCompleteTime,
          headcount,
          need_host: need_host === "yes" ? "yes" : "no",
          hours_needed,
          number_of_host,
          client_attention,
          pickup_notes,
          special_notes,
          order_total: parsedOrderTotal,
          tip: parsedTip,
          status: "active",
        },
      });

      return newCateringRequest;
    });

    // Convert BigInt to string for JSON serialization
    const serializedCateringRequest = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(serializedCateringRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating catering request:", error);
    if (error instanceof Error) {
      if (error.message === "Order number already exists") {
        return NextResponse.json(
          { message: "Order number already exists" },
          { status: 400 },
        );
      } else if (
        error.message === "Invalid address_id" ||
        error.message === "Invalid date format" ||
        error.message === "Invalid order total" ||
        error.message === "Invalid tip amount"
      ) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }
    return NextResponse.json(
      { message: "Error creating catering request" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.type !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit');
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;

    const cateringRequests = await prisma.catering_request.findMany({
      take: parsedLimit,
      orderBy: {
        date: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        delivery_address: true
      }
    });

    // Convert BigInt to string for JSON serialization
    const serializedRequests = JSON.parse(JSON.stringify(cateringRequests, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    ));

    return NextResponse.json(serializedRequests);
  } catch (error) {
    console.error("Error fetching catering requests:", error);
    return NextResponse.json({ message: "Error fetching catering requests" }, { status: 500 });
  }
}