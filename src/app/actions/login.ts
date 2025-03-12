// src/app/actions/login.ts

'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // Use cookies() to opt out of caching
  await cookies()
  
  // Create and await the Supabase client
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  console.log(`Login attempt for: ${email}`)
  
  // Form validation
  if (!email || !password) {
    console.log('Missing email or password')
    redirect('/sign-in?error=Email+and+password+are+required')
  }
  
  // Try to sign in directly - we'll handle user existence through the signin response
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.log('Login error:', error.message, error.code)
    
    // Check if user exists by attempting to send a password reset
    // This is a workaround to check if the user exists without direct API access
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })
    
    const userExists = !resetError || resetError.message !== "User not found"
    
    if (userExists) {
      console.log('User exists but password is incorrect - likely a migration issue')
    } else {
      console.log('User does not exist')
    }
    
    // Redirect with error
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`)
  }
  
  // Check if the user has a temporary password (using user metadata)
  const isTemporaryPassword = data.user?.user_metadata?.isTemporaryPassword
  
  if (isTemporaryPassword) {
    // Redirect to change password page if using temporary password
    redirect('/change-password')
  }
  
  // Redirect to home page on successful login
  redirect('/')
}

export async function signup(formData: FormData) {
  // Use cookies() to opt out of caching
  await cookies()
  
  // Create and await the Supabase client
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Form validation
  if (!email || !password) {
    redirect('/sign-in?error=Email+and+password+are+required')
  }
  
  // Password strength validation (optional)
  if (password.length < 8) {
    redirect('/sign-in?error=Password+must+be+at+least+8+characters+long')
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`)
  }
  
  // Check if email confirmation is required
  const emailConfirmationRequired = !data.session
  if (emailConfirmationRequired) {
    // Redirect to a confirmation page
    redirect('/signup-confirmation')
  } else {
    // If email confirmation is not required, redirect to home
    redirect('/')
  }
}