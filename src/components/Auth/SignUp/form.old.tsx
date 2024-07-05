"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "@/components/Common/Loader";
import { Store, Truck, User } from "lucide-react";
import CirclePattern from "./ui/CirclePattern";
import CirclePatternSecond from "./ui/CirclePatternSecond";

import VendorForm from "./ui/VendorForm";
import ClientForm from "./ui/ClientForm";
import DriverForm from "./ui/DriverForm";


const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userType, setUserType] = useState<UserType | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(
      userType === "vendor"
        ? vendorSchema
        : userType === "client"
          ? clientSchema
          : userType === "driver"
            ? driverSchema
            : z.object({}),
    ),
  });

  const selectedUserType = watch("userType");

  const getBottomText = (type: UserType) => {
    switch (type) {
      case "vendor":
        return "If you need us to deliver for you to your client";
      case "client":
        return "If you want to order from our vendors";
      case "driver":
        return "If you want to deliver orders for our vendors";
      default:
        return "";
    }
  };

  const renderForm = () => {
    const commonFields = (
      <>
        <input
          {...register("name")}
          placeholder="Name"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
        {errors.name && (
          <p className="mb-4 text-red-500">{errors.name.message as string}</p>
        )}

        <input
          {...register("phoneNumber")}
          placeholder="Phone Number"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
        {errors.phoneNumber && (
          <p className="mb-4 text-red-500">
            {errors.phoneNumber.message as string}
          </p>
        )}

        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
        {errors.email && (
          <p className="mb-4 text-red-500">{errors.email.message as string}</p>
        )}

        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
        {errors.password && (
          <p className="mb-4 text-red-500">
            {errors.password.message as string}
          </p>
        )}
      </>
    );

    switch (userType) {
      case "vendor":
        return (
          <>
            {commonFields}
            <input
              {...register("company")}
              placeholder="Company Name"
              className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
            />
            {errors.company && (
              <p className="mb-4 text-red-500">
                {errors.company.message as string}
              </p>
            )}
            {/* Add other vendor-specific fields */}
          </>
        );
      case "client":
        return (
          <>
            {commonFields}
            {/* Add client-specific fields if any */}
          </>
        );
      case "driver":
        return (
          <>
            {commonFields}
            <input
              {...register("licenseNumber")}
              placeholder="License Number"
              className="mb-4 w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
            />
            {errors.licenseNumber && (
              <p className="mb-4 text-red-500">
                {errors.licenseNumber.message as string}
              </p>
            )}
            {/* Add other driver-specific fields */}
          </>
        );
      default:
        return null;
    }
  };

  interface UserTypeIconProps {
    type: UserType;
    isSelected: boolean;
    onClick: () => void;
  }

  const UserTypeIcon: React.FC<UserTypeIconProps> = ({ type, onClick }) => {
    const IconComponent = {
      vendor: Store,
      client: User,
      driver: Truck,
    }[type];

    return (
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-yellow-400 bg-yellow-100 p-4 px-6 transition-colors duration-200 dark:bg-gray-600`}
        onClick={onClick}
      >
        <div className="flex items-center justify-center">
          <IconComponent
            size={40}
            className="text-gray-600 dark:text-gray-300"
          />
        </div>
        <span className="mt-2 font-semibold text-gray-600 dark:text-gray-100">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
    );
  };
  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      toast.success("Successfully registered");
      setLoading(false);
      router.push("/signin");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#F4F7FF] py-4 dark:bg-dark lg:py-8">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp shadow-form relative mx-auto max-w-[525px] overflow-hidden rounded-xl bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"
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
                      {(["vendor", "client", "driver"] as const).map((type) => (
                        <div key={type} className="flex flex-col items-center">
                          <UserTypeIcon
                            type={type}
                            isSelected={false}
                            onClick={() => {
                              setUserType(type);
                              reset();
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="mb-4 text-xl font-semibold">
                      {userType.charAt(0).toUpperCase() + userType.slice(1)}{" "}
                      Registration
                    </h2>
                    <p className="mb-4 text-sm text-gray-600">
                      {getBottomText(userType)}
                    </p>
                    {renderForm()}
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setUserType(null);
                          reset();
                        }}
                        className="rounded bg-gray-200 px-4 py-2"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white"
                        disabled={loading}
                      >
                        {loading ? "Registering..." : "Register"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              {/* <MagicLink /> */}

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
