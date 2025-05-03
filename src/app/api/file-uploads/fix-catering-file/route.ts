import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function GET(request: NextRequest) {
  try {
    // The file ID from your database
    const fileId = '41b1dab3-653f-4b39-8fb3-fad1e8e8b005';
    
    // The catering request ID
    const cateringRequestId = '0e228663-a3c1-44cf-9c80-bcfe4d96e200';
    
    console.log(`Attempting to update file ${fileId} with cateringRequestId ${cateringRequestId}...`);
    
    // Update the file record
    const updatedFile = await prisma.fileUpload.update({
      where: {
        id: fileId
      },
      data: {
        cateringRequestId: cateringRequestId
      }
    });
    
    console.log('File record updated successfully:', updatedFile);
    
    // Try to fetch files with the updated record to confirm
    const files = await prisma.fileUpload.findMany({
      where: {
        cateringRequestId: cateringRequestId
      }
    });
    
    console.log(`Found ${files.length} files for catering request ID ${cateringRequestId}`);
    
    return NextResponse.json({
      success: true,
      message: 'File record updated successfully',
      updatedFile,
      filesFound: files.length
    });
  } catch (error: any) {
    console.error('Error updating file record:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update file record',
        message: error.message || String(error)
      },
      { status: 500 }
    );
  }
} 