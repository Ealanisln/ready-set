import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if the user is authenticated
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is a super admin
    // You'll need to retrieve user type from your database or from Supabase user metadata
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { type: true }
    });

    if (!userData || userData.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized. Only super admins can delete orders." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const orderType = searchParams.get('orderType');

    if (!orderId || !orderType) {
      return NextResponse.json({ error: 'Missing orderId or orderType' }, { status: 400 });
    }

    if (orderType !== 'catering' && orderType !== 'onDemand') {
      return NextResponse.json({ error: 'Invalid orderType' }, { status: 400 });
    }

    const orderIdNumber = parseInt(orderId, 10);

    if (isNaN(orderIdNumber)) {
      return NextResponse.json({ error: 'Invalid orderId' }, { status: 400 });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete associated dispatches
      const deletedDispatches = await tx.dispatch.deleteMany({
        where: {
          [orderType === 'catering' ? 'cateringRequestId' : 'on_demandId']: orderIdNumber,
        },
      });

      // Delete associated file uploads
      const deletedFileUploads = await tx.file_upload.deleteMany({
        where: {
          [orderType === 'catering' ? 'cateringRequestId' : 'onDemandId']: orderIdNumber,
        },
      });

      // Delete the order
      let deletedOrder;
      if (orderType === 'catering') {
        deletedOrder = await tx.catering_request.delete({
          where: { id: orderIdNumber },
        });
      } else {
        deletedOrder = await tx.on_demand.delete({
          where: { id: orderIdNumber },
        });
      }

      return { 
        success: true,
        deletedDispatches: deletedDispatches.count,
        deletedFileUploads: deletedFileUploads.count,
        deletedOrder: deletedOrder ? 1 : 0
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}