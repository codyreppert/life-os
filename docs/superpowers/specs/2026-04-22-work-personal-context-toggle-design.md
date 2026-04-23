# Work / Personal Context Toggle — Design Spec

**Date:** 2026-04-22

## Context

The Life OS app holds both work (W2 job) and personal items in a single account intentionally — the combined view gives a complete picture of everything on your mind. But sometimes you need to focus on just one context. This feature adds a global Work / Personal toggle that filters all pages while keeping both contexts in one place.

## Decisions

- **"Work"** = W2 job items only. Everything else is personal.
- **Default context for all existing items:** `personal` (current data is all personal).
- **Default mode on first visit:** `all` (nothing gets hidden unexpectedly).
- **New items auto-tag** based on active mode. If mode is `all`, new items default to `personal`.
- **Toggle order:** All · Personal · Work.
- **Toggle placement:** Global top bar above the full layout (sidebar + content).
- **Context editing on existing items:** Right-click context menu ("Move to Work" / "Move to Personal").

## Data Model

Add `context: 'work' | 'personal'` to all four item types.

**New type in `src/types/index.ts`:**
```ts
export type ItemContext = 'work' | 'personal'
```

**Updated interfaces** (add `context: ItemContext` field):
- `Item` — tasks
- `Project`
- `FoundationItem`
- `WaitingOnItem`

**DB migrations** (one per table, all default `'personal'`):
```sql
ALTER TABLE items ADD COLUMN context text NOT NULL DEFAULT 'personal';
ALTER TABLE projects ADD COLUMN context text NOT NULL DEFAULT 'personal';
ALTER TABLE foundation_items ADD COLUMN context text NOT NULL DEFAULT 'personal';
ALTER TABLE waiting_on ADD COLUMN context text NOT NULL DEFAULT 'personal';
```

**Seed data:** All existing items get `context: 'personal'` so demo mode continues to work.

## Global State

**New file: `src/context/ContextMode.tsx`**
- `'use client'` component: `ContextModeProvider`
- Stores `mode: 'all' | 'personal' | 'work'` in `localStorage` (key: `life-os-context-mode`)
- Exposes via `useContextMode()` hook returning `{ mode, setMode }`
- Default: `'all'`

**`src/app/layout.tsx`** — wrap the body content in `ContextModeProvider`. Since `layout.tsx` is a Server Component, the provider goes in a thin `'use client'` wrapper around the body content (standard Next.js pattern).

## UI — Top Bar

**New file: `src/components/ui/ContextToggle.tsx`**
- `'use client'` component
- Renders a pill toggle: `All · Personal · Work`
- Reads/writes via `useContextMode()`
- Active segment highlighted with accent color (`#6366f1`)

**`src/app/layout.tsx`** — `ContextToggle` renders in a thin bar (`border-bottom`) that sits above the `flex h-screen` container, so it spans full width above both sidebar and main content.

## Filtering

Each page calls `useContextMode()` and filters its data after fetching:

```ts
const { mode } = useContextMode()
const filtered = mode === 'all' ? items : items.filter(i => i.context === mode)
```

Pages affected: `tasks/page.tsx`, `projects/page.tsx`, `foundations/page.tsx`, `waiting-on/page.tsx`.

The page subtitle already shows context count (e.g., "3/8 done") — update it to include the active context label when mode is not `all` (e.g., "Personal · 3/8 done").

## Item Creation

When creating any new item, pass `context` based on the active mode:
```ts
const { mode } = useContextMode()
const context: ItemContext = mode === 'work' ? 'work' : 'personal'
```

## Context Editing (Existing Items)

Add to the right-click context menu on each item type:
- Separator
- "Move to Work" (disabled if already work)
- "Move to Personal" (disabled if already personal)

This calls the existing update API for each item type with `{ context: 'work' | 'personal' }`.

**Files to update:**
- `src/components/ui/TaskItem.tsx` — task context menu
- `src/components/ui/ProjectCard.tsx` — project context menu
- `src/app/foundations/page.tsx` — foundation item actions
- `src/app/waiting-on/page.tsx` — waiting item actions

## Files Changed / Created

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `ItemContext` type; add `context` field to all 4 interfaces |
| `src/context/ContextMode.tsx` | New — provider + hook |
| `src/components/ui/ContextToggle.tsx` | New — pill toggle component |
| `src/app/layout.tsx` | Add provider wrapper + ContextToggle above layout |
| `src/lib/data.ts` | Pass `context` field in all fetch/create/update operations |
| `src/app/tasks/page.tsx` | Filter by context; pass context on create |
| `src/app/projects/page.tsx` | Filter by context; pass context on create |
| `src/app/foundations/page.tsx` | Filter by context; add context menu actions |
| `src/app/waiting-on/page.tsx` | Filter by context; add context menu actions |
| `src/components/ui/TaskItem.tsx` | Add "Move to Work/Personal" to context menu |
| `src/components/ui/ProjectCard.tsx` | Add "Move to Work/Personal" to context menu |
| Supabase migrations | 4 `ALTER TABLE` statements |
| Seed data | Add `context: 'personal'` to all existing items |

## Verification

1. Run the dev server and confirm the top bar renders with `All · Personal · Work`.
2. Switch to Personal — verify only personal-tagged items appear on all 4 pages.
3. Switch to Work — verify list is empty (all current items are personal).
4. Create a task while in Work mode — confirm it's tagged work and visible in Work mode.
5. Right-click a task in All mode → "Move to Work" — confirm it moves and is filterable.
6. Refresh the page — confirm the toggle remembers its last state from localStorage.
7. Run existing tests to confirm nothing regressed.
