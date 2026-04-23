'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProjectType, ProjectStatus, ItemContext } from '@/types'

export async function addProject(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return
  const name = formData.get('name') as string
  const type = (formData.get('type') as ProjectType) || 'active'
  const purpose = (formData.get('purpose') as string) || null
  const timeline = (formData.get('timeline') as string) || null
  const why_now = (formData.get('why_now') as string) || null
  const revenue_potential = (formData.get('revenue_potential') as string) || null
  if (!name?.trim()) return
  await supabase.from('projects').insert({ name: name.trim(), type, purpose, timeline, why_now, revenue_potential, status: type === 'active' ? 'active' : 'planning' })
  revalidatePath('/projects')
  revalidatePath('/horizon')
  revalidatePath('/incubation')
  revalidatePath('/dashboard')
}

export async function updateProject(id: string, updates: Partial<{ name: string; purpose: string; notes: string; timeline: string; revenue_potential: string; why_now: string; energy_level: number; urgency_level: number }>) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('projects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/projects')
  revalidatePath('/horizon')
  revalidatePath('/incubation')
}

export async function toggleProjectTask(id: string, completed: boolean) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('project_tasks').update({ completed, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/projects')
}

export async function addProjectTask(projectId: string, content: string) {
  const supabase = await createClient()
  if (!supabase) return
  if (!content?.trim()) return
  await supabase.from('project_tasks').insert({ project_id: projectId, content: content.trim() })
  revalidatePath('/projects')
}

export async function promoteProject(id: string, toType: ProjectType) {
  const supabase = await createClient()
  if (!supabase) return
  const status = toType === 'active' ? 'active' : 'planning'
  await supabase.from('projects').update({ type: toType, status, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/projects')
  revalidatePath('/horizon')
  revalidatePath('/incubation')
  revalidatePath('/dashboard')
}

export async function setProjectContext(id: string, context: ItemContext) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('projects').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/projects')
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const supabase = await createClient()
  if (!supabase) return
  const completed_at = status === 'complete' ? new Date().toISOString() : null
  await supabase.from('projects').update({ status, completed_at, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/projects')
}
