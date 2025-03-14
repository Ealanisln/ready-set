'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function OtpAuth() {
  const [email, setEmail] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return setMessage({ type: 'error', text: 'Please enter your email address' })
    
    try {
      setLoading(true)
      setMessage(null)
      
      const supabase = await createClient()
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Set to false if you only want existing users to sign in
        },
      })
      
      if (error) throw error
      
      setOtpSent(true)
      setMessage({ 
        type: 'success', 
        text: 'Check your email for the verification code' 
      })
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while sending the verification code' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otpToken) return setMessage({ type: 'error', text: 'Please enter the verification code' })
    
    try {
      setLoading(true)
      setMessage(null)
      
      const supabase = await createClient()
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpToken,
        type: 'email',
      })
      
      if (error) throw error
      
      // User is now signed in and will be redirected by Supabase's auth helpers
      setMessage({ 
        type: 'success', 
        text: 'Successfully verified. Redirecting...' 
      })

      // Optional: Redirect the user manually if needed
      // window.location.href = '/dashboard';
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to verify the code. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign in with Email OTP</CardTitle>
        <CardDescription>
          {otpSent 
            ? 'Enter the verification code sent to your email' 
            : 'Enter your email to receive a verification code'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!otpSent ? (
          // Step 1: Request OTP
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </Button>
          </form>
        ) : (
          // Step 2: Verify OTP
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                required
              />
            </div>
            
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Sign In'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => setOtpSent(false)}
              disabled={loading}
            >
              Back
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        {otpSent 
          ? "Didn't receive the code? Check your spam folder." 
          : "We'll email you a one-time password to sign in."}
      </CardFooter>
    </Card>
  )
}