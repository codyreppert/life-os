export type ItemList = 'inbox' | 'today' | 'this_week' | 'admin' | 'archive'
export type ItemCategory = 'foundation' | 'strategic' | 'admin' | 'maintenance'
export type ItemContext = 'work' | 'personal'

export interface Item {
  id: string
  user_id: string | null
  list: ItemList
  content: string
  completed: boolean
  priority: number
  category: ItemCategory | null
  notes: string | null
  due_date: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
  metadata: Record<string, unknown>
  context: ItemContext
}

export type ProjectType = 'active' | 'horizon' | 'incubation' | 'support'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'complete' | 'archived'

export interface Project {
  id: string
  user_id: string | null
  name: string
  type: ProjectType
  status: ProjectStatus
  purpose: string | null
  success_criteria: string[]
  strategic_level: string | null
  revenue_potential: string | null
  energy_level: number | null
  urgency_level: number | null
  timeline: string | null
  why_now: string | null
  notes: string | null
  position: number
  created_at: string
  updated_at: string
  completed_at: string | null
  metadata: Record<string, unknown>
  context: ItemContext
}

export interface ProjectTask {
  id: string
  project_id: string
  content: string
  completed: boolean
  position: number
  created_at: string
  updated_at: string
}

export type FoundationPillar = 'spiritual' | 'marriage' | 'health' | 'community' | 'lifestyle'
export type RhythmType = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export interface FoundationItem {
  id: string
  user_id: string | null
  pillar: FoundationPillar
  content: string
  rhythm_type: RhythmType | null
  completed_this_week: boolean
  notes: string | null
  position: number
  created_at: string
  updated_at: string
  context: ItemContext
}

export type WaitingStatus = 'pending' | 'received' | 'done'

export interface WaitingOnItem {
  id: string
  user_id: string | null
  item: string
  waiting_for: string
  status: WaitingStatus
  category: string | null
  due_by: string | null
  follow_up_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  context: ItemContext
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type ChatState = {
  messages: Message[]
  isExpanded: boolean
  isLoading: boolean
}
