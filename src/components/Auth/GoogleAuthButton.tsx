// src/components/Auth/GoogleAuthButton.tsx

'use client'

import { createClient } from '@/utils/supabase/client'
import { getRedirectUrl } from '@/utils/supabase/auth-helpers'
import { useState } from 'react'
import Loader from "@/components/Common/Loader";
import { SupabaseClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

interface GoogleAuthButtonProps {
  className?: string;
}

const GoogleAuthButton = ({ className = '' }: GoogleAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    let supabase: SupabaseClient | null = null;
    let retryCount = 0;
    const maxRetries = 5; // Increased retries

    const attemptSignIn = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Initializing Supabase client..."); // Debug log
        
        supabase = await createClient();
        console.log("Supabase client initialized successfully"); // Debug log
        
        console.log("Starting Google OAuth sign-in..."); // Debug log
        console.log("Redirecting to:", getRedirectUrl()); // Debug log
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: getRedirectUrl(),
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          }
        });
        
        if (error) {
          console.error("OAuth error details:", {
            message: error.message,
            status: error.status,
            name: error.name
          });
          throw error;
        }
        
        console.log("OAuth sign-in response:", data); // Debug log
        return true;
      } catch (error: any) {
        console.error('Attempt failed:', {
          error,
          attempt: retryCount + 1,
          supabaseInitialized: !!supabase,
          timestamp: new Date().toISOString()
        });
        
        // Check for specific error types
        if (error.message?.includes('connect error') || 
            error.message?.includes('upstream connect error') ||
            error.message?.includes('capacity')) {
          if (retryCount < maxRetries) {
            retryCount++;
            const waitTime = Math.min(1000 * Math.pow(2, retryCount), 8000); // Exponential backoff
            console.log(`Retrying... Attempt ${retryCount} of ${maxRetries} after ${waitTime}ms`);
            toast.loading(`Connection attempt ${retryCount} of ${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return false;
          } else {
            setError('Service is experiencing high load. Please try again in a few minutes.');
            toast.error('Service is temporarily unavailable. Please try again later.');
          }
        }
        throw error;
      }
    };

    try {
      let success = false;
      while (!success && retryCount < maxRetries) {
        success = await attemptSignIn();
      }
      
      if (!success) {
        throw new Error('Failed to connect after multiple attempts');
      }
    } catch (error: any) {
      console.error('All sign-in attempts failed:', error);
      setError(
        error.message?.includes('capacity') || error.message?.includes('connect error')
          ? 'Our authentication service is experiencing high load. Please try again in a few minutes.'
          : 'Unable to sign in with Google. Please try again later.'
      );
      toast.error(error.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
        className={`flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-4 p-3.5 text-dark duration-200 ease-in hover:border-gray-5 hover:bg-gray dark:border-dark-3 dark:text-white dark:hover:bg-dark-3 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      >
        <svg
          width="23"
          height="22"
          viewBox="0 0 23 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_709_8846)">
            <path
              d="M22.5001 11.2438C22.5134 10.4876 22.4338 9.73256 22.2629 8.995H11.7246V13.0771H17.9105C17.7933 13.7929 17.5296 14.478 17.1352 15.0914C16.7409 15.7047 16.224 16.2335 15.6158 16.646L15.5942 16.7827L18.9264 19.3124L19.1571 19.335C21.2772 17.4161 22.4997 14.5926 22.4997 11.2438"
              fill="#4285F4"
            />
            <path
              d="M11.7245 22C14.755 22 17.2992 21.0221 19.1577 19.3355L15.6156 16.6464C14.6679 17.2944 13.3958 17.7467 11.7245 17.7467C10.3051 17.7385 8.92433 17.2926 7.77814 16.472C6.63195 15.6515 5.77851 14.4981 5.33892 13.1755L5.20737 13.1865L1.74255 15.8142L1.69727 15.9376C2.63043 17.7602 4.06252 19.2925 5.83341 20.3631C7.60429 21.4337 9.64416 22.0005 11.7249 22"
              fill="#34A853"
            />
            <path
              d="M5.33889 13.1755C5.09338 12.4753 4.96669 11.7404 4.96388 11C4.9684 10.2608 5.09041 9.52685 5.32552 8.8245L5.31927 8.67868L1.81196 6.00867L1.69724 6.06214C0.910039 7.5938 0.5 9.28491 0.5 10.9999C0.5 12.7148 0.910039 14.406 1.69724 15.9376L5.33889 13.1755Z"
              fill="#FBBC05"
            />
            <path
              d="M11.7249 4.25337C13.3333 4.22889 14.8888 4.8159 16.065 5.89121L19.2329 2.86003C17.2011 0.992106 14.5106 -0.0328008 11.7249 3.27798e-05C9.64418 -0.000452376 7.60433 0.566279 5.83345 1.63686C4.06256 2.70743 2.63046 4.23965 1.69727 6.06218L5.32684 8.82455C5.77077 7.50213 6.62703 6.34962 7.77491 5.5295C8.9228 4.70938 10.3044 4.26302 11.7249 4.25337Z"
              fill="#EB4335"
            />
          </g>
          <defs>
            <clipPath id="clip0_709_8846">
              <rect
                width="22"
                height="22"
                fill="white"
                transform="translate(0.5)"
              />
            </clipPath>
          </defs>
        </svg>
        {isLoading ? (
          <>
            <span>Connecting...</span>
            <Loader />
          </>
        ) : (
          <span>Sign in with Google</span>
        )}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
    </>
  )
}

export default GoogleAuthButton