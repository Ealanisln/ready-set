'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MagicLinkAuth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return setMessage({ type: 'error', text: 'Please enter your email address' })
    
    try {
      setLoading(true)
      setMessage(null)
      
      const supabase = await createClient()
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true, // Set to false if you only want existing users to sign in
        },
      })
      
      if (error) throw error
      
      setMessage({ 
        type: 'success', 
        text: 'Check your email for the magic link to log in' 
      })
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred during the sign-in process' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign in with Magic Link</CardTitle>
        <CardDescription>
          Enter your email to receive a magic link for passwordless login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
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
            {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        We'll email you a magic link for a password-free sign in.
      </CardFooter>
    </Card>
  )
}