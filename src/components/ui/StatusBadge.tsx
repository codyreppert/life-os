import { cn, getStatusColor, getWaitingStatusColor, getCategoryColor } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  variant?: 'status' | 'waiting' | 'category'
  className?: string
}

export default function StatusBadge({ label, variant = 'status', className }: StatusBadgeProps) {
  const colorFn = variant === 'waiting' ? getWaitingStatusColor : variant === 'category' ? getCategoryColor : getStatusColor
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
      colorFn(label),
      className
    )}>
      {label}
    </span>
  )
}
