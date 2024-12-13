"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { sendRegistrationNotification } from "@/lib/notifications"

const userTypeIcons = {
  vendor: Store,
  client: Users,
  driver: Truck,
  helpdesk: HeadsetIcon,
};

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);

  const onSubmit = async (data: FormDataUnion) => {
    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred during registration");
      }

            // Send notification email
            await sendRegistrationNotification(data);

      toast.success("Successfully registered");
      router.push("/signin");
    } catch (err) {
      console.error("SignUp: Registration error:", err);
      toast.error(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
    setStep(2);
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
            className="h-24 flex flex-col items-center justify-center"
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="text-sm capitalize">{type}</span>
          </Button>
        );
      })}
    </div>
  );

  const renderForm = () => {
    switch (userType) {
      case "vendor":
        return <VendorForm onSubmit={(data: VendorFormData) => onSubmit({ ...data, userType: "vendor" })} />;
      case "client":
        return <ClientForm onSubmit={(data: ClientFormData) => onSubmit({ ...data, userType: "client" })} />;
      case "driver":
        return <DriverForm onSubmit={(data: DriverFormData) => onSubmit({ ...data, userType: "driver" })} />;
      case "helpdesk":
        return <HelpDeskForm onSubmit={(data: HelpdeskFormData) => onSubmit({ ...data, userType: "helpdesk" })} />;
      default:
        return null;
    }
  };

  return (
    <section className="bg-[#F4F7FF] py-4 dark:bg-dark lg:py-8">
      <div className="container">
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <Link href="/" className="mx-auto inline-block max-w-[160px] mb-6">
                <Image
                  src="/images/logo/logo-white.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="dark:hidden"
                />
                <Image
                  src="/images/logo/logo-dark.png"
                  alt="logo"
                  width={140}
                  height={30}
                  className="hidden dark:block"
                />
              </Link>
              <CardTitle>User Registration</CardTitle>
              <CardDescription>
                {step === 1 ? "Please select your user type to begin." : `Sign up as ${userType}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 ? renderUserTypeSelection() : renderForm()}
              {step === 2 && (
                <Button variant="outline" onClick={() => setStep(1)} className="mt-4">
                  Back to user type selection
                </Button>
              )}
              <p className="text-sm text-gray-500 mt-6 text-center">
                By creating an account you agree to our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </p>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SignUp;