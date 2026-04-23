import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { revalidatePath } from 'next/cache'
import { tools } from '@/lib/ai/tools'
import { searchItems } from '@/lib/ai/search'
import { addItemDirect } from '@/lib/actions/items'
import type { ItemList, ItemContext } from '@/types'
import { addProject, addProjectTask } from '@/lib/actions/projects'
import { addWaitingItem } from '@/lib/actions/waiting'
import { addFoundationItem } from '@/lib/actions/foundations'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { message, currentPath, history, context = 'personal' } = await request.json()

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

    const messages: Anthropic.MessageParam[] = history.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    }))
    messages.push({ role: 'user', content: message })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    })

    let finalResponse = ''
    const actedOnTools: Anthropic.ToolUseBlock[] = []

    const assistantMsg: Anthropic.MessageParam = {
      role: 'assistant',
      content: response.content,
    }

    const executeTool = async (toolName: string, input: Record<string, unknown>): Promise<unknown> => {
      try {
        switch (toolName) {
          case 'add_item':
            return await addItemDirect(input.content as string, input.list as ItemList, context as ItemContext)

          case 'update_item': {
            const supabase = await createClient()
            if (!supabase) return { success: false, error: 'Supabase not configured' }
            const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
            if (input.content) updates.content = (input.content as string).trim()
            if (input.list) updates.list = input.list
            if (input.priority !== undefined) updates.priority = input.priority
            const { error } = await supabase.from('items').update(updates).eq('id', input.id)
            if (error) throw error
            revalidatePath('/tasks')
            revalidatePath('/today')
            revalidatePath('/this-week')
            revalidatePath('/inbox')
            revalidatePath('/dashboard')
            return { success: true }
          }

          case 'delete_item': {
            const supabase = await createClient()
            if (!supabase) return { success: false, error: 'Supabase not configured' }
            const { error } = await supabase.from('items').delete().eq('id', input.id)
            if (error) throw error
            revalidatePath('/tasks')
            revalidatePath('/today')
            revalidatePath('/this-week')
            revalidatePath('/inbox')
            revalidatePath('/dashboard')
            return { success: true }
          }

          case 'search_items':
            return await searchItems(input.query as string)

          case 'add_project': {
            const fd = new FormData()
            fd.append('name', input.name as string)
            fd.append('type', input.type as string)
            if (input.purpose) fd.append('purpose', input.purpose as string)
            return await addProject(fd)
          }

          case 'add_project_task':
            return await addProjectTask(input.project_id as string, input.content as string)

          case 'add_waiting_item': {
            const fd = new FormData()
            fd.append('item', input.item as string)
            fd.append('waiting_for', input.waiting_for as string)
            return await addWaitingItem(fd)
          }

          case 'add_foundation_item': {
            const fd = new FormData()
            fd.append('content', input.content as string)
            fd.append('pillar', input.pillar as string)
            fd.append('rhythm_type', input.rhythm_type as string)
            return await addFoundationItem(fd)
          }

          default:
            throw new Error(`Unknown tool: ${toolName}`)
        }
      } catch (error) {
        console.error(`Error executing tool ${toolName}:`, error)
        throw error
      }
    }

    // Execute tools and collect results
    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const block of response.content) {
      if (block.type === 'text') {
        finalResponse = block.text
      } else if (block.type === 'tool_use') {
        actedOnTools.push(block)
        let result: unknown
        try {
          result = await executeTool(block.name, block.input as Record<string, unknown>)
        } catch (e) {
          result = { error: String(e) }
        }
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result ?? { success: true }),
        })
      }
    }

    // If tools were called, send results back to get a confirmation reply
    if (toolResults.length > 0) {
      const followUp = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        system: systemPrompt,
        tools,
        messages: [
          ...messages,
          assistantMsg,
          { role: 'user', content: toolResults },
        ],
      })
      for (const block of followUp.content) {
        if (block.type === 'text') {
          finalResponse = block.text
          break
        }
      }
    }

    return NextResponse.json({ reply: finalResponse, acted: actedOnTools.length > 0 })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 })
  }
}
