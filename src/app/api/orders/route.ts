import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { Prisma, PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();

// Define types for our order objects
type CateringOrder = Prisma.catering_requestGetPayload<{
  include: { user: { select: { name: true; email: true } } };
}>;

type OnDemandOrder = Prisma.on_demandGetPayload<{
  include: { user: { select: { name: true; email: true } } };
}>;

type Order = CateringOrder | OnDemandOrder;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const type = url.searchParams.get("type");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  try {
    let cateringOrders: CateringOrder[] = [];
    let onDemandOrders: OnDemandOrder[] = [];

    if (type === "all" || type === "catering" || !type) {
      cateringOrders = await prisma.catering_request.findMany({
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: { user: { select: { name: true, email: true } } },
      });
    }

    if (type === "all" || type === "on_demand" || !type) {
      onDemandOrders = await prisma.on_demand.findMany({
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: { user: { select: { name: true, email: true } } },
      });
    }

    const allOrders: Order[] = [...cateringOrders, ...onDemandOrders]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);

    const serializedOrders = allOrders.map((order) => ({
      ...JSON.parse(
        JSON.stringify(order, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      ),
      order_type: "brokerage" in order ? "catering" : "on_demand",
    }));

    return NextResponse.json(serializedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 },
    );
  }
}

async function sendOrderEmail(order: any) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  const formatAddress = (address: any) => {
    return `${address.street1}${address.street2 ? ", " + address.street2 : ""}, ${address.city}, ${address.state} ${address.zip}`;
  };

  let body = `
    <h2>New Order Details:</h2>
    <p>Order Type: ${order.order_type}</p>
    <p>Order Number: ${order.order_number}</p>
    <p>Brokerage: ${order.brokerage}</p>
    <p>Date: ${formatDate(new Date(order.date))}</p>
    <p>Pickup Time: ${formatTime(new Date(order.pickup_time))}</p>
    <p>Arrival Time: ${formatTime(new Date(order.arrival_time))}</p>
    <p>Order Total: $${order.order_total}</p>
    <p>Client Attention: ${order.client_attention}</p>
    <p>Pickup Notes: ${order.pickup_notes || "N/A"}</p>
    <p>Special Notes: ${order.special_notes || "N/A"}</p>
    <p>Pickup Address: ${formatAddress(order.address)}</p>
    <p>Drop-off Address: ${formatAddress(order.delivery_address)}</p>
  `;

  if (order.order_type === "catering") {
    body += `
      <p>Headcount: ${order.headcount}</p>
      <p>Need Host: ${order.need_host}</p>
      <p>Hours Needed: ${order.hours_needed || "N/A"}</p>
      <p>Number of Hosts: ${order.number_of_host || "N/A"}</p>
    `;
  } else if (order.order_type === "on_demand") {
    body += `
      <p>Item Delivered: ${order.item_delivered}</p>
      <p>Vehicle Type: ${order.vehicle_type}</p>
      <p>Length: ${order.length}</p>
      <p>Width: ${order.width}</p>
      <p>Height: ${order.height}</p>
      <p>Weight: ${order.weight}</p>
    `;
  }

  const msg = {
    to: "info@ready-set.co", // Replace with the desired recipient email
    from: "emmanuel@alanis.dev", // Replace with your verified sender email
    subject: `New ${order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1)} Order - ${order.order_number}`,
    html: body,
  };

  sgMail.setApiKey(process.env.SEND_API_KEY || "");

  try {
    await sgMail.send(msg);
    console.log("Order notification email sent successfully");
  } catch (error) {
    console.error("Error sending order notification email:", error);
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
      const existingCateringRequest =
        await txPrisma.catering_request.findUnique({
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
      let addressId: string;
      if (address.id) {
        // If an id is provided, update the existing address
        await txPrisma.address.update({
          where: { id: address.id },
          data: {
            street1: address.street1,
            street2: address.street2 || null,
            city: address.city,
            state: address.state,
            zip: address.zip,
            locationNumber: address.locationNumber || null,
            parkingLoading: address.parkingLoading || null,
            isRestaurant: address.isRestaurant || false,
            isShared: address.isShared || false,
            createdBy: session.user.id,
          },
        });
        addressId = address.id;
      } else {
        // If no id is provided, create a new address
        const newAddress = await txPrisma.address.create({
          data: {
            street1: address.street1,
            street2: address.street2 || null,
            city: address.city,
            state: address.state,
            zip: address.zip,
            locationNumber: address.locationNumber || null,
            parkingLoading: address.parkingLoading || null,
            isRestaurant: address.isRestaurant || false,
            isShared: address.isShared || false,
            createdBy: session.user.id,
          },
        });
        addressId = newAddress.id;
      }

      // Handle delivery address creation or update
      let deliveryAddressId: string;
      if (delivery_address.id) {
        // If an id is provided, update the existing address
        await txPrisma.address.update({
          where: { id: delivery_address.id },
          data: {
            street1: delivery_address.street1,
            street2: delivery_address.street2 || null,
            city: delivery_address.city,
            state: delivery_address.state,
            zip: delivery_address.zip,
            locationNumber: delivery_address.locationNumber || null,
            parkingLoading: delivery_address.parkingLoading || null,
            isRestaurant: delivery_address.isRestaurant || false,
            isShared: delivery_address.isShared || false,
            createdBy: session.user.id,
          },
        });
        deliveryAddressId = delivery_address.id;
      } else {
        // If no id is provided, create a new address
        const newDeliveryAddress = await txPrisma.address.create({
          data: {
            street1: delivery_address.street1,
            street2: delivery_address.street2 || null,
            city: delivery_address.city,
            state: delivery_address.state,
            zip: delivery_address.zip,
            locationNumber: delivery_address.locationNumber || null,
            parkingLoading: delivery_address.parkingLoading || null,
            isRestaurant: delivery_address.isRestaurant || false,
            isShared: delivery_address.isShared || false,
            createdBy: session.user.id,
          },
        });
        deliveryAddressId = newDeliveryAddress.id;
      }

      let newOrder;
      if (order_type === "catering") {
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
          include: {
            address: true,
            delivery_address: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
      } else if (order_type === "on_demand") {
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
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            address: true,
            delivery_address: true, // Changed to match schema
          },
        });
      } else {
        throw new Error("Invalid order type");
      }

      // Send email notification
      await sendOrderEmail({ ...newOrder, order_type });

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
