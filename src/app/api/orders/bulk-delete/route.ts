import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";
import { storage } from "@/utils/supabaseStorage";

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    
    // Get user session from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated and is admin
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.profiles.findUnique({
      where: { auth_user_id: user.id },
      select: { type: true },
    });

    // Only allow admins or super_admins to delete orders
    if (!userData || (userData.type !== 'admin' && userData.type !== 'super_admin')) {
      return NextResponse.json({ message: "Forbidden - Admin permissions required" }, { status: 403 });
    }

    // Get order numbers from request body
    const { orderNumbers } = await req.json();

    if (!Array.isArray(orderNumbers) || orderNumbers.length === 0) {
      return NextResponse.json(
        { message: "Invalid request format. Expected an array of order numbers." },
        { status: 400 }
      );
    }

    const results = {
      deleted: [] as string[],
      failed: [] as { orderNumber: string; reason: string }[],
    };

    // Process each order
    for (const orderNumber of orderNumbers) {
      try {
        // Step 1: Identify order type
        let orderType: 'catering' | 'on_demand' | null = null;
        let orderId: bigint | null = null;

        // Check if it's a catering request
        const cateringRequest = await prisma.catering_request.findUnique({
          where: { order_number: orderNumber },
          select: { id: true }
        });

        if (cateringRequest) {
          orderType = 'catering';
          orderId = cateringRequest.id;
        } else {
          // Check if it's an on-demand order
          const onDemandOrder = await prisma.on_demand.findUnique({
            where: { order_number: orderNumber },
            select: { id: true }
          });

          if (onDemandOrder) {
            orderType = 'on_demand';
            orderId = onDemandOrder.id;
          }
        }

        if (!orderType || !orderId) {
          results.failed.push({ 
            orderNumber, 
            reason: "Order not found" 
          });
          continue;
        }

        // Step 2: Find all file uploads for this order
        const fileUploads = await prisma.file_upload.findMany({
          where: orderType === 'catering' 
            ? { cateringRequestId: orderId } 
            : { onDemandId: orderId }
        });

        // Step 3: Start a transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
          // Step 4: Delete file uploads from storage
          for (const file of fileUploads) {
            // Extract the filename from the URL
            const filePathMatch = file.fileUrl.match(/\/([^/]+)$/);
            if (filePathMatch && filePathMatch[1]) {
              const filePath = filePathMatch[1];
              
              // Delete from Supabase Storage
              try {
                const { error } = await storage
                  .from('order-files')
                  .remove([filePath]);
                  
                if (error) {
                  console.error(`Error deleting file ${filePath} from storage:`, error);
                  // Continue with other deletions even if one fails
                }
              } catch (err) {
                console.error(`Failed to delete file ${filePath}:`, err);
              }
            }
          }

          // Step 5: Delete all dispatches related to the order
          await tx.dispatch.deleteMany({
            where: orderType === 'catering' 
              ? { cateringRequestId: orderId } 
              : { on_demandId: orderId }
          });

          // Step 6: Delete all file uploads from database
          await tx.file_upload.deleteMany({
            where: orderType === 'catering' 
              ? { cateringRequestId: orderId } 
              : { onDemandId: orderId }
          });

          // Step 7: Delete the order itself
          if (orderType === 'catering') {
            await tx.catering_request.delete({
              where: { id: orderId }
            });
          } else {
            await tx.on_demand.delete({
              where: { id: orderId }
            });
          }
        });

        results.deleted.push(orderNumber);
      } catch (error) {
        console.error(`Error deleting order ${orderNumber}:`, error);
        results.failed.push({ 
          orderNumber, 
          reason: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }

    return NextResponse.json({
      message: `${results.deleted.length} orders deleted, ${results.failed.length} failed`,
      results
    });
    
  } catch (error) {
    console.error("Error in bulk order deletion:", error);
    return NextResponse.json(
      { message: "Error in bulk order deletion", error: (error as Error).message },
      { status: 500 }
    );
  }
}