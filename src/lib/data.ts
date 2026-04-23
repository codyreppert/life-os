import { createClient, isSupabaseConfigured } from './supabase/server'
import { seedData } from '@/data/seed'
import type { Item, ItemList, Project, ProjectTask, FoundationItem, WaitingOnItem } from '@/types'

export { isSupabaseConfigured }

export async function getItems(list: ItemList): Promise<Item[]> {
  const supabase = await createClient()
  if (!supabase) {
    return seedData.items
      .filter(i => i.list === list)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999) || a.created_at.localeCompare(b.created_at))
  }
  const { data } = await supabase
    .from('items')
    .select('*')
    .eq('list', list)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: true })
  return (data as Item[]) || []
}

export async function getProjects(type?: string): Promise<Project[]> {
  const supabase = await createClient()
  if (!supabase) {
    return type
      ? seedData.projects.filter(p => p.type === type)
      : seedData.projects
  }
  let query = supabase.from('projects').select('*').order('position')
  if (type) query = query.eq('type', type)
  const { data } = await query
  return (data as Project[]) || []
}

export async function getProjectTasks(projectId?: string): Promise<ProjectTask[]> {
  const supabase = await createClient()
  if (!supabase) {
    return projectId
      ? seedData.projectTasks.filter(t => t.project_id === projectId)
      : seedData.projectTasks
  }
  let query = supabase.from('project_tasks').select('*').order('position')
  if (projectId) query = query.eq('project_id', projectId)
  const { data } = await query
  return (data as ProjectTask[]) || []
}

export async function getFoundationItems(pillar?: string): Promise<FoundationItem[]> {
  const supabase = await createClient()
  if (!supabase) {
    return pillar
      ? seedData.foundationItems.filter(f => f.pillar === pillar)
      : seedData.foundationItems
  }
  let query = supabase.from('foundation_items').select('*').order('pillar').order('position')
  if (pillar) query = query.eq('pillar', pillar)
  const { data } = await query
  return (data as FoundationItem[]) || []
}

export async function getWaitingOn(category?: string): Promise<WaitingOnItem[]> {
  const supabase = await createClient()
  if (!supabase) {
    return category
      ? seedData.waitingOn.filter(w => w.category === category)
      : seedData.waitingOn
  }
  let query = supabase.from('waiting_on').select('*').order('created_at')
  if (category) query = query.eq('category', category)
  const { data } = await query
  return (data as WaitingOnItem[]) || []
}

export async function getDashboardStats() {
  const [todayItems, activeProjects, waitingItems, foundationItems] = await Promise.all([
    getItems('today'),
    getProjects('active'),
    getWaitingOn(),
    getFoundationItems(),
  ])

  const foundationsCompleted = foundationItems.filter(f => f.completed_this_week).length
  const totalFoundations = foundationItems.length
  const overdueWaiting = waitingItems.filter(w => w.status === 'pending' && w.due_by && new Date(w.due_by) < new Date()).length

  return {
    todayItems: todayItems.sort((a, b) => a.priority - b.priority),
    activeProjects,
    waitingCount: waitingItems.filter(w => w.status === 'pending').length,
    overdueWaiting,
    foundationsCompleted,
    totalFoundations,
  }
}
