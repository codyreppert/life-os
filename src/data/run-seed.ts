import { createClient } from '@supabase/supabase-js'
import { seedItems, seedProjects, seedProjectTasks, seedFoundationItems, seedWaitingOn } from './seed'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, key)

// Strip id field — let Supabase generate real UUIDs
function stripId<T extends { id: string }>(items: T[]): Omit<T, 'id'>[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return items.map(({ id: _id, ...rest }) => rest)
}

async function seed() {
  console.log('Seeding database...\n')

  // Items
  console.log(`Inserting ${seedItems.length} items...`)
  const { error: itemsErr } = await supabase.from('items').insert(stripId(seedItems))
  if (itemsErr) { console.error('Items error:', itemsErr.message); process.exit(1) }
  console.log('✓ Items')

  // Projects — insert and get back real IDs
  console.log(`Inserting ${seedProjects.length} projects...`)
  const { data: insertedProjects, error: projectsErr } = await supabase
    .from('projects')
    .insert(stripId(seedProjects))
    .select('id, name')
  if (projectsErr || !insertedProjects) { console.error('Projects error:', projectsErr?.message); process.exit(1) }
  console.log('✓ Projects')

  // Build old seed ID → new real UUID map using project name as the key
  const nameToRealId = new Map(insertedProjects.map(p => [p.name, p.id]))
  const oldIdToName = new Map(seedProjects.map(p => [p.id, p.name]))

  // Project tasks — remap project_id to real UUIDs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const remappedTasks = seedProjectTasks.map(({ id: _id, project_id, ...rest }) => {
    const projectName = oldIdToName.get(project_id)
    const realProjectId = projectName ? nameToRealId.get(projectName) : undefined
    if (!realProjectId) {
      console.error(`Could not find real ID for project_id: ${project_id}`)
      process.exit(1)
    }
    return { ...rest, project_id: realProjectId }
  })

  console.log(`Inserting ${remappedTasks.length} project tasks...`)
  const { error: tasksErr } = await supabase.from('project_tasks').insert(remappedTasks)
  if (tasksErr) { console.error('Project tasks error:', tasksErr.message); process.exit(1) }
  console.log('✓ Project tasks')

  // Foundation items
  console.log(`Inserting ${seedFoundationItems.length} foundation items...`)
  const { error: foundationsErr } = await supabase.from('foundation_items').insert(stripId(seedFoundationItems))
  if (foundationsErr) { console.error('Foundation items error:', foundationsErr.message); process.exit(1) }
  console.log('✓ Foundation items')

  // Waiting on
  console.log(`Inserting ${seedWaitingOn.length} waiting items...`)
  const { error: waitingErr } = await supabase.from('waiting_on').insert(stripId(seedWaitingOn))
  if (waitingErr) { console.error('Waiting on error:', waitingErr.message); process.exit(1) }
  console.log('✓ Waiting on')

  console.log('\nSeed complete!')
}

seed().catch(console.error)
