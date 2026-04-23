import { getProjects, getProjectTasks } from '@/lib/data'
import ProjectsDisplay from '@/components/ui/ProjectsDisplay'
import PageHeader from '@/components/layout/PageHeader'
import ViewToggle from './ViewToggle'

type ProjectViewType = 'active' | 'horizon' | 'incubation'

const VIEW_LABELS: Record<ProjectViewType, string> = {
  active: 'Active Projects',
  horizon: 'Horizon Projects',
  incubation: 'Incubation',
}

const VIEW_ICONS: Record<ProjectViewType, string> = {
  active: '🚀',
  horizon: '🌅',
  incubation: '🌱',
}

const VIEW_SUBTITLES: Record<ProjectViewType, string> = {
  active: "What you're building right now",
  horizon: 'On the roadmap, not yet started',
  incubation: 'Ideas and experiments',
}

interface ProjectsPageProps {
  searchParams: Promise<{ view?: string }>
}

async function ProjectsList({ view }: { view: ProjectViewType }) {
  const [projects, tasks] = await Promise.all([
    getProjects(view),
    getProjectTasks(),
  ])

  return (
    <>
      <PageHeader
        title={`${VIEW_ICONS[view]} ${VIEW_LABELS[view]}`}
        subtitle={VIEW_SUBTITLES[view]}
      />
      <ViewToggle currentView={view} />
      <ProjectsDisplay
        projects={projects}
        tasks={tasks}
        icon={VIEW_ICONS[view]}
        label={VIEW_LABELS[view]}
      />
    </>
  )
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { view = 'active' } = await searchParams
  const normalizedView = (
    view === 'active' || view === 'horizon' || view === 'incubation' ? view : 'active'
  ) as ProjectViewType

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="min-h-[60vh] space-y-6">
        <ProjectsList view={normalizedView} />
      </div>
    </div>
  )
}
