'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MagicLinkLogin() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const supabase = await createClient()
      
      // Send the magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        throw error
      }
      
      // Success!
      setMessage(`Magic link sent to ${email}. Please check your inbox.`)
      setEmail('')
      
    } catch (err: any) {
      console.error('Magic link error:', err)
      setError(err.message || 'Failed to send magic link')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login with Magic Link</CardTitle>
          <CardDescription>We'll email you a magic link to sign in instantly</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSendMagicLink}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || !!message}
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !!message}
              >
                {isSubmitting ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}