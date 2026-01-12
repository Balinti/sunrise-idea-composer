import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400">
            <span className="mr-2">☀️</span>
            Capture your ideas at the break of dawn
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Where Great Ideas
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Come to Life
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Sunrise Idea Composer helps you capture, organize, and develop your ideas
            before they fade away. Start your creative journey today.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 font-medium text-white shadow-lg shadow-amber-500/25 transition hover:shadow-xl hover:shadow-amber-500/30"
            >
              Start Composing
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 px-8 font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              View Pricing
            </Link>
          </div>
        </div>

        <div className="mt-32 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Capture Instantly
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Quickly jot down ideas as they come to you. Never lose a brilliant thought again.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Organize with Tags
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Categorize and tag your ideas for easy retrieval and connection.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Develop & Execute
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Transform raw ideas into actionable plans and bring them to reality.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Sunrise Idea Composer. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
