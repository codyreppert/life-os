'use client'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { addItemDirect } from '@/lib/actions/items'
import { useContextMode } from '@/context/ContextMode'
import type { ItemList } from '@/types'

interface QuickCaptureProps {
  placeholder?: string
  onSubmit?: (value: string) => void | Promise<void>
  list?: ItemList
  className?: string
  autoFocus?: boolean
}

export default function QuickCapture({ placeholder = 'Capture anything...', onSubmit, list, className, autoFocus }: QuickCaptureProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { mode } = useContextMode()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || loading) return
    setLoading(true)
    try {
      if (onSubmit) {
        await onSubmit(value.trim())
      } else if (list) {
        const context = mode === 'work' ? 'work' : 'personal'
        await addItemDirect(value.trim(), list, context)
      }
      setValue('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center gap-2', className)}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 bg-surface-hover border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
      />
      <button
        type="submit"
        disabled={!value.trim() || loading}
        className="px-3 py-2 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors shrink-0"
      >
        Add
      </button>
    </form>
  )
}
