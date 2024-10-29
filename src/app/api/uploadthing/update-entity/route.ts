// src/app/api/uploadthing/update-entity/route.ts
import { prisma } from "@/utils/prismaDB";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { oldEntityId, newEntityId, entityType } = await req.json();

    // Update the files with the new entityId
    await prisma.file_upload.updateMany({
      where: {
        entityId: oldEntityId,
        entityType: entityType,
      },
      data: {
        entityId: newEntityId,
        cateringRequestId:
          entityType === "catering_request" ? BigInt(newEntityId) : null,
        onDemandId: entityType === "on_demand" ? BigInt(newEntityId) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating entity ID:", error);
    return NextResponse.json(
      { error: "Failed to update entity ID" },
      { status: 500 },
    );
  }
}
