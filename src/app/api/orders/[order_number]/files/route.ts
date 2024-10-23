import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prismaDB';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { order_number: string } }
) {
  const orderNumber = params.order_number;

  if (!orderNumber) {
    return NextResponse.json(
      { message: 'Order number is required' },
      { status: 400 }
    );
  }

  try {
    // First try to find a catering request
    const cateringRequest = await prisma.catering_request.findUnique({
      where: {
        order_number: orderNumber,
      },
      include: {
        fileUploads: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            fileUrl: true,
            category: true,
            uploadedAt: true,
          },
        },
      },
    });

    if (cateringRequest) {
      return NextResponse.json(cateringRequest.fileUploads);
    }

    // If not found, try to find an on-demand order
    const onDemandOrder = await prisma.on_demand.findUnique({
      where: {
        order_number: orderNumber,
      },
      include: {
        fileUploads: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            fileUrl: true,
            category: true,
            uploadedAt: true,
          },
        },
      },
    });

    if (onDemandOrder) {
      return NextResponse.json(onDemandOrder.fileUploads);
    }

    // If neither is found, return 404
    return NextResponse.json(
      { message: 'Order not found' },
      { status: 404 }
    );

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: 'Unique constraint violation' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 400 }
      );
    }
    
    console.error('Error fetching order files:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}