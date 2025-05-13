'use client';

import React, { useState } from 'react';
import { clearSupabaseCookies, retryAuth } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthErrorRecoveryProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function AuthErrorRecovery({ onSuccess, onError }: AuthErrorRecoveryProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retrySuccess, setRetrySuccess] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const router = useRouter();

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryError(null);
    
    try {
      // Clear cookies to remove any problematic state
      clearSupabaseCookies();
      
      // Attempt to retry auth
      const result = await retryAuth();
      
      if (result.success) {
        setRetrySuccess(true);
        if (onSuccess) onSuccess();
        
        // Redirect to admin dashboard on success
        router.push('/admin');
      } else {
        setRetryError('Authentication retry failed. Please try signing in again.');
        if (onError) onError(new Error('Auth retry failed'));
      }
    } catch (error) {
      console.error('Error during auth recovery:', error);
      setRetryError('An unexpected error occurred. Please try signing in again.');
      if (onError && error instanceof Error) onError(error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleSignIn = () => {
    // Clear cookies first
    clearSupabaseCookies();
    
    // Go to sign-in page
    router.push('/sign-in');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
        Authentication Issue Detected
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        We detected an issue with your session. This might be due to cookie problems or an expired session.
      </p>
      
      {retryError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {retryError}
        </div>
      )}
      
      {retrySuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Authentication recovered successfully! Redirecting...
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={handleRetry}
          disabled={isRetrying || retrySuccess}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isRetrying ? 'Trying to recover...' : 'Try to recover session'}
        </button>
        
        <button
          onClick={handleSignIn}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Sign in again
        </button>
      </div>
    </div>
  );
} 