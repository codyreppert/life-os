import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import ChatBar from '@/components/ui/ChatBar'
import ContextToggle from '@/components/ui/ContextToggle'
import AppShell from '@/components/layout/AppShell'
import { isSupabaseConfigured } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Life OS',
  description: 'Personal productivity command center',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasSupabase = isSupabaseConfigured()
  return (
    <html lang="en">
      <body className="bg-bg text-text antialiased">
        <AppShell>
          <ContextToggle />
          <div className="flex h-[calc(100vh-36px)] overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-scroll">
              {!hasSupabase && (
                <div className="bg-warning/10 border-b border-warning/20 px-4 py-2 text-xs text-warning flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Demo mode — showing seed data. Add your Supabase credentials to enable persistence. See README for setup.</span>
                </div>
              )}
              {children}
            </main>
          </div>
          <MobileNav />
          <ChatBar />
        </AppShell>
      </body>
    </html>
  )
}
