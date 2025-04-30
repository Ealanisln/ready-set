import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { sendEmail } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Debug log
    console.log("Received data:", JSON.stringify(data, null, 2));

    // First, fetch the actual file URLs from the file uploads
    let resumeUrl = "";
    let driversLicenseUrl = null;
    let insuranceUrl = null;
    let vehicleRegUrl = null;

    if (data.resumeFileId || data.driversLicenseFileId || data.insuranceFileId || data.vehicleRegFileId) {
      const fileIds = [
        data.resumeFileId,
        data.driversLicenseFileId,
        data.insuranceFileId,
        data.vehicleRegFileId
      ].filter(Boolean);

      if (fileIds.length > 0) {
        // Fetch all file records at once
        const fileUploads = await prisma.fileUpload.findMany({
          where: {
            id: {
              in: fileIds
            }
          }
        });

        // Map the file uploads to their corresponding URL properties
        if (data.resumeFileId) {
          const resumeFile = fileUploads.find(file => file.id === data.resumeFileId);
          resumeUrl = resumeFile?.fileUrl || data.resumeFileId || "";
        }

        if (data.driversLicenseFileId) {
          const driversLicenseFile = fileUploads.find(file => file.id === data.driversLicenseFileId);
          driversLicenseUrl = driversLicenseFile?.fileUrl || null;
        }

        if (data.insuranceFileId) {
          const insuranceFile = fileUploads.find(file => file.id === data.insuranceFileId);
          insuranceUrl = insuranceFile?.fileUrl || null;
        }

        if (data.vehicleRegFileId) {
          const vehicleRegFile = fileUploads.find(file => file.id === data.vehicleRegFileId);
          vehicleRegUrl = vehicleRegFile?.fileUrl || null;
        }
      }
    }

    // Create the job application with the file URLs
    const applicationData = {
      // Basic Information
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      position: data.role,

      // Address Information
      addressStreet: data.address.street,
      addressCity: data.address.city,
      addressState: data.address.state,
      addressZip: data.address.zip,

      // Professional Information
      education: data.education,
      workExperience: data.workExperience,
      skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
      coverLetter: data.coverLetter || null,

      // Document URLs from file uploads - now using actual URLs
      resumeUrl: resumeUrl,
      driversLicenseUrl: driversLicenseUrl,
      insuranceUrl: insuranceUrl,
      vehicleRegUrl: vehicleRegUrl,
      // Use the enum type for status
      status: "PENDING" as const,
    };

    console.log("Creating application with data:", JSON.stringify(applicationData, null, 2));

    const application = await prisma.jobApplication.create({
      data: applicationData,
    });

    // Update the file records to associate them with the job application
    if (data.resumeFileId || data.driversLicenseFileId || data.insuranceFileId || data.vehicleRegFileId) {
      const fileIds = [
        data.resumeFileId,
        data.driversLicenseFileId,
        data.insuranceFileId,
        data.vehicleRegFileId
      ].filter(Boolean);

      console.log("Updating files with IDs:", fileIds);

      if (fileIds.length > 0) {
        await prisma.fileUpload.updateMany({
          where: {
            id: {
              in: fileIds
            }
          },
          data: {
            jobApplicationId: application.id,
            isTemporary: false // Mark as permanent since they're now associated
          }
        });
      }
    }

    // Send notification email to admin with full application details
    const recipient = "apply@readysetllc.com";
    const subject = `New Job Application: ${applicationData.firstName} ${applicationData.lastName} - ${applicationData.position}`;

    // Create a more detailed HTML body
    let htmlBody = `<h1>New Job Application Received</h1>`;
    htmlBody += `<p><strong>Application ID:</strong> ${application.id}</p>`;
    htmlBody += `<h2>Applicant Details:</h2><ul>`;

    // Iterate over applicationData to create list items
    for (const [key, value] of Object.entries(applicationData)) {
      // Simple formatting for key names
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      htmlBody += `<li><strong>${formattedKey}:</strong> ${value || 'N/A'}</li>`;
    }

    htmlBody += `</ul>`;

    await sendEmail({
      to: recipient,
      subject: subject, // Use the updated subject
      html: htmlBody, // Use the detailed HTML body
    });

    return NextResponse.json({
      success: true,
      id: application.id,
    });
  } catch (error: any) {
    console.error("Application submission error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });

    return NextResponse.json(
      { error: "Failed to submit application", details: error.message },
      { status: 500 }
    );
  }
}