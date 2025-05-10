// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { CookieOptions } from '@supabase/ssr'

// For App Router usage - this uses next/headers which only works in the App Router
export async function createClient() {
  // Dynamically import cookies from next/headers only when this function is called
  // This prevents the import from being evaluated during build time for Pages Router
  const { cookies } = await import('next/headers')
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies()
          return cookieStore.getAll()
        },
        async setAll(cookiesToSet) {
          const cookieStore = await cookies()
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

// For admin operations that require elevated privileges - App Router only
export async function createAdminClient() {
  // Dynamically import cookies from next/headers only when this function is called
  const { cookies } = await import('next/headers')
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies()
          return cookieStore.getAll()
        },
        async setAll(cookiesToSet) {
          const cookieStore = await cookies()
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

// For Pages Router API routes
export function createServerSupabaseClient(context: { req: NextApiRequest; res: NextApiResponse }) {
  const { req, res } = context
  const cookiesObj = parseCookies({ req })

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(cookiesObj).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie({ res }, name, value, options as CookieOptions)
          })
        },
      },
    }
  )
}