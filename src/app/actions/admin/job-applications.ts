"use server";

import { revalidatePath } from 'next/cache';
import { Prisma, PrismaClient, UserType } from '@prisma/client';
import { prisma } from '../../../lib/prisma'; 
import { createClient } from '@/utils/supabase/server';

/**
 * Server action to approve a job application and create a corresponding user profile.
 */
export const approveJobApplication = async (jobApplicationId: string): Promise<{ message: string; profileId: string }> => {
  // --- IMPORTANT: Manual Authorization Check using Supabase --- 
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth Error:", userError);
    throw new Error("Unauthorized: Could not retrieve user session.");
  }

  // Get user type from profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("type")
    .eq("id", user.id) // Use the authenticated user's ID
    .single();

  if (profileError) {
    console.error("Profile Fetch Error:", profileError);
    throw new Error("Unauthorized: Could not retrieve user profile.");
  }

  const userType = profile?.type;
  // Allow ADMIN, SUPER_ADMIN, and HELPDESK to approve applications
  const isApprover = userType === UserType.ADMIN || userType === UserType.SUPER_ADMIN || userType === UserType.HELPDESK;

  if (!isApprover) {
    console.warn(`Unauthorized attempt by user ${user.id} with type ${userType}`);
    throw new Error("Unauthorized: Admin, Super Admin, or Helpdesk privileges required.");
  }
  // --- End Authorization Check ---

  // --- Basic Input Validation ---
  if (!jobApplicationId || typeof jobApplicationId !== 'string') {
      throw new Error("Invalid input: jobApplicationId is required.");
  }
  // Add more specific validation if needed (e.g., regex for UUID format)
  // --- End Input Validation ---


  // 1. Fetch the job application using prisma
  const jobApplication = await prisma.jobApplication.findUnique({
    where: { id: jobApplicationId },
  });

  if (!jobApplication) {
    throw new Error('Job application not found.');
  }

  // Optional: Check if the application is already approved/rejected
  if (
    jobApplication.status === 'APPROVED' ||
    jobApplication.status === 'REJECTED'
  ) {
    throw new Error(
      `Job application status is already ${jobApplication.status}.`,
    );
  }

  // 2. Check if a profile with this email already exists using prisma
  const existingProfile = await prisma.profile.findUnique({
    where: { email: jobApplication.email },
  });

  if (existingProfile) {
     throw new Error(
       `A profile with email ${jobApplication.email} already exists. Cannot create a new profile automatically. Please link manually or review the existing profile.`,
     );
  }

  // 3. Use a transaction to create the profile and update the application using prisma
  let newProfile: Awaited<ReturnType<typeof prisma.profile.create>> | null = null;
  try {
    // Determine profile type based on job position
    let profileType: UserType = UserType.DRIVER; // Default to DRIVER
    // Add specific checks based on the position strings you expect
    if (jobApplication.position?.toLowerCase().includes('virtual assistant') || 
        jobApplication.position?.toLowerCase().includes('helpdesk')) {
      profileType = UserType.HELPDESK;
    } else if (jobApplication.position?.toLowerCase().includes('driver')) {
      profileType = UserType.DRIVER;
    }
    // Add more else-if conditions for other positions/types if needed

    newProfile = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the new Profile
      const createdProfile = await tx.profile.create({
        data: {
          email: jobApplication.email,
          name: `${jobApplication.firstName} ${jobApplication.lastName}`,
          contactName: `${jobApplication.firstName} ${jobApplication.lastName}`,
          contactNumber: jobApplication.phone,
          type: profileType, // Use the determined profile type
          status: 'ACTIVE',
          isTemporaryPassword: true,
        },
      });

      // Find the job application again within the transaction to ensure consistency
      const jobAppInTx = await tx.jobApplication.findUnique({ where: { id: jobApplicationId } });
      if (!jobAppInTx) {
          throw new Error("Job application disappeared during transaction");
      }

      // Update the Job Application status and link the profile
      await tx.jobApplication.update({
        where: { id: jobApplicationId },
        data: {
          status: 'APPROVED',
          profileId: createdProfile.id,
        },
      });

      return createdProfile;
    });
  } catch (error) {
    console.error('Failed to approve job application:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        `Database error during approval: ${error.code}. Please try again or contact support.`
      );
    } else if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while approving the application.');
  }

  // Check if newProfile was successfully created before returning
  if (!newProfile) {
      throw new Error("Failed to create profile during transaction.");
  }

  // 4. Revalidate the path to update the UI
  revalidatePath('/admin/job-applications');

  // 5. (Optional) Trigger an email notification
  // await sendApprovalEmail(newProfile.email, newProfile.name);

  return {
    message: `Job application approved successfully for ${newProfile.email}. Profile created.`,
    profileId: newProfile.id, // Return the actual ID
  };
};

// Removed placeholders for safe-action and email
