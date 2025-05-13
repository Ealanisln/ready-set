// src/components/Auth/SignUp/SignUp.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VendorForm from "./ui/VendorForm";
import ClientForm from "./ui/ClientForm";
import { Store, Users, Car, Headphones } from "lucide-react";
import {
  UserType,
  FormDataUnion,
  VendorFormData,
  ClientFormData,
} from "./FormSchemas";
import { sendRegistrationNotification } from "@/lib/notifications";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GoogleAuthButton from "@/components/Auth/GoogleAuthButton";

// User types
const userTypes = ["vendor", "client"] as const;
type StandardUserType = typeof userTypes[number];

// Career types
const careerTypes = ["driver", "helpdesk"] as const;
type CareerType = typeof careerTypes[number];

// Combined type for all user types
type ExtendedUserType = StandardUserType | CareerType;

const userTypeIcons = {
  vendor: Store,
  client: Users,
  driver: Car,
  helpdesk: Headphones,
} as const;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<ExtendedUserType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormDataUnion) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "An error occurred during registration"
        );
      }

      const userData = await response.json();

      // Send notification email
      await sendRegistrationNotification(data);

      toast.success("Successfully registered");
      router.push("/sign-in");
    } catch (err) {
      console.error("SignUp: Registration error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeSelection = (type: ExtendedUserType) => {
    setUserType(type);
    
    // Redirect to application form for driver and helpdesk roles
    if (type === "driver" || type === "helpdesk") {
      const role = type === "driver" ? "Driver for Catering Deliveries" : "Virtual Assistant";
      router.push(`/apply?role=${encodeURIComponent(role)}`);
      return;
    }
    
    // Otherwise, continue with normal signup flow
    setStep(2);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const renderUserTypeSelection = () => (
    <div className="space-y-8">
      {/* User Accounts Section */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-3">Create an account</h3>
        <div className="grid grid-cols-2 gap-4">
          {userTypes.map((type) => {
            const Icon = userTypeIcons[type];
            
            return (
              <Button
                key={type}
                onClick={() => handleUserTypeSelection(type)}
                variant="outline"
                className="flex h-20 flex-col items-center justify-center transition-all hover:border-primary hover:text-primary"
                disabled={loading}
              >
                <div className="flex items-center justify-center h-8 w-8 mb-2">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm capitalize">{type}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Career Opportunities Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-base font-medium text-gray-800 mb-3">Join our team</h3>
        <div className="grid grid-cols-2 gap-4">
          {careerTypes.map((type) => {
            const Icon = userTypeIcons[type];
            const roleTitle = type === "driver" ? "Delivery Driver" : "Helpdesk";
            
            return (
              <Button
                key={type}
                onClick={() => handleUserTypeSelection(type)}
                variant="outline"
                className="flex h-20 flex-col items-center justify-center border-yellow-300 bg-yellow-50 transition-all hover:bg-yellow-100"
                disabled={loading}
              >
                <div className="flex items-center justify-center h-8 w-8 mb-2">
                  <Icon className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">{roleTitle}</span>
                <span className="text-[10px] text-yellow-600 mt-1">Apply Now</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Add Google sign-up to vendor and client forms
  const renderForm = () => {
    switch (userType) {
      case "vendor":
        return (
          <>
            {/* Google Sign-Up for vendors at the top */}
            <div className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h3 className="text-base font-medium text-gray-800 mb-3">Quick sign up</h3>
              <GoogleAuthButton userType="vendor" mode="signup" />
              <p className="text-xs text-center text-gray-500 mt-3">
                By signing up with Google as a vendor, you'll be asked to complete your vendor profile after authentication.
              </p>
            </div>
            
            {/* Divider */}
            <div className="relative flex justify-center text-xs uppercase my-6">
              <span className="bg-white dark:bg-dark-2 px-2 text-gray-500">Or complete the form</span>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-300 dark:bg-dark-3"></div>
            </div>
            
            <div className="mb-6">
              <VendorForm
                onSubmit={(data: VendorFormData) =>
                  onSubmit({ ...data, userType: "vendor" })
                }
                isLoading={loading}
              />
            </div>
          </>
        );
      case "client":
        return (
          <>
            {/* Google Sign-Up for clients at the top */}
            <div className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h3 className="text-base font-medium text-gray-800 mb-3">Quick sign up</h3>
              <GoogleAuthButton userType="client" mode="signup" />
              <p className="text-xs text-center text-gray-500 mt-3">
                By signing up with Google as a client, you'll be asked to complete your client profile after authentication.
              </p>
            </div>
            
            {/* Divider */}
            <div className="relative flex justify-center text-xs uppercase my-6">
              <span className="bg-white dark:bg-dark-2 px-2 text-gray-500">Or complete the form</span>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-300 dark:bg-dark-3"></div>
            </div>
            
            <div className="mb-6">
              <ClientForm
                onSubmit={(data: ClientFormData) =>
                  onSubmit({ ...data, userType: "client" })
                }
                isLoading={loading}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return renderUserTypeSelection();
      case 2:
        return renderForm();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Get started with Ready Set";
      case 2:
        return userType ? `Sign up as ${userType}` : "Complete registration";
      default:
        return "";
    }
  };

  return (
    <section className="bg-[#F4F7FF] py-4 dark:bg-dark lg:py-8">
      <div className="container">
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl shadow-sm">
            <CardHeader className="text-center">
              <Link
                href="/"
                className="mx-auto mb-6 inline-block max-w-[160px]"
              >
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
              </Link>
              <CardTitle className="text-2xl font-bold">User Registration</CardTitle>
              <CardDescription className="text-base mt-1">{getStepTitle()}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderContent()}

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
            
            <CardFooter className="flex flex-col space-y-4 border-t border-gray-100 pt-4">
              <p className="text-center text-sm text-gray-500">
                By creating an account you agree to our{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </p>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SignUp;