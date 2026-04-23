'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { WaitingStatus, ItemContext } from '@/types'

export async function addWaitingItem(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return
  const item = formData.get('item') as string
  const waiting_for = formData.get('waiting_for') as string
  const category = (formData.get('category') as string) || null
  const notes = (formData.get('notes') as string) || null
  const due_by = (formData.get('due_by') as string) || null
  if (!item?.trim() || !waiting_for?.trim()) return
  await supabase.from('waiting_on').insert({ item: item.trim(), waiting_for: waiting_for.trim(), category, notes, due_by: due_by || null })
  revalidatePath('/waiting-on')
  revalidatePath('/dashboard')
}

export async function updateWaitingStatus(id: string, status: WaitingStatus) {
  const supabase = await createClient()
  if (!supabase) return
  const resolved_at = status === 'done' ? new Date().toISOString() : null
  await supabase.from('waiting_on').update({ status, resolved_at, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/waiting-on')
  revalidatePath('/dashboard')
}

export async function setWaitingItemContext(id: string, context: ItemContext) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('waiting_on').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/waiting-on')
}

export async function deleteWaitingItem(id: string) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('waiting_on').delete().eq('id', id)
  revalidatePath('/waiting-on')
  revalidatePath('/dashboard')
}
