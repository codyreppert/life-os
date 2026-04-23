interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
}

export default function EmptyState({ icon = '✦', title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-3xl mb-3 opacity-30">{icon}</div>
      <p className="text-sm font-medium text-muted">{title}</p>
      {description && <p className="text-xs text-muted/60 mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
