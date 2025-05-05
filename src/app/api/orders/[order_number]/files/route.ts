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
          OR: [
            // Lookup by specific onDemandId
            {
              onDemandId: onDemandRequest.id.toString()
            },
            // Also look for files with this catering request and the on-demand category
            {
              category: "on-demand",
              onDemandId: onDemandRequest.id.toString() 
            }
          ]
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
        OR: [
          // Lookup by specific cateringRequestId
          {
            cateringRequestId: cateringRequest.id
          },
          // Also look for files with this catering request ID and specific categories
          {
            category: "catering-order",
            cateringRequestId: cateringRequest.id
          },
          {
            category: "catering",
            cateringRequestId: cateringRequest.id
          }
        ]
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    
    console.log(`Found ${files.length} files for catering order ${orderNumber}`, 
      files.length > 0 ? files.map(f => ({ id: f.id, name: f.fileName, category: f.category })) : "No files");
    
    // If we found files, return them
    if (files.length > 0) {
      return NextResponse.json(files);
    }
    
    // If no files found by ID, try to find by entityId in the storage path
    // This is a fallback mechanism for files uploaded before the fix
    console.log("No files found by ID lookup, checking storage for temporary uploads");
    const fileUploads = await prisma.fileUpload.findMany({
      where: {
        OR: [
          {
            fileUrl: {
              contains: `/catering/${cateringRequest.id}/`
            }
          },
          {
            fileUrl: {
              contains: `/catering_order/${cateringRequest.id}/`
            }
          },
          {
            fileUrl: {
              contains: `/orders/catering/${cateringRequest.id}/`
            }
          },
          // Add check for fileUploader bucket files
          {
            fileUrl: {
              contains: `fileUploader/catering_order/`
            },
            isTemporary: true
          },
          // Add general check for any temporary catering-related files
          {
            category: {
              in: ["catering", "catering-order"]
            },
            isTemporary: true
          }
        ]
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    
    console.log(`Found ${fileUploads.length} files by URL path and temporary lookup`);
    
    if (fileUploads.length > 0) {
      console.log("File URLs found:", fileUploads.map(f => ({ 
        id: f.id, 
        name: f.fileName, 
        url: f.fileUrl,
        isTemporary: f.isTemporary 
      })));
      
      // Update these files to associate them with the correct catering request ID
      for (const file of fileUploads) {
        try {
          await prisma.fileUpload.update({
            where: { id: file.id },
            data: { 
              cateringRequestId: cateringRequest.id,
              category: "catering-order",
              isTemporary: false
            }
          });
          console.log(`Updated file ${file.id} to associate with catering request ${cateringRequest.id}`);
        } catch (updateError) {
          console.error(`Failed to update file ${file.id}:`, updateError);
        }
      }
      
      // Return the updated files
      return NextResponse.json(fileUploads);
    }
    
    // If no files found at all, return empty array
    return NextResponse.json([]);
    
  } catch (error: any) {
    console.error("Error fetching order files:", error);
    return NextResponse.json(
      { error: "Failed to fetch order files", details: error.message || error },
      { status: 500 }
    );
  }
}