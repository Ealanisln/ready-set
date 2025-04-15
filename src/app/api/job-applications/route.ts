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

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "",
      subject: "New Job Application",
      html: `New application received from ${data.firstName} ${data.lastName} for ${data.role} position. Application ID: ${application.id}`,
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