-- IdeaForge AI Copilot - Supabase Database Schema Migration
-- Project: nqnxfrxqsgebcczfdmpe

-- 1. Enable pgvector Extension for AI Vector Search & Embeddings
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Create 'plans' Table (Stores user generated blueprints & DeepSearch states)
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  title TEXT NOT NULL,
  idea_text TEXT NOT NULL,
  category TEXT,
  target_user TEXT,
  blueprint JSONB NOT NULL,
  search_data JSONB NOT NULL,
  embedding extensions.vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance & similarity search
CREATE INDEX IF NOT EXISTS idx_plans_user_email ON public.plans(user_email);

-- 3. Create 'milestones' Table (Stores milestone progress check-offs)
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  week INT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_milestones_user_email ON public.milestones(user_email);

-- 4. Create 'telegram_links' Table (Stores Telegram bot connect codes & Chat IDs)
CREATE TABLE IF NOT EXISTS public.telegram_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL UNIQUE,
  connect_code TEXT NOT NULL,
  telegram_chat_id TEXT,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_links ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Allow access to plans, milestones, and telegram links)
DROP POLICY IF EXISTS "Allow access to plans by email" ON public.plans;
CREATE POLICY "Allow access to plans by email"
ON public.plans
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access to milestones" ON public.milestones;
CREATE POLICY "Allow access to milestones"
ON public.milestones
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access to telegram_links" ON public.telegram_links;
CREATE POLICY "Allow access to telegram_links"
ON public.telegram_links
FOR ALL
USING (true)
WITH CHECK (true);
