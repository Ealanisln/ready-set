import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from '@/utils/prismaDB';
import { Prisma } from '@prisma/client';

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Add your DELETE implementation here
    // Example:
    // const { fileId } = await request.json();
    // await prisma.file_upload.delete({
    //   where: { id: fileId }
    // });

    return NextResponse.json({ message: "File deleted successfully" });
    
  } catch (error) {
    console.error('Error deleting file:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { order_number: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderNumber = params.order_number;
    if (!orderNumber) {
      return NextResponse.json(
        { message: 'Order number is required' },
        { status: 400 }
      );
    }

    console.log('Fetching files for order:', orderNumber);
    
    // First find the order to get its ID
    const cateringRequest = await prisma.catering_request.findUnique({
      where: {
        order_number: orderNumber,
      },
      select: {
        id: true
      }
    });

    const onDemandOrder = await prisma.on_demand.findUnique({
      where: {
        order_number: orderNumber,
      },
      select: {
        id: true
      }
    });

    // Find files based on the order type
    const files = await prisma.file_upload.findMany({
      where: {
        OR: [
          {
            cateringRequestId: cateringRequest?.id
          },
          {
            onDemandId: onDemandOrder?.id
          }
        ]
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        fileUrl: true,
        category: true,
        uploadedAt: true,
        updatedAt: true,
        entityType: true,
        entityId: true,
        userId: true,
        cateringRequestId: true,
        onDemandId: true,
      },
    });

    console.log(`Found ${files.length} files for order:`, orderNumber);
    return NextResponse.json(files);

  } catch (error) {
    console.error('Error fetching order files:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}