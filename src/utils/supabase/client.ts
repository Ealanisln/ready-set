// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Make this an async function
export async function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'supabase.auth.token',
        storage: {
          getItem: (key) => {
            if (typeof window !== 'undefined') {
              return window.localStorage.getItem(key)
            }
            return null
          },
          setItem: (key, value) => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(key, value)
            }
          },
          removeItem: (key) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(key)
            }
          }
        }
      },
      global: {
        headers: {
          'x-client-info': 'supabase-js-web',
        },
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(30000)
          })
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 1,
        },
      },
      db: {
        schema: 'public'
      }
    }
  )
}