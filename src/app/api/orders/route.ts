import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    const orders = await prisma.$transaction([
      prisma.catering_request.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.on_demand.findMany({
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      })
    ]);

    const allOrders = [...orders[0], ...orders[1]]
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
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const {
      order_type,
      brokerage,
      order_number,
      address,
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
      item_delivered,
      vehicle_type,
      length,
      width,
      height,
      weight,
    } = data;

    // Validate required fields
    if (
      !order_type ||
      !brokerage ||
      !order_number ||
      !address ||
      !delivery_address ||
      !date ||
      !pickup_time ||
      !arrival_time ||
      !client_attention ||
      !order_total
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (txPrisma) => {
      // Check for existing order number within both catering_request and on_demand tables
      const existingCateringRequest = await txPrisma.catering_request.findUnique({
        where: { order_number: order_number },
      });

      const existingOnDemandRequest = await txPrisma.on_demand.findUnique({
        where: { order_number: order_number },
      });

      if (existingCateringRequest || existingOnDemandRequest) {
        throw new Error("Order number already exists");
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

      if (tip !== null && tip !== undefined && tip !== "") {
        parsedTip = parseFloat(tip);
        if (isNaN(parsedTip)) {
          throw new Error("Invalid tip amount");
        }
      }

      // Handle address creation or update
      let addressId: bigint;
      if (address.id) {
        // If an id is provided, update the existing address
        await txPrisma.address.update({
          where: { id: BigInt(address.id) },
          data: {
            street1: address.street1,
            street2: address.street2 || null,
            city: address.city,
            state: address.state,
            zip: address.zip,
            user_id: session.user.id,
          },
        });
        addressId = BigInt(address.id);
      } else {
        // If no id is provided, create a new address
        const newAddress = await txPrisma.address.create({
          data: {
            street1: address.street1,
            street2: address.street2 || null,
            city: address.city,
            state: address.state,
            zip: address.zip,
            user_id: session.user.id,
            status: "active",
          },
        });
        addressId = newAddress.id;
      }

      // Handle delivery address creation or update
      let deliveryAddressId: bigint;
      if (delivery_address.id) {
        // If an id is provided, update the existing address
        await txPrisma.address.update({
          where: { id: BigInt(delivery_address.id) },
          data: {
            street1: delivery_address.street1,
            street2: delivery_address.street2 || null,
            city: delivery_address.city,
            state: delivery_address.state,
            zip: delivery_address.zip,
            user_id: session.user.id,
          },
        });
        deliveryAddressId = BigInt(delivery_address.id);
      } else {
        // If no id is provided, create a new address
        const newDeliveryAddress = await txPrisma.address.create({
          data: {
            street1: delivery_address.street1,
            street2: delivery_address.street2 || null,
            city: delivery_address.city,
            state: delivery_address.state,
            zip: delivery_address.zip,
            user_id: session.user.id,
            status: "active",
          },
        });
        deliveryAddressId = newDeliveryAddress.id;
      }

      let newOrder;
      if (order_type === "catering") {
        // Create catering request
        newOrder = await txPrisma.catering_request.create({
          data: {
            user_id: session.user.id,
            address_id: addressId,
            delivery_address_id: deliveryAddressId,
            brokerage,
            order_number,
            date: parsedDate,
            pickup_time: parsedPickupTime,
            arrival_time: parsedArrivalTime,
            complete_time: parsedCompleteTime,
            headcount: headcount ? String(headcount) : null,
            need_host: need_host === "yes" ? "yes" : "no",
            hours_needed: hours_needed ? String(hours_needed) : null,
            number_of_host: number_of_host ? String(number_of_host) : null,
            client_attention,
            pickup_notes,
            special_notes,
            order_total: parsedOrderTotal,
            tip: parsedTip,
            status: "active",
          },
        });
      } else if (order_type === "on_demand") {
        // Create on-demand request
        newOrder = await txPrisma.on_demand.create({
          data: {
            user_id: session.user.id,
            address_id: addressId,
            delivery_address_id: deliveryAddressId,
            order_number,
            date: parsedDate,
            pickup_time: parsedPickupTime,
            arrival_time: parsedArrivalTime,
            complete_time: parsedCompleteTime,
            hours_needed: hours_needed ? String(hours_needed) : null,
            item_delivered,
            vehicle_type,
            client_attention,
            pickup_notes,
            special_notes,
            order_total: parsedOrderTotal,
            tip: parsedTip,
            length,
            width,
            height,
            weight,
            status: "active",
          },
        });
      } else {
        throw new Error("Invalid order type");
      }

      return newOrder;
    });

    // Convert BigInt to string for JSON serialization
    const serializedOrder = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    return NextResponse.json(serializedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof Error) {
      if (error.message === "Order number already exists") {
        return NextResponse.json(
          { message: "Order number already exists" },
          { status: 400 },
        );
      } else if (
        error.message === "Invalid date format" ||
        error.message === "Invalid order total" ||
        error.message === "Invalid tip amount" ||
        error.message === "Invalid order type"
      ) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }
    return NextResponse.json(
      { message: "Error creating order" },
      { status: 500 },
    );
  }
}