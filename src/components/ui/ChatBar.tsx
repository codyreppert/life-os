'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useContextMode } from '@/context/ContextMode'
import type { Message } from '@/types'

export default function ChatBar() {
  const pathname = usePathname()
  const { mode } = useContextMode()
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when expanding
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isExpanded])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          currentPath: pathname,
          history: messages,
          context: mode === 'work' ? 'work' : 'personal',
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating panel — visible when expanded */}
      {isExpanded && (
        <div className="fixed bottom-20 right-6 z-40 flex flex-col w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Message history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-darker">
            {messages.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">
                Start a conversation. Type naturally: add a task, move something, ask what&apos;s next.
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs flex-shrink-0">
                      ✦
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[260px] px-3 py-2 rounded-lg text-sm',
                      msg.role === 'user'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-surface text-text'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2 border-t border-border bg-surface px-3 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What should I do?"
              className="flex-1 bg-surface-darker rounded-full px-4 py-2 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 bg-accent text-white rounded-full text-sm font-medium flex items-center justify-center hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '…' : '↑'}
            </button>
          </div>
        </div>
      )}

      {/* FAB button — always visible, bottom-right */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors',
          isExpanded ? 'bg-surface border border-border text-muted hover:text-text' : 'bg-accent hover:bg-accent-hover'
        )}
        aria-label={isExpanded ? 'Close chat' : 'Open chat'}
      >
        {isExpanded ? '✕' : '✦'}
      </button>
    </>
  )
}
