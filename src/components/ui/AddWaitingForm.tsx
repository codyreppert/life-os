'use client'
import { useState } from 'react'
import { addWaitingItem } from '@/lib/actions/waiting'

export default function AddWaitingForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await addWaitingItem(formData)
    e.currentTarget.reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <input
        name="item"
        type="text"
        placeholder="What are you waiting on?"
        required
        className="flex-1 min-w-48 bg-surface-hover border border-border rounded px-3 py-1.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent"
      />
      <input
        name="waiting_for"
        type="text"
        placeholder="Waiting for whom?"
        required
        className="flex-1 min-w-40 bg-surface-hover border border-border rounded px-3 py-1.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-1.5 text-sm text-accent border border-accent/30 rounded hover:bg-accent/10 transition-colors disabled:opacity-40"
      >
        {loading ? '...' : 'Add'}
      </button>
    </form>
  )
}
