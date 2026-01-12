'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthButton({ user }: { user: { email?: string } | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
    >
      Sign In with Google
    </button>
  )
}
