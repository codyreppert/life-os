'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const mobileNavItems = [
  { href: '/tasks', label: 'Tasks', icon: '✓' },
  { href: '/projects', label: 'Projects', icon: '🚀' },
  { href: '/foundations', label: 'Foundations', icon: '💎' },
  { href: '/waiting-on', label: 'Waiting On', icon: '⏸' },
]

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50 safe-area-pb">
      <div className="flex">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors',
                isActive ? 'text-accent' : 'text-muted'
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
