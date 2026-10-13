-- ==========================================================
-- TaskFlow Database Schema (Supabase Postgres)
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    due_date TEXT,                  -- Deadline timestamp or date string
    category TEXT DEFAULT 'Academic', -- 'Academic', 'Coding', 'Dorm', 'Fun'
    group_name TEXT DEFAULT NULL,   -- e.g. 'CS Capstone', 'Hackathon 2026'
    assigned_role TEXT DEFAULT NULL,-- e.g. 'Backend Wizard', 'UI Architect'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (suitable for class project / demo)
CREATE POLICY "Allow public full access to tasks"
ON public.tasks
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert sample starter tasks for students
INSERT INTO public.tasks (title, is_done, priority, due_date, category, group_name, assigned_role)
VALUES 
    ('Complete FastAPI CRUD endpoints & Supabase sync', false, 'High', 'Today 23:59', 'Coding', 'CS Project', 'Backend Wizard'),
    ('Submit Operating Systems Virtual Memory Lab Report', false, 'Medium', 'Tomorrow 10:00', 'Academic', 'OS Lab', 'Report Lead'),
    ('Restock instant Maggi noodles & dark roast coffee', true, 'Low', 'Friday 18:00', 'Dorm', NULL, 'Snack Master');
