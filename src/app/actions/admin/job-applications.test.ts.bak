// src/app/actions/admin/job-applications.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '../../../lib/prisma'; // Adjust path if your prisma client is elsewhere
import { approveJobApplication } from './job-applications';
import { UserType, ApplicationStatus } from '@prisma/client';

// --- Mock next/cache --- 
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(), // Mock revalidatePath as a simple function
}));

// --- Mock Supabase Auth for Vitest ---
// Mock the module containing your createClient function
vi.mock('@/utils/supabase/server', () => ({
    createClient: () => ({
        auth: {
            // Mock getUser to simulate an authenticated admin user
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-admin-user-id' } }, // Provide a mock user ID
                error: null,
            }),
        },
        // Mock the database profile fetch based on the mock user ID
        from: (table: string) => ({
            select: (selectString: string) => ({
                eq: (column: string, value: string) => ({
                    single: async () => {
                        // Only mock profile fetch for the specific test admin user
                        if (table === 'profiles' && column === 'id' && value === 'test-admin-user-id') {
                            return { data: { type: UserType.ADMIN }, error: null }; // Simulate admin profile
                        }
                        // Return null/error for other queries to avoid unintended matches
                        return { data: null, error: new Error(`Mock DB error: Table=${table} Col=${column} Val=${value}`) };
                    }
                })
            })
        })
    }),
}));
// --- End Mock ---

describe('approveJobApplication Server Action Integration Tests', () => {
    let pendingApplicationId: string;

    // Seed database before each test
    beforeEach(async () => {
        // Clear relevant tables to ensure a clean state
        // Using transaction for potentially faster cleanup
        await prisma.$transaction([
            prisma.profile.deleteMany(),
            prisma.jobApplication.deleteMany(),
            // Add other related tables if necessary (e.g., fileUploads linked to jobApplications)
        ]);

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
                resumeUrl: 'resume.pdf', // Required field
                status: ApplicationStatus.PENDING, // Start as pending
                // Add any other non-nullable fields from your schema
            },
        });
        pendingApplicationId = pendingApp.id;
    });

    it('should approve a PENDING application and create a DRIVER profile', async () => {
        // Act: Call the server action
        const result = await approveJobApplication(pendingApplicationId);

        // Assert: Check the returned value
        expect(result.message).toContain('approved successfully');
        expect(result.profileId).toBeDefined();

        // Assert: Check the JobApplication status and linked profileId in DB
        const updatedApplication = await prisma.jobApplication.findUnique({
            where: { id: pendingApplicationId },
        });
        expect(updatedApplication?.status).toBe(ApplicationStatus.APPROVED);
        expect(updatedApplication?.profileId).toBe(result.profileId);

        // Assert: Check the newly created Profile in DB
        const newProfile = await prisma.profile.findUnique({
            where: { id: result.profileId },
        });
        expect(newProfile).toBeDefined();
        expect(newProfile?.email).toBe('test.driver.applicant@example.com');
        expect(newProfile?.name).toBe('Test DriverApp');
        expect(newProfile?.type).toBe(UserType.DRIVER); // Verify correct type based on position
        expect(newProfile?.status).toBe('ACTIVE');
        expect(newProfile?.isTemporaryPassword).toBe(true);
    });

    it('should set profile type to HELPDESK for a relevant position', async () => {
         // Arrange: Create a specific application for helpdesk
         await prisma.jobApplication.deleteMany(); // Clear previous app
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
                resumeUrl: 'resume_help.pdf',
                status: ApplicationStatus.PENDING,
             },
         });

         // Act: Call the server action
         const result = await approveJobApplication(helpdeskApp.id);

         // Assert: Check the created profile's type
         const newProfile = await prisma.profile.findUnique({ where: { id: result.profileId } });
         expect(newProfile?.type).toBe(UserType.HELPDESK);
         expect(newProfile?.email).toBe('helpdesk.applicant@example.com');
    });

    // --- TODO: Add more test cases --- 

    // it('should throw an error if the application is already approved', async () => { ... });

    // it('should throw an error if a profile with the same email already exists', async () => { ... });

    // it('should throw an error if the user is not an admin', async () => { 
    //    // Requires adjusting the Supabase mock to return a non-admin user
    // });

    // it('should throw an error for an invalid jobApplicationId', async () => { ... });

}); 