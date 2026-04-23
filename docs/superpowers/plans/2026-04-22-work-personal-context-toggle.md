# Work / Personal Context Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global Work / Personal / All toggle that filters all pages (tasks, projects, foundations, waiting-on) by context, stored in localStorage, with context editable per-item via the right-click context menu.

**Architecture:** A `ContextModeProvider` (client component) wraps the app body and stores the active mode (`'all' | 'personal' | 'work'`) in localStorage. Server pages fetch all data as-is; a thin client display component at the bottom of each page reads the mode and filters before rendering. A `ContextToggle` pill renders in a bar above the full layout.

**Tech Stack:** Next.js 14 (App Router), React Context, localStorage, Supabase, Tailwind CSS, TypeScript

---

## File Map

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `ItemContext` type; add `context: ItemContext` to all 4 interfaces |
| `src/data/seed.ts` | Add `context: 'personal'` to all seed items/projects/foundations/waiting |
| `src/context/ContextMode.tsx` | **New** — provider + `useContextMode` hook |
| `src/components/ui/ContextToggle.tsx` | **New** — `All · Personal · Work` pill toggle |
| `src/components/layout/AppShell.tsx` | **New** — thin `'use client'` wrapper for layout body |
| `src/app/layout.tsx` | Add context bar above layout + AppShell wrapper |
| `src/lib/actions/items.ts` | Add `setItemContext` server action |
| `src/lib/actions/projects.ts` | Add `setProjectContext` server action |
| `src/lib/actions/foundations.ts` | Add `setFoundationItemContext` server action |
| `src/lib/actions/waiting.ts` | Add `setWaitingItemContext` server action |
| `src/components/ui/TasksDisplay.tsx` | **New** — client filter + render for tasks |
| `src/app/tasks/page.tsx` | Pass fetched items to `TasksDisplay` |
| `src/components/ui/ProjectsDisplay.tsx` | **New** — client filter + render for projects |
| `src/app/projects/page.tsx` | Pass fetched projects to `ProjectsDisplay` |
| `src/components/ui/FoundationsDisplay.tsx` | **New** — client filter + render for foundations |
| `src/app/foundations/page.tsx` | Pass fetched items to `FoundationsDisplay` |
| `src/components/ui/WaitingDisplay.tsx` | **New** — client filter + render for waiting-on |
| `src/app/waiting-on/page.tsx` | Pass fetched items to `WaitingDisplay` |
| `src/components/ui/TaskItem.tsx` | Add "Move to Work / Move to Personal" to context menu |
| `src/components/ui/ProjectCard.tsx` | Add context menu with "Move to Work / Move to Personal" |
| `src/components/ui/FoundationCard.tsx` | Add context menu per item |
| `src/components/ui/WaitingRow.tsx` | Add context menu per row |

---

## Task 1: Run DB migrations

**Files:** Supabase SQL editor (run manually)

- [ ] **Step 1: Run these 4 migrations in your Supabase SQL editor**

```sql
ALTER TABLE items ADD COLUMN context text NOT NULL DEFAULT 'personal';
ALTER TABLE projects ADD COLUMN context text NOT NULL DEFAULT 'personal';
ALTER TABLE foundation_items ADD COLUMN context text NOT NULL DEFAULT 'personal';
ALTER TABLE waiting_on ADD COLUMN context text NOT NULL DEFAULT 'personal';
```

- [ ] **Step 2: Verify in Supabase Table Editor**

Open each table in the Supabase dashboard and confirm a `context` column exists with value `personal` on all rows.

---

## Task 2: Add `ItemContext` type and update all interfaces

**Files:**
- Modify: `life-os/src/types/index.ts`

- [ ] **Step 1: Add `ItemContext` type and `context` field to all interfaces**

Replace the full contents of `src/types/index.ts` with:

```ts
export type ItemList = 'inbox' | 'today' | 'this_week' | 'admin' | 'archive'
export type ItemCategory = 'foundation' | 'strategic' | 'admin' | 'maintenance'
export type ItemContext = 'work' | 'personal'

export interface Item {
  id: string
  user_id: string | null
  list: ItemList
  content: string
  completed: boolean
  priority: number
  category: ItemCategory | null
  notes: string | null
  due_date: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
  metadata: Record<string, unknown>
  context: ItemContext
}

export type ProjectType = 'active' | 'horizon' | 'incubation' | 'support'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'complete' | 'archived'

export interface Project {
  id: string
  user_id: string | null
  name: string
  type: ProjectType
  status: ProjectStatus
  purpose: string | null
  success_criteria: string[]
  strategic_level: string | null
  revenue_potential: string | null
  energy_level: number | null
  urgency_level: number | null
  timeline: string | null
  why_now: string | null
  notes: string | null
  position: number
  created_at: string
  updated_at: string
  completed_at: string | null
  metadata: Record<string, unknown>
  context: ItemContext
}

export interface ProjectTask {
  id: string
  project_id: string
  content: string
  completed: boolean
  position: number
  created_at: string
  updated_at: string
}

export type FoundationPillar = 'spiritual' | 'marriage' | 'health' | 'community' | 'lifestyle'
export type RhythmType = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export interface FoundationItem {
  id: string
  user_id: string | null
  pillar: FoundationPillar
  content: string
  rhythm_type: RhythmType | null
  completed_this_week: boolean
  notes: string | null
  position: number
  created_at: string
  updated_at: string
  context: ItemContext
}

export type WaitingStatus = 'pending' | 'received' | 'done'

export interface WaitingOnItem {
  id: string
  user_id: string | null
  item: string
  waiting_for: string
  status: WaitingStatus
  category: string | null
  due_by: string | null
  follow_up_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  context: ItemContext
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type ChatState = {
  messages: Message[]
  isExpanded: boolean
  isLoading: boolean
}
```

