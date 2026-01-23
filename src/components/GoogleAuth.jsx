'use client'

import { useEffect, useState, useRef } from 'react'

// Hardcoded Supabase configuration - DO NOT use env vars
const SUPABASE_URL = 'https://api.srv936332.hstgr.cloud'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
const APP_SLUG = 'sunrise-idea-composer'

export default function GoogleAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState(null)
  const hasTrackedLogin = useRef(false)

  // Track user login - upsert to user_tracking table
  async function trackUserLogin(client, userEmail, userId) {
    if (hasTrackedLogin.current) return
    hasTrackedLogin.current = true

    try {
      // Try to get existing record
      const { data: existing } = await client
        .from('user_tracking')
        .select('login_cnt')
        .eq('user_id', userId)
        .eq('app', APP_SLUG)
        .single()

      if (existing) {
        // Update existing record - increment login count
        await client
          .from('user_tracking')
          .update({
            login_cnt: existing.login_cnt + 1,
            last_login_ts: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('app', APP_SLUG)
      } else {
        // Insert new record
        await client.from('user_tracking').insert({
          user_id: userId,
          user_email: userEmail,
          app: APP_SLUG,
          login_cnt: 1,
          last_login_ts: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.error('Error tracking user login:', err)
    }
  }

  useEffect(() => {
    // Load Supabase client from CDN
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
    script.async = true
    script.onload = () => {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      setSupabase(client)

      // Check current session
      client.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Listen for auth state changes
      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)

        // Track login on SIGNED_IN event
        if (event === 'SIGNED_IN' && session?.user) {
          trackUserLogin(client, session.user.email, session.user.id)
        }

        // Reset tracking flag on sign out
        if (event === 'SIGNED_OUT') {
          hasTrackedLogin.current = false
        }
      })

      return () => subscription.unsubscribe()
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script if component unmounts before load
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!supabase) return
    setLoading(true)

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    if (!supabase) return
    setLoading(true)

    await supabase.auth.signOut()
    setLoading(false)
  }

  // Loading state while Supabase initializes
  if (loading && !supabase) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
    )
  }

  // User is logged in - show email and sign out button
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</span>
        <button
          onClick={signOut}
          disabled={loading}
          className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        >
          Sign Out
        </button>
      </div>
    )
  }

  // User is not logged in - show Google Sign In button
  return (
    <button
      onClick={signInWithGoogle}
      disabled={loading || !supabase}
      className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm ring-1 ring-zinc-200 transition hover:bg-zinc-50 disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-700"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in with Google
    </button>
  )
}
