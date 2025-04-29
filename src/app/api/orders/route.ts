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

export async function POST(request: NextRequest) {
  // Create a Supabase client for server-side authentication
  const supabase = await createClient();

  // Get the user session from Supabase
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    console.log("Received data in API route:", data); // Add detailed logging

    // Destructure fields sent by the frontend
    const {
      order_type,
      brokerage,
      orderNumber, // Changed from order_number
      pickupAddressId, // Changed from address
      deliveryAddressId, // Changed from delivery_address
      pickupDateTime, // Changed from date, pickup_time
      arrivalDateTime, // Changed from arrival_time
      completeDateTime, // Changed from complete_time
      headcount,
      needHost, // Changed from need_host
      hoursNeeded, // Changed from hours_needed
      numberOfHosts, // Changed from number_of_host
      clientAttention, // Changed from client_attention
      pickupNotes, // Changed from pickup_notes
      specialNotes, // Changed from special_notes
      orderTotal, // Changed from order_total
      tip,
      // On-demand specific fields (add if needed)
      // item_delivered,
      // vehicle_type,
      // length,
      // width,
      // height,
      // weight,
      // attachments, // Added attachments
      status, // Added status
      userId // Added userId (though we use the authenticated user.id)
    } = data;

    // --- Improved Validation ---
    const missingFields: string[] = [];
    const requiredFieldsCommon = [
      "order_type", "brokerage", "orderNumber", "pickupAddressId",
      "deliveryAddressId", "pickupDateTime", "arrivalDateTime",
      "clientAttention", "orderTotal", "status", "userId"
    ];

    requiredFieldsCommon.forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missingFields.push(field);
      }
    });

    // Catering specific validation
    if (order_type === 'catering') {
      if (data.headcount === undefined || data.headcount === null || data.headcount === '') {
        missingFields.push("headcount");
      }
      if (data.needHost === CateringNeedHost.YES) {
        if (data.hoursNeeded === undefined || data.hoursNeeded === null || data.hoursNeeded === '') {
          missingFields.push("hoursNeeded");
        }
        if (data.numberOfHosts === undefined || data.numberOfHosts === null || data.numberOfHosts === '') {
          missingFields.push("numberOfHosts");
        }
      }
    }
    // TODO: Add validation for 'on_demand' order_type if needed

    if (missingFields.length > 0) {
      console.error("Validation failed. Missing fields:", missingFields);
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 },
      );
    }
    // --- End Improved Validation ---


    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (txPrisma) => {
      // Check for existing order number within both cateringRequest and onDemand tables
      const existingCateringRequest = await txPrisma.cateringRequest.findUnique({
        where: { orderNumber: orderNumber }, // Use correct field name
      });

      const existingOnDemandRequest = await txPrisma.onDemand.findUnique({
        where: { orderNumber: orderNumber }, // Use correct field name
      });

      if (existingCateringRequest || existingOnDemandRequest) {
        // Use a specific status code for conflict
        return NextResponse.json({ message: "Order number already exists" }, { status: 409 });
      }

      // Use dates directly from the request body
      const parsedPickupDateTime = new Date(pickupDateTime);
      const parsedArrivalDateTime = new Date(arrivalDateTime);
      const parsedCompleteDateTime = completeDateTime ? new Date(completeDateTime) : null;

      // Validate parsed dates
      if (isNaN(parsedPickupDateTime.getTime())) throw new Error("Invalid pickupDateTime format");
      if (isNaN(parsedArrivalDateTime.getTime())) throw new Error("Invalid arrivalDateTime format");
      if (parsedCompleteDateTime && isNaN(parsedCompleteDateTime.getTime())) throw new Error("Invalid completeDateTime format");


      // Parse numbers (ensure they are valid numbers before parsing)
      const parsedOrderTotal = typeof orderTotal === 'number' ? orderTotal : parseFloat(orderTotal);
      if (isNaN(parsedOrderTotal)) {
        throw new Error("Invalid order total format");
      }

      let parsedTip: number | undefined = undefined; // Use undefined instead of null for optional Prisma fields
      if (tip !== null && tip !== undefined && tip !== "") {
        parsedTip = typeof tip === 'number' ? tip : parseFloat(tip);
        if (isNaN(parsedTip)) {
          throw new Error("Invalid tip amount format");
        }
      }

      const parsedHeadcount = typeof headcount === 'number' ? headcount : parseInt(headcount, 10);
      if (order_type === 'catering' && isNaN(parsedHeadcount)) {
         throw new Error("Invalid headcount format");
      }

      let parsedHoursNeeded: number | undefined = undefined;
      if (needHost === CateringNeedHost.YES && hoursNeeded !== null && hoursNeeded !== undefined && hoursNeeded !== "") {
        parsedHoursNeeded = typeof hoursNeeded === 'number' ? hoursNeeded : parseFloat(hoursNeeded);
        if (isNaN(parsedHoursNeeded)) {
          throw new Error("Invalid hoursNeeded format");
        }
      }

      let parsedNumberOfHosts: number | undefined = undefined;
      if (needHost === CateringNeedHost.YES && numberOfHosts !== null && numberOfHosts !== undefined && numberOfHosts !== "") {
        parsedNumberOfHosts = typeof numberOfHosts === 'number' ? numberOfHosts : parseInt(numberOfHosts, 10);
        if (isNaN(parsedNumberOfHosts)) {
           throw new Error("Invalid numberOfHosts format");
        }
      }

      // Check if addresses exist (we only have IDs now)
      const pickupAddr = await txPrisma.address.findUnique({ where: { id: pickupAddressId } });
      if (!pickupAddr) throw new Error(`Pickup address with ID ${pickupAddressId} not found.`);

      const deliveryAddr = await txPrisma.address.findUnique({ where: { id: deliveryAddressId } });
      if (!deliveryAddr) throw new Error(`Delivery address with ID ${deliveryAddressId} not found.`);

      let createdOrder: PrismaOrder;

      // Prepare common data
      const commonOrderData = {
        userId: user.id, // Use authenticated user ID
        pickupAddressId: pickupAddressId,
        deliveryAddressId: deliveryAddressId,
        orderNumber: orderNumber,
        pickupDateTime: parsedPickupDateTime,
        arrivalDateTime: parsedArrivalDateTime,
        completeDateTime: parsedCompleteDateTime,
        clientAttention: clientAttention?.trim(),
        pickupNotes: pickupNotes,
        specialNotes: specialNotes,
        orderTotal: parsedOrderTotal,
        tip: parsedTip,
        status: status as OrderStatus, // Assume status is valid or add validation
      };

      if (order_type === "catering") {
        createdOrder = await txPrisma.cateringRequest.create({
          data: {
            ...commonOrderData,
            brokerage: brokerage,
            headcount: parsedHeadcount,
            needHost: needHost as CateringNeedHost,
            hoursNeeded: parsedHoursNeeded,
            numberOfHosts: parsedNumberOfHosts,
          },
          include: {
            user: { select: { name: true, email: true } },
            pickupAddress: true,
            deliveryAddress: true,
          },
        });
      } else if (order_type === "on_demand") {
        // Prepare on-demand specific data
        const onDemandData = {
          // itemDelivered: item_delivered, // Uncomment and use if needed
          // vehicleType: vehicle_type as VehicleType, // Uncomment and use if needed
          // length: length ? parseFloat(length) : null,
          // width: width ? parseFloat(width) : null,
          // height: height ? parseFloat(height) : null,
          // weight: weight ? parseFloat(weight) : null,
        };

         createdOrder = await txPrisma.onDemand.create({
           data: {
             ...commonOrderData,
             ...onDemandData, // Add specific on-demand fields here
           },
           include: {
             user: { select: { name: true, email: true } },
             pickupAddress: true,
             deliveryAddress: true,
           },
        });

      } else {
        throw new Error(`Unsupported order_type: ${order_type}`);
      }

      // Send email notification
      try {
        // Helper to map PrismaOrder to the expected email sender type
        function mapOrderForEmail(order: PrismaOrder): import("@/utils/emailSender").CateringOrder | import("@/utils/emailSender").OnDemandOrder {
          const isCatering = 'brokerage' in order;
          const base = {
            user: {
              name: order.user?.name ?? null,
              email: order.user?.email ?? null,
            },
            address: order.pickupAddress,
            delivery_address: order.deliveryAddress,
            order_number: order.orderNumber,
            brokerage: isCatering ? order.brokerage : undefined,
            date: order.pickupDateTime ?? null,
            pickup_time: order.pickupDateTime ?? null,
            arrival_time: order.arrivalDateTime ?? null,
            complete_time: order.completeDateTime ?? null,
            order_total:
              typeof order.orderTotal === "object" && order.orderTotal !== null && "toNumber" in order.orderTotal
                ? order.orderTotal.toNumber()
                : order.orderTotal,
            client_attention: order.clientAttention ?? null,
            pickup_notes: order.pickupNotes ?? null,
            special_notes: order.specialNotes ?? null,
            status: order.status ?? null,
            driver_status: undefined, // Add if you have this field
          };
          if (isCatering) {
            return {
              ...base,
              order_type: "catering",
              headcount: order.headcount?.toString() ?? null,
              need_host: order.needHost?.toString() ?? null,
              hours_needed: order.hoursNeeded?.toString() ?? null,
              number_of_host: order.numberOfHosts?.toString() ?? null,
            };
          } else {
            return {
              ...base,
              order_type: "on_demand",
              item_delivered: (order as any).itemDelivered ?? null,
              vehicle_type: (order as any).vehicleType ?? null,
              length: (order as any).length ?? null,
              width: (order as any).width ?? null,
              height: (order as any).height ?? null,
              weight: (order as any).weight ?? null,
            };
          }
        }
        await sendOrderEmail(mapOrderForEmail(createdOrder));
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Email failure is logged but does not prevent order creation
      }

      return createdOrder;
    }); // End transaction

    // Serialize the result before sending (handle BigInt, etc.)
    const serializedResult = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      );

    return NextResponse.json(serializedResult, { status: 201 }); // Return 201 Created status
  } catch (error) {
    console.error("Error creating order:", error);
    // Provide more specific error messages based on error type
    if (error instanceof Error) {
       // Handle specific Prisma errors or other known errors if necessary
       if (error.message.includes("already exists")) {
         return NextResponse.json({ message: error.message }, { status: 409 }); // Conflict
       }
       if (error.message.includes("not found")) {
         return NextResponse.json({ message: error.message }, { status: 404 }); // Not Found
       }
       if (error.message.includes("Invalid") || error.message.includes("Missing")) {
         return NextResponse.json({ message: error.message }, { status: 400 }); // Bad Request for validation errors caught in transaction
       }
       return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unexpected error occurred while creating the order." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}