'use client'
import { useContextMode } from '@/context/ContextMode'
import WaitingRow from '@/components/ui/WaitingRow'
import EmptyState from '@/components/ui/EmptyState'
import AddWaitingForm from '@/components/ui/AddWaitingForm'
import { isOverdue } from '@/lib/utils'
import type { WaitingOnItem } from '@/types'

interface WaitingDisplayProps {
  items: WaitingOnItem[]
}

export default function WaitingDisplay({ items }: WaitingDisplayProps) {
  const { mode } = useContextMode()
  const filtered = mode === 'all' ? items : items.filter(i => i.context === mode)

  const pending = filtered.filter(i => i.status === 'pending')
  const received = filtered.filter(i => i.status === 'received')
  const done = filtered.filter(i => i.status === 'done')
  const overdue = pending.filter(i => i.due_by && isOverdue(i.due_by)).length

  return (
    <>
      <div className="flex gap-4 text-sm">
        <span className="text-text">{pending.length} pending</span>
        {overdue > 0 && <span className="text-danger">⚠ {overdue} overdue</span>}
        {received.length > 0 && <span className="text-muted">{received.length} received</span>}
        {done.length > 0 && <span className="text-muted">{done.length} done</span>}
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon="⏸" title="Nothing waiting" description={mode === 'all' ? "Add items you're waiting on others to deliver." : `No ${mode} items waiting.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Item</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Waiting For</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Due By</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Category</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody>
                {pending.map(item => <WaitingRow key={item.id} item={item} />)}
                {received.map(item => <WaitingRow key={item.id} item={item} />)}
                {done.map(item => <WaitingRow key={item.id} item={item} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-lg p-4">
        <h2 className="text-sm font-semibold text-text mb-3">+ Add item</h2>
        <AddWaitingForm />
      </div>
    </>
  )
}
