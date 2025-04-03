// src/app/actions/register.ts

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaDB";
import { headers } from "next/headers";

// Helper function for redirects
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
  const userType = formData.get("userType")?.toString();
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!email || !password || !name || !userType) {
    return encodedRedirect(
      "error",
      "/auth/signup",
      "All required fields must be provided",
    );
  }

  // Extract all possible user data from your schema
  const userData = {
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
    counties: formData.get("counties")?.toString() || null,
    time_needed: formData.get("time_needed")?.toString() || null,
    catering_brokerage: formData.get("catering_brokerage")?.toString() || null,
    frequency: formData.get("frequency")?.toString() || null,
    provide: formData.get("provide")?.toString() || null,
    head_count: formData.get("head_count")?.toString() || null,
    side_notes: formData.get("side_notes")?.toString() || null,
    confirmation_code: formData.get("confirmation_code")?.toString() || null,
    image: formData.get("image")?.toString() || null,
  };

  // Filter out null values to avoid unnecessary database writes
  const filteredUserData = Object.fromEntries(
    Object.entries(userData).filter(([_, value]) => value !== null),
  );

  try {
    // Create Supabase client
    const supabase = await createClient();

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          name,
          user_type: userType,
        },
      },
    });

    if (authError) {
      console.error(authError.code + " " + authError.message);
      return encodedRedirect("error", "/auth/signup", authError.message);
    }

    // Get the user ID from Supabase Auth
    const userId = authData.user?.id;

    if (!userId) {
      return encodedRedirect(
        "error",
        "/auth/signup",
        "User ID not returned from Supabase Auth",
      );
    }

    // 2. Create user record in public.user table
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
        type: userType as any, // Cast to enum type
        status: "pending", // Default from your enum
        isTemporaryPassword: false, // Default value
        created_at: new Date(),
        updated_at: new Date(),
        ...filteredUserData,
      },
    });

    // 3. Create profile record in auth.profiles table
    await prisma.profiles.create({
      data: {
        auth_user_id: userId,
        guid: userData.guid,
        name,
        image: userData.image,
        type: userType as any, // Cast to enum type
        company_name: userData.company_name,
        contact_name: userData.contact_name,
        contact_number: userData.contact_number,
        website: userData.website,
        street1: userData.street1,
        street2: userData.street2,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
        location_number: userData.location_number,
        parking_loading: userData.parking_loading,
        counties: userData.counties,
        time_needed: userData.time_needed,
        catering_brokerage: userData.catering_brokerage,
        frequency: userData.frequency,
        provide: userData.provide,
        head_count: userData.head_count,
        status: "pending",
        side_notes: userData.side_notes,
        confirmation_code: userData.confirmation_code,
        created_at: new Date(),
        updated_at: new Date(),
        is_temporary_password: false,
      },
    });

    // Handle email confirmation flow
    if (authData.session) {
      // Email confirmation is disabled, user is logged in
      return { success: true, user, session: authData.session };
    } else {
      // Email confirmation is enabled
      return encodedRedirect(
        "success",
        "/auth/signup",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return encodedRedirect("error", "/auth/signup", (error as Error).message);
  }
}

// For users signing up from the admin panel
export async function adminCreateUser(userData: {
  email: string;
  password: string;
  name: string;
  userType: string;
  // Add other fields as needed based on your schema
  [key: string]: any;
}) {
  try {
    const supabase = await createClient();

    // 1. Create user in Supabase Auth with admin privileges
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          name: userData.name,
          user_type: userData.userType,
        },
        app_metadata: {
          role: userData.userType,
        },
      });

    if (authError) throw authError;

    const userId = authData.user.id;

    // 2. Create user record in public.user table
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: userData.email,
        name: userData.name,
        type: userData.userType as any, // Cast to enum type
        status: userData.status || "active", // Admin-created users can be active by default
        created_at: new Date(),
        updated_at: new Date(),
        // Add other fields from userData
        ...Object.fromEntries(
          Object.entries(userData).filter(
            ([key]) => !["email", "password", "name", "userType"].includes(key),
          ),
        ),
      },
    });

    // 3. Create profile record in auth.profiles table
    await prisma.profiles.create({
      data: {
        auth_user_id: userId,
        name: userData.name,
        type: userData.userType as any, // Cast to enum type
        status: userData.status || "active",
        created_at: new Date(),
        updated_at: new Date(),
        is_temporary_password: userData.isTemporaryPassword || false,
        // Add other fields from userData, similar to above
        ...Object.fromEntries(
          Object.entries(userData).filter(
            ([key]) =>
              ![
                "email",
                "password",
                "name",
                "userType",
                "status",
                "isTemporaryPassword",
              ].includes(key),
          ),
        ),
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Admin user creation error:", error);
    return { success: false, error: (error as Error).message };
  }
}
