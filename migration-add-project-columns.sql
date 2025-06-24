-- =================================================================
-- MIGRATION: Add missing columns to projects table
-- =================================================================
-- This script adds the missing category, difficulty_level, and featured columns
-- to the existing projects table.

-- Add category column
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add difficulty_level column with constraint
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS difficulty_level TEXT;

-- Add constraint for difficulty_level values
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_difficulty_level_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_difficulty_level_check 
CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced') OR difficulty_level IS NULL);

-- Add featured column
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_difficulty_level ON public.projects(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);

-- Update RLS policies to include the new columns
-- (The existing policies should work fine, but we can add specific ones if needed)

COMMENT ON COLUMN public.projects.category IS 'Project category (e.g., web-development, mobile-app, ai-ml)';
COMMENT ON COLUMN public.projects.difficulty_level IS 'Project difficulty level (beginner, intermediate, advanced)';
COMMENT ON COLUMN public.projects.featured IS 'Whether the project is featured in the showcase';

-- =================================================================
-- END OF MIGRATION
-- ================================================================= 