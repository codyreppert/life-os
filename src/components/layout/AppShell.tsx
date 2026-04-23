'use client'
import { ContextModeProvider } from '@/context/ContextMode'
import { ReactNode } from 'react'

export default function AppShell({ children }: { children: ReactNode }) {
  return <ContextModeProvider>{children}</ContextModeProvider>
}
