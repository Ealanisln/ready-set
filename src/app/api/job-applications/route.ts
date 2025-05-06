import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { sendEmail } from "@/utils/email";
import { createClient } from "@/utils/supabase/server"; // Import Supabase server client
import { FileUpload } from "@prisma/client"; // Import FileUpload type if not already

export async function POST(request: Request) {
  const supabase = await createClient(); // Initialize Supabase client AND AWAIT IT
  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'user-assets'; // Get bucket name

  try {
    const data = await request.json();
    
    // Debug log received data
    console.log("Received application data:", JSON.stringify(data, null, 2));

    // --- Step 1: Identify and Fetch FileUpload Records ---
    const fileIdsToProcess = [
      data.resumeFileId,
      data.driversLicenseFileId,
      data.insuranceFileId,
      data.vehicleRegFileId,
      data.foodHandlerFileId,
      data.hipaaFileId,
      data.driverPhotoFileId,
      data.carPhotoFileId,
      data.equipmentPhotoFileId
    ].filter((id): id is string => typeof id === 'string' && id !== '');

    let temporaryFileUploads: FileUpload[] = [];
    if (fileIdsToProcess.length > 0) {
        console.log("Fetching FileUpload records for IDs:", fileIdsToProcess);
        temporaryFileUploads = await prisma.fileUpload.findMany({
            where: {
                id: { in: fileIdsToProcess },
                // Don't restrict by isTemporary flag - some files may not be marked correctly
                // but we still want to process them
            }
        });
        console.log("Fetched file uploads:", temporaryFileUploads.map(f => ({ 
          id: f.id, 
          url: f.fileUrl, 
          name: f.fileName,
          isTemporary: f.isTemporary,
          category: f.category
        })));
        
        // Optional: Check if all requested IDs were found
        if (temporaryFileUploads.length !== fileIdsToProcess.length) {
            console.warn("Mismatch between requested file IDs and found files. Some files might not exist or IDs are invalid.");
            // Decide if this should be a hard error or just a warning
        }
    } else {
      console.log("No file IDs provided in the request.");
    }


    // --- Step 2: Create Job Application Data (prepare but don't save yet if dependent on file processing outcome) ---
    // It might be safer to create the JobApplication *after* successfully moving files,
    // or handle potential file move failures gracefully. For now, let's proceed as before.
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
      // --- Store temporary paths/URLs initially? --- 
      // The JobApplication model itself uses *FilePath fields, which seems inconsistent
      // with FileUpload model using fileUrl. Let's keep applicationData simple for now
      // and rely on the FileUpload relationship for the final, correct URLs/paths.
      // We remove the direct *FilePath fields from applicationData creation.
      /*
      resumeFilePath: temporaryFileUploads.find(f => f.id === data.resumeFileId)?.filePath ?? data.resumeFilePath ?? null, 
      // ... other FilePath fields removed ...
      */
      // Set initial status
      status: "PENDING" as const,
    };

    console.log("Creating application with initial data:", JSON.stringify(applicationData, null, 2));

    // --- Step 3: Create the JobApplication Record ---
    const application = await prisma.jobApplication.create({
      data: applicationData,
    });
    console.log("JobApplication created with ID:", application.id);


    // --- Step 4: Move Files and Update FileUpload Records ---
    const processedFilesInfo: { id: string; newPath: string; newUrl: string }[] = [];
    if (temporaryFileUploads.length > 0) {
      console.log(`Processing ${temporaryFileUploads.length} files for application ${application.id}...`);
      
      for (const file of temporaryFileUploads) {
        // Ensure fileUrl and fileName exist before proceeding
        if (!file.fileUrl || !file.fileName) {
            console.error(`Skipping file ID ${file.id} due to missing fileUrl or fileName.`);
            continue; 
        }

        // Extract the temporary path from the fileUrl
        let oldPath = '';
        try {
            const urlObject = new URL(file.fileUrl);
            // Pathname usually starts with /storage/v1/object/public/bucket_name/
            const pathParts = urlObject.pathname.split('/');
            if (pathParts.length > 6 && pathParts[5] === bucketName) {
                oldPath = pathParts.slice(6).join('/'); // Join the rest as the path
            } else {
                 console.error(`Could not extract valid path from URL: ${file.fileUrl}`);
                 continue;
            }
        } catch (e) {
            console.error(`Invalid URL format for file ID ${file.id}: ${file.fileUrl}`, e);
            continue;
        }

        if (!oldPath) { // Double check if path extraction failed
            console.error(`Failed to extract oldPath for file ID ${file.id}`);
            continue;
        }
        
        // Sanitize fileName: remove potentially problematic characters, replace spaces
        const sanitizedFileName = file.fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_').replace(/\s+/g, '_');
        
        // Add a timestamp to ensure uniqueness even for files with the same name
        const timestamp = Date.now();
        const fileNameParts = sanitizedFileName.split('.');
        const fileExtension = fileNameParts.pop() || '';
        const fileNameWithoutExtension = fileNameParts.join('.');
        const uniqueFileName = `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;
        
        const newPath = `job-applications/${application.id}/${uniqueFileName}`;
        
        console.log(`Attempting to move file: ${oldPath} -> ${newPath}`);

        try {
          // Move the file in Supabase Storage
          const { data: moveData, error: moveError } = await supabase.storage
            .from(bucketName)
            .move(oldPath, newPath);

          if (moveError) {
            // Log the error but continue processing other files
            console.error(`Error moving file ${oldPath} to ${newPath}:`, moveError);
            // Potentially add logic here to mark this file as failed or retry later
            continue; // Skip updating this file record if move failed
          }

          console.log(`Successfully moved file to ${newPath}`, moveData);

          // Construct the new public URL
          const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(newPath);
          const newPublicUrl = urlData?.publicUrl || ''; // Fallback to empty string if URL generation fails

          // Update the FileUpload record in Prisma
          console.log(`Updating FileUpload record ID ${file.id} with new path and URL...`);
          await prisma.fileUpload.update({
            where: { id: file.id },
            data: {
              jobApplicationId: application.id, // Critical: Associate with the job application
              isTemporary: false, // Mark as no longer temporary
              fileUrl: newPublicUrl, // Store the new public URL
            },
          });
          console.log(`FileUpload record ID ${file.id} updated successfully.`);
          processedFilesInfo.push({ id: file.id, newPath: newPath, newUrl: newPublicUrl });

        } catch (processingError: any) {
          console.error(`Error processing file ID ${file.id} (path: ${oldPath}):`, {
            message: processingError.message,
            stack: processingError.stack,
          });
          // Continue to the next file
        }
      } // End for loop
      
      console.log(`Finished processing ${temporaryFileUploads.length} files.`);
      
      // Update the JobApplication record with the final permanent paths
      if (processedFilesInfo.length > 0) {
        console.log("Updating JobApplication with file paths...");
        
        // Map file categories to the corresponding file path fields in the JobApplication model
        const filePathUpdates: Record<string, string> = {};
        
        for (const file of temporaryFileUploads) {
          const processedFile = processedFilesInfo.find(p => p.id === file.id);
          if (!processedFile) continue;
          
          // Map category to the appropriate *FilePath field
          switch (file.category) {
            case 'resume':
            case 'job-applications/temp/resume':
              filePathUpdates.resumeFilePath = processedFile.newPath;
              break;
            case 'license':
            case 'job-applications/temp/license':
              filePathUpdates.driversLicenseFilePath = processedFile.newPath;
              break;
            case 'insurance':
            case 'job-applications/temp/insurance':
              filePathUpdates.insuranceFilePath = processedFile.newPath;
              break;
            case 'registration':
            case 'job-applications/temp/registration':
              filePathUpdates.vehicleRegFilePath = processedFile.newPath;
              break;
            case 'food_handler':
            case 'job-applications/temp/food_handler':
              filePathUpdates.foodHandlerFilePath = processedFile.newPath;
              break;
            case 'hipaa':
            case 'job-applications/temp/hipaa':
              filePathUpdates.hipaaFilePath = processedFile.newPath;
              break;
            case 'driver_photo':
            case 'job-applications/temp/driver_photo':
              filePathUpdates.driverPhotoFilePath = processedFile.newPath;
              break;
            case 'car_photo':
            case 'job-applications/temp/car_photo':
              filePathUpdates.carPhotoFilePath = processedFile.newPath;
              break;
            case 'equipment_photo':
            case 'job-applications/temp/equipment_photo':
              filePathUpdates.equipmentPhotoFilePath = processedFile.newPath;
              break;
          }
        }
        
        // Update the application with file paths
        if (Object.keys(filePathUpdates).length > 0) {
          console.log("Updating JobApplication with file paths:", filePathUpdates);
          try {
            await prisma.jobApplication.update({
              where: { id: application.id },
              data: filePathUpdates,
              include: {
                fileUploads: true  // Include file uploads in the returned data
              }
            });
            console.log("JobApplication updated with file paths successfully");
          } catch (updateError: any) {
            console.error("Error updating JobApplication with file paths:", {
              error: updateError.message,
              stack: updateError.stack,
              filePathUpdates
            });
          }
        } else {
          console.log("No file paths to update for JobApplication");
        }
      }

    } else {
      console.log("No temporary files to process for JobApplication ID:", application.id);
    }

    // --- Step 5: Send Notification Email (Adjust to use final paths/URLs) ---
    const recipient = process.env.ADMIN_EMAIL || "apply@readysetllc.com";
    const subject = `New Job Application: ${application.firstName} ${application.lastName} - ${application.position}`;
    
    // Fetch the application *with* its associated (and now updated) file uploads
    const applicationWithFiles = await prisma.jobApplication.findUnique({
        where: { id: application.id },
        include: { fileUploads: true } // Include the updated FileUploads
    });

    if (!applicationWithFiles) {
        console.error("Could not refetch application with files for email notification.");
        // Handle this case - maybe send email with initial data?
    } else {
        let htmlBody = `<h1>New Job Application Received</h1>`;
        htmlBody += `<p><strong>Application ID:</strong> <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/job-applications/${application.id}">${application.id}</a></p>`;
        htmlBody += `<h2>Applicant Details:</h2><ul>`;

        // Iterate over application fields (excluding relations)
        for (const [key, value] of Object.entries(applicationWithFiles)) {
            if (key === 'fileUploads' || key === 'profile') continue; // Skip relations

            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/([Ff]ile[Pp]ath)/, ' File Path').replace(/^./, (str) => str.toUpperCase());
            htmlBody += `<li><strong>${formattedKey}:</strong> ${value || 'N/A'}</li>`;
        }
        
        // Add links for processed files
        if (applicationWithFiles.fileUploads && applicationWithFiles.fileUploads.length > 0) {
            htmlBody += `<h2>Uploaded Documents:</h2><ul>`;
            applicationWithFiles.fileUploads.forEach(file => {
                // Use category or fileName for the link text
                const linkText = file.category ? file.category.charAt(0).toUpperCase() + file.category.slice(1) : file.fileName || 'View File';
                if (file.fileUrl) { // Use the updated fileUrl
                   // Use fileUrl directly as it should now be the permanent public URL
                   htmlBody += `<li><strong>${linkText}:</strong> <a href="${file.fileUrl}" target="_blank">Open File</a></li>`;
                } else {
                   htmlBody += `<li><strong>${linkText}:</strong> Link unavailable (Original Name: ${file.fileName})</li>`;
                }
            });
            htmlBody += `</ul>`;
        }

        htmlBody += `</ul>`; // Close Applicant Details list

        try {
          await sendEmail({
            to: recipient,
            subject: subject,
            html: htmlBody,
          });
          console.log("Notification email sent successfully to:", recipient);
        } catch (emailError: any) {
          console.error("Error sending notification email:", {
            message: emailError.message, recipient, jobApplicationId: application.id, stack: emailError.stack
          });
        }
    } // End if applicationWithFiles

    // --- Step 6: Return Success Response ---
    return NextResponse.json({
      success: true,
      id: application.id,
    });

  } catch (error: any) {
    // Enhanced error logging
    let requestBodyText = 'Could not read request body';
    try {
      // Attempt to read the body again if needed, only if request object allows it
      // Note: request.json() consumes the body, so reading again might fail unless cloned
      // For simplicity, we might rely on the initial 'data' variable if available in scope
      // requestBodyText = await request.text(); 
    } catch (readError) { /* Ignore */ }

    console.error("Application submission error details:", {
      message: error.message,
      code: error.code, 
      meta: error.meta,
      stack: error.stack,
      requestData: /* data */ 'See initial log for request data', // Reference logged data
    });
    
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later.", details: error.message },
      { status: 500 }
    );
  }
}