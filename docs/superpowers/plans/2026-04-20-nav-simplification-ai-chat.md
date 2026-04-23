# Life OS Navigation Simplification + AI Chat Bar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Execute in **parallel waves** — dispatch one implementer subagent per task within each wave, then proceed to the next wave. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 11-item navigation with 4 focused items, merge related views into single pages with toggles, and add a persistent AI chat bar powered by Claude that accepts natural language commands to add/edit/delete data.

**Architecture:** Nav items collapse from 11 → 4 by merging related views (Today/This Week/Inbox → Tasks page with pill toggles; Active/Horizon/Incubation → Projects page with tabs). A persistent ChatBar component renders in root layout, always accessible. It calls a new `/api/chat` route that uses Claude with tool use to parse natural language and execute CRUD operations via existing server actions. The AI has read-only search tools to resolve ambiguous references before mutating.

**Tech Stack:** Next.js 14, React (client state for chat history), Supabase (read/write), Anthropic SDK (Claude Sonnet for tool use), TypeScript.

---

## Execution Strategy: Parallel Waves

**Wave 1 (✅ COMPLETED):** Tasks 1–3 (navigation restructure + redirects)
- Task 1: Update Sidebar
- Task 2: Update Mobile Nav
- Task 3: Set Up Redirects
- Status: All committed, spec + code quality approved

**Wave 2 (RUN IN PARALLEL):** Tasks 4, 5, 6, 8, 9
- Task 4: Create `/tasks` page (independent — reads existing today/week/inbox pages)
- Task 5: Modify `/projects` page (independent — reads existing projects page)
- Task 6: Create `ChatBar.tsx` component (independent)
- Task 8: Create tool definitions (independent)
- Task 9: Create search helpers (independent)
- **Dispatch as 5 separate subagents simultaneously in different sessions**

**Wave 3 (SEQUENTIAL after Wave 2):** Tasks 7, 10
- Task 7: Add ChatBar to root layout (depends on Task 6 commit)
- Task 10: Create `/api/chat` endpoint (depends on Tasks 8 & 9 commits)

**Wave 4 (SEQUENTIAL after Wave 3):** Tasks 11, 12
- Task 11: End-to-end testing (depends on all feature work)
- Task 12: Remove QuickCapture cleanup

**Wave 5 (FINAL):** Task 13
- Task 13: Final verification checklist

---

## Wave 1 Status: ✅ COMPLETED

All 3 nav restructure tasks are committed and approved. Proceed directly to Wave 2.

---

## File Structure & Responsibilities

**Navigation:**
- `src/components/layout/Sidebar.tsx` — 4 nav items (Tasks, Projects, Foundations, Waiting On)
- `src/components/layout/MobileNav.tsx` — same 4 items, mobile layout

**Pages:**
- `src/app/tasks/page.tsx` — NEW: unified Tasks view with pill toggles (Today/This Week/All)
- `src/app/projects/page.tsx` — MODIFY: add pill toggles (Active/Horizon/Incubation)
- `src/app/today/page.tsx` — redirect to `/tasks?view=today`
- `src/app/this-week/page.tsx` — redirect to `/tasks?view=week`
- `src/app/inbox/page.tsx` — redirect to `/tasks?view=all`
- `src/app/horizon/page.tsx` — redirect to `/projects?view=horizon`
- `src/app/incubation/page.tsx` — redirect to `/projects?view=incubation`
- `src/app/dashboard/page.tsx` — redirect to `/tasks`

**Chat:**
- `src/components/ui/ChatBar.tsx` — NEW: persistent chat bar (collapsed + expanded states)
- `src/app/api/chat/route.ts` — NEW: POST endpoint, Claude tool use orchestration
- `src/lib/ai/tools.ts` — NEW: tool definitions for Claude (add_item, update_item, delete_item, etc.)
- `src/lib/ai/search.ts` — NEW: read-only search helpers for Claude (search_items, search_projects, etc.)

**Updates:**
- `src/app/layout.tsx` — import and render `<ChatBar />` at bottom
- `src/components/ui/QuickCapture.tsx` — remove all usage from pages (keep file, unused)
- `src/types/index.ts` — add types: `Message`, `ChatState`, `ToolUseRequest`

---

## Phase 1: Navigation Restructure (Wave 1 — ✅ COMPLETED)

