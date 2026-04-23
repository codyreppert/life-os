'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@supabase/ssr'

const navItems = [
  { href: '/tasks', label: 'Tasks', icon: '✓' },
  { href: '/projects', label: 'Projects', icon: '🚀' },
  { href: '/foundations', label: 'Foundations', icon: '💎' },
  { href: '/waiting-on', label: 'Waiting On', icon: '⏸' },
]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    if (!supabaseUrl || !supabaseKey) return
    setSigningOut(true)
    const supabase = createBrowserClient(supabaseUrl, supabaseKey)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden md:flex w-56 flex-col bg-surface border-r border-border shrink-0">
      <div className="px-4 py-5 border-b border-border">
        <h1 className="text-sm font-semibold text-text tracking-wide">Life OS</h1>
        <p className="text-xs text-muted mt-0.5">Personal Command Center</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors mb-0.5',
                isActive
                  ? 'bg-accent/15 text-accent font-medium'
                  : 'text-muted hover:text-text hover:bg-surface-hover'
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-3 border-t border-border space-y-2">
        <p className="text-xs text-muted">Week of Apr 20-26</p>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-xs text-muted hover:text-danger disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
