'use client'

import { useState } from 'react'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  created_at: string
}

export default function IdeaCard({
  idea,
  onDelete,
}: {
  idea: Idea
  onDelete: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/ideas?id=${idea.id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete(idea.id)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="group relative rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-start justify-between">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          {idea.category}
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded p-1 text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
        {idea.title}
      </h3>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">{idea.description}</p>
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs text-zinc-400">
        {new Date(idea.created_at).toLocaleDateString()}
      </p>
    </div>
  )
}
