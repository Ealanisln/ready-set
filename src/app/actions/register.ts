// src/app/actions/register.ts

"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from "@/utils/supabase/server";
import { Prisma } from '@prisma/client';
import { UserStatus, UserType } from '@/types/user';
import { convertToPrismaUserStatus, convertToPrismaUserType, PrismaClientKnownRequestError } from '@/types/prisma-types';
import { prisma } from "@/utils/prismaDB";
import { headers } from "next/headers";

// Helper function for redirects (keep as is)
const encodedRedirect = (
    type: "success" | "error",
    path: string,
    message: string,
) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, message);
    return { redirect: `${path}?${searchParams.toString()}` };
};

export async function registerUser(formData: FormData) {
    // Extract basic auth data
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const name = formData.get("name")?.toString();
    const userType = formData.get("userType")?.toString(); // e.g., 'VENDOR', 'CLIENT'
    const headCountStr = formData.get("head_count")?.toString(); // Get as string first

    const headersList = await headers();
    const origin = headersList.get("origin");

    if (!email || !password || !name || !userType) {
        return encodedRedirect(
            "error",
            "/auth/signup",
            "All required fields must be provided",
        );
    }

    // Map userType string to UserType enum
    let userTypeEnum: UserType;
    switch(userType.toUpperCase()) {
        case 'VENDOR':
            userTypeEnum = UserType.VENDOR;
            break;
        case 'CLIENT':
            userTypeEnum = UserType.CLIENT;
            break;
        case 'DRIVER':
            userTypeEnum = UserType.DRIVER;
            break;
        case 'ADMIN':
            userTypeEnum = UserType.ADMIN;
            break;
        case 'HELPDESK':
            userTypeEnum = UserType.HELPDESK;
            break;
        case 'SUPER_ADMIN':
            userTypeEnum = UserType.SUPER_ADMIN;
            break;
        default:
            return encodedRedirect(
                "error",
                "/auth/signup",
                `Invalid user type provided: ${userType}`,
            );
    }

    // Extract *other* user data
    const otherUserData = {
        guid: formData.get("guid")?.toString() || null,
        company_name: formData.get("company_name")?.toString() || null,
        contact_name: formData.get("contact_name")?.toString() || null,
        contact_number: formData.get("contact_number")?.toString() || null,
        website: formData.get("website")?.toString() || null,
        street1: formData.get("street1")?.toString() || null,
        street2: formData.get("street2")?.toString() || null,
        city: formData.get("city")?.toString() || null,
        state: formData.get("state")?.toString() || null,
        zip: formData.get("zip")?.toString() || null,
        location_number: formData.get("location_number")?.toString() || null,
        parking_loading: formData.get("parking_loading")?.toString() || null,
        counties: formData.get("counties")?.toString() || null, // Consider parsing if JSON/array
        time_needed: formData.get("time_needed")?.toString() || null, // Consider parsing
        catering_brokerage: formData.get("catering_brokerage")?.toString() || null, // Consider parsing
        frequency: formData.get("frequency")?.toString() || null,
        provide: formData.get("provide")?.toString() || null, // Consider parsing
        side_notes: formData.get("side_notes")?.toString() || null,
        confirmation_code: formData.get("confirmation_code")?.toString() || null,
        image: formData.get("image")?.toString() || null,
    };

    // Filter out null values from other data
    const filteredOtherData = Object.fromEntries(
        Object.entries(otherUserData).filter(([_, value]) => value !== null)
    );

    // Parse head_count separately - FIX for Error 1
    let headCountNum: number | undefined = undefined;
    if (headCountStr) {
        const parsed = parseInt(headCountStr, 10);
        if (!isNaN(parsed)) {
            headCountNum = parsed;
        } else {
            console.warn("Could not parse head_count to number:", headCountStr);
            // Decide how to handle: error out, ignore, etc.
            // return encodedRedirect("error", "/auth/signup", `Invalid head count value: ${headCountStr}`);
        }
    }

    try {
        const supabase = await createClient();

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
                data: { name, user_type: userType },
            },
        });

        if (authError) {
            console.error("Supabase Auth Error:", authError.code, authError.message);
            // Provide more specific user feedback if possible
            if (authError.message.includes("User already registered")) {
                 return encodedRedirect("error", "/auth/signup", "An account with this email already exists.");
            }
            return encodedRedirect("error", "/auth/signup", `Auth error: ${authError.message}`);
        }

        const userId = authData.user?.id;
        if (!userId) {
            return encodedRedirect("error", "/auth/signup", "User registration succeeded but no ID was returned.");
        }

        // 2. Create user record in Prisma Profile table
        const user = await prisma.profile.create({
            data: {
                id: userId, // Link to auth.users table
                email,
                name,
                type: convertToPrismaUserType(userTypeEnum) as any, // Convert and cast
                status: convertToPrismaUserStatus(UserStatus.PENDING) as any, // Convert and cast
                isTemporaryPassword: false,
                // Spread other filtered data
                ...filteredOtherData,
                // Explicitly set parsed head_count (will override if present in spread) - FIX for Error 1
                ...(headCountNum !== undefined && { head_count: String(headCountNum) }), // Convert to string
            },
        });

        if (authData.session) {
            return { success: true, user, session: authData.session };
        } else {
            return encodedRedirect(
                "success", "/auth/signup", "Thanks for signing up! Please check your email for a verification link."
            );
        }
    } catch (error) {
        console.error("Registration Process Error:", error);
        let errorMessage = "An unexpected error occurred during registration.";
        // Check for Prisma unique constraint violation (example)
        if (error instanceof Error && (error as any).code === 'P2002') {
             // More specific check possible if you know the constraint name/fields
             errorMessage = "An account with this email or other unique identifier already exists.";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        return encodedRedirect("error", "/auth/signup", errorMessage);
    }
}


