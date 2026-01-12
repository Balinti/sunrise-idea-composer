'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Free',
    price: 0,
    ideas: 5,
    features: [
      '5 ideas',
      'Basic categorization',
      'Tag support',
      'Email support',
    ],
    priceId: null,
  },
  {
    name: 'Pro',
    price: 9,
    ideas: 100,
    features: [
      '100 ideas',
      'Advanced categorization',
      'Priority support',
      'Export to PDF',
      'Collaboration (coming soon)',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    popular: true,
  },
  {
    name: 'Unlimited',
    price: 29,
    ideas: -1,
    features: [
      'Unlimited ideas',
      'All Pro features',
      'API access',
      'Custom integrations',
      'Dedicated support',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID,
  },
]

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubscribe(planName: string, priceId: string | null | undefined) {
    if (!priceId) {
      router.push('/dashboard')
      return
    }

    setLoading(planName)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planName: planName.toLowerCase() }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error === 'Unauthorized') {
        router.push('/')
      }
    } finally {
      setLoading(null)
    }
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
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Choose the plan that fits your creative needs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? 'border-amber-500 bg-white shadow-xl shadow-amber-500/10 dark:bg-zinc-900'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="ml-2 text-zinc-600 dark:text-zinc-400">/month</span>
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <svg
                      className="mr-3 h-5 w-5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name, plan.priceId)}
                disabled={loading === plan.name}
                className={`w-full rounded-xl px-4 py-3 font-medium transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl'
                    : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                } disabled:opacity-50`}
              >
                {loading === plan.name ? 'Loading...' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-zinc-500">
          All plans include a 14-day money-back guarantee. Cancel anytime.
        </div>
      </main>
    </div>
  )
}
