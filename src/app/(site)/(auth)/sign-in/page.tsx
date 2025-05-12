import Signin from "@/components/Auth/SignIn";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import AuthRedirectTracker from "@/components/Auth/AuthRedirectTracker";
import { Suspense } from "react";

export const metadata: Metadata = {
  title:
    "Sign In | Ready Set",
};

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In Page" />
      <Signin />
      <Suspense fallback={null}>
        <AuthRedirectTracker />
      </Suspense>
    </>
  );
};

export default SigninPage;
