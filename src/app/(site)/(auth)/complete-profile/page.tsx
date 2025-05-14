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
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await createClient();
      setSupabase(client);
    };
    
    initSupabase();
  }, []);

  // Simple global loading timeout
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

  // Updated fetchUser to prevent false redirects for manual users
  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) return; // Wait until supabase is initialized
      
      try {
        console.log("Fetching user data...");
        
        // Simple user fetch with no custom timeouts
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

        const userId = data.user.id;
        console.log("User found:", userId);
        console.log("User metadata:", data.user.user_metadata);
        console.log("App metadata:", data.user.app_metadata);
        setUser(data.user);

        // Check if userType exists in metadata and use it
        if (data.user.user_metadata?.userType) {
          console.log("User type found in metadata:", data.user.user_metadata.userType);
          setUserType(data.user.user_metadata.userType as UserType);
        }

        // IMPORTANT: First check public.user table directly with a raw query
        // This ensures we're definitely checking the right table
        try {
          const { data: rawUserData, error: rawUserError } = await supabase.rpc(
            'get_user_by_id',
            { user_id: userId }
          );

          console.log("Raw user query result:", rawUserData, rawUserError);

          if (!rawUserError && rawUserData) {
            console.log("User found in public.user table via RPC, redirecting to home");
            router.push("/");
            return;
          }
        } catch (rpcError) {
          console.error("RPC query error:", rpcError);
          // Fall back to standard query if RPC fails
        }

        // Standard check if the above RPC isn't available
        const { data: publicUserData, error: publicUserError } = await supabase
          .from("user")
          .select("*")
          .eq("id", userId)
          .limit(1);

        console.log("Public user table search result:", publicUserData, publicUserError);

        if (!publicUserError && publicUserData && publicUserData.length > 0) {
          console.log("User found in public.user table, redirecting to home");
          router.push("/");
          return;
        }

        // Then check if user has a profile in the 'profiles' table
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_user_id", userId)
          .limit(1);

        console.log("Profiles table search result:", profilesData, profilesError);

        if (!profilesError && profilesData && profilesData.length > 0) {
          console.log("User already has a profile, redirecting to home");
          router.push("/");
          return;
        }

        // Special debug: Log user data from Supabase to see what's going on
        console.log("User not found in public.user or profiles tables!");
        console.log("This user needs to complete their profile");

        // Allow profile completion
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error in fetchUser:", err);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };

    if (supabase) {
      fetchUser();
    }
  }, [router, supabase]);

  const handleUserTypeSelection = (type: UserType) => {
    console.log("User type selected:", type);
    setUserType(type);
    setStep(2);
  };

  const onSubmit = async (formData: any) => {
    if (!supabase) {
      setError("Supabase client not initialized");
      return;
    }
    
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
  
      // Prepare profile data
      const profileData = {
        auth_user_id: user.id,
        guid: null,
        name: user.user_metadata?.full_name || formData.contact_name || user.user_metadata?.name,
        image: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        type: userType,
        company_name: formData.company || null,
        contact_name: formData.contact_name || user.user_metadata?.full_name || null,
        contact_number: formData.phone || null,
        website: formData.website || null,
        street1: formData.street1 || null,
        street2: formData.street2 || null,
        city: formData.city || null,
        state: formData.state || null,
        zip: formData.zip || null,
        location_number: null,
        parking_loading: formData.parking || null,
        counties: Array.isArray(formData.countiesServed) ? formData.countiesServed.join(",") : null,
        time_needed: Array.isArray(formData.timeNeeded) ? formData.timeNeeded.join(",") : null,
        frequency: formData.frequency || null,
        provide: Array.isArray(formData.provisions) ? formData.provisions.join(",") : null,
        head_count: formData.head_count || null,
        catering_brokerage: Array.isArray(formData.cateringBrokerage) ? formData.cateringBrokerage.join(",") : null,
        status: "pending",
        side_notes: null,
        confirmation_code: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_temporary_password: false,
      };
  
      console.log("Profile data to insert:", profileData);
  
      // Prepare user table data
      const userTableData = {
        id: user.id,
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
  
      // Try direct Supabase insertion first for better error handling
      console.log("Inserting profile data directly via Supabase...");
      
      try {
        // Insert into profiles table first
        const { data: profileInsertData, error: profileInsertError } = await supabase
          .from('profiles')
          .insert([profileData]);
          
        if (profileInsertError) {
          console.error("Error inserting profile:", profileInsertError);
          throw new Error(`Profile insertion failed: ${profileInsertError.message}`);
        }
        
        console.log("Profile inserted successfully:", profileInsertData);
        
        // Insert into user table (public schema, not 'users')
        const { data: userInsertData, error: userInsertError } = await supabase
          .from('user')
          .insert([userTableData]);
          
        if (userInsertError) {
          console.error("Error inserting user:", userInsertError);
          throw new Error(`User insertion failed: ${userInsertError.message}`);
        }
        
        console.log("User inserted successfully:", userInsertData);
        
        // Success with direct Supabase insertion
        toast.success("Profile completed successfully");
        setTimeout(() => {
          router.push("/");
        }, 500);
        return;
      } catch (supabaseError) {
        // If direct Supabase insertion fails, fall back to API route
        console.warn("Direct Supabase insertion failed, falling back to API route:", supabaseError);
      }

      // Fall back to the API route for profile creation
      console.log("Falling back to API route for profile creation...");
      
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileData,
          userTableData
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Profile creation failed');
      }
  
      // Success - show toast and redirect
      console.log("Profile created successfully via API");
      toast.success("Profile completed successfully");
      
      // Short timeout to allow the toast to display before redirecting
      setTimeout(() => {
        router.push("/");
      }, 500);
      
      return;
      
    } catch (err) {
      console.error("CompleteProfile Error:", err);
      
      let errorMessage = "An unexpected error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log("Form submission process completed");
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
            onSubmit={(data) =>
              onSubmit({ ...data, userType: "vendor" } as any)
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
            onSubmit={(data) =>
              onSubmit({ ...data, userType: "client" } as any)
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

  // Debug function to manually redirect user
  const debugRedirectHome = () => {
    console.log("Manual redirect triggered by user");
    router.push("/");
  };

  // Debug function to manually clear state and retry
  const debugRetry = () => {
    console.log("Manual retry triggered by user");
    setLoading(false);
    setError(null);
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

                {/* Cancel button */}
                <Button
                  variant="outline"
                  className="mt-4 mb-2"
                  onClick={() => {
                    setLoading(false);
                    setError("Operation cancelled. Please try again.");
                  }}
                >
                  Cancel
                </Button>
                
                {/* Debug buttons */}
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={debugRedirectHome}
                  >
                    Go to Home
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={debugRetry}
                  >
                    Retry
                  </Button>
                </div>
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