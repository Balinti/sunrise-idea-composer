import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Null client for when Supabase is not configured
function createNullClient(): SupabaseClient {
  const nullAuth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
  return {
    auth: nullAuth,
    from: () => ({
      select: () => ({ data: null, error: new Error('Supabase not configured'), single: () => ({ data: null, error: new Error('Supabase not configured') }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
      delete: () => ({ eq: () => ({ eq: () => ({ error: new Error('Supabase not configured') }) }) }),
    }),
  } as unknown as SupabaseClient
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null client if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return createNullClient()
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
