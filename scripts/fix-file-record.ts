import { PrismaClient } from '@prisma/client';

// Initialize the Prisma client
const prisma = new PrismaClient();

async function fixFileRecord() {
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
    
    return {
      success: true,
      file: updatedFile
    };
  } catch (error) {
    console.error('Error updating file record:', error);
    return {
      success: false,
      error
    };
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

// Run the function
fixFileRecord()
  .then(result => {
    if (result.success) {
      console.log('Script completed successfully');
      process.exit(0);
    } else {
      console.error('Script failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 