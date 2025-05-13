import { NextRequest, NextResponse } from "next/server";
import { getVendorMetrics, checkVendorAccess } from "@/lib/services/vendor";

export async function GET(req: NextRequest) {
  try {
    // Check if user has vendor access
    const hasAccess = await checkVendorAccess();
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Get vendor metrics
    const metrics = await getVendorMetrics();
    
    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error("Error fetching vendor metrics:", error);
    
    return NextResponse.json(
      { error: error.message || "Failed to fetch vendor metrics" },
      { status: 500 }
    );
  }
} 