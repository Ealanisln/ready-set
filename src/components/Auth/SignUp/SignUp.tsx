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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserType,
  FormDataUnion,
  VendorFormData,
  ClientFormData,
} from "./FormSchemas";
import JoinTeam from "./JoinTeam";

const userTypeIcons = {
  vendor: Store,
  client: Users,
} as const;

const userTypes = ["vendor", "client"] as const;

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
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
        throw new Error(errorData.error || "An error occurred during registration");
      }

      const userData = await response.json();
      console.log("Full registration response:", userData);

      toast.success("Successfully registered");
      router.push("/signin");
    } catch (err) {
      console.error("SignUp: Registration error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeSelection = (type: UserType) => {
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {userTypes.map((type) => {
        const Icon = userTypeIcons[type];
        return (
          <button
            key={type}
            onClick={() => handleUserTypeSelection(type)}
            className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:border-primary hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            disabled={loading}
            type="button"
          >
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4 transition-colors duration-300 group-hover:bg-primary/20">
                <Icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-lg font-medium capitalize text-gray-900 dark:text-gray-100">
                {type}
              </span>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {type === "vendor"
                  ? "Sell your products and services"
                  : "Browse and purchase products"}
              </p>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        );
      })}
    </div>
  );

  const renderForm = () => {
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4">
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl border-0 shadow-xl">
            <CardHeader className="space-y-6 text-center">
              <Link href="/" className="mx-auto inline-block">
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
              <div>
                <CardTitle className="text-3xl font-bold">
                  {step === 1 ? "Welcome!" : `Sign up as ${userType}`}
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                  {step === 1
                    ? "Choose how you want to use our platform"
                    : "Complete your registration"}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === 1 ? renderUserTypeSelection() : renderForm()}

              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full"
                  disabled={loading}
                >
                  Back
                </Button>
              )}

              <div className="space-y-4 pt-6">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  By creating an account you agree to our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </p>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/signin"
                    className="text-primary hover:text-primary/80"
                  >
                    Sign in to your account
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <JoinTeam />
      </div>
    </section>
  );
};

export default SignUp;