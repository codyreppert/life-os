import type { Item, Project, ProjectTask, FoundationItem, WaitingOnItem } from '@/types'

const now = new Date().toISOString()
const today = new Date().toISOString().split('T')[0]

let idCounter = 0
function makeId(): string {
  idCounter++
  return `seed-${idCounter}-${Math.random().toString(36).slice(2, 9)}`
}

const projectIds = {
  homeBuying: makeId(),
  consulting: makeId(),
  lifeOrganizer: makeId(),
  travelMedia: makeId(),
  aiProfitWeekly: makeId(),
  productDesigner: makeId(),
  horizonRealEstate: makeId(),
  horizonVan: makeId(),
  horizonLifeOrganizerExpansion: makeId(),
}

export const seedItems: Item[] = [
  // TODAY (top 3 — priority 1/2/3)
  { id: makeId(), user_id: null, list: 'today', content: 'Plan this week + build Life OS system', completed: false, priority: 1, category: 'foundation', notes: 'Organizing Sunday — system setup', due_date: today, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },
  { id: makeId(), user_id: null, list: 'today', content: 'Finalize consulting niche + prep first outreach emails', completed: false, priority: 2, category: 'strategic', notes: 'Must choose niche before outreach', due_date: today, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },
  { id: makeId(), user_id: null, list: 'today', content: 'Confirm home inspector availability (phone call)', completed: false, priority: 3, category: 'admin', notes: 'Unblocks home buying momentum', due_date: today, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },

  // THIS WEEK — Foundations
  { id: makeId(), user_id: null, list: 'this_week', content: 'Date night with Kat (Friday evening)', completed: false, priority: 0, category: 'foundation', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'foundations' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: '4x exercise (Mon/Wed/Fri/Sat)', completed: false, priority: 0, category: 'foundation', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'foundations' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: '2x spiritual practice (prayer + church Sunday)', completed: false, priority: 0, category: 'foundation', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'foundations' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Check-in with guy friend (text or call)', completed: false, priority: 0, category: 'foundation', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'foundations' }, context: 'personal' },

  // THIS WEEK — Home Buying
  { id: makeId(), user_id: null, list: 'this_week', content: 'Confirm home inspector availability', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'home_buying' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Pin down 3-5 properties to inspect this week', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'home_buying' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Schedule inspections for next 2 weeks', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'home_buying' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Research comps + neighborhood crime data', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'home_buying' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Create home analysis spreadsheet', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'home_buying' }, context: 'personal' },

  // THIS WEEK — AI Consulting
  { id: makeId(), user_id: null, list: 'this_week', content: 'Finalize niche (decision by Tuesday)', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'consulting' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Create list of 10 target prospects', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'consulting' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Send initial emails to 3 prospects (by Thursday)', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'consulting' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Write niche positioning statement', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'consulting' }, context: 'personal' },

  // THIS WEEK — Life Organizer
  { id: makeId(), user_id: null, list: 'this_week', content: 'Choose hosting provider (Railway or Vercel) by Tuesday', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'life_organizer' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Deploy app + Supabase schema (by Wednesday)', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'life_organizer' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: "Set up Kat's dad account (by Thursday)", completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'life_organizer' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Create onboarding doc (by Friday)', completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'life_organizer' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: "Launch with Kat's dad (Saturday/Sunday)", completed: false, priority: 0, category: 'strategic', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'life_organizer' }, context: 'personal' },

  // THIS WEEK — Admin
  { id: makeId(), user_id: null, list: 'this_week', content: 'Amazon returns (drop off Wednesday)', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'admin' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'this_week', content: 'Respond to pending emails / Slack items', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { section: 'admin' }, context: 'personal' },

  // INBOX
  { id: makeId(), user_id: null, list: 'inbox', content: 'Check home inspector availability for next 2 weeks', completed: false, priority: 0, category: null, notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },
  { id: makeId(), user_id: null, list: 'inbox', content: 'Send initial consulting emails to 3 potential clients', completed: false, priority: 0, category: null, notes: 'Niche not finalized yet', due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },
  { id: makeId(), user_id: null, list: 'inbox', content: 'Newsletter name options: "AI Money Stories", "Profit Pulse", "The AI Dollar"', completed: false, priority: 0, category: null, notes: 'Ideas — evaluate after newsletter launch', due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },
  { id: makeId(), user_id: null, list: 'inbox', content: 'Set up monthly financial review cadence', completed: false, priority: 0, category: null, notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },
  { id: makeId(), user_id: null, list: 'inbox', content: 'Travel media: which YouTube channel name feels right?', completed: false, priority: 0, category: null, notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: {}, context: 'personal' },

  // ADMIN
  { id: makeId(), user_id: null, list: 'admin', content: 'Amazon returns', completed: false, priority: 0, category: 'admin', notes: 'Drop off Wednesday April 23', due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'this_week', domain: 'logistics' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'admin', content: 'Pay pending invoices / review expenses', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'this_week', domain: 'financial' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'admin', content: 'HVAC filter replacement', completed: false, priority: 0, category: 'admin', notes: 'Due this month', due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'monthly', domain: 'home' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'admin', content: 'Car maintenance check', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'monthly', domain: 'logistics' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'admin', content: 'Renew insurance (home + auto + personal liability)', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'monthly', domain: 'financial' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'admin', content: 'Review credit card charges', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'monthly', domain: 'financial' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'admin', content: 'Annual physicals scheduled (Cody + Kat)', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'quarterly', domain: 'health' }, context: 'personal' },
  { id: makeId(), user_id: null, list: 'admin', content: 'Review subscriptions — cancel unused', completed: false, priority: 0, category: 'admin', notes: null, due_date: null, created_at: now, updated_at: now, archived_at: null, metadata: { tier: 'quarterly', domain: 'tech' }, context: 'personal' },
]

export const seedProjects: Project[] = [
  {
    id: projectIds.homeBuying, user_id: null, name: 'Home Buying', type: 'active', status: 'active',
    purpose: 'Find + analyze properties, secure inspections, move toward offer by end of May',
    success_criteria: ['Inspect 3-5 properties', 'Analyze neighborhoods + comps', 'Have an offer ready by May 15'],
    strategic_level: 'level_2', revenue_potential: 'Creates major asset', energy_level: 9, urgency_level: 10,
    timeline: '4-week sprint', why_now: 'Starting now — 30 day window to inspect and make offers',
    notes: 'Build agents for deal analysis + property comparison. Use process to inform AI consulting (case study).',
    position: 1, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  {
    id: projectIds.consulting, user_id: null, name: 'AI Consulting Launch', type: 'active', status: 'active',
    purpose: 'Land first clients, validate tier framework, establish position in market',
    success_criteria: ['Niche selected', '5+ prospect conversations scheduled', '1-2 pilot clients (free or reduced rate)', 'Tier framework validated with feedback'],
    strategic_level: 'level_2', revenue_potential: '$10-50k first quarter if 2-3 pilots convert', energy_level: 10, urgency_level: 9,
    timeline: '2-4 weeks', why_now: 'Time-sensitive to capitalize early — market window open now',
    notes: 'Tier 1: education ($2-5k), Tier 2: tool finding ($5-15k), Tier 3: custom ($15k+). Be specific about niche before outreach.',
    position: 2, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  {
    id: projectIds.lifeOrganizer, user_id: null, name: 'Life Organizer v1', type: 'active', status: 'active',
    purpose: "Host the app + get first user feedback from Kat's dad by next Sunday",
    success_criteria: ['App hosted + accessible', "Kat's dad onboarded + using it", 'Feedback collected on UX + value', 'Roadmap for v1.1 documented'],
    strategic_level: 'level_3', revenue_potential: 'Potential future opportunity — validates product before expansion', energy_level: 8, urgency_level: 8,
    timeline: '1-week sprint', why_now: "Kat's dad is ready; proves real-user value before investing more",
    notes: "v1 learning project — don't over-engineer. Primary goal: validate that real users find value.",
    position: 3, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  {
    id: projectIds.travelMedia, user_id: null, name: 'Travel Media Business', type: 'active', status: 'active',
    purpose: 'Unify drone screensavers, travel prints, and trip documentation into one revenue stream',
    success_criteria: ['Drone screensavers live on YouTube + Etsy', 'Travel prints on print-on-demand', 'Trip documentation system working for first trip', '100+ YouTube subscribers + first sales'],
    strategic_level: 'level_2', revenue_potential: '$500-2k/month if 10+ prints/month + YouTube revenue', energy_level: 8, urgency_level: 6,
    timeline: '8-12 weeks', why_now: 'Footage + photos already ready. Creates business trip documentation for tax purposes.',
    notes: 'Start small: launch with 3 videos + 5 prints. Use this to inform tax deduction strategy with CPA.',
    position: 4, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  {
    id: projectIds.aiProfitWeekly, user_id: null, name: 'AI Profit Weekly', type: 'active', status: 'active',
    purpose: 'Keep newsletter pipeline running, plan Phase 2 automation',
    success_criteria: ['2-3 social posts daily (auto-generated)', '500+ newsletter subscribers by end of Q2', 'First sponsorship inquiry by June'],
    strategic_level: 'level_3', revenue_potential: '$1-3k/month sponsorships (1k+ subscribers), affiliate links ongoing', energy_level: 7, urgency_level: 5,
    timeline: 'Ongoing', why_now: 'Phase 1 complete — maintenance mode while consulting takes priority',
    notes: "Newsletter is primarily an audience engine for consulting. Don't let it compete with consulting launch.",
    position: 5, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  {
    id: projectIds.productDesigner, user_id: null, name: 'Product Designer Automation', type: 'support', status: 'active',
    purpose: 'Build workflow to become thought leader at 9-5, stay engaged with design practice',
    success_criteria: ['Workflow documentation for common design tasks', '2-3 AI agents / automations built', 'Visible to leadership as innovator', 'Time freed up for strategic work'],
    strategic_level: 'level_3', revenue_potential: 'Job security + internal influence + consulting case studies', energy_level: 6, urgency_level: 4,
    timeline: 'Ongoing (5-10 hrs/week)', why_now: 'Credibility work — keep it bounded at 9-5',
    notes: 'This is credibility work, not a growth engine. Goal: be known internally as "design + AI person".',
    position: 6, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  // HORIZON
  {
    id: projectIds.horizonRealEstate, user_id: null, name: 'Real Estate Acquisitions (Tax Strategy)', type: 'horizon', status: 'planning',
    purpose: 'Acquire 1-2 additional properties for tax optimization, cash flow, and long-term appreciation',
    success_criteria: ['CPA strategy defined', 'Target market identified', 'First acquisition closed'],
    strategic_level: 'level_4', revenue_potential: 'Passive income + tax optimization + long-term appreciation', energy_level: 8, urgency_level: 3,
    timeline: '6-18 months', why_now: 'Need CPA conversation first (5/15). Home buying is enough complexity right now.',
    notes: 'Coordinate with CPA on entity strategy. Likely duplex or multi-unit. Look at LLC structure.',
    position: 1, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  {
    id: projectIds.horizonVan, user_id: null, name: 'Business Van Build', type: 'horizon', status: 'planning',
    purpose: 'Convert van into mobile office + business vehicle for travel content and consulting',
    success_criteria: ['Van purchased', 'Build-out complete', 'First business trip documented', 'Tax treatment confirmed with CPA'],
    strategic_level: 'level_4', revenue_potential: 'Business vehicle deduction + travel media content + mobile consulting', energy_level: 9, urgency_level: 2,
    timeline: '12-18 months', why_now: 'Makes sense once home buying closes and consulting is profitable',
    notes: 'Target: Sprinter, Transit, or Promaster. Budget: $30-60k total. Coordinate with CPA on tax treatment.',
    position: 2, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  {
    id: projectIds.horizonLifeOrganizerExpansion, user_id: null, name: 'Life Organizer: In-Home Service', type: 'horizon', status: 'planning',
    purpose: "Go into homes, document everything with AI + video, serve insurance/estate/fire documentation market",
    success_criteria: ['v1 user feedback validates demand', '2-3 pilot in-home projects done', 'Pricing + packaging defined', 'First paying client'],
    strategic_level: 'level_4', revenue_potential: '$500-2k per home + recurring software = major opportunity', energy_level: 9, urgency_level: 3,
    timeline: '6-12 months', why_now: "v1 needs user feedback first (Kat's dad pilot next week). If it validates, this becomes Q3 focus.",
    notes: 'California fire risk makes home documentation valuable. Realtor + insurance agent referrals could be lead source.',
    position: 3, created_at: now, updated_at: now, completed_at: null, metadata: {}, context: 'personal'
  },
  // INCUBATION
  { id: makeId(), user_id: null, name: 'AI Home Buying Agent', type: 'incubation', status: 'planning', purpose: 'Agent that analyzes properties, comps, neighborhoods and gives yes/no recommendation', success_criteria: [], strategic_level: 'level_5', revenue_potential: 'Consulting service ($5-10k per analysis)', energy_level: 8, urgency_level: 2, timeline: null, why_now: "Don't build until consulting launch succeeds — could be proof-of-concept", notes: 'Category: AI & Automation. Effort: Medium (2-3 weeks).', position: 1, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'ai_automation', effort: 'medium' }, context: 'personal' },
  { id: makeId(), user_id: null, name: 'AI Personal Assistant', type: 'incubation', status: 'planning', purpose: 'Custom Claude chatbot trained on your life (calendar, projects, values) for decision-making', success_criteria: [], strategic_level: 'level_5', revenue_potential: 'Personal use — unless productized', energy_level: 7, urgency_level: 1, timeline: null, why_now: 'Could be internal tool or beta product', notes: 'Category: AI & Automation. Effort: Low (1-2 weeks with MCP setup).', position: 2, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'ai_automation', effort: 'low' }, context: 'personal' },
  { id: makeId(), user_id: null, name: 'Automation Audit Service', type: 'incubation', status: 'planning', purpose: "Audit companies' workflows and recommend AI automation opportunities", success_criteria: [], strategic_level: 'level_5', revenue_potential: '$10-30k per audit', energy_level: 7, urgency_level: 1, timeline: null, why_now: 'Only pursue if consulting gets traction first', notes: 'Category: AI & Automation. Effort: varies per engagement.', position: 3, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'ai_automation', effort: 'high' }, context: 'personal' },
  { id: makeId(), user_id: null, name: 'Quarterly Financial Review System', type: 'incubation', status: 'planning', purpose: 'Track income, expenses, taxes, and wealth across all ventures in one place', success_criteria: [], strategic_level: 'level_5', revenue_potential: 'Personal only (or potentially productize)', energy_level: 6, urgency_level: 2, timeline: null, why_now: 'CPA conversation (5/15) will inform this', notes: 'Category: Business & Money. Effort: Medium.', position: 4, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'business_money', effort: 'medium' }, context: 'personal' },
  { id: makeId(), user_id: null, name: 'Tax Strategy Playbook', type: 'incubation', status: 'planning', purpose: "Document tax strategy across all ventures so you don't rely on CPA for every decision", success_criteria: [], strategic_level: 'level_5', revenue_potential: 'Personal + potential advisory offer', energy_level: 6, urgency_level: 2, timeline: null, why_now: 'Schedule after first CPA conversation', notes: 'Category: Business & Money. Effort: Medium (3-4 weeks, requires CPA input).', position: 5, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'business_money', effort: 'medium' }, context: 'personal' },
  { id: makeId(), user_id: null, name: 'YouTube Series: AI for Business Owners', type: 'incubation', status: 'planning', purpose: 'Tutorial series on AI tools you use — builds consulting audience', success_criteria: [], strategic_level: 'level_5', revenue_potential: 'Ad revenue + sponsorships at scale', energy_level: 8, urgency_level: 1, timeline: null, why_now: 'Start ONE YouTube series after newsletter reaches 1k subscribers', notes: 'Category: Content & Media. Effort: 2-4 hrs per episode.', position: 6, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'content_media', effort: 'medium' }, context: 'personal' },
  { id: makeId(), user_id: null, name: 'Travel Writing / Newsletter', type: 'incubation', status: 'planning', purpose: 'Narrative travel stories published on Medium, Substack, or own platform', success_criteria: [], strategic_level: 'level_5', revenue_potential: '$0 short-term, monetize at scale', energy_level: 6, urgency_level: 1, timeline: null, why_now: 'Only if travel media business needs more content', notes: 'Category: Content & Media. Effort: 1-2 hrs per article.', position: 7, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'content_media', effort: 'low' }, context: 'personal' },
  { id: makeId(), user_id: null, name: 'Podcast / Interview Series', type: 'incubation', status: 'planning', purpose: "Interview entrepreneurs about AI, consulting, real estate — builds audience faster", success_criteria: [], strategic_level: 'level_5', revenue_potential: 'Sponsorships only (1k+ listeners)', energy_level: 7, urgency_level: 1, timeline: null, why_now: 'Consider if you want to be "on mic" personality', notes: 'Category: Content & Media. Effort: 3-4 hrs per episode.', position: 8, created_at: now, updated_at: now, completed_at: null, metadata: { category: 'content_media', effort: 'high' }, context: 'personal' },
]

export const seedProjectTasks: ProjectTask[] = [
  // Home Buying
  { id: makeId(), project_id: projectIds.homeBuying, content: 'Pin down 3-5 properties to inspect this week', completed: false, position: 1, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.homeBuying, content: 'Confirm inspector availability', completed: false, position: 2, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.homeBuying, content: 'Create neighborhood + pricing decision framework', completed: false, position: 3, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.homeBuying, content: 'Research property taxes, insurance, HOA', completed: false, position: 4, created_at: now, updated_at: now },
  // AI Consulting
  { id: makeId(), project_id: projectIds.consulting, content: 'Finalize niche (home buying? marketing automation? operations?)', completed: false, position: 1, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.consulting, content: 'Identify 10 target prospects', completed: false, position: 2, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.consulting, content: 'Send initial outreach to 3 this week', completed: false, position: 3, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.consulting, content: 'Document tier framework (Tier 1: education, Tier 2: tool finding, Tier 3: custom build)', completed: false, position: 4, created_at: now, updated_at: now },
  // Life Organizer
  { id: makeId(), project_id: projectIds.lifeOrganizer, content: 'Choose hosting provider (Railway, Vercel, or cloud)', completed: false, position: 1, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.lifeOrganizer, content: 'Deploy Supabase + app schema', completed: false, position: 2, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.lifeOrganizer, content: "Set up login for Kat's dad", completed: false, position: 3, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.lifeOrganizer, content: 'Create onboarding walkthrough (short video or doc)', completed: false, position: 4, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.lifeOrganizer, content: 'Collect feedback Saturday/Sunday', completed: false, position: 5, created_at: now, updated_at: now },
  // Travel Media
  { id: makeId(), project_id: projectIds.travelMedia, content: 'Consolidate drone footage from trips (organize clips)', completed: false, position: 1, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.travelMedia, content: 'Create screensaver montages (3-4 videos)', completed: false, position: 2, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.travelMedia, content: 'Set up YouTube channel + upload first 3 videos', completed: false, position: 3, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.travelMedia, content: 'Create print templates (5-10 travel photos)', completed: false, position: 4, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.travelMedia, content: 'Launch print-on-demand store (Printful or similar)', completed: false, position: 5, created_at: now, updated_at: now },
  // AI Profit Weekly
  { id: makeId(), project_id: projectIds.aiProfitWeekly, content: 'Maintain HN scraper + daily publishing (current setup)', completed: false, position: 1, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.aiProfitWeekly, content: 'Gather competitor examples + styling (3-4 top newsletters)', completed: false, position: 2, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.aiProfitWeekly, content: 'Plan Phase 2: Buffer API, image generation, GitHub Actions cron', completed: false, position: 3, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.aiProfitWeekly, content: 'Design 1-month ad rate card (sponsorship pricing)', completed: false, position: 4, created_at: now, updated_at: now },
  // Product Designer
  { id: makeId(), project_id: projectIds.productDesigner, content: 'Map current design workflow (bottleneck analysis)', completed: false, position: 1, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.productDesigner, content: 'Identify 2-3 highest-leverage automation opportunities', completed: false, position: 2, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.productDesigner, content: 'Build first small agent (wireframe generator, copy suggestions)', completed: false, position: 3, created_at: now, updated_at: now },
  { id: makeId(), project_id: projectIds.productDesigner, content: 'Document + demo to team', completed: false, position: 4, created_at: now, updated_at: now },
]

export const seedFoundationItems: FoundationItem[] = [
  // Spiritual
  { id: makeId(), user_id: null, pillar: 'spiritual', content: 'Weekly prayer practice (Sunday + mid-week quiet time)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 1, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'spiritual', content: 'Church attendance (Sunday)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 2, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'spiritual', content: 'Spiritual reading or reflection (2-3x weekly)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 3, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'spiritual', content: 'Trust and surrender in waiting areas (home buying, consulting)', rhythm_type: 'daily', completed_this_week: false, notes: null, position: 4, created_at: now, updated_at: now, context: 'personal' },
  // Marriage
  { id: makeId(), user_id: null, pillar: 'marriage', content: 'Weekly date night (Friday or Saturday)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 1, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'marriage', content: '15-min daily connection (morning coffee or evening wind-down)', rhythm_type: 'daily', completed_this_week: false, notes: null, position: 2, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'marriage', content: 'Monthly deeper conversation (state of union, dreams, concerns)', rhythm_type: 'monthly', completed_this_week: false, notes: null, position: 3, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'marriage', content: 'Discuss home buying feelings + consulting adventure this weekend', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 4, created_at: now, updated_at: now, context: 'personal' },
  // Health
  { id: makeId(), user_id: null, pillar: 'health', content: 'Monday: Strength training (30-40 min)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 1, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'health', content: 'Wednesday: Cardio (20-30 min)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 2, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'health', content: 'Friday: Strength + flexibility', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 3, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'health', content: 'Saturday: Outdoor activity or yoga', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 4, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'health', content: 'Sunday meal prep: 2 batches (breakfast + lunch proteins)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 5, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'health', content: 'Hydration: 3-4L daily', rhythm_type: 'daily', completed_this_week: false, notes: null, position: 6, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'health', content: 'Cold exposure 2x weekly (cold shower or ice bath)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 7, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'health', content: 'Sunlight exposure daily (morning walk if possible)', rhythm_type: 'daily', completed_this_week: false, notes: null, position: 8, created_at: now, updated_at: now, context: 'personal' },
  // Community
  { id: makeId(), user_id: null, pillar: 'community', content: 'Check-in call or text with guy friend (weekly, rotate)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 1, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'community', content: 'In-person hangout with guy friend (every 2 weeks)', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 2, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'community', content: 'Plan couple dinner this month (rotating hosts)', rhythm_type: 'monthly', completed_this_week: false, notes: null, position: 3, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'community', content: 'Text or check-in with couple friend every few weeks', rhythm_type: 'weekly', completed_this_week: false, notes: null, position: 4, created_at: now, updated_at: now, context: 'personal' },
  // Lifestyle
  { id: makeId(), user_id: null, pillar: 'lifestyle', content: 'Buy quality, timeless clothing pieces (not fast fashion)', rhythm_type: 'monthly', completed_this_week: false, notes: 'Budget $50-100/month', position: 1, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'lifestyle', content: 'Assess kitchen plastics quarterly, replace over time', rhythm_type: 'quarterly', completed_this_week: false, notes: '2-3 year shift, no rush', position: 2, created_at: now, updated_at: now, context: 'personal' },
  { id: makeId(), user_id: null, pillar: 'lifestyle', content: 'Audit wardrobe every 6 months, replace worn items with better versions', rhythm_type: 'monthly', completed_this_week: false, notes: null, position: 3, created_at: now, updated_at: now, context: 'personal' },
]

export const seedWaitingOn: WaitingOnItem[] = [
  { id: makeId(), user_id: null, item: 'Home inspector availability', waiting_for: 'Home inspector (called Mon)', status: 'pending', category: 'home_buying', due_by: null, follow_up_by: null, notes: 'Need 2-week window for inspections', created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
  { id: makeId(), user_id: null, item: 'Property list (3-5 solid options)', waiting_for: 'Realtor', status: 'pending', category: 'home_buying', due_by: null, follow_up_by: null, notes: null, created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
  { id: makeId(), user_id: null, item: 'Prospect #1 response', waiting_for: 'Prospect (email sent Mon)', status: 'pending', category: 'consulting', due_by: null, follow_up_by: null, notes: 'Follow-up Tue if no response', created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
  { id: makeId(), user_id: null, item: 'Prospect #2 response', waiting_for: 'Prospect (email sent Tue)', status: 'pending', category: 'consulting', due_by: null, follow_up_by: null, notes: 'Key prospect, high value', created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
  { id: makeId(), user_id: null, item: 'Prospect #3 response', waiting_for: 'Prospect (email sent Wed)', status: 'pending', category: 'consulting', due_by: null, follow_up_by: null, notes: 'Lower priority, exploratory', created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
  { id: makeId(), user_id: null, item: "Kat's dad feedback on Life Organizer v1", waiting_for: "Kat's dad (user testing Sat/Sun)", status: 'pending', category: 'life_organizer', due_by: null, follow_up_by: null, notes: 'v1 launch success depends on this', created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
  { id: makeId(), user_id: null, item: 'CPA conversation on tax strategy', waiting_for: 'CPA (scheduled meeting ~5/15)', status: 'pending', category: 'cpa', due_by: null, follow_up_by: null, notes: 'Tax strategy + real estate plans', created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
  { id: makeId(), user_id: null, item: 'Reddit API approval for AI Profit Weekly', waiting_for: 'Reddit admin', status: 'pending', category: 'ai_profit_weekly', due_by: null, follow_up_by: null, notes: 'Resubmit if account age OK now', created_at: now, updated_at: now, resolved_at: null, context: 'personal' },
]

export const seedData = {
  items: seedItems,
  projects: seedProjects,
  projectTasks: seedProjectTasks,
  foundationItems: seedFoundationItems,
  waitingOn: seedWaitingOn,
}