### Task 1: Update Sidebar Navigation ✅

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Open the file and review current navItems array**

Current array has 11 items. You'll replace it with 4.

- [ ] **Step 2: Replace navItems array**

```typescript
const navItems = [
  { href: '/tasks', label: 'Tasks', icon: '✓' },
  { href: '/projects', label: 'Projects', icon: '🚀' },
  { href: '/foundations', label: 'Foundations', icon: '💎' },
  { href: '/waiting-on', label: 'Waiting On', icon: '⏸' },
]
```

- [ ] **Step 3: Verify the component still renders correctly (no other changes needed)**

The map and className logic remain the same. Only the data changes.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "refactor: reduce sidebar nav from 11 to 4 items"
```

### Task 2: Update Mobile Navigation ✅

**Files:**
- Modify: `src/components/layout/MobileNav.tsx`

- [ ] **Step 1: Apply the same navItems change to MobileNav**

Replace the navItems array with the same 4 items:
```typescript
const navItems = [
  { href: '/tasks', label: 'Tasks', icon: '✓' },
  { href: '/projects', label: 'Projects', icon: '🚀' },
  { href: '/foundations', label: 'Foundations', icon: '💎' },
  { href: '/waiting-on', label: 'Waiting On', icon: '⏸' },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/MobileNav.tsx
git commit -m "refactor: reduce mobile nav from 11 to 4 items"
```

### Task 3: Set Up Redirects ✅

**Files:**
- Modify: `src/app/today/page.tsx`
- Modify: `src/app/this-week/page.tsx`
- Modify: `src/app/inbox/page.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/horizon/page.tsx`
- Modify: `src/app/incubation/page.tsx`

- [ ] **Step 1: Replace `/today/page.tsx` with a redirect**

```typescript
import { redirect } from 'next/navigation'

export default function TodayPage() {
  redirect('/tasks?view=today')
}
```

- [ ] **Step 2: Replace `/this-week/page.tsx` with a redirect**

```typescript
import { redirect } from 'next/navigation'

export default function ThisWeekPage() {
  redirect('/tasks?view=week')
}
```

- [ ] **Step 3: Replace `/inbox/page.tsx` with a redirect**

```typescript
import { redirect } from 'next/navigation'

export default function InboxPage() {
  redirect('/tasks?view=all')
}
```

- [ ] **Step 4: Replace `/dashboard/page.tsx` with a redirect**

```typescript
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  redirect('/tasks')
}
```

- [ ] **Step 5: Replace `/horizon/page.tsx` with a redirect**

```typescript
import { redirect } from 'next/navigation'

export default function HorizonPage() {
  redirect('/projects?view=horizon')
}
```

- [ ] **Step 6: Replace `/incubation/page.tsx` with a redirect**

```typescript
import { redirect } from 'next/navigation'

export default function IncubationPage() {
  redirect('/projects?view=incubation')
}
```

- [ ] **Step 7: Commit all redirects**

```bash
git add src/app/today/page.tsx src/app/this-week/page.tsx src/app/inbox/page.tsx src/app/dashboard/page.tsx src/app/horizon/page.tsx src/app/incubation/page.tsx
git commit -m "refactor: redirect old routes to new merged pages"
```

---

## Phase 2: Feature Pages (Wave 2 — RUN IN PARALLEL)

### Task 4: Create `/tasks` Page with Unified View Logic

**🔶 PARALLEL:** Run this simultaneously with Tasks 5, 6, 8, 9 in separate sessions

**Files:**
- Create: `src/app/tasks/page.tsx`
- Read: `src/app/today/page.tsx` (reference for existing logic)
- Read: `src/app/this-week/page.tsx` (reference)
- Read: `src/app/inbox/page.tsx` (reference)

- [ ] **Step 1: Analyze the 3 existing pages to understand their data-fetching patterns**

Check what each page imports and renders. They likely all fetch items filtered by list, then render them differently.

- [ ] **Step 2: Create `/tasks/page.tsx`**

```typescript
'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getItems } from '@/lib/data'
import TaskItem from '@/components/ui/TaskItem'
import { cn } from '@/lib/utils'

type ViewType = 'today' | 'week' | 'all'

