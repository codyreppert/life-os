'use client'
import { useState } from 'react'
import { cn, getStatusColor, truncate } from '@/lib/utils'
import type { Project, ProjectTask } from '@/types'
import { toggleProjectTask, addProjectTask, promoteProject, setProjectContext } from '@/lib/actions/projects'

interface ProjectCardProps {
  project: Project
  tasks: ProjectTask[]
  showPromote?: boolean
  promoteLabel?: string
  promoteType?: 'active' | 'horizon'
}

export default function ProjectCard({ project, tasks, showPromote, promoteLabel, promoteType }: ProjectCardProps) {
  const [addingTask, setAddingTask] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  const completedTasks = tasks.filter(t => t.completed).length
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  async function handleAddTask() {
    if (!newTask.trim()) return
    await addProjectTask(project.id, newTask)
    setNewTask('')
    setAddingTask(false)
  }

  async function handlePromote() {
    if (!promoteType) return
    await promoteProject(project.id, promoteType)
  }

  async function handleSetContext(context: 'work' | 'personal') {
    setShowMenu(false)
    await setProjectContext(project.id, context)
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-border/80 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text">{project.name}</h3>
          {project.purpose && (
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{truncate(project.purpose, 90)}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', getStatusColor(project.status))}>
            {project.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-muted hover:text-text text-sm px-1"
            >
              ···
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-6 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-36">
                  {project.context !== 'work' && (
                    <button onClick={() => handleSetContext('work')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                      Move to Work
                    </button>
                  )}
                  {project.context !== 'personal' && (
                    <button onClick={() => handleSetContext('personal')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                      Move to Personal
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Energy + Urgency */}
      {(project.energy_level || project.urgency_level) && (
        <div className="flex items-center gap-4">
          {project.energy_level && (
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] text-muted uppercase tracking-wide w-12">Energy</span>
              <div className="flex-1 h-1 bg-surface-hover rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${project.energy_level * 10}%` }} />
              </div>
              <span className="text-[10px] text-muted w-4">{project.energy_level}</span>
            </div>
          )}
          {project.urgency_level && (
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] text-muted uppercase tracking-wide w-12">Urgency</span>
              <div className="flex-1 h-1 bg-surface-hover rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: `${project.urgency_level * 10}%` }} />
              </div>
              <span className="text-[10px] text-muted w-4">{project.urgency_level}</span>
            </div>
          )}
        </div>
      )}

      {/* Revenue potential */}
      {project.revenue_potential && (
        <p className="text-[11px] text-success/80 bg-success/5 border border-success/10 rounded px-2 py-1">
          💰 {project.revenue_potential}
        </p>
      )}

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted uppercase tracking-wide">Next Actions</span>
            <span className="text-[10px] text-muted">{completedTasks}/{tasks.length}</span>
          </div>
          {tasks.length > 0 && (
            <div className="h-0.5 bg-surface-hover rounded-full mb-2">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {tasks.slice(0, 4).map(task => (
            <label key={task.id} className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={async () => await toggleProjectTask(task.id, !task.completed)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-border accent-accent shrink-0"
              />
              <span className={cn('text-xs leading-relaxed', task.completed ? 'line-through text-muted' : 'text-text/80')}>
                {task.content}
              </span>
            </label>
          ))}
          {tasks.length > 4 && (
            <p className="text-[11px] text-muted pl-5">+{tasks.length - 4} more</p>
          )}
        </div>
      )}

      {/* Add task */}
      {addingTask ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAddTask()
              if (e.key === 'Escape') { setNewTask(''); setAddingTask(false) }
            }}
            autoFocus
            placeholder="Add next action..."
            className="flex-1 bg-surface-hover border border-border rounded px-2 py-1 text-xs text-text placeholder:text-muted focus:outline-none focus:border-accent"
          />
          <button onClick={handleAddTask} className="text-xs text-accent">Add</button>
          <button onClick={() => setAddingTask(false)} className="text-xs text-muted">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setAddingTask(true)}
          className="text-left text-xs text-muted hover:text-text transition-colors"
        >
          + Add action
        </button>
      )}

      {/* Promote button */}
      {showPromote && promoteType && (
        <button
          onClick={handlePromote}
          className="w-full py-1.5 text-xs font-medium text-accent border border-accent/30 rounded hover:bg-accent/10 transition-colors"
        >
          {promoteLabel || `Promote to ${promoteType}`} →
        </button>
      )}

      {/* Why now / timeline */}
      {project.timeline && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted border-t border-border pt-2">
          <span>⏱</span>
          <span>{project.timeline}</span>
          {project.why_now && <span>· {truncate(project.why_now, 60)}</span>}
        </div>
      )}
    </div>
  )
}
