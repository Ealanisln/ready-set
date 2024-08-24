"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import VendorForm from "./ui/VendorForm";
import ClientForm from "./ui/ClientForm";
import DriverForm from "./ui/DriverForm";
import HelpDeskForm from "./ui/HelpDeskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserType,
  FormDataUnion,
  VendorFormData,
  ClientFormData,
  DriverFormData,
  HelpdeskFormData,
  userTypes,
} from "./FormSchemas";
import { getBottomText } from "./utils";
import Link from "next/link";
import Image from "next/image";
import CirclePattern from "./ui/CirclePattern";
import CirclePatternSecond from "./ui/CirclePatternSecond";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("vendor");

  const onSubmit = async (data: FormDataUnion) => {
    console.log("SignUp: onSubmit called with data:", data);
    setLoading(true);

    try {
      console.log("SignUp: Sending registration request");
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("SignUp: Registration response received:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "An error occurred during registration");
      }

      const responseData = await response.json();
      console.log("SignUp: Registration successful:", responseData);

      toast.success("Successfully registered");
      setLoading(false);
      router.push("/signin");
    } catch (err) {
      console.error("SignUp: Registration error:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  const onSubmitVendor = async (data: VendorFormData) => {
    await onSubmit({ ...data, userType: "vendor" });
  };

  const onSubmitClient = async (data: ClientFormData) => {
    await onSubmit({ ...data, userType: "client" });
  };

  const onSubmitDriver = async (data: DriverFormData) => {
    await onSubmit({ ...data, userType: "driver" } as FormDataUnion);
  };

  const onSubmitHelpDesk = async (data: HelpdeskFormData) => {
    await onSubmit({ ...data, userType: "helpdesk" } as FormDataUnion);
  };

  return (
    <section className="bg-[#F4F7FF] py-4 dark:bg-dark lg:py-8">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp shadow-form relative mx-auto max-w-[800px] overflow-hidden rounded-xl bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"
              data-wow-delay=".15s"
            >
              <div className="mb-10 text-center">
                <Link href="/" className="mx-auto inline-block max-w-[160px]">
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
              </div>
              <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle>User Registration</CardTitle>
                  <CardDescription>Please select your user type and fill out the appropriate form.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                    <TabsList className="grid w-full grid-cols-4">
                      {userTypes.map((type) => (
                        <TabsTrigger key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="mt-6">
                      <TabsContent value="vendor">
                        <VendorForm onSubmit={onSubmitVendor} />
                      </TabsContent>
                      <TabsContent value="client">
                        <ClientForm onSubmit={onSubmitClient} />
                      </TabsContent>
                      <TabsContent value="driver">
                        <DriverForm onSubmit={onSubmitDriver} />
                      </TabsContent>
                      <TabsContent value="helpdesk">
                        <HelpDeskForm onSubmit={onSubmitHelpDesk} />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
              <p className="text-body-secondary mb-4 py-8 text-base">
                By creating an account you are agree with our{" "}
                <a href="/#" className="text-primary hover:underline">
                  Privacy
                </a>{" "}
                and{" "}
                <a href="/#" className="text-primary hover:underline">
                  Policy
                </a>
              </p>
              <p className="text-body-secondary text-base">
                Already have an account?
                <Link href="/signin" className="pl-2 text-primary hover:underline">
                  Sign In
                </Link>
              </p>
              <div className="relative">
                <span className="absolute right-1 top-1">
                  <CirclePattern />
                </span>
                <span className="absolute bottom-1 left-1">
                  <CirclePatternSecond
                    numCircles={12}
                    offsetX={2.288}
                    offsetY={38.0087}
                    cols={3}
                    width={29}
                    height={40}
                    viewBox="0 0 29 40"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;