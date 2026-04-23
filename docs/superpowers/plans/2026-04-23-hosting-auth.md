# Hosting & Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy Life OS to Vercel at `lifeorganizer.store` behind a Supabase email + password auth gate.

**Architecture:** Next.js middleware checks for a valid Supabase session on every request and redirects unauthenticated users to `/login`. The login page calls `signInWithPassword` client-side; on success Next.js navigates to `/`. Sign-out lives in the Sidebar. Vercel hosts the app; the domain is pointed via DNS.

**Tech Stack:** Next.js 14 App Router, `@supabase/ssr` ^0.10, Supabase Auth (email + password), Vercel, custom domain `lifeorganizer.store`

---

## File Map

| File | Change |
|------|--------|
| `src/middleware.ts` | **New** — session check, redirect to `/login` if unauthenticated |
| `src/app/login/page.tsx` | **New** — centered login form, calls `signInWithPassword` |
| `src/app/auth/callback/route.ts` | **New** — Supabase auth code exchange (future-proofing) |
| `src/components/layout/Sidebar.tsx` | Modify — add sign-out button at bottom |

---

## Task 1: Add Next.js middleware for auth protection

**Files:**
- Create: `life-os/src/middleware.ts`

- [ ] **Step 1: Create `src/middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip auth gate in demo mode (no Supabase env vars)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('https://')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Refresh session if expired (required for SSR cookie auth)
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPath = request.nextUrl.pathname.startsWith('/login')
  const isAuthPath = request.nextUrl.pathname.startsWith('/auth')

  if (!user && !isLoginPath && !isAuthPath) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd life-os && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add life-os/src/middleware.ts
git commit -m "feat: add auth middleware — redirect unauthenticated requests to /login"
```

---

## Task 2: Create the login page

**Files:**
- Create: `life-os/src/app/login/page.tsx`

- [ ] **Step 1: Create `src/app/login/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl text-accent mb-2">✦</div>
          <h1 className="text-lg font-semibold text-text">Life OS</h1>
          <p className="text-xs text-muted mt-0.5">lifeorganizer.store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoFocus
            className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />

          {error && (
            <p className="text-xs text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md py-2.5 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript + lint**

```bash
cd life-os && npx tsc --noEmit && npm run lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add life-os/src/app/login/page.tsx
git commit -m "feat: add login page with email + password form"
```

---

## Task 3: Add auth callback route

**Files:**
- Create: `life-os/src/app/auth/callback/route.ts`

This route handles the code→session exchange. Not strictly needed for password auth today but required if email confirmation or magic links are ever turned on.

- [ ] **Step 1: Create `src/app/auth/callback/route.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
```

- [ ] **Step 2: Verify TypeScript + lint**

```bash
cd life-os && npx tsc --noEmit && npm run lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add life-os/src/app/auth/callback/route.ts
git commit -m "feat: add auth callback route for code exchange"
```

---

## Task 4: Add sign-out button to Sidebar

**Files:**
- Modify: `life-os/src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Replace the full `Sidebar.tsx`**

```tsx
'use client'
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

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
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
          className="text-xs text-muted hover:text-danger transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Verify TypeScript + lint**

```bash
cd life-os && npx tsc --noEmit && npm run lint
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add life-os/src/components/layout/Sidebar.tsx
git commit -m "feat: add sign-out button to sidebar"
```

---

## Task 5: Vercel deployment + domain + Supabase config

These are manual steps in the browser. No code changes.

**Files:** none

- [ ] **Step 1: Push all commits to GitHub**

```bash
git push
```

- [ ] **Step 2: Create Vercel project**

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo (`Task-Management-System`)
3. Set **Root Directory** to `life-os`
4. Framework: Next.js (auto-detected)
5. Click Deploy (it will fail — env vars not set yet, that's fine)

- [ ] **Step 3: Add environment variables in Vercel**

In Vercel project → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (from Supabase dashboard → Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key (same page) |

Apply to: Production, Preview, Development. Then **Redeploy**.

- [ ] **Step 4: Add custom domain in Vercel**

Vercel project → Settings → Domains → Add `lifeorganizer.store`

Vercel will show you DNS records to add. Two options:
- **Recommended:** Add Vercel's nameservers to your domain registrar (full DNS handoff)
- **Alternative:** Add the `A` record and `CNAME` records Vercel shows you

Add those records at your domain registrar, then wait for DNS propagation (usually 5-30 min).

- [ ] **Step 5: Update Supabase Auth settings**

In Supabase dashboard → Authentication → URL Configuration:

| Setting | Value |
|---------|-------|
| Site URL | `https://lifeorganizer.store` |
| Redirect URLs | `https://lifeorganizer.store/**` |

Also add your local dev URL: `http://localhost:3000/**`

- [ ] **Step 6: Disable email confirmation**

Supabase dashboard → Authentication → Providers → Email:
- Turn off **Confirm email** (so you can log in without clicking a confirmation link)

- [ ] **Step 7: Create your user account**

Supabase dashboard → Authentication → Users → **Add user**
- Enter your email and a strong password
- Click Create

- [ ] **Step 8: Verify end-to-end**

1. Visit `https://lifeorganizer.store` — should redirect to `/login`
2. Enter your email + password → should land on the app
3. Refresh — should stay logged in
4. Click "Sign out" in sidebar → should redirect to `/login`
5. Try visiting `https://lifeorganizer.store/tasks` while logged out → should redirect to `/login`

---

## Final Verification

- [ ] `https://lifeorganizer.store` redirects to `/login` when logged out
- [ ] Correct credentials → app loads, all pages work
- [ ] Wrong password → "Invalid email or password." shown on login page
- [ ] Sign out → `/login`, app fully protected
- [ ] Refresh while logged in → session persists
- [ ] Local dev without env vars → still works in demo mode (no auth wall)
