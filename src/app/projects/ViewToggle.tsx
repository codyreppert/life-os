'use client'

import { useRouter } from 'next/navigation'

type ProjectViewType = 'active' | 'horizon' | 'incubation'

const VIEW_LABELS: Record<ProjectViewType, string> = {
  active: 'Active',
  horizon: 'Horizon',
  incubation: 'Incubation',
}

interface ViewToggleProps {
  currentView: ProjectViewType
}

export default function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter()

  function handleViewChange(newView: ProjectViewType) {
    const url = new URL(window.location.href)
    url.searchParams.set('view', newView)
    window.history.pushState({}, '', url.toString())
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {(Object.keys(VIEW_LABELS) as ProjectViewType[]).map(v => (
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
