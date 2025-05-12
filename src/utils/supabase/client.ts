// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a singleton instance
let supabaseInstance: SupabaseClient | null = null;

// Make the function synchronous
export const createClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'x-redirect-to': '/sign-in',
        },
      },
    });
  }
  return supabaseInstance;
};