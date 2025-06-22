-- =================================================================
--        ORANGOPUS SUPABASE DATABASE SETUP SCRIPT
-- =================================================================
-- This script will completely reset and configure your database.
-- It is designed to be run once on a fresh Supabase project.
--
-- Running this script will:
--   1. Drop existing tables to ensure a clean slate.
--   2. Create the necessary tables with correct schemas.
--   3. Set up functions and triggers for automation.
--   4. Apply Row Level Security (RLS) policies for data protection.
--   5. Create indexes for performance.
--
--
-- ==> IMPORTANT: Before you run this, make sure you have a backup
--      of any important data if you are running this on an
--      existing project.
-- =================================================================


-- =================================================================
-- 1. DROP EXISTING OBJECTS
-- =================================================================
-- Drops all tables and functions to ensure a clean setup.

DROP TABLE IF EXISTS public.project_likes;
DROP TABLE IF EXISTS public.user_activities;
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.users;
DROP FUNCTION IF EXISTS public.create_user_profile();
DROP FUNCTION IF EXISTS public.update_updated_at_column();


-- =================================================================
-- 2. CREATE TABLES
-- =================================================================
-- Creates the core tables for the application.

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    github_username TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.users IS 'Stores public user profile information.';

-- Projects showcase table
CREATE TABLE public.projects (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  technologies TEXT[],
  status TEXT DEFAULT 'draft',
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.projects IS 'Stores user-created projects for the showcase.';

-- Social feed posts table
CREATE TABLE public.posts (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    github_repo TEXT,
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.posts IS 'Stores posts for the community social feed.';

-- Project likes table (tracks who liked which project)
CREATE TABLE public.project_likes (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);
COMMENT ON TABLE public.project_likes IS 'Tracks user likes on projects.';

-- User activities table
CREATE TABLE public.user_activities (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.user_activities IS 'Logs user activities for the dashboard feed.';


-- =================================================================
-- 3. FUNCTIONS & TRIGGERS
-- =================================================================
-- Automates profile creation and timestamp updates.

-- Function to create a user profile on new user signup
CREATE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name', -- Matches Supabase Auth UI
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger to execute the profile creation function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();

-- Function to automatically update the `updated_at` timestamp
CREATE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;

-- Triggers to update timestamps on table updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- =================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =================================================================
-- Secures the database by defining access policies.

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Policies for `users` table
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Policies for `projects` table
CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow users to create their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Policies for `posts` table
CREATE POLICY "Allow public read access to posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow users to create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Policies for `project_likes` table
CREATE POLICY "Allow public read access to project likes" ON public.project_likes FOR SELECT USING (true);
CREATE POLICY "Allow users to create likes" ON public.project_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own likes" ON public.project_likes FOR DELETE USING (auth.uid() = user_id);

-- Policies for `user_activities` table
CREATE POLICY "Allow users to view their own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);


-- =================================================================
-- 5. INDEXES
-- =================================================================
-- Creates indexes for faster queries on frequently accessed columns.

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id_user_id ON public.project_likes(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);


-- =================================================================
-- 6. GRANT PERMISSIONS
-- =================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =================================================================
--                       END OF SCRIPT
-- =================================================================
-- Your database should now be set up correctly.
-- =================================================================