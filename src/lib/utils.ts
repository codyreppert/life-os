import { clsx, type ClassValue } from 'clsx'
import { format, isToday, isPast, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    return format(parseISO(dateStr), 'MMM d')
  } catch {
    return dateStr
  }
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  try {
    return isPast(parseISO(dateStr)) && !isToday(parseISO(dateStr))
  } catch {
    return false
  }
}

export function getCategoryColor(category: string | null): string {
  switch (category) {
    case 'foundation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'strategic': return 'bg-accent/20 text-accent border-accent/30'
    case 'admin': return 'bg-zinc-500/20 text-zinc-400 border-zinc-700'
    case 'maintenance': return 'bg-zinc-500/20 text-zinc-400 border-zinc-700'
    default: return 'bg-zinc-800 text-muted border-zinc-700'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-success/20 text-success border-success/30'
    case 'planning': return 'bg-warning/20 text-warning border-warning/30'
    case 'on_hold': return 'bg-zinc-500/20 text-zinc-400 border-zinc-700'
    case 'complete': return 'bg-success/20 text-success border-success/30'
    case 'archived': return 'bg-zinc-800 text-muted border-zinc-700'
    default: return 'bg-zinc-800 text-muted border-zinc-700'
  }
}

export function getWaitingStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-warning/20 text-warning border-warning/30'
    case 'received': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'done': return 'bg-success/20 text-success border-success/30'
    default: return 'bg-zinc-800 text-muted border-zinc-700'
  }
}

export function getPillarIcon(pillar: string): string {
  switch (pillar) {
    case 'spiritual': return '🙏'
    case 'marriage': return '💑'
    case 'health': return '💪'
    case 'community': return '👥'
    case 'lifestyle': return '🌱'
    default: return '◆'
  }
}

export function getPillarLabel(pillar: string): string {
  switch (pillar) {
    case 'spiritual': return 'Spiritual'
    case 'marriage': return 'Marriage'
    case 'health': return 'Health'
    case 'community': return 'Community'
    case 'lifestyle': return 'Lifestyle'
    default: return pillar
  }
}

export function getProjectTypeLabel(type: string): string {
  switch (type) {
    case 'active': return 'Active'
    case 'horizon': return 'Horizon'
    case 'incubation': return 'Incubation'
    case 'support': return 'Support'
    default: return type
  }
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}
