'use client'
import { useContextMode, type ContextMode } from '@/context/ContextMode'
import { cn } from '@/lib/utils'

const MODES: { value: ContextMode; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
]

export default function ContextToggle() {
  const { mode, setMode } = useContextMode()

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-1.5 border-b border-border bg-bg">
      <span className="text-[10px] text-muted uppercase tracking-wider mr-1">Context</span>
      <div className="flex items-center bg-surface border border-border rounded-full p-0.5">
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={cn(
              'px-3 py-1 text-xs rounded-full transition-colors',
              mode === value
                ? 'bg-accent text-white font-medium'
                : 'text-muted hover:text-text'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
