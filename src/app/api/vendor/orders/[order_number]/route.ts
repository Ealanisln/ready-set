import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber, checkVendorAccess } from "@/lib/services/vendor";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ order_number: string }> }
) {
  try {
    // Check if user has vendor access
    const hasAccess = await checkVendorAccess();
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const params = await props.params;
    const orderNumber = params.order_number;
    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    // Get order details
    const order = await getOrderByNumber(orderNumber);
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error(`Error fetching order:`, error);
    
    if (error.message === "Not Found") {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to fetch order details" },
      { status: 500 }
    );
  }
} 