- [ ] **Step 2: Update seed data — add `context: 'personal'` to every item**

Open `src/data/seed.ts`. Every object in `seedItems`, `seedProjects`, `seedFoundationItems`, and `seedWaitingOn` arrays needs `context: 'personal'` added. Example for one item:

```ts
{ id: makeId(), user_id: null, list: 'today', content: 'Plan this week...', ..., context: 'personal' },
```

Do this for every item in all four arrays. TypeScript will error on any you miss.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd life-os && npx tsc --noEmit
```

Expected: no errors (or only pre-existing errors unrelated to context)

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/data/seed.ts
git commit -m "feat: add ItemContext type and context field to all entity types"
```

---

## Task 3: Create `ContextModeProvider` and `useContextMode`

**Files:**
- Create: `life-os/src/context/ContextMode.tsx`

- [ ] **Step 1: Create the context file**

```tsx
// src/context/ContextMode.tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd life-os && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/context/ContextMode.tsx
git commit -m "feat: add ContextModeProvider and useContextMode hook"
```

---

## Task 4: Create `ContextToggle` component

**Files:**
- Create: `life-os/src/components/ui/ContextToggle.tsx`

- [ ] **Step 1: Create the toggle component**

```tsx
// src/components/ui/ContextToggle.tsx
'use client'
import { useContextMode, type ContextMode } from '@/context/ContextMode'
import { cn } from '@/lib/utils'

const MODES: { value: ContextMode; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
]

export default function ContextToggle() {
  const { mode, setMode } = useContextMode()

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-1.5 border-b border-border bg-bg">
      <span className="text-[10px] text-muted uppercase tracking-wider mr-1">Context</span>
      <div className="flex items-center bg-surface border border-border rounded-full p-0.5">
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={cn(
              'px-3 py-1 text-xs rounded-full transition-colors',
              mode === value
                ? 'bg-accent text-white font-medium'
                : 'text-muted hover:text-text'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/ContextToggle.tsx
git commit -m "feat: add ContextToggle pill component"
```

---

## Task 5: Wire provider and toggle into layout

**Files:**
- Create: `life-os/src/components/layout/AppShell.tsx`
- Modify: `life-os/src/app/layout.tsx`

- [ ] **Step 1: Create `AppShell` — a thin client wrapper**

`layout.tsx` is a Server Component and cannot import client-only hooks directly. `AppShell` provides the client boundary.

```tsx
// src/components/layout/AppShell.tsx
'use client'
import { ContextModeProvider } from '@/context/ContextMode'
import { ReactNode } from 'react'

export default function AppShell({ children }: { children: ReactNode }) {
  return <ContextModeProvider>{children}</ContextModeProvider>
}
```

- [ ] **Step 2: Update `layout.tsx`**

```tsx
// src/app/layout.tsx
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
```

Note: `h-[calc(100vh-36px)]` accounts for the ~36px context bar height. Adjust if needed after visual check.

- [ ] **Step 3: Start dev server and verify**

```bash
cd life-os && npm run dev
```

