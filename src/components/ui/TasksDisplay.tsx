'use client'
import { useContextMode } from '@/context/ContextMode'
import TaskItem from '@/components/ui/TaskItem'
import EmptyState from '@/components/ui/EmptyState'
import type { Item } from '@/types'

interface TasksDisplayProps {
  items: Item[]
  icon: string
  label: string
}

export default function TasksDisplay({ items, icon, label }: TasksDisplayProps) {
  const { mode } = useContextMode()
  const filtered = mode === 'all' ? items : items.filter(i => i.context === mode)
  const completedCount = filtered.filter(i => i.completed).length

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={icon}
        title={`No ${label.toLowerCase()} tasks`}
        description={mode === 'all' ? "You're all caught up!" : `No ${mode} tasks here.`}
      />
    )
  }

  return (
    <>
      <p className="text-xs text-muted -mt-4">
        {mode !== 'all' && <span className="capitalize">{mode} · </span>}
        {completedCount}/{filtered.length} done
      </p>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text">
            {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
          </h2>
        </div>
        <div>
          {filtered.map(item => (
            <TaskItem key={item.id} item={item} showCategory showMove />
          ))}
        </div>
      </div>
    </>
  )
}
