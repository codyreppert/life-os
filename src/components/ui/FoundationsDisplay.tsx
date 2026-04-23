'use client'
import { useContextMode } from '@/context/ContextMode'
import FoundationCard from '@/components/ui/FoundationCard'
import type { FoundationItem, FoundationPillar } from '@/types'

interface FoundationsDisplayProps {
  byPillar: { pillar: FoundationPillar; items: FoundationItem[] }[]
  view: string
}

export default function FoundationsDisplay({ byPillar, view }: FoundationsDisplayProps) {
  const { mode } = useContextMode()

  const filtered = byPillar.map(({ pillar, items }) => ({
    pillar,
    items: mode === 'all' ? items : items.filter(i => i.context === mode),
  })).filter(({ items }) => items.length > 0)

  const shownItems = filtered.flatMap(p => p.items)
  const totalCompleted = shownItems.filter(i => i.completed_this_week).length
  const total = shownItems.length
  const scorePercent = total > 0 ? Math.round((totalCompleted / total) * 100) : 0

  return (
    <>
      <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text font-medium">{totalCompleted} of {total} rhythms honored this week</p>
          <div className="h-1.5 bg-surface-hover rounded-full mt-2 w-48">
            <div
              className={`h-full rounded-full transition-all ${scorePercent === 100 ? 'bg-success' : 'bg-accent'}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-text">{scorePercent}<span className="text-xl text-muted">%</span></span>
        </div>
      </div>

      <div className={view === 'all' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filtered.map(({ pillar, items }) => (
          <FoundationCard key={pillar} pillar={pillar} items={items} />
        ))}
      </div>
    </>
  )
}
