"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import VendorForm from "./ui/VendorForm";
import ClientForm from "./ui/ClientForm";
import DriverForm from "./ui/DriverForm";
import UserTypeIcon from "./ui/UserTypeIcon";
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
import HelpDeskForm from "./ui/HelpDeskForm";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userType, setUserType] = useState<UserType | null>(null);

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
    await onSubmit({
      ...data,
      userType: "driver",
    } as FormDataUnion);
  };

  const onSubmitHelpDesk = async (data: HelpdeskFormData) => {
    await onSubmit({
      ...data,
      userType: "helpdesk",
    } as FormDataUnion);
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
              <div className="mx-auto max-w-md p-4 sm:p-6 lg:p-8">
                {!userType ? (
                  <div>
                    <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
                      Choose Account Type
                    </h2>
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {userTypes.map((type) => (
                        <UserTypeIcon
                          key={type}
                          type={type}
                          isSelected={false}
                          onClick={() => setUserType(type)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">
                      {userType.charAt(0).toUpperCase() + userType.slice(1)}{" "}
                      Registration
                    </h2>
                    <p className="mb-4 text-sm text-gray-600">
                      {getBottomText(userType)}
                    </p>
                    {userType === "vendor" && (
                      <VendorForm onSubmit={onSubmitVendor} />
                    )}
                    {userType === "client" && (
                      <ClientForm onSubmit={onSubmitClient} />
                    )}
                    {userType === "driver" && (
                      <DriverForm onSubmit={onSubmitDriver} />
                    )}
                    {userType === "helpdesk" && (
                      <HelpDeskForm onSubmit={onSubmitHelpDesk} />
                    )}
                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setUserType(null)}
                        className="rounded bg-gray-200 px-4 py-2"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                <Link
                  href="/signin"
                  className="pl-2 text-primary hover:underline"
                >
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
