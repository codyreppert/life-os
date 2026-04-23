-- Life OS Database Schema
-- Run this in Supabase SQL editor

CREATE TABLE items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID DEFAULT NULL,
  list        TEXT NOT NULL CHECK (list IN ('inbox','today','this_week','admin','archive')),
  content     TEXT NOT NULL,
  completed   BOOLEAN DEFAULT FALSE,
  priority    INTEGER DEFAULT 0,
  category    TEXT,
  notes       TEXT,
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ,
  metadata    JSONB DEFAULT '{}'
);

CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID DEFAULT NULL,
  name              TEXT NOT NULL,
  type              TEXT NOT NULL CHECK (type IN ('active','horizon','incubation','support')),
  status            TEXT DEFAULT 'planning' CHECK (status IN ('planning','active','on_hold','complete','archived')),
  purpose           TEXT,
  success_criteria  TEXT[],
  strategic_level   TEXT,
  revenue_potential TEXT,
  energy_level      INTEGER,
  urgency_level     INTEGER,
  timeline          TEXT,
  why_now           TEXT,
  notes             TEXT,
  position          INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  metadata          JSONB DEFAULT '{}'
);

CREATE TABLE project_tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  completed   BOOLEAN DEFAULT FALSE,
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE foundation_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID DEFAULT NULL,
  pillar                TEXT NOT NULL CHECK (pillar IN ('spiritual','marriage','health','community','lifestyle')),
  content               TEXT NOT NULL,
  rhythm_type           TEXT CHECK (rhythm_type IN ('daily','weekly','monthly','quarterly')),
  completed_this_week   BOOLEAN DEFAULT FALSE,
  notes                 TEXT,
  position              INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waiting_on (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID DEFAULT NULL,
  item          TEXT NOT NULL,
  waiting_for   TEXT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','received','done')),
  category      TEXT,
  due_by        DATE,
  follow_up_by  DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  resolved_at   TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX idx_items_list ON items(list);
CREATE INDEX idx_items_completed ON items(completed);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_foundation_items_pillar ON foundation_items(pillar);
CREATE INDEX idx_waiting_on_status ON waiting_on(status);
