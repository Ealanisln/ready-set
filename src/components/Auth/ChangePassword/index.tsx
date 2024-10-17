"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const ChangePassword = () => {
  const [data, setData] = useState({
    newPassword: "",
    ReNewPassword: "",
  });
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);

    if (data.newPassword === "" || data.ReNewPassword === "") {
      toast.error("Please enter and confirm your new password.");
      setLoader(false);
      return;
    }

    if (data.newPassword !== data.ReNewPassword) {
      toast.error("Passwords do not match.");
      setLoader(false);
      return;
    }

    try {
      const res = await axios.post(`/api/change-password`, {
        email: session?.user?.email,
        password: data.newPassword,
      });

      if (res.status === 200) {
        toast.success("Password changed successfully. Please log in again.");
        setData({ newPassword: "", ReNewPassword: "" });
        
        // Log the user out
        await signOut({ redirect: false });

        // Redirect to login page
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      }

      setLoader(false);
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.error || "An error occurred");
      setLoader(false);
    }
  };

  if (!session || !session.user?.isTemporaryPassword) {
    // Redirect to home if user doesn't need to change password
    router.push("/");
    return null;
  }

  return (
    <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-20">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"
              data-wow-delay=".15s"
            >
              <div className="mb-10 text-center">
                <Link href="/" className="mx-auto inline-block max-w-[160px]">
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="hidden dark:block"
                  />
                </Link>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-[22px]">
                  <input
                    type="password"
                    placeholder="New password"
                    name="newPassword"
                    value={data.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-[22px]">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    name="ReNewPassword"
                    value={data.ReNewPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
                  >
                    Change Password {loader && <Loader />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;