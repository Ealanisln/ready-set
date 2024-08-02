import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

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

    // Handle BigInt conversion
    const addressId = BigInt(address_id);
    if (isNaN(Number(address_id))) {
      return NextResponse.json(
        { message: "Invalid address_id" },
        { status: 400 },
      );
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
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 },
      );
    }

    // Parse numbers
    const parsedOrderTotal = parseFloat(order_total);
    let parsedTip: number | null = null;

    if (isNaN(parsedOrderTotal)) {
      return NextResponse.json({ message: 'Invalid order total' }, { status: 400 });
    }

    if (tip !== null && tip !== undefined) {
      parsedTip = parseFloat(tip);
      if (isNaN(parsedTip)) {
        return NextResponse.json({ message: 'Invalid tip amount' }, { status: 400 });
      }
    }

    // Create or update delivery address
    let deliveryAddressId;
    if (delivery_address.id) {
      // If an id is provided, update the existing address
      await prisma.address.update({
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
      const newAddress = await prisma.address.create({
        data: {
          street1: delivery_address.street1,
          street2: delivery_address.street2,
          city: delivery_address.city,
          state: delivery_address.state,
          zip: delivery_address.zip,
          user_id: session.user.id,
          status: 'active',
        },
      });
      deliveryAddressId = newAddress.id;
    }

    // Create catering request
    let newCateringRequest;
    try {
      newCateringRequest = await prisma.catering_request.create({
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
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      return NextResponse.json({ message: "Database error" }, { status: 500 });
    }

    // Convert BigInt to string for JSON serialization
    const serializedCateringRequest = JSON.parse(
      JSON.stringify(newCateringRequest, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(serializedCateringRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating catering request:", error);
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