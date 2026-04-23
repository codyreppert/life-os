'use client'
import { cn, getWaitingStatusColor, formatDate, isOverdue } from '@/lib/utils'
import type { WaitingOnItem, WaitingStatus } from '@/types'
import { updateWaitingStatus, deleteWaitingItem, setWaitingItemContext } from '@/lib/actions/waiting'
import { useState } from 'react'

interface WaitingRowProps {
  item: WaitingOnItem
}

const STATUSES: WaitingStatus[] = ['pending', 'received', 'done']

export default function WaitingRow({ item }: WaitingRowProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const overdue = isOverdue(item.due_by)

  async function handleSetContext(context: 'work' | 'personal') {
    setShowContextMenu(false)
    await setWaitingItemContext(item.id, context)
  }

  return (
    <tr className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm text-text">{item.item}</p>
        {item.notes && <p className="text-xs text-muted mt-0.5">{item.notes}</p>}
      </td>
      <td className="px-4 py-3 text-sm text-muted">{item.waiting_for}</td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={cn('px-2 py-0.5 rounded text-xs font-medium border transition-colors', getWaitingStatusColor(item.status))}
          >
            {item.status}
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute left-0 top-7 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-28">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={async () => { setShowMenu(false); await updateWaitingStatus(item.id, s) }}
                    className={cn('w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover', s === item.status ? 'text-accent' : 'text-text')}
                  >
                    {s}
                  </button>
                ))}
                <div className="border-t border-border my-1" />
                <button onClick={async () => { setShowMenu(false); await deleteWaitingItem(item.id) }} className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-surface-hover">Delete</button>
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {item.due_by && (
          <span className={cn('text-xs', overdue && item.status === 'pending' ? 'text-danger' : 'text-muted')}>
            {overdue && item.status === 'pending' ? '⚠ ' : ''}{formatDate(item.due_by)}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {item.category && (
          <span className="text-xs text-muted bg-surface-hover px-1.5 py-0.5 rounded">
            {item.category.replace('_', ' ')}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setShowContextMenu(!showContextMenu)}
            className="text-muted hover:text-text text-sm px-1"
          >
            ···
          </button>
          {showContextMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowContextMenu(false)} />
              <div className="absolute right-0 top-6 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-36">
                {item.context !== 'work' && (
                  <button onClick={() => handleSetContext('work')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                    Move to Work
                  </button>
                )}
                {item.context !== 'personal' && (
                  <button onClick={() => handleSetContext('personal')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                    Move to Personal
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
