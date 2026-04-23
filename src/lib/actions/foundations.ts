'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { FoundationPillar, RhythmType, ItemContext } from '@/types'

export async function toggleFoundationItem(id: string, completed: boolean) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('foundation_items').update({ completed_this_week: completed, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/foundations')
  revalidatePath('/dashboard')
}

export async function addFoundationItem(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return
  const pillar = formData.get('pillar') as FoundationPillar
  const content = formData.get('content') as string
  const rhythm_type = (formData.get('rhythm_type') as RhythmType) || 'weekly'
  const notes = (formData.get('notes') as string) || null
  if (!pillar || !content?.trim()) return
  await supabase.from('foundation_items').insert({ pillar, content: content.trim(), rhythm_type, notes })
  revalidatePath('/foundations')
}

export async function deleteFoundationItem(id: string) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('foundation_items').delete().eq('id', id)
  revalidatePath('/foundations')
}

export async function setFoundationItemContext(id: string, context: ItemContext) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('foundation_items').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/foundations')
}

export async function resetWeeklyFoundations() {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('foundation_items').update({ completed_this_week: false, updated_at: new Date().toISOString() }).neq('id', '')
  revalidatePath('/foundations')
  revalidatePath('/dashboard')
}
