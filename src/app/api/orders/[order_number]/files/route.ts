import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { Prisma } from "@prisma/client";

// Add the serialization utility
type SerializableObject = { [key: string]: any };

const serializeBigInt = <T extends SerializableObject>(
  obj: T,
): SerializableObject => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === "bigint") {
      acc[key] = value.toString();
    } else if (value instanceof Date) {
      acc[key] = value.toISOString(); // Convert Date objects to ISO strings
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      acc[key] = serializeBigInt(value);
    } else if (Array.isArray(value)) {
      acc[key] = value.map((item) =>
        typeof item === "object" ? serializeBigInt(item) : item,
      );
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as SerializableObject);
};

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Add your DELETE implementation here
    // Example:
    // const { fileId } = await request.json();
    // await prisma.file_upload.delete({
    //   where: { id: fileId }
    // });

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { order_number: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderNumber = params.order_number;
    if (!orderNumber) {
      return NextResponse.json(
        { message: "Order number is required" },
        { status: 400 },
      );
    }

    console.log("Fetching files for order:", orderNumber);

    // First find the order to get its ID
    const cateringRequest = await prisma.catering_request.findUnique({
      where: {
        order_number: orderNumber,
      },
      select: {
        id: true,
      },
    });

    const onDemandOrder = await prisma.on_demand.findUnique({
      where: {
        order_number: orderNumber,
      },
      select: {
        id: true,
      },
    });

    // Find files based on the order type
    const files = await prisma.file_upload.findMany({
      where: {
        OR: [
          {
            cateringRequestId: cateringRequest?.id,
          },
          {
            onDemandId: onDemandOrder?.id,
          },
        ],
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

    // Serialize the files data before returning
    const serializedFiles = serializeBigInt(files);
    return NextResponse.json(serializedFiles);
  } catch (error) {
    console.error("Error fetching order files:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
