// src/components/Auth/ChangePassword/index.tsx

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useLoadingStore } from '@/store/loadingStore';
import { useFormValidation } from '@/hooks/useFormValidation';

const ChangePassword = () => {
  const [data, setData] = useState({
    newPassword: "",
    ReNewPassword: "",
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isLoading, setLoading } = useLoadingStore();
  const { errors, validateForm } = useFormValidation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      validateForm(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (data.newPassword === "" || data.ReNewPassword === "") {
      toast.error("Please enter and confirm your new password.");
      setLoading(false);
      return;
    }

    if (data.newPassword !== data.ReNewPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!validateForm(data.newPassword)) {
      errors.forEach(error => toast.error(error));
      setLoading(false);
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
        await signOut({ redirect: false });
        router.push("/signin");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || status === "loading") {
    return <Loader />;
  }

  if (!session?.user?.isTemporaryPassword) {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    return null;
  }

  return (
    <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-20">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">
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
                  {errors.length > 0 && (
                    <div className="mt-2 text-left text-sm text-red-500">
                      {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
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
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || errors.length > 0}
                    className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-50"
                  >
                    Change Password {isLoading && <Loader />}
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