Open http://localhost:3000. You should see the `All · Personal · Work` pill bar at the top of the page above the sidebar. Click each option — they should highlight. Refresh the page — the selected mode should persist.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppShell.tsx src/app/layout.tsx
git commit -m "feat: wire ContextModeProvider and ContextToggle into layout"
```

---

## Task 6: Add `setItemContext` server action

**Files:**
- Modify: `life-os/src/lib/actions/items.ts`

- [ ] **Step 1: Add `setItemContext` to items actions**

Append to `src/lib/actions/items.ts`:

```ts
export async function setItemContext(id: string, context: ItemContext, list: ItemList) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('items').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(listToPath(list))
  revalidatePath('/tasks')
}
```

Also update the import at the top of the file to include `ItemContext`:

```ts
import type { ItemList, ItemCategory, ItemContext } from '@/types'
```

- [ ] **Step 2: Add `setProjectContext` to projects actions**

Append to `src/lib/actions/projects.ts`:

```ts
export async function setProjectContext(id: string, context: ItemContext) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('projects').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/projects')
}
```

Update the import:

```ts
import type { ProjectType, ProjectStatus, ItemContext } from '@/types'
```

- [ ] **Step 3: Add `setFoundationItemContext` to foundations actions**

Append to `src/lib/actions/foundations.ts`:

```ts
export async function setFoundationItemContext(id: string, context: ItemContext) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('foundation_items').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/foundations')
}
```

Update the import:

```ts
import type { FoundationPillar, RhythmType, ItemContext } from '@/types'
```

- [ ] **Step 4: Add `setWaitingItemContext` to waiting actions**

Append to `src/lib/actions/waiting.ts`:

```ts
export async function setWaitingItemContext(id: string, context: ItemContext) {
  const supabase = await createClient()
  if (!supabase) return
  await supabase.from('waiting_on').update({ context, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/waiting-on')
}
```

Update the import:

```ts
import type { WaitingStatus, ItemContext } from '@/types'
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd life-os && npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/actions/items.ts src/lib/actions/projects.ts src/lib/actions/foundations.ts src/lib/actions/waiting.ts
git commit -m "feat: add setContext server actions for all entity types"
```

---

## Task 7: Filter tasks page by context

**Files:**
- Create: `life-os/src/components/ui/TasksDisplay.tsx`
- Modify: `life-os/src/app/tasks/page.tsx`

- [ ] **Step 1: Create `TasksDisplay` client component**

```tsx
// src/components/ui/TasksDisplay.tsx
'use client'
import { useContextMode } from '@/context/ContextMode'
import TaskItem from '@/components/ui/TaskItem'
import EmptyState from '@/components/ui/EmptyState'
import type { Item } from '@/types'

interface TasksDisplayProps {
  items: Item[]
  icon: string
  label: string
}

export default function TasksDisplay({ items, icon, label }: TasksDisplayProps) {
  const { mode } = useContextMode()
  const filtered = mode === 'all' ? items : items.filter(i => i.context === mode)

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={icon}
        title={`No ${label.toLowerCase()} tasks`}
        description={mode === 'all' ? "You're all caught up!" : `No ${mode} tasks here.`}
      />
    )
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-text">
          {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
        </h2>
      </div>
      <div>
        {filtered.map(item => (
          <TaskItem key={item.id} item={item} showCategory showMove />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `TasksDisplay` stats line to reflect filtered count**

The page header subtitle currently shows `completedCount/totalCount done`. This comes from `TasksList` (server). We need to move the stat to the client so it reflects filtering. Update `TasksDisplay` to export a stat:

Replace the `TasksDisplay` file with this version that also handles the subtitle:

```tsx
// src/components/ui/TasksDisplay.tsx
'use client'
import { useContextMode } from '@/context/ContextMode'
import TaskItem from '@/components/ui/TaskItem'
import EmptyState from '@/components/ui/EmptyState'
import type { Item } from '@/types'

interface TasksDisplayProps {
  items: Item[]
  icon: string
  label: string
}

export default function TasksDisplay({ items, icon, label }: TasksDisplayProps) {
  const { mode } = useContextMode()
  const filtered = mode === 'all' ? items : items.filter(i => i.context === mode)
  const completedCount = filtered.filter(i => i.completed).length

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={icon}
        title={`No ${label.toLowerCase()} tasks`}
        description={mode === 'all' ? "You're all caught up!" : `No ${mode} tasks here.`}
      />
    )
  }

  return (
    <>
      <p className="text-xs text-muted -mt-4">
        {mode !== 'all' && <span className="capitalize">{mode} · </span>}
        {completedCount}/{filtered.length} done
      </p>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text">
            {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
          </h2>
        </div>
        <div>
          {filtered.map(item => (
            <TaskItem key={item.id} item={item} showCategory showMove />
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Update `tasks/page.tsx` to use `TasksDisplay`**

Replace the full file:

```tsx
// src/app/tasks/page.tsx
import { getItems } from '@/lib/data'
import TasksDisplay from '@/components/ui/TasksDisplay'
import PageHeader from '@/components/layout/PageHeader'
import ViewToggle from './ViewToggle'
import WeekView from './WeekView'
import type { Item } from '@/types'

type ViewType = 'today' | 'week' | 'all'

const VIEW_LABELS: Record<ViewType, string> = {
  today: 'Today',
  week: 'This Week',
  all: 'All Tasks',
}

const VIEW_ICONS: Record<ViewType, string> = {
  today: '📅',
  week: '📆',
  all: '📋',
}

interface TasksPageProps {
  searchParams: Promise<{ view?: string }>
}

async function TasksList({ view }: { view: ViewType }) {
  let items: Item[] = []

  if (view === 'today') {
    items = await getItems('today')
  } else if (view === 'week') {
    const weekItems = await getItems('this_week')
    return (
      <>
        <PageHeader
          title={`${VIEW_ICONS[view]} ${VIEW_LABELS[view]}`}
          subtitle=""
        />
        <ViewToggle currentView={view} />
        <WeekView initialItems={weekItems} />
      </>
    )
  } else if (view === 'all') {
    const [inboxItems, todayItems, weekItems] = await Promise.all([
      getItems('inbox'),
      getItems('today'),
      getItems('this_week'),
    ])
    items = [...inboxItems, ...todayItems, ...weekItems]
  }

  return (
    <>
      <PageHeader
        title={`${VIEW_ICONS[view]} ${VIEW_LABELS[view]}`}
        subtitle=""
      />
      <ViewToggle currentView={view} />
      <TasksDisplay items={items} icon={VIEW_ICONS[view]} label={VIEW_LABELS[view]} />
    </>
  )
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const { view = 'today' } = await searchParams
  const normalizedView = (view === 'today' || view === 'week' || view === 'all' ? view : 'today') as ViewType

  return (
    <div className="mx-auto px-4 py-6 max-w-screen-xl">
      <div className="min-h-[60vh] space-y-6">
        <TasksList view={normalizedView} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

Navigate to http://localhost:3000/tasks. Switch between All / Personal / Work — the task list should filter. All existing tasks should show in Personal mode (since seed data is all personal). Work mode should show empty state.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/TasksDisplay.tsx src/app/tasks/page.tsx
git commit -m "feat: filter tasks page by context mode"
```

---

## Task 8: Filter projects page by context

**Files:**
- Create: `life-os/src/components/ui/ProjectsDisplay.tsx`
- Modify: `life-os/src/app/projects/page.tsx`

- [ ] **Step 1: Create `ProjectsDisplay` client component**

```tsx
// src/components/ui/ProjectsDisplay.tsx
'use client'
import { useContextMode } from '@/context/ContextMode'
import ProjectCard from '@/components/ui/ProjectCard'
import EmptyState from '@/components/ui/EmptyState'
import type { Project, ProjectTask } from '@/types'

interface ProjectsDisplayProps {
  projects: Project[]
  tasks: ProjectTask[]
  icon: string
  label: string
}

export default function ProjectsDisplay({ projects, tasks, icon, label }: ProjectsDisplayProps) {
  const { mode } = useContextMode()
  const filtered = mode === 'all' ? projects : projects.filter(p => p.context === mode)

  function tasksFor(projectId: string) {
    return tasks.filter(t => t.project_id === projectId)
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={icon}
        title={`No ${label.toLowerCase()}`}
        description={mode === 'all' ? 'Nothing here yet.' : `No ${mode} projects here.`}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filtered.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          tasks={tasksFor(project.id)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Update `projects/page.tsx`**

Replace the full file:

```tsx
// src/app/projects/page.tsx
import { getProjects, getProjectTasks } from '@/lib/data'
import ProjectsDisplay from '@/components/ui/ProjectsDisplay'
import PageHeader from '@/components/layout/PageHeader'
import ViewToggle from './ViewToggle'

type ProjectViewType = 'active' | 'horizon' | 'incubation'

const VIEW_LABELS: Record<ProjectViewType, string> = {
  active: 'Active Projects',
  horizon: 'Horizon Projects',
  incubation: 'Incubation',
}

const VIEW_ICONS: Record<ProjectViewType, string> = {
  active: '🚀',
  horizon: '🌅',
  incubation: '🌱',
}

const VIEW_SUBTITLES: Record<ProjectViewType, string> = {
  active: "What you're building right now",
  horizon: 'On the roadmap, not yet started',
  incubation: 'Ideas and experiments',
}

interface ProjectsPageProps {
  searchParams: Promise<{ view?: string }>
}

async function ProjectsList({ view }: { view: ProjectViewType }) {
  const [projects, tasks] = await Promise.all([
    getProjects(view),
    getProjectTasks(),
  ])

  return (
    <>
      <PageHeader
        title={`${VIEW_ICONS[view]} ${VIEW_LABELS[view]}`}
        subtitle={VIEW_SUBTITLES[view]}
      />
      <ViewToggle currentView={view} />
      <ProjectsDisplay
        projects={projects}
        tasks={tasks}
        icon={VIEW_ICONS[view]}
        label={VIEW_LABELS[view]}
      />
    </>
  )
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { view = 'active' } = await searchParams
  const normalizedView = (
    view === 'active' || view === 'horizon' || view === 'incubation' ? view : 'active'
  ) as ProjectViewType

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="min-h-[60vh] space-y-6">
        <ProjectsList view={normalizedView} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to http://localhost:3000/projects. Switch between modes — projects should filter.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ProjectsDisplay.tsx src/app/projects/page.tsx
git commit -m "feat: filter projects page by context mode"
```

---

## Task 9: Filter foundations page by context

**Files:**
- Create: `life-os/src/components/ui/FoundationsDisplay.tsx`
- Modify: `life-os/src/app/foundations/page.tsx`

- [ ] **Step 1: Create `FoundationsDisplay` client component**

```tsx
// src/components/ui/FoundationsDisplay.tsx
'use client'
import { useContextMode } from '@/context/ContextMode'
import FoundationCard from '@/components/ui/FoundationCard'
import type { FoundationItem, FoundationPillar } from '@/types'

interface FoundationsDisplayProps {
  byPillar: { pillar: FoundationPillar; items: FoundationItem[] }[]
  view: string
}

export default function FoundationsDisplay({ byPillar, view }: FoundationsDisplayProps) {
  const { mode } = useContextMode()

  const filtered = byPillar.map(({ pillar, items }) => ({
    pillar,
    items: mode === 'all' ? items : items.filter(i => i.context === mode),
  })).filter(({ items }) => items.length > 0)

  const shownItems = filtered.flatMap(p => p.items)
  const totalCompleted = shownItems.filter(i => i.completed_this_week).length
  const total = shownItems.length
  const scorePercent = total > 0 ? Math.round((totalCompleted / total) * 100) : 0

  return (
    <>
      <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text font-medium">{totalCompleted} of {total} rhythms honored this week</p>
          <div className="h-1.5 bg-surface-hover rounded-full mt-2 w-48">
            <div
              className={`h-full rounded-full transition-all ${scorePercent === 100 ? 'bg-success' : 'bg-accent'}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-text">{scorePercent}<span className="text-xl text-muted">%</span></span>
        </div>
      </div>

      <div className={view === 'all' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filtered.map(({ pillar, items }) => (
          <FoundationCard key={pillar} pillar={pillar} items={items} />
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Update `foundations/page.tsx`**

Replace the full file:

```tsx
// src/app/foundations/page.tsx
import { getFoundationItems } from '@/lib/data'
import FoundationsDisplay from '@/components/ui/FoundationsDisplay'
import PageHeader from '@/components/layout/PageHeader'
import ViewToggle from './ViewToggle'
import type { FoundationView } from './ViewToggle'
import type { FoundationPillar } from '@/types'

const PILLARS: FoundationPillar[] = ['spiritual', 'marriage', 'health', 'community', 'lifestyle']
const VALID_VIEWS = ['all', ...PILLARS] as const

interface FoundationsPageProps {
  searchParams: Promise<{ view?: string }>
}

async function FoundationsContent({ view }: { view: FoundationView }) {
  const allItems = await getFoundationItems()

  const pillarsToShow = view === 'all' ? PILLARS : [view as FoundationPillar]
  const byPillar = pillarsToShow.map(pillar => ({
    pillar,
    items: allItems.filter(i => i.pillar === pillar),
  }))

  return (
    <>
      <PageHeader
        title="💎 Foundations"
        subtitle="What keeps everything else sustainable"
      />
      <ViewToggle currentView={view} />
      <FoundationsDisplay byPillar={byPillar} view={view} />
    </>
  )
}

export default async function FoundationsPage({ searchParams }: FoundationsPageProps) {
  const { view = 'all' } = await searchParams
  const normalizedView = (VALID_VIEWS.includes(view as any) ? view : 'all') as FoundationView

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="min-h-[60vh] space-y-6">
        <FoundationsContent view={normalizedView} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to http://localhost:3000/foundations. Switch modes — rhythms should filter.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/FoundationsDisplay.tsx src/app/foundations/page.tsx
git commit -m "feat: filter foundations page by context mode"
```

---

## Task 10: Filter waiting-on page by context

**Files:**
- Create: `life-os/src/components/ui/WaitingDisplay.tsx`
- Modify: `life-os/src/app/waiting-on/page.tsx`

- [ ] **Step 1: Create `WaitingDisplay` client component**

```tsx
// src/components/ui/WaitingDisplay.tsx
'use client'
import { useContextMode } from '@/context/ContextMode'
import WaitingRow from '@/components/ui/WaitingRow'
import EmptyState from '@/components/ui/EmptyState'
import AddWaitingForm from '@/components/ui/AddWaitingForm'
import { isOverdue } from '@/lib/utils'
import type { WaitingOnItem } from '@/types'

interface WaitingDisplayProps {
  items: WaitingOnItem[]
}

export default function WaitingDisplay({ items }: WaitingDisplayProps) {
  const { mode } = useContextMode()
  const filtered = mode === 'all' ? items : items.filter(i => i.context === mode)

  const pending = filtered.filter(i => i.status === 'pending')
  const received = filtered.filter(i => i.status === 'received')
  const done = filtered.filter(i => i.status === 'done')
  const overdue = pending.filter(i => i.due_by && isOverdue(i.due_by)).length

  return (
    <>
      <div className="flex gap-4 text-sm">
        <span className="text-text">{pending.length} pending</span>
        {overdue > 0 && <span className="text-danger">⚠ {overdue} overdue</span>}
        {received.length > 0 && <span className="text-muted">{received.length} received</span>}
        {done.length > 0 && <span className="text-muted">{done.length} done</span>}
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon="⏸" title="Nothing waiting" description={mode === 'all' ? "Add items you're waiting on others to deliver." : `No ${mode} items waiting.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Item</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Waiting For</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Due By</th>
                  <th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide">Category</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(item => <WaitingRow key={item.id} item={item} />)}
                {received.map(item => <WaitingRow key={item.id} item={item} />)}
                {done.map(item => <WaitingRow key={item.id} item={item} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-lg p-4">
        <h2 className="text-sm font-semibold text-text mb-3">+ Add item</h2>
        <AddWaitingForm />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Update `waiting-on/page.tsx`**

Replace the full file:

```tsx
// src/app/waiting-on/page.tsx
import { getWaitingOn } from '@/lib/data'
import WaitingDisplay from '@/components/ui/WaitingDisplay'
import PageHeader from '@/components/layout/PageHeader'

export default async function WaitingOnPage() {
  const items = await getWaitingOn()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="⏸ Waiting On"
        subtitle="External dependencies in motion"
      />
      <WaitingDisplay items={items} />
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to http://localhost:3000/waiting-on. Switch modes — waiting items should filter.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/WaitingDisplay.tsx src/app/waiting-on/page.tsx
git commit -m "feat: filter waiting-on page by context mode"
```

---

## Task 11: Add "Move to Work / Personal" to TaskItem context menu

**Files:**
- Modify: `life-os/src/components/ui/TaskItem.tsx`

- [ ] **Step 1: Update `TaskItem.tsx`**

Add `setItemContext` import and the two new menu buttons. Replace the full file:

```tsx
'use client'
import { useState, useRef } from 'react'
import { cn, getCategoryColor } from '@/lib/utils'
import type { Item, ItemList } from '@/types'
import { toggleItem, deleteItem, moveItem, updateItemContent, archiveItem, setItemContext } from '@/lib/actions/items'

interface TaskItemProps {
  item: Item
  showCategory?: boolean
  showMove?: boolean
}

const LISTS: ItemList[] = ['inbox', 'today', 'this_week', 'admin', 'archive']
const LIST_LABELS: Record<ItemList, string> = {
  inbox: 'Inbox',
  today: 'Today',
  this_week: 'This Week',
  admin: 'Admin',
  archive: 'Archive',
}

export default function TaskItem({ item, showCategory = true, showMove = true }: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.content)
  const [showMenu, setShowMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleToggle() {
    await toggleItem(item.id, !item.completed, item.list)
  }

  async function handleSaveEdit() {
    if (editValue.trim() && editValue !== item.content) {
      await updateItemContent(item.id, editValue, item.list)
    }
    setEditing(false)
  }

  async function handleDelete() {
    setShowMenu(false)
    await deleteItem(item.id, item.list)
  }

  async function handleMove(toList: ItemList) {
    setShowMenu(false)
    await moveItem(item.id, item.list, toList)
  }

  async function handleArchive() {
    setShowMenu(false)
    await archiveItem(item.id, item.list)
  }

  async function handleSetContext(context: 'work' | 'personal') {
    setShowMenu(false)
    await setItemContext(item.id, context, item.list)
  }

  return (
    <div className={cn('group flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-surface-hover/50 transition-colors', item.completed && 'opacity-50')}>
      <button
        onClick={handleToggle}
        className={cn(
          'mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors',
          item.completed
            ? 'bg-success/20 border-success/40 text-success'
            : 'border-border hover:border-accent'
        )}
      >
        {item.completed && <span className="text-[10px]">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSaveEdit()
              if (e.key === 'Escape') { setEditValue(item.content); setEditing(false) }
            }}
            autoFocus
            className="w-full bg-surface-hover border border-accent rounded px-2 py-0.5 text-sm text-text focus:outline-none"
          />
        ) : (
          <p
            className={cn('text-sm text-text cursor-pointer', item.completed && 'line-through text-muted')}
            onDoubleClick={() => setEditing(true)}
          >
            {item.content}
          </p>
        )}
        {item.notes && !editing && (
          <p className="text-xs text-muted mt-0.5">{item.notes}</p>
        )}
        {showCategory && item.category && !editing && (
          <span className={cn('inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium border', getCategoryColor(item.category))}>
            {item.category}
          </span>
        )}
      </div>

      {showMove && (
        <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-muted hover:text-text text-sm px-1"
          >
            ···
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-6 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-36">
                <button onClick={() => setEditing(true)} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover">Edit</button>
                {item.list !== 'archive' && (
                  <button onClick={handleArchive} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover">Archive</button>
                )}
                <div className="border-t border-border my-1" />
                {LISTS.filter(l => l !== item.list && l !== 'archive').map(l => (
                  <button key={l} onClick={() => handleMove(l)} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                    Move to {LIST_LABELS[l]}
                  </button>
                ))}
                <div className="border-t border-border my-1" />
                {item.context !== 'work' && (
                  <button onClick={() => handleSetContext('work')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                    Move to Work
                  </button>
                )}
                {item.context !== 'personal' && (
                  <button onClick={() => handleSetContext('personal')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                    Move to Personal
                  </button>
                )}
                <div className="border-t border-border my-1" />
                <button onClick={handleDelete} className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-surface-hover">Delete</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Go to http://localhost:3000/tasks. Hover a task → click `···` → verify "Move to Work" and "Move to Personal" appear in the menu. Click "Move to Work" on a task. Switch to Work mode — that task should now appear. Switch to Personal — it should be gone.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/TaskItem.tsx
git commit -m "feat: add Move to Work/Personal to task context menu"
```

---

## Task 12: Add "Move to Work / Personal" to ProjectCard

**Files:**
- Modify: `life-os/src/components/ui/ProjectCard.tsx`

- [ ] **Step 1: Update `ProjectCard.tsx`**

Add a context menu button in the card header. Replace the full file:

```tsx
'use client'
import { useState } from 'react'
import { cn, getStatusColor, truncate } from '@/lib/utils'
import type { Project, ProjectTask } from '@/types'
import { toggleProjectTask, addProjectTask, promoteProject, setProjectContext } from '@/lib/actions/projects'

interface ProjectCardProps {
  project: Project
  tasks: ProjectTask[]
  showPromote?: boolean
  promoteLabel?: string
  promoteType?: 'active' | 'horizon'
}

export default function ProjectCard({ project, tasks, showPromote, promoteLabel, promoteType }: ProjectCardProps) {
  const [addingTask, setAddingTask] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  const completedTasks = tasks.filter(t => t.completed).length
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  async function handleAddTask() {
    if (!newTask.trim()) return
    await addProjectTask(project.id, newTask)
    setNewTask('')
    setAddingTask(false)
  }

  async function handlePromote() {
    if (!promoteType) return
    await promoteProject(project.id, promoteType)
  }

  async function handleSetContext(context: 'work' | 'personal') {
    setShowMenu(false)
    await setProjectContext(project.id, context)
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-border/80 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text">{project.name}</h3>
          {project.purpose && (
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{truncate(project.purpose, 90)}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', getStatusColor(project.status))}>
            {project.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-muted hover:text-text text-sm px-1"
            >
              ···
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-6 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-36">
                  {project.context !== 'work' && (
                    <button onClick={() => handleSetContext('work')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                      Move to Work
                    </button>
                  )}
                  {project.context !== 'personal' && (
                    <button onClick={() => handleSetContext('personal')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                      Move to Personal
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Energy + Urgency */}
      {(project.energy_level || project.urgency_level) && (
        <div className="flex items-center gap-4">
          {project.energy_level && (
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] text-muted uppercase tracking-wide w-12">Energy</span>
              <div className="flex-1 h-1 bg-surface-hover rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${project.energy_level * 10}%` }} />
              </div>
              <span className="text-[10px] text-muted w-4">{project.energy_level}</span>
            </div>
          )}
          {project.urgency_level && (
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] text-muted uppercase tracking-wide w-12">Urgency</span>
              <div className="flex-1 h-1 bg-surface-hover rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: `${project.urgency_level * 10}%` }} />
              </div>
              <span className="text-[10px] text-muted w-4">{project.urgency_level}</span>
            </div>
          )}
        </div>
      )}

      {/* Revenue potential */}
      {project.revenue_potential && (
        <p className="text-[11px] text-success/80 bg-success/5 border border-success/10 rounded px-2 py-1">
          💰 {project.revenue_potential}
        </p>
      )}

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted uppercase tracking-wide">Next Actions</span>
            <span className="text-[10px] text-muted">{completedTasks}/{tasks.length}</span>
          </div>
          {tasks.length > 0 && (
            <div className="h-0.5 bg-surface-hover rounded-full mb-2">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {tasks.slice(0, 4).map(task => (
            <label key={task.id} className="flex items-start gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={async () => await toggleProjectTask(task.id, !task.completed)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-border accent-accent shrink-0"
              />
              <span className={cn('text-xs leading-relaxed', task.completed ? 'line-through text-muted' : 'text-text/80')}>
                {task.content}
              </span>
            </label>
          ))}
          {tasks.length > 4 && (
            <p className="text-[11px] text-muted pl-5">+{tasks.length - 4} more</p>
          )}
        </div>
      )}

      {/* Add task */}
      {addingTask ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAddTask()
              if (e.key === 'Escape') { setNewTask(''); setAddingTask(false) }
            }}
            autoFocus
            placeholder="Add next action..."
            className="flex-1 bg-surface-hover border border-border rounded px-2 py-1 text-xs text-text placeholder:text-muted focus:outline-none focus:border-accent"
          />
          <button onClick={handleAddTask} className="text-xs text-accent">Add</button>
          <button onClick={() => setAddingTask(false)} className="text-xs text-muted">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setAddingTask(true)}
          className="text-left text-xs text-muted hover:text-text transition-colors"
        >
          + Add action
        </button>
      )}

      {/* Promote button */}
      {showPromote && promoteType && (
        <button
          onClick={handlePromote}
          className="w-full py-1.5 text-xs font-medium text-accent border border-accent/30 rounded hover:bg-accent/10 transition-colors"
        >
          {promoteLabel || `Promote to ${promoteType}`} →
        </button>
      )}

      {/* Why now / timeline */}
      {project.timeline && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted border-t border-border pt-2">
          <span>⏱</span>
          <span>{project.timeline}</span>
          {project.why_now && <span>· {truncate(project.why_now, 60)}</span>}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Go to http://localhost:3000/projects. Click `···` on a project card → "Move to Work" should appear. Click it, then switch to Work mode — the project should appear there.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ProjectCard.tsx
git commit -m "feat: add Move to Work/Personal to project card menu"
```

---

## Task 13: Add "Move to Work / Personal" to FoundationCard items

**Files:**
- Modify: `life-os/src/components/ui/FoundationCard.tsx`

- [ ] **Step 1: Replace `FoundationCard.tsx` with this updated version**

```tsx
'use client'
import { useState } from 'react'
import { cn, getPillarIcon, getPillarLabel } from '@/lib/utils'
import type { FoundationItem, FoundationPillar } from '@/types'
import { toggleFoundationItem, setFoundationItemContext } from '@/lib/actions/foundations'

interface FoundationCardProps {
  pillar: FoundationPillar
  items: FoundationItem[]
}

export default function FoundationCard({ pillar, items }: FoundationCardProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const completed = items.filter(i => i.completed_this_week).length
  const total = items.length
  const allDone = completed === total && total > 0
  const scorePercent = total > 0 ? Math.round((completed / total) * 100) : 0

  async function handleSetContext(id: string, context: 'work' | 'personal') {
    setOpenMenuId(null)
    await setFoundationItemContext(id, context)
  }

  return (
    <div className={cn(
      'bg-surface border rounded-lg p-4 flex flex-col gap-3',
      allDone ? 'border-success/40' : 'border-border'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getPillarIcon(pillar)}</span>
          <h3 className="text-sm font-semibold text-text">{getPillarLabel(pillar)}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{completed}/{total}</span>
          {allDone && <span className="text-xs text-success">✓</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-surface-hover rounded-full">
        <div
          className={cn('h-full rounded-full transition-all', allDone ? 'bg-success' : 'bg-accent')}
          style={{ width: `${scorePercent}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-2.5 group">
            <input
              type="checkbox"
              checked={item.completed_this_week}
              onChange={async () => await toggleFoundationItem(item.id, !item.completed_this_week)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-border accent-success shrink-0 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <span className={cn(
                'text-xs leading-relaxed block',
                item.completed_this_week ? 'line-through text-muted' : 'text-text/80'
              )}>
                {item.content}
              </span>
              {item.rhythm_type && (
                <span className="text-[10px] text-muted/60">{item.rhythm_type}</span>
              )}
            </div>
            <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                className="text-muted hover:text-text text-sm px-1"
              >
                ···
              </button>
              {openMenuId === item.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute right-0 top-6 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-36">
                    {item.context !== 'work' && (
                      <button onClick={() => handleSetContext(item.id, 'work')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                        Move to Work
                      </button>
                    )}
                    {item.context !== 'personal' && (
                      <button onClick={() => handleSetContext(item.id, 'personal')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                        Move to Personal
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Go to http://localhost:3000/foundations. Hover a rhythm item — a `···` button should appear. Click it → "Move to Work" / "Move to Personal" options appear. Move an item to Work, switch to Work mode — it should appear.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FoundationCard.tsx
git commit -m "feat: add Move to Work/Personal to foundation item menu"
```

---

## Task 14: Add "Move to Work / Personal" to WaitingRow

**Files:**
- Modify: `life-os/src/components/ui/WaitingRow.tsx`

- [ ] **Step 1: Replace `WaitingRow.tsx` with this updated version**

Add "Move to Work / Personal" to the existing status dropdown menu, separated by a divider:

```tsx
'use client'
import { cn, getWaitingStatusColor, formatDate, isOverdue } from '@/lib/utils'
import type { WaitingOnItem, WaitingStatus } from '@/types'
import { updateWaitingStatus, deleteWaitingItem, setWaitingItemContext } from '@/lib/actions/waiting'
import { useState } from 'react'

interface WaitingRowProps {
  item: WaitingOnItem
}

const STATUSES: WaitingStatus[] = ['pending', 'received', 'done']

export default function WaitingRow({ item }: WaitingRowProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const overdue = isOverdue(item.due_by)

  async function handleSetContext(context: 'work' | 'personal') {
    setShowContextMenu(false)
    await setWaitingItemContext(item.id, context)
  }

  return (
    <tr className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm text-text">{item.item}</p>
        {item.notes && <p className="text-xs text-muted mt-0.5">{item.notes}</p>}
      </td>
      <td className="px-4 py-3 text-sm text-muted">{item.waiting_for}</td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={cn('px-2 py-0.5 rounded text-xs font-medium border transition-colors', getWaitingStatusColor(item.status))}
          >
            {item.status}
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute left-0 top-7 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-28">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={async () => { setShowMenu(false); await updateWaitingStatus(item.id, s) }}
                    className={cn('w-full text-left px-3 py-1.5 text-xs hover:bg-surface-hover', s === item.status ? 'text-accent' : 'text-text')}
                  >
                    {s}
                  </button>
                ))}
                <div className="border-t border-border my-1" />
                <button onClick={async () => { setShowMenu(false); await deleteWaitingItem(item.id) }} className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-surface-hover">Delete</button>
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {item.due_by && (
          <span className={cn('text-xs', overdue && item.status === 'pending' ? 'text-danger' : 'text-muted')}>
            {overdue && item.status === 'pending' ? '⚠ ' : ''}{formatDate(item.due_by)}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {item.category && (
          <span className="text-xs text-muted bg-surface-hover px-1.5 py-0.5 rounded">
            {item.category.replace('_', ' ')}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setShowContextMenu(!showContextMenu)}
            className="text-muted hover:text-text text-sm px-1"
          >
            ···
          </button>
          {showContextMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowContextMenu(false)} />
              <div className="absolute right-0 top-6 z-50 bg-surface border border-border rounded-md shadow-lg py-1 min-w-36">
                {item.context !== 'work' && (
                  <button onClick={() => handleSetContext('work')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                    Move to Work
                  </button>
                )}
                {item.context !== 'personal' && (
                  <button onClick={() => handleSetContext('personal')} className="w-full text-left px-3 py-1.5 text-xs text-muted hover:bg-surface-hover">
                    Move to Personal
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
```

Note: this adds a new `···` column to the right. Also update the table header in `WaitingDisplay.tsx` to add an empty `<th>` for this column:

```tsx
<th className="px-4 py-2.5 text-left text-[10px] text-muted uppercase tracking-wide"></th>
```

- [ ] **Step 2: Verify in browser**

Go to http://localhost:3000/waiting-on. Click `···` on a row → "Move to Work" / "Move to Personal" options appear. Move an item, switch modes — it filters correctly.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/WaitingRow.tsx src/components/ui/WaitingDisplay.tsx
git commit -m "feat: add Move to Work/Personal to waiting-on row"
```

---

## Task 15: Auto-tag new items with active context

**Files:**
- Modify: `life-os/src/lib/actions/items.ts`
- Modify: `life-os/src/components/ui/QuickCapture.tsx`
- Modify: `life-os/src/components/ui/ChatBar.tsx`
- Modify: `life-os/src/app/api/chat/route.ts`

New items should be tagged with the active context mode. The active mode lives in localStorage (client-side), so it must be passed to server actions as a parameter.

- [ ] **Step 1: Update `addItemDirect` to accept optional context**

In `src/lib/actions/items.ts`, update `addItemDirect`:

```ts
export async function addItemDirect(content: string, list: ItemList, context: ItemContext = 'personal') {
  const supabase = await createClient()
  if (!content?.trim() || !list) return
  if (!supabase) {
    console.warn('Supabase not configured — item not persisted')
    revalidatePath(listToPath(list))
    return
  }
  await supabase.from('items').insert({ content: content.trim(), list, context })
  revalidatePath(listToPath(list))
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}
```

Ensure `ItemContext` is in the import at the top:

```ts
import type { ItemList, ItemCategory, ItemContext } from '@/types'
```

- [ ] **Step 2: Update `QuickCapture` to read and pass active context**

Replace `src/components/ui/QuickCapture.tsx`:

```tsx
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
```

- [ ] **Step 3: Update `ChatBar` to pass context in API requests**

Read `src/components/ui/ChatBar.tsx`. Find the `fetch` call that POSTs to `/api/chat`. Add `context` to the request body:

```ts
const { mode } = useContextMode()
// ... in the fetch call:
body: JSON.stringify({ message, currentPath, history, context: mode === 'work' ? 'work' : 'personal' }),
```

- [ ] **Step 4: Update the chat API route to use context**

In `src/app/api/chat/route.ts`, destructure `context` from the request body and pass it to `addItemDirect`:

```ts
const { message, currentPath, history, context = 'personal' } = await request.json()
```

Then in `executeTool`:

```ts
case 'add_item':
  return await addItemDirect(input.content as string, input.list as ItemList, context as ItemContext)
```

To make `context` available inside `executeTool`, wrap it or pass it as a closure. The cleanest way is to define `executeTool` inside the `POST` handler so it closes over `context`:

Move `executeTool` definition inside the `POST` handler function (just before the `response` call), changing:

```ts
async function executeTool(toolName: string, input: Record<string, unknown>): Promise<unknown> {
```

to an inner `const`:

```ts
const executeTool = async (toolName: string, input: Record<string, unknown>): Promise<unknown> => {
```

Then it will close over the `context` variable.

Also add `ItemContext` to imports:

```ts
import type { ItemList, ItemContext } from '@/types'
```

- [ ] **Step 5: Verify in browser**

Switch to Work mode. Add a task via QuickCapture (if present on any page) — switch to All mode and verify the new task has work context (it should appear when switching back to Work mode). Do the same via the ChatBar.

- [ ] **Step 6: Commit**

```bash
git add src/lib/actions/items.ts src/components/ui/QuickCapture.tsx src/components/ui/ChatBar.tsx src/app/api/chat/route.ts
git commit -m "feat: auto-tag new items with active context mode"
```

---

## Final Verification

- [ ] Toggle between All / Personal / Work on the tasks page — items filter correctly
- [ ] Toggle between modes on projects, foundations, waiting-on — all filter correctly
- [ ] Move a task to Work via right-click menu, switch to Work mode — it appears; switch to Personal — it's gone
- [ ] Refresh the page — toggle state is remembered from localStorage
- [ ] Switch to Work mode and create a task via ChatBar — it should default to work context (verify in All mode that it's tagged correctly)
- [ ] Default (first-time visit): mode is `all`, nothing is hidden

---

## Save Plan

Save this plan to `docs/superpowers/plans/2026-04-22-work-personal-context-toggle.md` at the start of execution.
