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
import DriverForm from "./ui/DriverForm";
import HelpDeskForm from "./ui/HelpDeskForm";
import { Store, Users, Truck, HeadsetIcon } from "lucide-react";
import {
  UserType,
  FormDataUnion,
  VendorFormData,
  ClientFormData,
  DriverFormData,
  HelpdeskFormData,
  userTypes,
} from "./FormSchemas";
import { sendRegistrationNotification } from "@/lib/notifications";
import DriverSignupUploads from "@/components/Uploader/driver-signup-uploads";
import { Alert, AlertDescription } from "@/components/ui/alert";

const userTypeIcons = {
  vendor: Store,
  client: Users,
  driver: Truck,
  helpdesk: HeadsetIcon,
} as const;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormDataUnion) => {
    console.log("Form submission started:", data); // Debug log
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
          errorData.error || "An error occurred during registration",
        );
      }

      const userData = await response.json();
      console.log("Full registration response:", userData);
      if (!userData.userId) {
        throw new Error("No user ID received from registration");
      }

      setUserId(userData.userId);
      // Send notification email
      await sendRegistrationNotification(data);

      if (data.userType === "driver") {
        console.log("Setting step to 3 for driver uploads"); // Debug log
        setStep(3);
        toast.success(
          "Registration successful. Please upload required documents.",
        );
      } else {
        toast.success("Successfully registered");
        router.push("/signin");
      }
    } catch (err) {
      console.error("SignUp: Registration error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeSelection = (type: UserType) => {
    console.log("User type selected:", type); // Debug log
    setUserType(type);
    setStep(2);
  };

  const handleUploadComplete = () => {
    console.log("Upload complete, redirecting to signin"); // Debug log
    toast.success("Documents uploaded successfully");
    router.push("/signin");
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const renderUserTypeSelection = () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
    console.log("Rendering form for user type:", userType); // Debug log
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
      case "driver":
        return (
          <DriverForm
            onSubmit={(data: DriverFormData) =>
              onSubmit({ ...data, userType: "driver" })
            }
            isLoading={loading}
          />
        );
      case "helpdesk":
        return (
          <HelpDeskForm
            onSubmit={(data: HelpdeskFormData) =>
              onSubmit({ ...data, userType: "helpdesk" })
            }
            isLoading={loading}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    console.log("Rendering content for step:", step); // Debug log
    switch (step) {
      case 1:
        return renderUserTypeSelection();
      case 2:
        return renderForm();
      case 3:
        console.log("Attempting to render driver uploads, userId:", userId); // Debug log
        return userId ? (
          <DriverSignupUploads
            userId={userId}
            onUploadComplete={handleUploadComplete}
          />
        ) : (
          <Alert variant="destructive">
            <AlertDescription>
              Error: User ID not found. Please try registering again.
            </AlertDescription>
          </Alert>
        );
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
      case 3:
        return "Upload Required Documents";
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

              {step > 1 && step !== 3 && (
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
                  <Link href="/signin" className="text-primary hover:underline">
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
