import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get("path");

  if (!filePath) {
    return new NextResponse("File path is required", { status: 400 });
  }

  try {
    // Ensure the file path is within your public/resources directory
    const fullPath = path.join(process.cwd(), "public", "resources", filePath);
    const fileBuffer = await fs.readFile(fullPath);

    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename=${path.basename(filePath)}`,
    );

    return response;
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}
