import Signin from "@/components/Auth/SignIn";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import AuthRedirectTracker from "@/components/Auth/AuthRedirectTracker";
import { Suspense } from "react";
import AuthErrorRecovery from "@/components/Auth/SignIn/AuthErrorRecovery";

export const metadata: Metadata = {
  title:
    "Sign In | Ready Set",
};

interface SearchParams {
  error?: string;
  message?: string;
  returnTo?: string;
  cookieError?: string;
}

const SigninPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams | null>
}) => {
  const params = await searchParams;
  
  // Show error recovery if cookie error is detected
  const showErrorRecovery = params?.cookieError === 'true';

  // Extract only the props that Signin component expects
  const signinParams = params ? {
    error: params.error,
    message: params.message,
    returnTo: params.returnTo
  } as any : undefined;

  return (
    <>
      <Breadcrumb pageName="Sign In Page" />
      
      {showErrorRecovery ? (
        <div className="container mx-auto py-8">
          <AuthErrorRecovery />
        </div>
      ) : (
        <Signin searchParams={signinParams} />
      )}
      
      <Suspense fallback={null}>
        <AuthRedirectTracker />
      </Suspense>
    </>
  );
};

export default SigninPage;
