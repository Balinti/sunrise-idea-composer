import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Null client for when Supabase is not configured
function createNullClient(): SupabaseClient {
  const nullAuth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
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

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null client if Supabase is not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return createNullClient()
  }

  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
