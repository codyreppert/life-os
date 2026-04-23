'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ContextMode = 'all' | 'personal' | 'work'

const STORAGE_KEY = 'life-os-context-mode'

interface ContextModeValue {
  mode: ContextMode
  setMode: (mode: ContextMode) => void
}

const ContextModeContext = createContext<ContextModeValue>({
  mode: 'all',
  setMode: () => {},
})

export function ContextModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ContextMode>('all')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ContextMode | null
    if (stored === 'all' || stored === 'personal' || stored === 'work') {
      setModeState(stored)
    }
  }, [])

  function setMode(next: ContextMode) {
    setModeState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <ContextModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ContextModeContext.Provider>
  )
}

export function useContextMode() {
  return useContext(ContextModeContext)
}
