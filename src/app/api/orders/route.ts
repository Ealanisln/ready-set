import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { sendOrderEmail } from "@/utils/emailSender";
import { createClient } from "@/utils/supabase/server";
import { CateringNeedHost, OrderStatus, VehicleType } from "@/types/order";

const prisma = new PrismaClient();

// Define types for our order objects
type PrismaCateringOrder = Prisma.CateringRequestGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    pickupAddress: true;
    deliveryAddress: true;
  };
}>;

type PrismaOnDemandOrder = Prisma.OnDemandGetPayload<{
  include: {
    user: { select: { name: true; email: true } };
    pickupAddress: true;
    deliveryAddress: true;
  };
}>;

type EmailBaseOrder = {
  order_type: string;
  address: any;
  delivery_address: any;
  order_number: string;
  date: Date | null;
  pickup_time: Date | null;
  arrival_time: Date | null;
  order_total: string;
  client_attention: string | null;
};

type EmailCateringOrder = EmailBaseOrder & {
  headcount: string | null;
  hours_needed: string | null;
  number_of_host: string | null;
};

type EmailOnDemandOrder = EmailBaseOrder & {
  item_delivered: string | null;
  vehicle_type: string | null;
};

type PrismaOrder = PrismaCateringOrder | PrismaOnDemandOrder;
type EmailOrder = EmailCateringOrder | EmailOnDemandOrder;

export async function GET(req: NextRequest) {
  // Create a Supabase client for server-side authentication
  const supabase = await createClient();

  // Get the user session from Supabase
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const type = url.searchParams.get("type");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  try {
    let cateringOrders: PrismaCateringOrder[] = [];
    let onDemandOrders: PrismaOnDemandOrder[] = [];

    if (type === "all" || type === "catering" || !type) {
      cateringOrders = await prisma.cateringRequest.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          pickupAddress: true,
          deliveryAddress: true,
        },
      });
    }

    if (type === "all" || type === "on_demand" || !type) {
      onDemandOrders = await prisma.onDemand.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          pickupAddress: true,
          deliveryAddress: true,
        },
      });
    }

    const allOrders = [...cateringOrders, ...onDemandOrders]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  // Create a Supabase client for server-side authentication
  const supabase = await createClient();

  // Get the user session from Supabase
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
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
      // Check for existing order number within both cateringRequest and onDemand tables
      const existingCateringRequest = await txPrisma.cateringRequest.findUnique({
        where: { orderNumber: order_number },
      });

      const existingOnDemandRequest = await txPrisma.onDemand.findUnique({
        where: { orderNumber: order_number },
      });

      if (existingCateringRequest || existingOnDemandRequest) {
        throw new Error("Order number already exists");
      }

      // Parse dates
      let parsedDate = new Date(date);
      let parsedPickupDateTime = new Date(parsedDate.setHours(
        new Date(`1970-01-01T${pickup_time}`).getHours(),
        new Date(`1970-01-01T${pickup_time}`).getMinutes()
      ));
      let parsedArrivalDateTime = new Date(parsedDate.setHours(
        new Date(`1970-01-01T${arrival_time}`).getHours(),
        new Date(`1970-01-01T${arrival_time}`).getMinutes()
      ));
      let parsedCompleteDateTime = complete_time ? new Date(parsedDate.setHours(
        new Date(`1970-01-01T${complete_time}`).getHours(),
        new Date(`1970-01-01T${complete_time}`).getMinutes()
      )) : null;

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
            createdBy: user.id,
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
            createdBy: user.id,
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
            createdBy: user.id,
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
            createdBy: user.id,
          },
        });
        deliveryAddressId = newDeliveryAddress.id;
      }

      let newOrder: PrismaOrder;
      if (order_type === "catering") {
        const cateringData = {
          userId: user.id,
          pickupAddressId: addressId,
          deliveryAddressId: deliveryAddressId,
          brokerage,
          orderNumber: order_number,
          pickupDateTime: parsedPickupDateTime,
          arrivalDateTime: parsedArrivalDateTime,
          completeDateTime: parsedCompleteDateTime,
          headcount: headcount ? parseInt(headcount) : null,
          needHost: need_host === "yes" ? CateringNeedHost.YES : CateringNeedHost.NO,
          hoursNeeded: hours_needed ? parseFloat(hours_needed) : null,
          numberOfHosts: number_of_host ? parseInt(number_of_host) : null,
          clientAttention: client_attention,
          pickupNotes: pickup_notes,
          specialNotes: special_notes,
          orderTotal: parsedOrderTotal,
          tip: parsedTip,
          status: OrderStatus.ACTIVE,
        };
        
        newOrder = await txPrisma.cateringRequest.create({
          data: cateringData,
          include: {
            user: { select: { name: true, email: true } },
            pickupAddress: true,
            deliveryAddress: true,
          },
        });
      } else {
        const onDemandData = {
          userId: user.id,
          pickupAddressId: addressId,
          deliveryAddressId: deliveryAddressId,
          orderNumber: order_number,
          pickupDateTime: parsedPickupDateTime,
          arrivalDateTime: parsedArrivalDateTime,
          completeDateTime: parsedCompleteDateTime,
          hoursNeeded: hours_needed ? parseFloat(hours_needed) : null,
          itemDelivered: item_delivered,
          vehicleType: vehicle_type as VehicleType,
          clientAttention: client_attention,
          pickupNotes: pickup_notes,
          specialNotes: special_notes,
          orderTotal: parsedOrderTotal,
          tip: parsedTip,
          length: length ? parseFloat(length) : null,
          width: width ? parseFloat(width) : null,
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          status: OrderStatus.ACTIVE,
        };

        newOrder = await txPrisma.onDemand.create({
          data: onDemandData,
          include: {
            user: { select: { name: true, email: true } },
            pickupAddress: true,
            deliveryAddress: true,
          },
        });
      }

      // Send email notification with type information
      const emailData = {
        ...newOrder,
        order_type,
        address: newOrder.pickupAddress,
        delivery_address: newOrder.deliveryAddress,
        order_number: newOrder.orderNumber,
        date: newOrder.pickupDateTime,
        pickup_time: newOrder.pickupDateTime,
        arrival_time: newOrder.arrivalDateTime,
        order_total: String(newOrder.orderTotal),
        client_attention: newOrder.clientAttention,
        // Convert numeric fields to strings for email
        headcount: 'headcount' in newOrder ? String(newOrder.headcount) : undefined,
        hours_needed: newOrder.hoursNeeded ? String(newOrder.hoursNeeded) : undefined,
        number_of_host: 'numberOfHosts' in newOrder ? String(newOrder.numberOfHosts) : undefined,
        item_delivered: 'itemDelivered' in newOrder ? newOrder.itemDelivered : undefined,
        vehicle_type: 'vehicleType' in newOrder ? newOrder.vehicleType : undefined
      };

      await sendOrderEmail(emailData);
      
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
  } finally {
    await prisma.$disconnect();
  }
}