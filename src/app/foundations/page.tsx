import { getFoundationItems } from '@/lib/data'
import FoundationsDisplay from '@/components/ui/FoundationsDisplay'
import PageHeader from '@/components/layout/PageHeader'
import ViewToggle from './ViewToggle'
import type { FoundationView } from './ViewToggle'
import type { FoundationPillar } from '@/types'

const PILLARS: FoundationPillar[] = ['spiritual', 'marriage', 'health', 'community', 'lifestyle']
const VALID_VIEWS = ['all', ...PILLARS] as const

interface FoundationsPageProps {
  searchParams: Promise<{ view?: string }>
}

async function FoundationsContent({ view }: { view: FoundationView }) {
  const allItems = await getFoundationItems()

  const pillarsToShow = view === 'all' ? PILLARS : [view as FoundationPillar]
  const byPillar = pillarsToShow.map(pillar => ({
    pillar,
    items: allItems.filter(i => i.pillar === pillar),
  }))

  return (
    <>
      <PageHeader
        title="💎 Foundations"
        subtitle="What keeps everything else sustainable"
      />
      <ViewToggle currentView={view} />
      <FoundationsDisplay byPillar={byPillar} view={view} />
    </>
  )
}

export default async function FoundationsPage({ searchParams }: FoundationsPageProps) {
  const { view = 'all' } = await searchParams
  const normalizedView = (VALID_VIEWS.includes(view as FoundationView) ? view : 'all') as FoundationView

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="min-h-[60vh] space-y-6">
        <FoundationsContent view={normalizedView} />
      </div>
    </div>
  )
}
