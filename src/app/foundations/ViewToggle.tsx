'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'

export type FoundationView = 'all' | 'spiritual' | 'marriage' | 'health' | 'community' | 'lifestyle'

const VIEW_LABELS: Record<FoundationView, string> = {
  all: 'All',
  spiritual: 'Spiritual',
  marriage: 'Marriage',
  health: 'Health',
  community: 'Community',
  lifestyle: 'Lifestyle',
}

interface ViewToggleProps {
  currentView: FoundationView
}

export default function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [optimisticView, setOptimisticView] = useState<FoundationView | null>(null)

  const activeView = optimisticView ?? currentView

  function handleViewChange(newView: FoundationView) {
    setOptimisticView(newView)
    startTransition(() => {
      router.push(`/foundations?view=${newView}`)
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(VIEW_LABELS) as FoundationView[]).map(v => (
        <button
          key={v}
          onClick={() => handleViewChange(v)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === v
              ? 'bg-accent text-accent-foreground'
              : 'bg-surface border border-border text-muted hover:text-text hover:border-accent'
          }`}
        >
          {VIEW_LABELS[v]}
        </button>
      ))}
    </div>
  )
}
