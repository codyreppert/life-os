'use client'
import { useContextMode } from '@/context/ContextMode'
import ProjectCard from '@/components/ui/ProjectCard'
import EmptyState from '@/components/ui/EmptyState'
import type { Project, ProjectTask } from '@/types'

interface ProjectsDisplayProps {
  projects: Project[]
  tasks: ProjectTask[]
  icon: string
  label: string
}

export default function ProjectsDisplay({ projects, tasks, icon, label }: ProjectsDisplayProps) {
  const { mode } = useContextMode()
  const filtered = mode === 'all' ? projects : projects.filter(p => p.context === mode)

  function tasksFor(projectId: string) {
    return tasks.filter(t => t.project_id === projectId)
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={icon}
        title={`No ${label.toLowerCase()}`}
        description={mode === 'all' ? 'Nothing here yet.' : `No ${mode} projects here.`}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filtered.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          tasks={tasksFor(project.id)}
        />
      ))}
    </div>
  )
}
