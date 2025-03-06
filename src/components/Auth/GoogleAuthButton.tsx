'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { KeyRound } from "lucide-react";
import Loader from "@/components/Common/Loader";

interface GoogleAuthButtonProps {
  className?: string;
}

const GoogleAuthButton = ({ className = '' }: GoogleAuthButtonProps) => {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error signing in with Google:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleGoogleSignIn}
      className={`w-full rounded-md border border-gray-300 bg-white px-5 py-3 text-base text-dark flex items-center justify-center gap-2 transition duration-300 ease-in-out hover:bg-gray-100 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-dark-2/80 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      <KeyRound size={20} />
      <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
      {isLoading && <Loader />}
    </button>
  )
}

export default GoogleAuthButton