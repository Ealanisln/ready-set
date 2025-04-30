import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { sendEmail } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Debug log received data
    console.log("Received application data:", JSON.stringify(data, null, 2));

    // Create the job application data, directly using file paths
    const applicationData = {
      // Basic Information
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      position: data.role,

      // Address Information
      addressStreet: data.address?.street || "",
      addressCity: data.address?.city || "",
      addressState: data.address?.state || "",
      addressZip: data.address?.zip || "",

      // Professional Information
      education: data.education || null,
      workExperience: data.workExperience || null,
      skills: Array.isArray(data.skills) ? data.skills.filter((s: string) => s && s.trim() !== "").join(", ") : data.skills || null,
      coverLetter: data.coverLetter || null,

      // --- REMOVED TEMPORARY MAPPING --- 
      // Directly use FilePath fields matching the updated Prisma schema
      resumeFilePath: data.resumeFilePath || null, 
      driversLicenseFilePath: data.driversLicenseFilePath || null, 
      insuranceFilePath: data.insuranceFilePath || null,         
      vehicleRegFilePath: data.vehicleRegFilePath || null,      
      foodHandlerFilePath: data.foodHandlerFilePath || null,       
      hipaaFilePath: data.hipaaFilePath || null,                 
      driverPhotoFilePath: data.driverPhotoFilePath || null,     
      carPhotoFilePath: data.carPhotoFilePath || null,           
      equipmentPhotoFilePath: data.equipmentPhotoFilePath || null, 
      // --- End FilePath Fields --- 
      
      // Set initial status
      status: "PENDING" as const,
    };

    console.log("Creating application with final data:", JSON.stringify(applicationData, null, 2));

    // Create the JobApplication record in the database
    const application = await prisma.jobApplication.create({
      data: applicationData,
    });

    console.log("JobApplication created with ID:", application.id);

    // --- Update FileUpload records --- 
    // Use the File IDs passed from the client to associate FileUpload records
    const fileIdsToUpdate = [
      data.resumeFileId,
      data.driversLicenseFileId,
      data.insuranceFileId,
      data.vehicleRegFileId,
      data.foodHandlerFileId,
      data.hipaaFileId,
      data.driverPhotoFileId,
      data.carPhotoFileId,
      data.equipmentPhotoFileId
    ].filter((id): id is string => typeof id === 'string' && id !== ''); // Filter out null/empty IDs

    if (fileIdsToUpdate.length > 0) {
      console.log("Updating FileUpload records with IDs:", fileIdsToUpdate, "to associate with JobApplication ID:", application.id);
      try {
        const updateResult = await prisma.fileUpload.updateMany({
          where: {
            id: {
              in: fileIdsToUpdate
            }
          },
          data: {
            jobApplicationId: application.id,
            isTemporary: false // Mark as permanent
          }
        });
        console.log("FileUpload records updated:", updateResult.count);
      } catch (updateError: any) {
        // Log the error but don't fail the entire application submission
        console.error("Error updating FileUpload records:", {
          message: updateError.message,
          jobApplicationId: application.id,
          fileIds: fileIdsToUpdate,
          stack: updateError.stack
        });
      }
    } else {
      console.log("No FileUpload records to update for JobApplication ID:", application.id);
    }

    // --- Send notification email (keep existing logic) --- 
    const recipient = process.env.ADMIN_EMAIL || "apply@readysetllc.com"; // Use environment variable
    const subject = `New Job Application: ${applicationData.firstName} ${applicationData.lastName} - ${applicationData.position}`;
    
    // Create a more detailed HTML body using application data
    let htmlBody = `<h1>New Job Application Received</h1>`;
    htmlBody += `<p><strong>Application ID:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/job-applications/${application.id}">${application.id}</a></p>`; // Link to admin page
    htmlBody += `<h2>Applicant Details:</h2><ul>`;
    
    for (const [key, value] of Object.entries(applicationData)) {
      // Simple formatting for key names
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/([Ff]ile[Pp]ath|[Uu]rl)/, ' File').replace(/^./, (str) => str.toUpperCase());
      let displayValue: string | React.ReactNode = value || 'N/A';
      // Make file paths/URLs clickable links if they exist
      if ((key.endsWith('FilePath') || key.endsWith('Url')) && typeof value === 'string' && value) { // Check for Url or FilePath keys
        // Construct Supabase public URL (adjust if using signed URLs or different bucket structure)
        // Assuming the stored value is the PATH
        const storagePath = value; 
        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'user-assets';
        const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${storagePath}`;
        // Generate HTML string for the link
        displayValue = `<a href="${fileUrl}" target="_blank">View File</a> (Path: ${storagePath})`;
      }
      htmlBody += `<li><strong>${formattedKey}:</strong> ${displayValue}</li>`;
    }

    htmlBody += `</ul>`;

    try {
      await sendEmail({
        to: recipient,
        subject: subject, 
        html: htmlBody, 
      });
      console.log("Notification email sent successfully to:", recipient);
    } catch (emailError: any) {
      // Log email sending error but don't fail the response
      console.error("Error sending notification email:", {
        message: emailError.message,
        recipient: recipient,
        jobApplicationId: application.id,
        stack: emailError.stack
      });
    }

    return NextResponse.json({
      success: true,
      id: application.id,
    });
  } catch (error: any) {
    console.error("Application submission error details:", {
      message: error.message,
      code: error.code, // Prisma errors might have codes
      meta: error.meta, // Prisma errors might have meta
      stack: error.stack,
      requestBody: await request.text().catch(() => 'Could not read request body') // Log raw body on error
    });
    // Provide a more generic error to the client for security
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later.", details: error.message }, // Keep details for debugging if needed, but maybe remove in production
      { status: 500 }
    );
  }
}