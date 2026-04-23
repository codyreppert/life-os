'use client'

import { useRouter } from 'next/navigation'

type ViewType = 'today' | 'week' | 'all'

const VIEW_LABELS: Record<ViewType, string> = {
  today: 'Today',
  week: 'This Week',
  all: 'All Tasks',
}

interface ViewToggleProps {
  currentView: ViewType
}

export default function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter()

  function handleViewChange(newView: ViewType) {
    const url = new URL(window.location.href)
    url.searchParams.set('view', newView)
    window.history.pushState({}, '', url.toString())
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {(Object.keys(VIEW_LABELS) as ViewType[]).map(v => (
        <button
          key={v}
          onClick={() => handleViewChange(v)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentView === v
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
