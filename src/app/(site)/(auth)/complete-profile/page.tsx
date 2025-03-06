"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import OAuthVendorForm from "@/components/Auth/SignUp/ui/OAuthVendorForm";
import OAuthClientForm from "@/components/Auth/SignUp/ui/OAuthClientForm";

// Only allowing client and vendor types for OAuth users
const userTypes = ["vendor", "client"] as const;
type UserType = (typeof userTypes)[number];

const userTypeIcons = {
  vendor: Store,
  client: Users,
} as const;

export default function CompleteProfile() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  // Add loading timeout to prevent infinite loading state
  useEffect(() => {
    // If loading state persists for more than 30 seconds, reset it
    let loadingTimeout: NodeJS.Timeout;

    if (loading) {
      loadingTimeout = setTimeout(() => {
        console.log("Loading timeout reached, resetting loading state");
        setLoading(false);
        setError("Operation timed out. Please try again.");
      }, 30000); // 30 second timeout
    }

    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [loading]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error);
          setError("Error authenticating user. Please try signing in again.");
          setLoading(false);
          return;
        }

        if (!data.user) {
          console.log("No user found, redirecting to sign-in");
          router.push("/sign-in");
          return;
        }

        console.log("User found:", data.user.id);
        setUser(data.user);

        // Check if user already has a profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_user_id", data.user.id)
          .single();

        if (profileError) {
          console.log(
            "Profile fetch error or no profile:",
            profileError.message,
          );
        }

        if (profile) {
          console.log("User already has a profile, redirecting to home");
          router.push("/");
          return;
        }

        // Successfully loaded user without profile
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error in fetchUser:", err);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase]);

  const handleUserTypeSelection = (type: UserType) => {
    console.log("User type selected:", type);
    setUserType(type);
    setStep(2);
  };

  const onSubmit = async (formData: any) => {
    console.log("Form submission started:", formData);
    setLoading(true);
    setError(null);

    if (!user) {
      console.error("No user found in state");
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      console.log("Creating profile for user:", user.id);

      // Prepare profile data - using formData correctly
      const profileData = {
        auth_user_id: user.id,
        guid: null, // Required field, but can be null
        name:
          user.user_metadata?.full_name ||
          formData.contact_name ||
          user.user_metadata?.name,
        image: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        type: userType,
        company_name: formData.company || null,
        contact_name:
          formData.contact_name || user.user_metadata?.full_name || null,
        contact_number: formData.phone || null,
        website: formData.website || null,
        street1: formData.street1 || null,
        street2: formData.street2 || null,
        city: formData.city || null,
        state: formData.state || null,
        zip: formData.zip || null,
        location_number: null,
        parking_loading: formData.parking || null,
        counties: Array.isArray(formData.countiesServed)
          ? formData.countiesServed.join(",")
          : null,
        time_needed: Array.isArray(formData.timeNeeded)
          ? formData.timeNeeded.join(",")
          : null,
        frequency: formData.frequency || null,
        provide: Array.isArray(formData.provisions)
          ? formData.provisions.join(",")
          : null,
        head_count: formData.head_count || null,
        catering_brokerage: Array.isArray(formData.cateringBrokerage)
          ? formData.cateringBrokerage.join(",")
          : null,
        status: "pending",
        side_notes: null,
        confirmation_code: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_temporary_password: false,
      };

      console.log("Profile data to insert:", profileData);

      // Debugging: Test database connection before insert
      console.log("Testing database connection...");
      const { data: testData, error: testError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);

      if (testError) {
        console.error("Database connection test failed:", testError);
        throw new Error(`Database connection error: ${testError.message}`);
      }

      console.log("Database connection successful, proceeding with insert");

      // Create the profile in the profiles table
      const { data: insertedData, error: profileError } = await supabase
        .from("profiles")
        .insert(profileData)
        .select();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      console.log("Profile created successfully:", insertedData);
      const userTableData = {
        id: user.id, // Use the same ID as in auth.users
        guid: null,
        name: profileData.name,
        email: user.email,
        image: profileData.image,
        type: userType,
        company_name: formData.company || null,
        contact_name: profileData.contact_name,
        contact_number: profileData.contact_number,
        website: profileData.website,
        street1: profileData.street1,
        street2: profileData.street2,
        city: profileData.city,
        state: profileData.state,
        zip: profileData.zip,
        location_number: profileData.location_number,
        parking_loading: profileData.parking_loading,
        counties: profileData.counties,
        time_needed: profileData.time_needed,
        frequency: profileData.frequency,
        provide: profileData.provide,
        head_count: profileData.head_count,
        status: profileData.status,
        created_at: new Date(),
        updated_at: new Date(),
        isTemporaryPassword: false,
      };

      console.log("Creating user record in public.user table:", userTableData);

      const { data: userTableInsert, error: userTableError } = await supabase
        .from("user")
        .insert(userTableData)
        .select();

      if (userTableError) {
        console.error("Error creating user record:", userTableError);
        // You may want to handle this error, but you can still continue
        // since the profile was created successfully
      }

      if (userTableInsert) {
        console.log("User record created successfully:", userTableInsert);
        
        // Add the redirect logic here, immediately after confirming user record was created
        console.log("All operations successful, redirecting to home page");
        toast.success("Profile completed successfully");
        
        // Short timeout to allow the toast to display before redirecting
        setTimeout(() => {
          setLoading(false);
          router.push("/");
        }, 500);
        
        // Return early to prevent the code below from executing
        return;
      }

      // Also update user's metadata with the role
      console.log("Updating user metadata with role:", userType);
      const { data: updatedUser, error: updateError } =
        await supabase.auth.updateUser({
          data: { role: userType },
        });

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
        // Continue anyway since the profile was created
      } else {
        console.log("User metadata updated successfully:", updatedUser);
      }

      console.log("Profile completion successful, preparing to redirect");
      toast.success("Profile completed successfully");
    } catch (err) {
      console.error("CompleteProfile Error (Full details):", err);

      // More detailed error handling
      let errorMessage = "An unexpected error occurred";

      if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }

      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false); // Make sure to set loading to false
    } finally {
      console.log("Form submission process completed");
      
      // Only set loading to false if we haven't already redirected
      // (This acts as a fallback)
      setLoading(false);
    }
  };

  const renderUserTypeSelection = () => (
    <div className="grid grid-cols-2 gap-4">
      {userTypes.map((type) => {
        const Icon = userTypeIcons[type];
        return (
          <Button
            key={type}
            onClick={() => handleUserTypeSelection(type)}
            variant="outline"
            className="flex h-24 flex-col items-center justify-center"
            disabled={loading}
          >
            <Icon className="mb-2 h-8 w-8" />
            <span className="text-sm capitalize">{type}</span>
          </Button>
        );
      })}
    </div>
  );

  const renderForm = () => {
    console.log("Rendering form for user type:", userType);
    switch (userType) {
      case "vendor":
        interface UserMetadata {
          full_name?: string;
          avatar_url?: string;
          picture?: string;
          name?: string;
        }

        interface VendorFormData {
          contact_name?: string;
          company?: string;
          phone?: string;
          website?: string;
          street1?: string;
          street2?: string;
          city?: string;
          state?: string;
          zip?: string;
          parking?: string;
          countiesServed?: string[];
          timeNeeded?: string[];
          frequency?: string;
          provisions?: string[];
          head_count?: number;
          cateringBrokerage?: string[];
          userType: "vendor";
        }

        interface OAuthVendorFormProps {
          onSubmit: (data: VendorFormData) => Promise<void>;
          isLoading: boolean;
          userData: UserMetadata;
        }

        return (
          <OAuthVendorForm
            onSubmit={(data: VendorFormData) =>
              onSubmit({ ...data, userType: "vendor" })
            }
            isLoading={loading}
            userData={user?.user_metadata || {}}
          />
        );
      case "client":
        interface ClientFormData {
          contact_name?: string;
          company?: string;
          phone?: string;
          website?: string;
          street1?: string;
          street2?: string;
          city?: string;
          state?: string;
          zip?: string;
          userType: "client";
        }

        interface OAuthClientFormProps {
          onSubmit: (data: ClientFormData) => Promise<void>;
          isLoading: boolean;
          userData: {
            full_name?: string;
            avatar_url?: string;
            picture?: string;
            name?: string;
          };
        }

        return (
          <OAuthClientForm
            onSubmit={(data: ClientFormData) =>
              onSubmit({ ...data, userType: "client" })
            }
            isLoading={loading}
            userData={user?.user_metadata || {}}
          />
        );
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Please select your user type to complete your profile.";
      case 2:
        return userType
          ? `Complete your ${userType} profile`
          : "Complete your profile";
      default:
        return "";
    }
  };

  // Show loading state while fetching user data
  if (loading && !error) {
    return (
      <section className="bg-[#F4F7FF] py-4 dark:bg-dark lg:py-8">
        <div className="container">
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-6 inline-block max-w-[160px]">
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="dark:hidden"
                    priority
                  />
                  <Image
                    src="/images/logo/logo-dark.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="hidden dark:block"
                    priority
                  />
                </div>
                <CardTitle>Loading...</CardTitle>
                <CardDescription>
                  Please wait while we prepare your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>

                {/* Add a cancel button that appears after 10 seconds */}
                {loading && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setLoading(false);
                      setError("Operation cancelled. Please try again.");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F4F7FF] py-4 dark:bg-dark lg:py-8">
      <div className="container">
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 inline-block max-w-[160px]">
                <Image
                  src="/images/logo/logo-white.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="dark:hidden"
                  priority
                />
                <Image
                  src="/images/logo/logo-dark.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden dark:block"
                  priority
                />
              </div>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>{getStepTitle()}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === 1 && renderUserTypeSelection()}
              {step === 2 && renderForm()}

              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="mt-4"
                  disabled={loading}
                >
                  Back
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
