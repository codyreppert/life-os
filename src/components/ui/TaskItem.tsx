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
