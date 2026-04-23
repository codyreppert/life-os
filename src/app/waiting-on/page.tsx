import { getWaitingOn } from '@/lib/data'
import WaitingDisplay from '@/components/ui/WaitingDisplay'
import PageHeader from '@/components/layout/PageHeader'

export default async function WaitingOnPage() {
  const items = await getWaitingOn()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="⏸ Waiting On"
        subtitle="External dependencies in motion"
      />
      <WaitingDisplay items={items} />
    </div>
  )
}
