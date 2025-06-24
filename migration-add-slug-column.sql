-- Migration: Add slug column to projects table
-- This migration adds a slug column for URL-friendly project links

-- Add slug column to projects table
ALTER TABLE public.projects 
ADD COLUMN slug VARCHAR(255);

-- Create a unique index on slug for fast lookups
CREATE UNIQUE INDEX idx_projects_slug ON public.projects(slug);

-- Add a function to generate slugs from titles
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$;

-- Update existing projects to have slugs
UPDATE public.projects 
SET slug = generate_slug(title) || '-' || substring(id::text from 1 for 8)
WHERE slug IS NULL;

-- Make slug column NOT NULL after populating existing data
ALTER TABLE public.projects 
ALTER COLUMN slug SET NOT NULL;

-- Add a trigger to automatically generate slugs for new projects
CREATE OR REPLACE FUNCTION set_project_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title) || '-' || substring(NEW.id::text from 1 for 8);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_project_slug
  BEFORE INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION set_project_slug();

-- Add comment for documentation
COMMENT ON COLUMN public.projects.slug IS 'URL-friendly identifier for the project'; 