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
