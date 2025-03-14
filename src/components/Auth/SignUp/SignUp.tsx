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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VendorForm from "./ui/VendorForm";
import ClientForm from "./ui/ClientForm";
import { Store, Users } from "lucide-react";
import {
  UserType,
  FormDataUnion,
  VendorFormData,
  ClientFormData,
} from "./FormSchemas";
import { sendRegistrationNotification } from "@/lib/notifications";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GoogleAuthButton from "@/components/Auth/GoogleAuthButton";

// Update user types to only include vendor and client
const userTypes = ["vendor", "client"] as const;

const userTypeIcons = {
  vendor: Store,
  client: Users,
} as const;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormDataUnion) => {
    console.log("Form submission started:", data);
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
      console.log("Full registration response:", userData);

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

  const handleUserTypeSelection = (type: UserType) => {
    console.log("User type selected:", type);
    setUserType(type);
    setStep(2);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
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
        return (
          <VendorForm
            onSubmit={(data: VendorFormData) =>
              onSubmit({ ...data, userType: "vendor" })
            }
            isLoading={loading}
          />
        );
      case "client":
        return (
          <ClientForm
            onSubmit={(data: ClientFormData) =>
              onSubmit({ ...data, userType: "client" })
            }
            isLoading={loading}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-6">
              {renderUserTypeSelection()}
            </div>
            
            {/* Divider */}
            <div className="relative flex justify-center text-xs uppercase my-6">
              <span className="bg-white dark:bg-dark-2 px-2 text-gray-500">Or</span>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-300 dark:bg-dark-3"></div>
            </div>
            
            {/* Google Sign-up Button */}
            <div className="mb-2">
              <GoogleAuthButton />
            </div>
            <p className="text-xs text-center text-gray-500 mt-1">
              By signing up with Google, you'll be asked to complete your profile after authentication.
            </p>
          </>
        );
      case 2:
        return renderForm();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Please select your user type to begin.";
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
          <Card className="w-full max-w-2xl">
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
              <CardTitle>User Registration</CardTitle>
              <CardDescription>{getStepTitle()}</CardDescription>
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

              <div className="mt-6 space-y-4">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SignUp;