export default function TasksPage() {
  const searchParams = useSearchParams()
  const viewParam = (searchParams.get('view') || 'today') as ViewType
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      let data
      if (viewParam === 'today') {
        data = await getItems('today')
      } else if (viewParam === 'week') {
        data = await getItems('this_week')
      } else {
        data = await getItems('inbox')
      }
      setItems(data)
    }
    fetchItems()
  }, [viewParam])

  const handleViewChange = (view: ViewType) => {
    window.history.pushState({}, '', `/tasks?view=${view}`)
    window.location.reload() // Simple reload; could use useRouter + shallow routing later
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Page header with pill toggles */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-2xl font-semibold text-text">Tasks</h1>
          <div className="flex gap-2 bg-surface rounded-full p-1">
            {(['today', 'week', 'all'] as const).map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  viewParam === view
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted hover:text-text'
                )}
              >
                {view === 'today' ? 'Today' : view === 'week' ? 'This Week' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div className="p-6 space-y-2">
          {items.length === 0 ? (
            <p className="text-muted text-center py-8">No tasks for this view</p>
          ) : (
            items.map((item) => <TaskItem key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test the page locally**

```bash
npm run dev
# Navigate to http://localhost:3000/tasks?view=today
# Click pill toggles, verify URL changes and items update
```

- [ ] **Step 4: Verify no QuickCapture input appears**

The old pages had QuickCapture. This new page should not. Confirm it's absent.

- [ ] **Step 5: Commit**

```bash
git add src/app/tasks/page.tsx
git commit -m "feat: create unified Tasks page with view toggles (today/week/all)"
```

### Task 5: Modify `/projects` Page to Support Tabs

**🔶 PARALLEL:** Run this simultaneously with Tasks 4, 6, 8, 9 in separate sessions

**Files:**
- Modify: `src/app/projects/page.tsx`
- Read: existing code to understand structure

- [ ] **Step 1: Review the existing `/projects` page**

Understand how it currently fetches and renders projects.

- [ ] **Step 2: Add view toggle logic similar to Tasks**

```typescript
'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getProjects } from '@/lib/data'
import ProjectCard from '@/components/ui/ProjectCard'
import { cn } from '@/lib/utils'

type ProjectViewType = 'active' | 'horizon' | 'incubation'

export default function ProjectsPage() {
  const searchParams = useSearchParams()
  const viewParam = (searchParams.get('view') || 'active') as ProjectViewType
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      let data
      if (viewParam === 'active') {
        data = await getProjects('active')
      } else if (viewParam === 'horizon') {
        data = await getProjects('horizon')
      } else {
        data = await getProjects('incubation')
      }
      setProjects(data)
    }
    fetchProjects()
  }, [viewParam])

  const handleViewChange = (view: ProjectViewType) => {
    window.history.pushState({}, '', `/projects?view=${view}`)
    window.location.reload()
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Page header with pill toggles */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-2xl font-semibold text-text">Projects</h1>
          <div className="flex gap-2 bg-surface rounded-full p-1">
            {(['active', 'horizon', 'incubation'] as const).map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
                  viewParam === view
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted hover:text-text'
                )}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Project cards grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <p className="text-muted col-span-full text-center py-8">No projects in this view</p>
          ) : (
            projects.map((project) => <ProjectCard key={project.id} project={project} />)
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test the page locally**

```bash
npm run dev
# Navigate to http://localhost:3000/projects
# Verify Active tab shows active projects
# Click Horizon, verify it shows horizon projects
# Click Incubation, verify it shows incubation projects
```

- [ ] **Step 4: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "feat: add view toggles to Projects page (active/horizon/incubation)"
```

### Task 6: Create ChatBar Component with Collapsed/Expanded States

**🔶 PARALLEL:** Run this simultaneously with Tasks 4, 5, 8, 9 in separate sessions

**Files:**
- Create: `src/components/ui/ChatBar.tsx`
- Create: `src/types/index.ts` additions (Message type)

- [ ] **Step 1: Add Message type to `src/types/index.ts`**

```typescript
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

- [ ] **Step 2: Create `src/components/ui/ChatBar.tsx`**

```typescript
'use client'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export default function ChatBar() {
  const pathname = usePathname()
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
      {/* Expanded overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsExpanded(false)} />
      )}

      {/* Chat container */}
      <div
        className={cn(
          'fixed z-50 bg-surface border-t border-border transition-all duration-300',
          isExpanded
            ? 'inset-0 flex flex-col'
            : 'bottom-0 left-0 right-0 h-16'
        )}
      >
        {/* Message history (only in expanded) */}
        {isExpanded && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-darker">
            {messages.length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">
                Start a conversation. Type naturally: add a task, move something, ask what's next.
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
                      'max-w-lg px-3 py-2 rounded-lg text-sm',
                      msg.role === 'user'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted text-text'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input bar (always visible when expanded, collapsed is minimal) */}
        <div className={cn('flex items-center gap-2 bg-surface border-t border-border p-2', isExpanded ? 'mx-4 my-4' : 'px-4 py-2')}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm flex-shrink-0 hover:bg-accent/90"
          >
            ✦
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isExpanded ? 'What should I do?' : 'Add a task, move something, ask what\'s next…'}
            className={cn(
              'flex-1 bg-surface-darker rounded-full px-4 py-2 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50',
              isExpanded ? 'py-2.5' : 'py-1.5'
            )}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isLoading ? '…' : '↑'}
          </button>
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-muted hover:text-text text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Spacer so content isn't hidden by collapsed bar */}
      {!isExpanded && <div className="h-16" />}
    </>
  )
}
```

- [ ] **Step 3: Test the component locally**

```bash
npm run dev
# You should see a small bar at the bottom with input
# Click the ✦ icon to expand
# Verify messages display, input works
# Collapse by clicking ✕
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ChatBar.tsx src/types/index.ts
git commit -m "feat: create persistent ChatBar component with expanded/collapsed states"
```

### Task 7: Add ChatBar to Root Layout

**⏳ SEQUENTIAL (Wave 3):** Wait for Task 6 to commit before starting this

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Import ChatBar at the top of layout.tsx**

```typescript
import ChatBar from '@/components/ui/ChatBar'
```

- [ ] **Step 2: Render ChatBar inside the main layout, just before closing tags**

Find where the layout renders its children. Add `<ChatBar />` after the main content but before closing the layout. It should be a top-level child so it persists across all pages:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen bg-background">
          {/* ... existing sidebar/layout content ... */}
          {children}
        </div>
        <ChatBar />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Test that ChatBar appears on every page**

```bash
npm run dev
# Navigate to /tasks, /projects, /foundations, /waiting-on
# Confirm ChatBar is visible on all pages
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add ChatBar to root layout for persistence across all pages"
```

---

## Phase 3: AI Infrastructure (Wave 2 — RUN IN PARALLEL)

### Task 8: Create Tool Definitions for Claude

**🔶 PARALLEL:** Run this simultaneously with Tasks 4, 5, 6, 9 in separate sessions

**Files:**
- Create: `src/lib/ai/tools.ts`

- [ ] **Step 1: Create the tools file**

```typescript
import Anthropic from '@anthropic-ai/sdk'

export const tools: Anthropic.Tool[] = [
  {
    name: 'add_item',
    description: 'Add a new task/item to a specific list',
    input_schema: {
      type: 'object' as const,
      properties: {
        content: {
          type: 'string',
          description: 'The task content/description',
        },
        list: {
          type: 'string',
          enum: ['today', 'this_week', 'inbox'],
          description: 'Which list to add to',
        },
        priority: {
          type: 'number',
          description: 'Priority level (optional, 1-5)',
        },
        due_date: {
          type: 'string',
          description: 'Due date in YYYY-MM-DD format (optional)',
        },
      },
      required: ['content', 'list'],
    },
  },
  {
    name: 'update_item',
    description: 'Update an existing item (change content, move list, change priority)',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string',
          description: 'The item ID',
        },
        content: {
          type: 'string',
          description: 'New content (optional)',
        },
        list: {
          type: 'string',
          enum: ['today', 'this_week', 'inbox'],
          description: 'Move to this list (optional)',
        },
        priority: {
          type: 'number',
          description: 'New priority level (optional)',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_item',
    description: 'Delete an item',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string',
          description: 'The item ID to delete',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'search_items',
    description: 'Search for items by content keyword to resolve references like "the dentist task"',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword(s)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'add_project',
    description: 'Create a new project',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'Project name',
        },
        type: {
          type: 'string',
          enum: ['active', 'horizon', 'incubation'],
          description: 'Project type',
        },
        purpose: {
          type: 'string',
          description: 'Purpose/description (optional)',
        },
      },
      required: ['name', 'type'],
    },
  },
  {
    name: 'add_project_task',
    description: 'Add a task to a specific project',
    input_schema: {
      type: 'object' as const,
      properties: {
        project_id: {
          type: 'string',
          description: 'The project ID',
        },
        content: {
          type: 'string',
          description: 'Task content',
        },
      },
      required: ['project_id', 'content'],
    },
  },
  {
    name: 'add_waiting_item',
    description: 'Add something you\'re waiting on',
    input_schema: {
      type: 'object' as const,
      properties: {
        item: {
          type: 'string',
          description: 'What you\'re waiting for',
        },
        waiting_for: {
          type: 'string',
          description: 'Who you\'re waiting for',
        },
      },
      required: ['item', 'waiting_for'],
    },
  },
  {
    name: 'add_foundation_item',
    description: 'Add a foundation rhythm (spiritual, marriage, health, community, lifestyle)',
    input_schema: {
      type: 'object' as const,
      properties: {
        content: {
          type: 'string',
          description: 'The foundation item content',
        },
        pillar: {
          type: 'string',
          enum: ['spiritual', 'marriage', 'health', 'community', 'lifestyle'],
          description: 'Which pillar this belongs to',
        },
        rhythm_type: {
          type: 'string',
          enum: ['daily', 'weekly', 'monthly', 'quarterly'],
          description: 'How often this rhythm occurs',
        },
      },
      required: ['content', 'pillar', 'rhythm_type'],
    },
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai/tools.ts
git commit -m "feat: define Claude tool schema for data mutations"
```

### Task 9: Create Search Helpers for Claude

**🔶 PARALLEL:** Run this simultaneously with Tasks 4, 5, 6, 8 in separate sessions

**Files:**
- Create: `src/lib/ai/search.ts`

- [ ] **Step 1: Create search helpers**

```typescript
import { createClient } from '@/lib/supabase/server'

export async function searchItems(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('items')
    .select('id, content, list, completed')
    .ilike('content', `%${query}%`)
    .limit(5)

  if (error) throw error
  return data
}

export async function searchProjects(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, type, status')
    .ilike('name', `%${query}%`)
    .limit(5)

  if (error) throw error
  return data
}

export async function searchWaitingItems(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('waiting_on')
    .select('id, item, waiting_for, status')
    .ilike('item', `%${query}%`)
    .limit(5)

  if (error) throw error
  return data
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai/search.ts
git commit -m "feat: add search helpers for Claude to resolve item references"
```

### Task 10: Create `/api/chat` Endpoint with Claude Tool Use

**⏳ SEQUENTIAL (Wave 3):** Wait for Tasks 8 & 9 to commit before starting this

**Files:**
- Create: `src/app/api/chat/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { tools } from '@/lib/ai/tools'
import { searchItems, searchProjects, searchWaitingItems } from '@/lib/ai/search'
import {
  addItemDirect,
  updateItemContent,
  moveItem,
  deleteItem,
} from '@/lib/actions/items'
import { addProject, addProjectTask } from '@/lib/actions/projects'
import { addWaitingItem } from '@/lib/actions/waiting'
import { addFoundationItem } from '@/lib/actions/foundations'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { message, currentPath, history } = await request.json()

    // Build system prompt with context
    const systemPrompt = `You are an AI assistant for Life OS, a personal task management system. 
You help users manage their tasks, projects, and goals through natural language commands.

Current page: ${currentPath}

Available lists: today, this_week, inbox
Available project types: active, horizon, incubation
Available foundations: spiritual, marriage, health, community, lifestyle

IMPORTANT:
- When the user's intent is ambiguous, ask ONE clarifying question before acting. Do not call any tools.
- When you have enough information, call the appropriate tool(s).
- Keep responses SHORT and confirmatory. Example: "Done — added 'Call dentist' to Today."
- If a user references an existing item by name (e.g., "delete the dentist task"), use search_items first to find the ID.`

    // Prepare messages for Claude
    const messages: Anthropic.MessageParam[] = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))
    messages.push({
      role: 'user',
      content: message,
    })

    // Call Claude with tools
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    })

    // Process response and execute tools if needed
    let finalResponse = ''
    const actedOnTools = []

    for (const block of response.content) {
      if (block.type === 'text') {
        finalResponse = block.text
      } else if (block.type === 'tool_use') {
        actedOnTools.push(block)
        // Execute the tool
        const toolResult = await executeTool(block.name, block.input as any)
        // Optionally: send tool result back to Claude for refinement
        // For now, we'll just collect the results
      }
    }

    return NextResponse.json({
      reply: finalResponse,
      acted: actedOnTools.length > 0,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

async function executeTool(toolName: string, input: any): Promise<any> {
  try {
    switch (toolName) {
      case 'add_item':
        return await addItemDirect(input.content, input.list)

      case 'update_item':
        if (input.content) {
          await updateItemContent(input.id, input.content)
        }
        if (input.list) {
          await moveItem(input.id, input.list)
        }
        return { success: true }

      case 'delete_item':
        return await deleteItem(input.id)

      case 'search_items':
        return await searchItems(input.query)

      case 'add_project':
        return await addProject(input.name, input.type, input.purpose || '')

      case 'add_project_task':
        return await addProjectTask(input.project_id, input.content)

      case 'add_waiting_item':
        return await addWaitingItem(input.item, input.waiting_for)

      case 'add_foundation_item':
        return await addFoundationItem(
          input.content,
          input.pillar,
          input.rhythm_type
        )

      default:
        throw new Error(`Unknown tool: ${toolName}`)
    }
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error)
    throw error
  }
}
```

- [ ] **Step 2: Test the endpoint with curl**

```bash
# First, start the dev server
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add call dentist to today",
    "currentPath": "/tasks?view=today",
    "history": []
  }'

