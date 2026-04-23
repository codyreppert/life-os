# Hosting & Auth — Design Spec

**Date:** 2026-04-23

## Context

Life OS is a personal productivity app (Next.js 14 App Router + Supabase) currently running locally. This spec covers deploying it to production at `lifeorganizer.store` with a simple authentication gate — email + password, single user.

## Decisions

- **Hosting:** Vercel — native Next.js support, GitHub auto-deploy, free tier sufficient, automatic HTTPS
- **Domain:** `lifeorganizer.store` — pointed to Vercel via DNS
- **Auth:** Supabase Auth, email + password
- **Users:** Single user only. Auth is a gate, not a data-isolation layer. No `user_id` scoping needed on queries.
- **Login UI:** Minimal centered — `✦ Life OS` wordmark, email + password fields, sign in button. Dark theme matching existing app.

## Architecture

### Authentication Flow

```
Request → Next.js Middleware
  ├─ Has valid Supabase session? → Pass through
  └─ No session?
       ├─ Path is /login → Pass through
       └─ Any other path → Redirect to /login
```

After successful login → redirect to `/`.  
Sign-out button in sidebar → calls Supabase `signOut()` → redirect to `/login`.

### Middleware

`src/middleware.ts` — runs on every request (excluding static assets). Uses `@supabase/ssr` to read the session cookie. Refreshes the session token if it's about to expire (standard Supabase SSR pattern).

### New Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Session check + redirect logic |
| `src/app/login/page.tsx` | Login page (client component) |
| `src/app/auth/callback/route.ts` | Supabase auth callback handler (needed if email confirmation is ever turned on; safe to include now) |

### Modified Files

| File | Change |
|------|---------|
| `src/components/layout/Sidebar.tsx` | Add sign-out button |
| `.env.local.example` | Add `SUPABASE_SERVICE_ROLE_KEY` note (not needed for auth, confirming only URL + anon key required) |

## Login Page

- Route: `/login`
- Full-screen dark background (`bg-bg`)
- Centered card — no sidebar, no nav
- Content: `✦` mark, "Life OS" title, `lifeorganizer.store` subtitle, email input, password input, "Sign in →" button
- Error state: inline message below the form ("Invalid email or password")
- After success: `router.push('/')` (client-side redirect after session is set)

## Vercel Deployment

1. Connect GitHub repo to Vercel project
2. Set root directory to `life-os/` (monorepo)
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Assign custom domain `lifeorganizer.store`
5. Update Supabase dashboard: add `https://lifeorganizer.store` to **Site URL** and **Redirect URLs**

## Supabase Setup

- Enable **Email provider** in Supabase Auth settings (already on by default)
- Disable **Confirm email** (no need for confirmation emails on a personal app)
- Create the single user account via Supabase dashboard (Authentication → Users → Invite/Add user)

## Security Notes

- Password is managed entirely by Supabase Auth — never stored in env vars or code
- Anon key is safe to expose publicly (it's already `NEXT_PUBLIC_`) — Supabase RLS would restrict data if needed, but for single-user this is acceptable
- Middleware protects all routes server-side — no client-only auth checks needed

## Success Criteria

1. `https://lifeorganizer.store` loads the app
2. Unauthenticated visit to any route redirects to `/login`
3. Correct email + password → lands on `/` with full app
4. Wrong password → shows error message, stays on login page
5. Sign out → redirects to `/login`, all routes protected again
6. Refreshing the page while logged in → stays logged in (session persists via cookie)
