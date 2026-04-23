import { getItems } from '@/lib/data'
import TaskItem from '@/components/ui/TaskItem'
import PageHeader from '@/components/layout/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

export default async function ArchivePage() {
  const items = await getItems('archive')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="📦 Archive"
        subtitle={`${items.length} archived items`}
      />

      <div className="bg-surface border border-border rounded-lg p-4 text-sm text-muted">
        <p>Items move here automatically when archived. This is your track record — a reminder that you get things done.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState icon="📦" title="Archive is empty" description="Completed and archived items will appear here." />
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-text">Archived Items</h2>
          </div>
          {items.map(item => (
            <TaskItem key={item.id} item={item} showCategory showMove={false} />
          ))}
        </div>
      )}
    </div>
  )
}
