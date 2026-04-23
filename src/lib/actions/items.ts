'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ItemList, ItemCategory, ItemContext } from '@/types'

function listToPath(list: ItemList): string {
  return '/' + list.replace('_', '-')
}

export async function addItem(formData: FormData) {
  const supabase = await createClient()
  const content = formData.get('content') as string
  const list = formData.get('list') as ItemList
  const category = (formData.get('category') as ItemCategory) || null
  const priority = parseInt(formData.get('priority') as string) || 0
  const notes = (formData.get('notes') as string) || null
  if (!content?.trim() || !list) return
  if (!supabase) {
    console.warn('Supabase not configured — item not persisted')
    revalidatePath(listToPath(list))
    return
  }
  await supabase.from('items').insert({ content: content.trim(), list, category, priority, notes })
  revalidatePath(listToPath(list))
  revalidatePath('/dashboard')
}

export async function toggleItem(id: string, completed: boolean, list: ItemList) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('items').update({ completed, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(listToPath(list))
  revalidatePath('/dashboard')
}

export async function deleteItem(id: string, list: ItemList) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('items').delete().eq('id', id)
  revalidatePath(listToPath(list))
}

export async function moveItem(id: string, fromList: ItemList, toList: ItemList) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('items').update({ list: toList, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(listToPath(fromList))
  revalidatePath(listToPath(toList))
  revalidatePath('/dashboard')
}

export async function updateItemContent(id: string, content: string, list: ItemList) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('items').update({ content: content.trim(), updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(listToPath(list))
}

export async function addItemDirect(content: string, list: ItemList, context: ItemContext = 'personal') {
  const supabase = await createClient()
  if (!content?.trim() || !list) return
  if (!supabase) {
    console.warn('Supabase not configured — item not persisted')
    revalidatePath(listToPath(list))
    return
  }
  await supabase.from('items').insert({ content: content.trim(), list, context })
  revalidatePath(listToPath(list))
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function archiveItem(id: string, fromList: ItemList) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('items').update({ list: 'archive', archived_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(listToPath(fromList))
  revalidatePath('/archive')
}

export async function setItemContext(id: string, context: ItemContext, list: ItemList) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('items').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(listToPath(list))
  revalidatePath('/tasks')
}

export async function setItemDueDate(id: string, dueDate: string | null) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase
    .from('items')
    .update({ due_date: dueDate, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/tasks')
}