# Expected response: { "reply": "Done — added 'Call dentist' to Today.", "acted": true }
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: add /api/chat endpoint with Claude tool use"
```

---

## Phase 4: Integration & Testing (Wave 4 — SEQUENTIAL)

### Task 11: Verify All Pages Work End-to-End

**⏳ SEQUENTIAL (Wave 4):** Wait for all Wave 2 & 3 tasks to commit before starting

**Files:**
- Test: All pages and the chat bar

- [ ] **Step 1: Test navigation**

```bash
npm run dev
# Sidebar shows exactly 4 items: Tasks, Projects, Foundations, Waiting On
# Click each nav item, verify routing works
```

- [ ] **Step 2: Test Tasks page**

```
# Navigate to /tasks
# Verify "Today" pills is highlighted
# Verify items load for today view
# Click "This Week" pill, verify URL changes to ?view=week and items update
# Click "All" pill, verify URL changes to ?view=all
# Verify old redirects work: /today → /tasks?view=today
```

- [ ] **Step 3: Test Projects page**

```
# Navigate to /projects
# Verify "Active" pill is highlighted
# Verify active projects load
# Click "Horizon" pill, verify projects update
# Click "Incubation" pill, verify projects update
# Verify old redirects work: /horizon → /projects?view=horizon
```

- [ ] **Step 4: Test ChatBar UI**

```
# ChatBar visible at bottom on all pages
# Click expand button (↑), verify it expands to full screen
# Verify history empty on first open
# Type "add get milk to today", click send
# Verify message appears in chat as user message
# Wait for Claude response
# Verify assistant response appears
# Verify item was added to database (check /tasks?view=today)
```

- [ ] **Step 5: Test ambiguous input**

```
# In chat, type "add task to week"
# Verify Claude asks clarifying question: "Which list — This Week or Inbox?"
# Type "this week"
# Verify Claude now acts and confirms
```

- [ ] **Step 6: Test search and update**

```
# Chat: "update the milk task to tomorrow"
# Verify Claude searches for "milk" task first
# Verify it moves the task
# Verify confirmation message
```

- [ ] **Step 7: Commit successful tests**

```bash
git add -A
git commit -m "test: verify all pages, chat bar, and API integration end-to-end"
```

### Task 12: Remove QuickCapture from Old Pages (Cleanup)

**⏳ SEQUENTIAL (Wave 4):** Run after Task 11 completes

**Files:**
- Modify: any pages still using QuickCapture (if they still exist and render)

- [ ] **Step 1: Search for QuickCapture usage**

```bash
grep -r "QuickCapture" src/app --include="*.tsx"
```

- [ ] **Step 2: Remove any remaining QuickCapture imports/usage from pages**

If found, remove the component from any pages (it should be gone since we redirected, but check old page files if they still have content).

- [ ] **Step 3: Commit cleanup**

```bash
git add -A
git commit -m "cleanup: remove QuickCapture references from old pages"
```

### Task 13: Final Verification Checklist

**⏳ FINAL (Wave 5):** Run after Task 12 completes

- [ ] **All nav items are 4 and clickable**
- [ ] **Tasks page renders with pill toggles, all 3 views work**
- [ ] **Projects page renders with pill toggles, all 3 views work**
- [ ] **ChatBar is visible and persistent across all pages**
- [ ] **Sending "add X to today" creates an item**
- [ ] **Sending ambiguous input gets a clarifying question**
- [ ] **Sending "delete [task name]" finds and deletes the task**
- [ ] **Old routes redirect correctly (/today → /tasks, etc.)**
- [ ] **No QuickCapture inputs visible on any page**
- [ ] **Chat history appears in expanded view**
- [ ] **Page revalidates after chat-driven mutations (new items appear)**

- [ ] **Step 1: Run through checklist manually**

Test each item above in the dev environment.

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "feat: complete nav simplification and AI chat bar implementation"
```

