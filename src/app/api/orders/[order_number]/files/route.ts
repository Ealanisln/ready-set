// src/app/api/orders/[orderNumber]/files/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/utils/prismaDB';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ order_number: string }> }
) {
  // Add debug logging to see what parameters we're receiving
  console.log("Order files API endpoint called with params:", params);
  
  // Await params before accessing its properties
  const { order_number } = await params;
  
  // Check if order_number exists
  if (!order_number) {
    console.log("Missing order number in params");
    return NextResponse.json(
      { error: "Missing order number parameter" },
      { status: 400 }
    );
  }
  
  const orderNumber = order_number;
  console.log("Processing files request for order:", orderNumber);
  
  try {
    // Initialize Supabase client for auth check
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user || !user.id) {
      console.log("Unauthorized access attempt to files API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Try to fetch the catering request
    console.log("Fetching catering request for", orderNumber);
    const cateringRequest = await prisma.cateringRequest.findFirst({
      where: { 
        orderNumber: {
          equals: orderNumber,
          mode: 'insensitive' // Add case-insensitive mode
        }
      },
      select: { id: true }
    });
    
    // Try to fetch the on-demand request if catering request not found
    if (!cateringRequest) {
      console.log("Catering request not found, trying on_demand");
      const onDemandRequest = await prisma.onDemand.findFirst({
        where: { 
          orderNumber: {
            equals: orderNumber,
            mode: 'insensitive' // Add case-insensitive mode
          }
        },
        select: { id: true }
      });
      
      if (!onDemandRequest) {
        console.log("Order not found:", orderNumber);
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
      
      console.log("Found on_demand order:", onDemandRequest);
      
      // Fetch files for on_demand
      const files = await prisma.fileUpload.findMany({
        where: {
          onDemandId: onDemandRequest.id.toString()
        },
        orderBy: {
          uploadedAt: 'desc'
        }
      });
      
      console.log(`Found ${files.length} files for on_demand order ${orderNumber}`);
      return NextResponse.json(files);
    }
    
    console.log("Found catering request:", cateringRequest);
    
    // Fetch files for catering_request
    const files = await prisma.fileUpload.findMany({
      where: {
        cateringRequestId: cateringRequest.id.toString()
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    
    console.log(`Found ${files.length} files for catering order ${orderNumber}`);
    return NextResponse.json(files);
    
  } catch (error: any) {
    console.error("Error fetching order files:", error);
    return NextResponse.json(
      { error: "Failed to fetch order files", details: error.message || error },
      { status: 500 }
    );
  }
}