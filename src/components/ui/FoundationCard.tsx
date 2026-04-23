'use client'
import { useState } from 'react'
import { cn, getPillarIcon, getPillarLabel } from '@/lib/utils'
import type { FoundationItem, FoundationPillar } from '@/types'
import { toggleFoundationItem, setFoundationItemContext } from '@/lib/actions/foundations'

interface FoundationCardProps {
  pillar: FoundationPillar
  items: FoundationItem[]
}

export default function FoundationCard({ pillar, items }: FoundationCardProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const completed = items.filter(i => i.completed_this_week).length
  const total = items.length
  const allDone = completed === total && total > 0
  const scorePercent = total > 0 ? Math.round((completed / total) * 100) : 0

  async function handleSetContext(id: string, context: 'work' | 'personal') {
    setOpenMenuId(null)
    await setFoundationItemContext(id, context)
  }

  return (
    <div className={cn(
      'bg-surface border rounded-lg p-4 flex flex-col gap-3',
      allDone ? 'border-success/40' : 'border-border'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getPillarIcon(pillar)}</span>
          <h3 className="text-sm font-semibold text-text">{getPillarLabel(pillar)}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{completed}/{total}</span>
          {allDone && <span className="text-xs text-success">✓</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-surface-hover rounded-full">
        <div
          className={cn('h-full rounded-full transition-all', allDone ? 'bg-success' : 'bg-accent')}
          style={{ width: `${scorePercent}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-2.5 group">
            <input
              type="checkbox"
              checked={item.completed_this_week}
              onChange={async () => await toggleFoundationItem(item.id, !item.completed_this_week)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-border accent-success shrink-0 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <span className={cn(
                'text-xs leading-relaxed block',
                item.completed_this_week ? 'line-through text-muted' : 'text-text/80'
              )}>
                {item.content}
              </span>
              {item.rhythm_type && (
                <span className="text-[10px] text-muted/60">{item.rhythm_type}</span>
              )}
            </div>
            <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                className="text-muted hover:text-text text-sm px-1"
              >
                ···
              </button>
              {openMenuId === item.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute right-0 top-6 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-36">
                    {item.context !== 'work' && (
                      <button onClick={() => handleSetContext(item.id, 'work')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                        Move to Work
                      </button>
                    )}
                    {item.context !== 'personal' && (
                      <button onClick={() => handleSetContext(item.id, 'personal')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                        Move to Personal
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