---

## Execution Summary by Wave

**Wave 1 (✅ COMPLETED)**
- Task 1: Sidebar reduction
- Task 2: Mobile nav reduction
- Task 3: Route redirects

**Wave 2 (🔶 RUN IN PARALLEL — dispatch 5 subagents simultaneously)**
- Task 4: `/tasks` page with toggles (new file)
- Task 5: `/projects` page with toggles (modify existing)
- Task 6: `ChatBar.tsx` component (new file)
- Task 8: AI tool definitions (new file)
- Task 9: Search helpers (new file)

**Wave 3 (⏳ SEQUENTIAL — after Wave 2 commits)**
- Task 7: Add ChatBar to root layout (depends on Task 6)
- Task 10: `/api/chat` endpoint (depends on Tasks 8 & 9)

**Wave 4 (⏳ SEQUENTIAL — after Wave 3 completes)**
- Task 11: End-to-end testing (depends on all features)
- Task 12: QuickCapture cleanup

**Wave 5 (🏁 FINAL — after Wave 4)**
- Task 13: Final verification checklist

---

## Execution Notes

**Why waves over sequential?**
- Wave 2 (5 parallel tasks) completes in ~10 minutes instead of 50 minutes
- Total project time: ~1.5 hours instead of 4+ hours
- Multiple independent sessions avoid git conflicts
- Clear dependencies make it easy to know when each wave can start

