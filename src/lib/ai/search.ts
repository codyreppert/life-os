import { createClient } from '@/lib/supabase/server'

export async function searchItems(query: string) {
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('items')
    .select('id, content, list, completed')
    .ilike('content', `%${query}%`)
    .limit(5)

  if (error) throw error
  return data
}

export async function searchProjects(query: string) {
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, type, status')
    .ilike('name', `%${query}%`)
    .limit(5)

  if (error) throw error
  return data
}

export async function searchWaitingItems(query: string) {
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('waiting_on')
    .select('id, item, waiting_for, status')
    .ilike('item', `%${query}%`)
    .limit(5)

  if (error) throw error
  return data
}
