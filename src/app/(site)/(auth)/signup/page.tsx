import SignUp from "@/components/Auth/SignUp/SignUp";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign Up | Ready Set, Always ready for you.",
};

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign Up Page" />
      <SignUp />
    </>
  );
};

export default SignupPage;