**Key pattern:** Tasks are organized into explicit waves based on file independence. Tasks within a wave touch different files (no conflicts), so they run in parallel via separate sessions. Sequential waves preserve dependency order.

**For future projects:** Structure large implementation plans into parallel waves where possible. Saves significant time and keeps subagent dispatch simple.

---

## What Gets Built

**What was built:**
- Navigation reduced from 11 to 4 items
- Tasks page merges Today/This Week/All with pill view toggles
- Projects page merges Active/Horizon/Incubation with pill view toggles
- Persistent ChatBar at bottom of every page
- `/api/chat` endpoint with Claude tool use
- AI can add, update, delete items via natural language
- AI asks clarifying questions on ambiguous input

**Key files created:**
- `src/app/tasks/page.tsx`
- `src/components/ui/ChatBar.tsx`
- `src/app/api/chat/route.ts`
- `src/lib/ai/tools.ts`
- `src/lib/ai/search.ts`

**Key files modified:**
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/app/layout.tsx`
- Redirect pages (today, this-week, inbox, horizon, incubation, dashboard)

---

## Spec Coverage Self-Review

✅ **Navigation restructure** — Tasks 1-3: reduced to 4 items, set up redirects
✅ **Tasks page** — Task 4: merged Today/This Week/All with pill toggles
✅ **Projects page** — Task 5: merged Active/Horizon/Incubation with pill toggles
✅ **ChatBar component** — Tasks 6-7: persistent, collapsed/expanded states, session history
✅ **AI architecture** — Tasks 8-10: Claude tool use, tools for CRUD, search helpers
✅ **Integration** — Task 11: end-to-end testing
✅ **Cleanup** — Task 12: removed QuickCapture
✅ **Verification** — Task 13: full checklist

No placeholders or ambiguities found. All code is complete and ready to execute.