// For users signing up from the admin panel
export async function adminCreateUser(userData: {
    email: string;
    password: string;
    name: string;
    userType: string; // Expecting 'VENDOR', 'CLIENT', etc.
    status?: string; // Optional: Expecting 'active', 'pending', etc.
    isTemporaryPassword?: boolean;
    head_count?: string | number; // Allow string or number input
    // Add other fields as needed based on your schema
    [key: string]: any;
}) {
    try {
        // Validate required fields more explicitly
        if (!userData.email || !userData.password || !userData.name || !userData.userType) {
            throw new Error("Missing required fields for admin user creation (email, password, name, userType).");
        }

        const adminUserType = userData.userType;
        
        // Map userType string to UserType enum
        let userTypeEnum: UserType;
        switch(adminUserType.toUpperCase()) {
            case 'VENDOR':
                userTypeEnum = UserType.VENDOR;
                break;
            case 'CLIENT':
                userTypeEnum = UserType.CLIENT;
                break;
            case 'DRIVER':
                userTypeEnum = UserType.DRIVER;
                break;
            case 'ADMIN':
                userTypeEnum = UserType.ADMIN;
                break;
            case 'HELPDESK':
                userTypeEnum = UserType.HELPDESK;
                break;
            case 'SUPER_ADMIN':
                userTypeEnum = UserType.SUPER_ADMIN;
                break;
            default:
                throw new Error(`Invalid user type provided: ${adminUserType}`);
        }

        // --- Validation & Resolution for Status ---
        let resolvedStatus: UserStatus;
        if (userData.status) {
            // Convert potential input string to appropriate enum value
            const statusUpperCase = String(userData.status).toUpperCase();
            if (statusUpperCase === 'ACTIVE') {
                resolvedStatus = UserStatus.ACTIVE;
            } else if (statusUpperCase === 'PENDING') {
                resolvedStatus = UserStatus.PENDING;
            } else if (statusUpperCase === 'DELETED') {
                resolvedStatus = UserStatus.DELETED;
            } else {
                throw new Error(`Invalid status provided: ${userData.status}. Expected one of ACTIVE, PENDING, DELETED`);
            }
        } else {
            resolvedStatus = UserStatus.ACTIVE; // Default to ACTIVE
        }
        // --- End Validation ---

        const supabase = await createClient();

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } =
            await supabase.auth.admin.createUser({
                email: userData.email,
                password: userData.password,
                email_confirm: true,
                user_metadata: { name: userData.name, user_type: userTypeEnum },
            });

        if (authError) throw authError; // Let the catch block handle

        const userId = authData.user.id;

        // FIX for Errors 4 & 5: Prepare profileData by *excluding* specific keys
        const profileSpecificKeys = ['email', 'password', 'name', 'userType', 'status', 'isTemporaryPassword', 'head_count'];
        const otherProfileData = Object.fromEntries(
            Object.entries(userData).filter(([key]) => !profileSpecificKeys.includes(key))
        );

        // Parse head_count - FIX for Error 1 (consistency)
        let headCountNum: number | undefined = undefined;
        if (userData.head_count !== null && userData.head_count !== undefined) {
            const parsed = parseInt(String(userData.head_count), 10); // Convert to string first in case it's already a number
            if (!isNaN(parsed)) {
                headCountNum = parsed;
            } else {
                console.warn("Admin Creation: Could not parse head_count:", userData.head_count);
                // Decide if this is an error or just ignore
                // throw new Error(`Invalid head count value provided: ${userData.head_count}`);
            }
        }

        // 2. Create user record in Prisma Profile table
        const createNewProfile = await prisma.profile.create({
            data: {
                id: userId, // Link to auth.users
                email: userData.email,
                name: userData.name,
                type: convertToPrismaUserType(userTypeEnum) as any, // Convert and cast
                status: convertToPrismaUserStatus(resolvedStatus) as any, // Convert and cast
                isTemporaryPassword: userData.isTemporaryPassword ?? true,
                // Spread the *filtered* other data
                ...otherProfileData,
                // Explicitly set parsed head_count - FIX for Error 1
                ...(headCountNum !== undefined && { head_count: String(headCountNum) }), // Convert to string
            },
        });

        return { success: true, user: createNewProfile };
    } catch (error) {
        console.error("Admin user creation error:", error);
        let errorMessage = "Failed to create user via admin panel.";
         // Check for Prisma unique constraint violation
        if (error instanceof Error && (error as any).code === 'P2002') {
            errorMessage = "An account with this email or other unique identifier already exists.";
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        // Ensure a serializable error is returned if needed by the caller
        return { success: false, error: errorMessage };
    }
}