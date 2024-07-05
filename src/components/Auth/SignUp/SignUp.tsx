"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import VendorForm from "./ui/VendorForm";
import ClientForm from "./ui/ClientForm";
import DriverForm from "./ui/DriverForm";
import UserTypeIcon from "./ui/UserTypeIcon";
import { UserType, FormData } from "./FormSchemas";
import { getBottomText } from "./utils";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userType, setUserType] = useState<UserType | null>(null);

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
        {/* ... (layout structure) */}
        {!userType ? (
          <div>
            <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
              Choose Account Type
            </h2>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {(["vendor", "client", "driver"] as const).map((type) => (
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
            {userType === "vendor" && <VendorForm onSubmit={onSubmit} />}
            {userType === "client" && <ClientForm onSubmit={onSubmit} />}
            {userType === "driver" && <DriverForm onSubmit={onSubmit} />}
            <div className="flex justify-between">
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
        {/* ... (remaining layout and links) */}
      </div>
    </section>
  );
};

export default SignUp;
