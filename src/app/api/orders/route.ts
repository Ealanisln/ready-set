import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient, CateringStatus, OnDemandStatus } from "@prisma/client";
import { sendOrderEmail, CateringOrder as EmailSenderCateringOrder, OnDemandOrder as EmailSenderOnDemandOrder } from "@/utils/emailSender";
import { createClient } from "@/utils/supabase/server";
import { CateringNeedHost } from "@/types/order";
import { updateCaterValleyOrderStatus } from '@/services/caterValleyService';

const prisma = new PrismaClient();

// Types use PascalCase payload getter and relations matching schema include
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
  order_total: string; // Or number/Decimal
  client_attention: string | null;
  // Add other fields expected by email template
  pickup_notes?: string | null;
  special_notes?: string | null;
  status?: string | null;
  user?: { name: string | null; email: string | null; };
  brokerage?: string | null;
  complete_time?: Date | null;
};

type EmailCateringOrder = EmailBaseOrder & {
  headcount: string | null;
  hours_needed: string | null;
  number_of_host: string | null;
  need_host?: string | null;
};

type EmailOnDemandOrder = EmailBaseOrder & {
  item_delivered: string | null;
  vehicle_type: string | null;
  // Add other on_demand fields if needed for email
  length?: string | null;
  width?: string | null;
  height?: string | null;
  weight?: string | null;
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

    // Combine, sort using PascalCase field name
    const allOrders = [...cateringOrders, ...onDemandOrders]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    // Serialization
    const serializedOrders = allOrders.map((order) => ({
      ...JSON.parse(
        JSON.stringify(order, (key, value) => {
          if ((key === 'order_total' || key === 'tip') && value instanceof Prisma.Decimal) {
            return value.toString();
          }
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        }),
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestData = await request.json();
    console.log("Received data in API route:", requestData);

    // Destructure using camelCase from request body but will map to PascalCase for DB
    const {
      order_type,
      brokerage,
      orderNumber, 
      pickupAddressId, // Expecting camelCase ID from request
      deliveryAddressId, // Expecting camelCase ID from request
      pickupDateTime,
      arrivalDateTime,
      completeDateTime,
      headcount,
      needHost,
      hoursNeeded,
      numberOfHosts, // Expecting camelCase from request
      clientAttention,
      pickupNotes,
      specialNotes,
      orderTotal,
      tip,
      status // Expecting status string like 'PENDING'
    } = requestData;

    // --- Validation on requestData ---
     const missingFields: string[] = [];
     // Add all required fields expected from requestData
     const requiredFields = [
        'order_type', 'orderNumber', 'pickupAddressId', 'deliveryAddressId',
        'pickupDateTime', 'arrivalDateTime', 'clientAttention', 'orderTotal', 'status'
     ];
     if (order_type === 'catering') {
        requiredFields.push('brokerage', 'headcount', 'needHost');
        if (needHost === CateringNeedHost.YES) {
            requiredFields.push('hoursNeeded', 'numberOfHosts');
        }
     } // Add checks for on_demand type if needed
 
     requiredFields.forEach(field => {
       // Check for undefined, null, or empty string
       if (requestData[field] === undefined || requestData[field] === null || requestData[field] === '') {
         missingFields.push(field);
       }
     });
 
     if (missingFields.length > 0) {
       throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
     }
    // Add more specific validation (date formats, number ranges, etc.)

    const result = await prisma.$transaction(async (txPrisma) => {
      // Check for existing order number (uses unique constraint on PascalCase orderNumber field)
      const existingCateringRequest = await txPrisma.cateringRequest.findUnique({
        where: { orderNumber: orderNumber },
      });
      const existingOnDemandRequest = await txPrisma.onDemand.findUnique({
        where: { orderNumber: orderNumber },
      });
      if (existingCateringRequest || existingOnDemandRequest) {
        return NextResponse.json({ message: "Order number already exists" }, { status: 409 });
      }

      // Validate Address IDs exist
      const pickupAddr = await txPrisma.address.findUnique({ where: { id: pickupAddressId } });
      if (!pickupAddr) throw new Error(`Pickup address with ID ${pickupAddressId} not found.`);
      const deliveryAddr = await txPrisma.address.findUnique({ where: { id: deliveryAddressId } });
      if (!deliveryAddr) throw new Error(`Delivery address with ID ${deliveryAddressId} not found.`);

      // Parse dates and numbers
      const parsedPickupDateTime = new Date(pickupDateTime);
      const parsedArrivalDateTime = new Date(arrivalDateTime);
      const parsedCompleteDateTime = completeDateTime ? new Date(completeDateTime) : null;
      // Use Prisma.Decimal for currency fields
      const parsedOrderTotal = new Prisma.Decimal(orderTotal);
      let parsedTip: Prisma.Decimal | undefined = tip ? new Prisma.Decimal(tip) : undefined;

      if (isNaN(parsedPickupDateTime.getTime())) throw new Error("Invalid pickupDateTime format");
      if (isNaN(parsedArrivalDateTime.getTime())) throw new Error("Invalid arrivalDateTime format");
      if (parsedCompleteDateTime && isNaN(parsedCompleteDateTime.getTime())) throw new Error("Invalid completeDateTime format");
      // Add validation for parsed decimals if needed

      if (order_type === "catering") {
        const parsedHeadcount = parseInt(headcount, 10);
        if (isNaN(parsedHeadcount)) throw new Error("Invalid headcount format");
        let parsedHoursNeeded: number | undefined = undefined;
        let parsedNumberOfHosts: number | undefined = undefined;
        if (needHost === CateringNeedHost.YES) {
          if (!hoursNeeded || !numberOfHosts) throw new Error("Host details required");
          parsedHoursNeeded = parseFloat(hoursNeeded);
          parsedNumberOfHosts = parseInt(numberOfHosts, 10);
          if (isNaN(parsedHoursNeeded) || isNaN(parsedNumberOfHosts)) throw new Error("Invalid host details format");
        }

        // Map status string to Prisma enum type
        const prismaStatus = status.toUpperCase() as CateringStatus;
        if (!Object.values(CateringStatus).includes(prismaStatus)) {
           throw new Error(`Invalid catering status provided: ${status}`);
        }

        // Create Catering Request using PascalCase field names matching the schema
        const newCateringOrder = await txPrisma.cateringRequest.create({
          data: {
            brokerage,
            orderNumber: orderNumber,
            pickupAddressId: pickupAddressId,
            deliveryAddressId: deliveryAddressId,
            pickupDateTime: parsedPickupDateTime,
            arrivalDateTime: parsedArrivalDateTime,
            completeDateTime: parsedCompleteDateTime,
            headcount: parsedHeadcount, // Use number type to match schema
            needHost: needHost,
            hoursNeeded: parsedHoursNeeded, // Use number type
            numberOfHosts: parsedNumberOfHosts, // Use number type
            clientAttention: clientAttention,
            pickupNotes: pickupNotes,
            specialNotes: specialNotes,
            orderTotal: parsedOrderTotal, // Use Decimal type
            tip: parsedTip, // Use Decimal type
            status: prismaStatus, // Use validated Prisma enum
            userId: user.id, // Use PascalCase user_id
          },
          include: {
              user: { select: { name: true, email: true } },
              pickupAddress: true, // Use PascalCase relation name
              deliveryAddress: true, // Use PascalCase relation name
          }
        });
        console.log(`Catering request ${newCateringOrder.id} created successfully.`);

        // --- CaterValley Integration --- 
        if (brokerage === 'Cater Valley') {
           console.log(`Catering request ${newCateringOrder.id} is from Cater Valley. Attempting status update...`);
          try {
            // Use the orderNumber for the API call
            const cvResponse = await updateCaterValleyOrderStatus(orderNumber, 'CONFIRM');
            if (!cvResponse.result) {
              console.warn(`CaterValley status update for order ${orderNumber} failed logically: ${cvResponse.message}`);
            } else {
              console.log(`CaterValley status successfully updated to CONFIRM for order ${orderNumber}.`);
            }
          } catch (cvError) {
            console.error(`Error updating CaterValley status for order ${orderNumber} (continuing transaction):`, cvError);
          }
        }
        // --- End CaterValley Integration ---

        const emailOrder = mapOrderForEmail(newCateringOrder as PrismaCateringOrder);
        await sendOrderEmail(emailOrder as unknown as EmailSenderCateringOrder | EmailSenderOnDemandOrder);
        console.log(`Email sent for catering order ${newCateringOrder.id}`);

        // Return the created order (Prisma returns PascalCase fields)
        // Serialize BigInts and Decimals before returning JSON
        const serializedOrder = JSON.parse(
           JSON.stringify(newCateringOrder, (key, value) => {
             if ((key === 'order_total' || key === 'tip') && value instanceof Prisma.Decimal) {
               return value.toString();
             }
             if (typeof value === 'bigint') {
               return value.toString();
             }
             return value;
           })
        );
        return NextResponse.json(serializedOrder, { status: 201 });

      } else if (order_type === "on_demand") {
         const prismaStatus = status.toUpperCase() as OnDemandStatus;
         if (!Object.values(OnDemandStatus).includes(prismaStatus)) {
           throw new Error(`Invalid on-demand status provided: ${status}`);
         }
         // TODO: Implement on_demand creation using PascalCase fields
         // await txPrisma.onDemand.create({ data: { ..., status: prismaStatus, address_id: ..., delivery_address_id: ... }, include: { user: ..., address: true, delivery_address: true } });
         throw new Error("On-demand order creation not yet implemented.");
      } else {
        throw new Error(`Invalid order_type: ${order_type}`);
      }
    }); // End transaction

     if (result instanceof NextResponse) {
        return result;
    }
    // Should not be reached if transaction always returns or throws
    console.warn("Transaction finished without returning a specific response.");
    return NextResponse.json({ message: "Order processed but unexpected transaction result" }, { status: 200 });

  } catch (error: any) {
     console.error("Error in POST /api/orders:", error);
    let statusCode = 500;
    let message = "Failed to process order.";
    // Use specific error message for validation/not found errors
    if (error.message.includes("Invalid") || error.message.includes("Missing") || error.message.includes("not found")) {
        statusCode = 400;
        message = error.message;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
            statusCode = 409;
            // Target might be an array like ['orderNumber']
            const field = (error.meta as any)?.target?.[0] || 'field'; 
            message = `An order with this ${field} already exists.`;
        } else {
             message = `Database error: ${error.code}`;
        }
    } else if (error instanceof Error) { // Catch generic errors
       message = error.message; // Use the actual error message
    } 
    // Avoid exposing raw error details in production unnecessarily
    return NextResponse.json({ message: message }, { status: statusCode });

  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to map Prisma order data (PascalCase fields and relations)
function mapOrderForEmail(order: PrismaOrder): EmailOrder {
    const isCatering = 'brokerage' in order;
    // Base mapping using PascalCase fields from Prisma object
    const base: EmailBaseOrder = {
      order_type: isCatering ? "catering" : "on_demand",
      user: {
        name: order.user?.name ?? null,
        email: order.user?.email ?? null,
      },
      address: order.pickupAddress, // Use PascalCase relation
      delivery_address: order.deliveryAddress, // Use PascalCase relation
      order_number: order.orderNumber, // Use PascalCase field
      brokerage: (order as PrismaCateringOrder).brokerage, // Add brokerage
      date: order.pickupDateTime ?? null, // Use PascalCase field
      pickup_time: order.pickupDateTime ?? null,
      arrival_time: order.arrivalDateTime ?? null,
      complete_time: order.completeDateTime ?? null,
      order_total: order.orderTotal?.toString() ?? "0.00",
      client_attention: order.clientAttention ?? null,
      pickup_notes: order.pickupNotes ?? null,
      special_notes: order.specialNotes ?? null,
      status: order.status ?? null,
    };
    if (isCatering) {
      const cateringOrder = order as PrismaCateringOrder;
      return {
        ...base,
        headcount: cateringOrder.headcount?.toString() ?? null,
        need_host: cateringOrder.needHost ?? null,
        hours_needed: cateringOrder.hoursNeeded?.toString() ?? null,
        number_of_host: cateringOrder.numberOfHosts?.toString() ?? null, // Use PascalCase field
      } as EmailCateringOrder;
    } else {
      const onDemandOrder = order as PrismaOnDemandOrder;
      return {
        ...base,
        item_delivered: onDemandOrder.itemDelivered ?? null,
        vehicle_type: onDemandOrder.vehicleType ?? null,
        length: onDemandOrder.length?.toString() ?? null,
        width: onDemandOrder.width?.toString() ?? null,
        height: onDemandOrder.height?.toString() ?? null,
        weight: onDemandOrder.weight?.toString() ?? null,
      } as EmailOnDemandOrder;
    }
}