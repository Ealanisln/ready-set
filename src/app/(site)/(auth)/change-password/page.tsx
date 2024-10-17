// src/app/(site)/(auth)/change-password/page.tsx
import React from "react";
import ChangePassword from "@/components/Auth/ChangePassword";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password | Ready Set",
};

const ChangePasswordPage = () => {
  return (
    <>
      <Breadcrumb pageName="Change Password" />
      <ChangePassword />
    </>
  );
};

export default ChangePasswordPage;