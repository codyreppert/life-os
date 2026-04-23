import { getItems } from '@/lib/data'
import TaskItem from '@/components/ui/TaskItem'
import QuickCapture from '@/components/ui/QuickCapture'
import PageHeader from '@/components/layout/PageHeader'
import type { Item } from '@/types'

const TIER_LABELS: Record<string, string> = {
  this_week: 'This Week',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
}

const TIER_ORDER = ['this_week', 'monthly', 'quarterly', 'yearly']

export default async function AdminPage() {
  const items = await getItems('admin')

  const byTier: Record<string, Item[]> = {}
  for (const item of items) {
    const tier = (item.metadata as Record<string, string>)?.tier || 'this_week'
    if (!byTier[tier]) byTier[tier] = []
    byTier[tier].push(item)
  }

  const totalItems = items.length
  const completedItems = items.filter(i => i.completed).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="📋 Admin"
        subtitle={`${completedItems}/${totalItems} done`}
      />

      {TIER_ORDER.map(tier => {
        const tierItems = byTier[tier] || []
        if (tierItems.length === 0) return null
        const done = tierItems.filter(i => i.completed).length
        return (
          <div key={tier} className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">{TIER_LABELS[tier]}</h2>
              <span className="text-xs text-muted">{done}/{tierItems.length}</span>
            </div>
            <div>
              {tierItems.map(item => (
                <TaskItem key={item.id} item={item} showCategory={false} showMove />
              ))}
            </div>
          </div>
        )
      })}

      {/* Uncategorized */}
      {byTier['other'] && byTier['other'].length > 0 && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-text">Other</h2>
          </div>
          <div>
            {byTier['other'].map(item => (
              <TaskItem key={item.id} item={item} showCategory={false} showMove />
            ))}
          </div>
        </div>
      )}

      {/* Add item */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h2 className="text-sm font-semibold text-text mb-3">+ Add admin task</h2>
        <QuickCapture placeholder="Add an admin task..." list="admin" />
      </div>
    </div>
  )
}
