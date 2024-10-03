import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    // Check if the user is authenticated and authorized
    const session = await getServerSession(authOptions);
    if (!session || session.user.type !== "super_admin") {
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