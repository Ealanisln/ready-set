import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '../../../lib/prisma'; // Adjust path if your prisma client is elsewhere
import { approveJobApplication } from './job-applications';
import { UserType } from "@/types/user";
import { ApplicationStatus } from "@prisma/client";

// --- Mock next/cache --- 
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(), // Mock revalidatePath as a simple function
}));

// ... existing code ...

        // Create a pending job application for testing
        const pendingApp = await prisma.jobApplication.create({
            data: {
                firstName: 'Test',
                lastName: 'DriverApp',
                email: 'test.driver.applicant@example.com',
                position: 'Driver for Delivery', // Position leading to DRIVER type
                addressStreet: '123 Test St',
                addressCity: 'Testville',
                addressState: 'TS',
                addressZip: '12345',
                education: 'Some School',
                workExperience: 'Some Experience',
                skills: 'Driving Safely',
                resumeFilePath: 'resume.pdf', // Required field
                status: ApplicationStatus.PENDING, // Start as pending
                // Add any other non-nullable fields from your schema
            },
        });

// ... existing code ...

         const helpdeskApp = await prisma.jobApplication.create({
             data: {
                firstName: 'Test',
                lastName: 'Helper',
                email: 'helpdesk.applicant@example.com',
                position: 'Virtual Assistant - Helpdesk Support', // Position leading to HELPDESK type
                addressStreet: '456 Desk St',
                addressCity: 'Supportville',
                addressState: 'SP',
                addressZip: '67890',
                education: 'Associate Degree',
                workExperience: 'Customer Service',
                skills: 'Typing, Communication',
                resumeFilePath: 'resume_help.pdf',
                status: ApplicationStatus.PENDING,
             },
         });

// ... rest of the file remains unchanged ...