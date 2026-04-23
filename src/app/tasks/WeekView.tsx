'use client'
import { useState, useTransition } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import {
  startOfISOWeek,
  endOfISOWeek,
  eachDayOfInterval,
  format,
  isToday,
  parseISO,
  isWithinInterval,
} from 'date-fns'
import { cn } from '@/lib/utils'
import TaskItem from '@/components/ui/TaskItem'
import { setItemDueDate } from '@/lib/actions/items'
import type { Item } from '@/types'

// ─── Week helpers ───────────────────────────────────────────────────────────

function getWeekDays(): Date[] {
  const now = new Date()
  return eachDayOfInterval({ start: startOfISOWeek(now), end: endOfISOWeek(now) })
}

type DayKey = string // "YYYY-MM-DD"

function groupItemsByDay(
  items: Item[],
  weekDays: Date[]
): { byDay: Map<DayKey, Item[]>; unscheduled: Item[] } {
  const weekStart = weekDays[0]
  const weekEnd = weekDays[weekDays.length - 1]
  const byDay = new Map<DayKey, Item[]>(
    weekDays.map(d => [format(d, 'yyyy-MM-dd'), []])
  )
  const unscheduled: Item[] = []

  for (const item of items) {
    if (!item.due_date) {
      unscheduled.push(item)
      continue
    }
    try {
      const date = parseISO(item.due_date)
      if (isWithinInterval(date, { start: weekStart, end: weekEnd })) {
        const key = format(date, 'yyyy-MM-dd')
        byDay.get(key)?.push(item)
      } else {
        unscheduled.push(item)
      }
    } catch {
      unscheduled.push(item)
    }
  }

  return { byDay, unscheduled }
}

// ─── DraggableCard ──────────────────────────────────────────────────────────

function DraggableCard({ item, isOverlay = false }: { item: Item; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded border border-border bg-surface',
        isDragging && !isOverlay && 'opacity-30',
        isOverlay && 'shadow-2xl rotate-1 ring-2 ring-accent/60 cursor-grabbing'
      )}
    >
      <div
        {...listeners}
        {...attributes}
        className="px-2 pt-1.5 pb-0.5 cursor-grab active:cursor-grabbing text-muted hover:text-text select-none text-center"
        title="Drag to reschedule"
      >
        <span className="text-[10px] tracking-widest">⠿⠿</span>
      </div>
      <TaskItem item={item} showCategory showMove />
    </div>
  )
}

// ─── DayColumn ──────────────────────────────────────────────────────────────

function DayColumn({ day, items }: { day: Date; items: Item[] }) {
  const dayKey = format(day, 'yyyy-MM-dd')
  const today = isToday(day)
  const { setNodeRef, isOver } = useDroppable({ id: dayKey })

  return (
    <div className="flex flex-col flex-shrink-0 w-40">
      <div
        className={cn(
          'text-center py-2 px-1 rounded-t-lg text-xs font-semibold mb-1',
          today
            ? 'bg-accent text-white'
            : 'bg-surface border border-border text-muted'
        )}
      >
        <div>{format(day, 'EEE')}</div>
        <div className={cn('text-base font-bold mt-0.5', today ? 'text-white' : 'text-text')}>
          {format(day, 'd')}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 min-h-32 rounded-b-lg p-2 space-y-2 transition-colors',
          isOver
            ? 'bg-accent/10 border-2 border-accent/40 border-dashed'
            : 'bg-surface border border-border'
        )}
      >
        {items.map(item => (
          <DraggableCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

// ─── UnscheduledColumn ──────────────────────────────────────────────────────

function UnscheduledColumn({ items }: { items: Item[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unscheduled' })

  return (
    <div className="flex flex-col flex-shrink-0 w-44">
      <div className="text-center py-2 px-1 rounded-t-lg text-xs font-semibold mb-1 bg-surface border border-border text-muted">
        <div>Unscheduled</div>
        <div className="text-base font-bold mt-0.5 text-text">{items.length}</div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 min-h-32 rounded-b-lg p-2 space-y-2 transition-colors',
          isOver
            ? 'bg-accent/10 border-2 border-accent/40 border-dashed'
            : 'bg-surface border border-border'
        )}
      >
        {items.map(item => (
          <DraggableCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

// ─── WeekView ───────────────────────────────────────────────────────────────

export default function WeekView({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [activeItem, setActiveItem] = useState<Item | null>(null)
  const [, startTransition] = useTransition()

  const weekDays = getWeekDays()
  const { byDay, unscheduled } = groupItemsByDay(items, weekDays)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const item = items.find(i => i.id === event.active.id)
    setActiveItem(item ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveItem(null)
    if (!over) return

    const itemId = String(active.id)
    const newDueDate = over.id === 'unscheduled' ? null : String(over.id)

    // Optimistic update — instant local state change
    setItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, due_date: newDueDate } : item)
    )

    // Background server sync
    startTransition(async () => {
      await setItemDueDate(itemId, newDueDate)
    })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 pr-2">
        <UnscheduledColumn items={unscheduled} />
        {weekDays.map(day => (
          <DayColumn
            key={format(day, 'yyyy-MM-dd')}
            day={day}
            items={byDay.get(format(day, 'yyyy-MM-dd')) ?? []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? <DraggableCard item={activeItem} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
