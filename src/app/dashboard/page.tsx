'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import IdeaCard from '@/components/IdeaCard'
import IdeaForm from '@/components/IdeaForm'
import Link from 'next/link'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  created_at: string
}

interface Subscription {
  plan: string
  status: string
}

export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const router = useRouter()

  const checkUser = useCallback(async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
      return
    }
    setUser(user)

    // Fetch ideas
    const res = await fetch('/api/ideas')
    if (res.ok) {
      const data = await res.json()
      setIdeas(data)
    }

    // Fetch subscription
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .single()
    setSubscription(subData)

    setLoading(false)
  }, [router])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  async function handleSubmit(idea: { title: string; description: string; category: string; tags: string[] }) {
    setError('')
    const res = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    })
    if (res.ok) {
      const newIdea = await res.json()
      setIdeas([newIdea, ...ideas])
      setShowForm(false)
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create idea')
    }
  }

  function handleDelete(id: string) {
    setIdeas(ideas.filter((i) => i.id !== id))
  }

  async function handleSignOut() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const plan = subscription?.plan || 'free'
  const limits: Record<string, number> = { free: 5, pro: 100, unlimited: -1 }
  const limit = limits[plan] ?? 5
  const remaining = limit === -1 ? 'Unlimited' : `${limit - ideas.length} remaining`

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">Sunrise Ideas</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Your Ideas</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {ideas.length} idea{ideas.length !== 1 ? 's' : ''} • {remaining}
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            {plan === 'free' && (
              <Link
                href="/pricing"
                className="rounded-lg border border-amber-500 px-4 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                Upgrade
              </Link>
            )}
            <button
              onClick={() => setShowForm(true)}
              disabled={limit !== -1 && ideas.length >= limit}
              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/25 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              + New Idea
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
            {error.includes('limit') && (
              <Link href="/pricing" className="ml-2 underline">
                Upgrade now
              </Link>
            )}
          </div>
        )}

        {showForm && (
          <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">Compose New Idea</h2>
            <IdeaForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {ideas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">No ideas yet</h3>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              Start capturing your brilliant ideas today!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600"
            >
              Create your first idea
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
