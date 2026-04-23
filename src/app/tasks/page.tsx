import { getItems } from '@/lib/data'
import TasksDisplay from '@/components/ui/TasksDisplay'
import PageHeader from '@/components/layout/PageHeader'
import ViewToggle from './ViewToggle'
import WeekView from './WeekView'
import type { Item } from '@/types'

type ViewType = 'today' | 'week' | 'all'

const VIEW_LABELS: Record<ViewType, string> = {
  today: 'Today',
  week: 'This Week',
  all: 'All Tasks',
}

const VIEW_ICONS: Record<ViewType, string> = {
  today: '📅',
  week: '📆',
  all: '📋',
}

interface TasksPageProps {
  searchParams: Promise<{ view?: string }>
}

async function TasksList({ view }: { view: ViewType }) {
  let items: Item[] = []

  if (view === 'today') {
    items = await getItems('today')
  } else if (view === 'week') {
    const weekItems = await getItems('this_week')
    return (
      <>
        <PageHeader
          title={`${VIEW_ICONS[view]} ${VIEW_LABELS[view]}`}
          subtitle=""
        />
        <ViewToggle currentView={view} />
        <WeekView initialItems={weekItems} />
      </>
    )
  } else if (view === 'all') {
    const [inboxItems, todayItems, weekItems] = await Promise.all([
      getItems('inbox'),
      getItems('today'),
      getItems('this_week'),
    ])
    items = [...inboxItems, ...todayItems, ...weekItems]
  }

  return (
    <>
      <PageHeader
        title={`${VIEW_ICONS[view]} ${VIEW_LABELS[view]}`}
        subtitle=""
      />
      <ViewToggle currentView={view} />
      <TasksDisplay items={items} icon={VIEW_ICONS[view]} label={VIEW_LABELS[view]} />
    </>
  )
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const { view = 'today' } = await searchParams
  const normalizedView = (view === 'today' || view === 'week' || view === 'all' ? view : 'today') as ViewType

  return (
    <div className="mx-auto px-4 py-6 max-w-screen-xl">
      <div className="min-h-[60vh] space-y-6">
        <TasksList view={normalizedView} />
      </div>
    </div>
  )
}
