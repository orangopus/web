-- Orangopus Database Setup
-- A grassroots nonprofit open collective supporting creators of all backgrounds

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables for dynamic content management

-- Pages table for static page content
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections table for dynamic section content
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug VARCHAR(255) NOT NULL REFERENCES pages(slug) ON DELETE CASCADE,
  section_key VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  subtitle TEXT,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs table with categories
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table for global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name VARCHAR(255) NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  github_repo TEXT,
  project_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects showcase table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  creator_name VARCHAR(255) NOT NULL,
  creator_avatar TEXT,
  github_url TEXT,
  live_url TEXT,
  tags TEXT[],
  featured_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    github_username TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activities table
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project likes table (for tracking who liked what)
CREATE TABLE IF NOT EXISTS project_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Social posts table
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    github_repo TEXT,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development tool integrations table
CREATE TABLE IF NOT EXISTS dev_tool_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('github', 'gitlab', 'bitbucket', 'vercel', 'netlify')),
    access_token TEXT,
    username TEXT NOT NULL,
    avatar_url TEXT,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sections_page_slug ON sections(page_slug);
CREATE INDEX IF NOT EXISTS idx_sections_active ON sections(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON project_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dev_tool_integrations_user_id ON dev_tool_integrations(user_id);

-- Insert sample data

-- Insert home page
INSERT INTO pages (slug, title, meta_description) VALUES 
('home', 'Home', 'Orangopus - A grassroots nonprofit open collective supporting creators of all backgrounds');

-- Insert mission section
INSERT INTO sections (page_slug, section_key, title, subtitle, order_index) VALUES 
('home', 'mission', 'Empowering Everyone to Create Without Limits', 'We are a grassroots nonprofit open collective making it easier for anyone of any background to create projects and get support without judgement or intolerance. Our mission is to build an inclusive community where creativity knows no boundaries.', 1);

-- Insert team section
INSERT INTO sections (page_slug, section_key, title, subtitle, order_index) VALUES 
('home', 'team', 'Meet Our Community', 'The passionate creators and supporters behind Orangopus, working together to build an inclusive space where everyone can create without judgement.', 2);

-- Insert journey section
INSERT INTO sections (page_slug, section_key, title, subtitle, order_index) VALUES 
('home', 'journey', 'Our Journey', 'From a simple idea to an inclusive community of creators, here''s how Orangopus came to support everyone in their creative journey.', 3);

-- Insert CTA section
INSERT INTO sections (page_slug, section_key, title, subtitle, order_index) VALUES 
('home', 'cta', 'Ready to Create Something Amazing?', 'Join our inclusive community where anyone can create projects, get support, and find their voice without fear of intolerance or discrimination.', 4);

-- Insert sample team members
INSERT INTO team_members (name, role, bio, avatar_url, github_url, twitter_url, order_index) VALUES 
('Alex Chen', 'Community Lead', 'Passionate about building inclusive spaces where everyone feels welcome to create and contribute, regardless of their background or experience level.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'https://github.com/alexchen', 'https://twitter.com/alexchen', 1),
('Samira Patel', 'Open Source Advocate', 'Believes in the power of open source to democratize creation and build bridges between communities. Dedicated to making technology accessible to all.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'https://github.com/samirapatel', 'https://twitter.com/samirapatel', 2),
('Marcus Johnson', 'Tool Developer', 'Creates intuitive tools that lower barriers to entry for creators from all backgrounds. Focused on building solutions that serve diverse communities.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'https://github.com/marcusjohnson', 'https://twitter.com/marcusjohnson', 3),
('Yuki Tanaka', 'Community Support', 'Ensures every member of our community feels heard, supported, and empowered to pursue their creative vision without fear of judgement.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'https://github.com/yukitanaka', 'https://twitter.com/yukitanaka', 4);

-- Insert sample FAQs
INSERT INTO faqs (category, question, answer, order_index) VALUES 
('Community', 'How do I join the Orangopus community?', 'Anyone can join our community! Simply visit our Discord server or GitHub repository to get started. We welcome creators of all backgrounds and experience levels.', 1),
('Community', 'What makes Orangopus different from other platforms?', 'We are a grassroots nonprofit open collective focused on inclusivity and support without judgement. Our mission is to remove barriers and create a safe space for everyone to create.', 2),
('Projects', 'How can I get help with my project?', 'Our community is here to support you! Share your project in our Discord, GitHub discussions, or community forums. We provide mentorship, resources, and collaboration opportunities.', 3),
('Projects', 'What types of projects are welcome?', 'All types of projects are welcome! Whether you''re building software, art, music, writing, or anything else creative, we support diverse forms of expression and creation.', 4),
('Support', 'How can I support Orangopus?', 'You can support us by contributing to projects, sharing your knowledge with others, donating through OpenCollective, or simply being an active and supportive community member.', 5),
('Support', 'Is everything really free and open source?', 'Yes! Everything we build is open source and free to use. We believe in transparency, accessibility, and removing financial barriers to creation.', 6);

-- Insert site settings
INSERT INTO site_settings (key, value, description) VALUES 
('stats_developers', '5000', 'Number of creators in the community'),
('stats_projects', '250', 'Number of projects created'),
('stats_countries', '50', 'Number of countries represented'),
('stats_contributions', '1000', 'Number of community contributions'),
('site_title', 'Orangopus - Empowering Everyone to Create Without Limits', 'Main site title'),
('site_description', 'A grassroots nonprofit open collective supporting creators of all backgrounds', 'Main site description'),
('discord_url', 'https://discord.gg/orangopus', 'Discord community URL'),
('github_url', 'https://github.com/orangopus', 'GitHub organization URL'),
('opencollective_url', 'https://opencollective.com/orangopus', 'OpenCollective donation URL');

-- Insert sample community posts
INSERT INTO posts (author_name, author_avatar, content, github_repo, project_url, likes_count, is_featured) VALUES 
('Jordan Lee', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Just launched my first open source project with the help of the Orangopus community! The support and encouragement I received was incredible. This is what inclusive creation looks like! 🚀', 'https://github.com/jordanlee/my-first-project', 'https://my-first-project.vercel.app', 45, true),
('Maria Garcia', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'The mentorship I received here helped me overcome imposter syndrome and finally share my creative work. Thank you for creating such a supportive environment! 💜', 'https://github.com/mariagarcia/creative-portfolio', 'https://mariagarcia.dev', 32, true),
('David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Built a tool that helps non-technical creators get started with web development. The community feedback was invaluable!', 'https://github.com/davidkim/creator-toolkit', 'https://creator-toolkit.com', 28, false);

-- Insert sample projects
INSERT INTO projects (title, description, creator_name, creator_avatar, github_url, live_url, tags, is_featured) VALUES 
('Creator Toolkit', 'A beginner-friendly toolkit that helps non-technical creators build their first web projects with confidence and support.', 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'https://github.com/davidkim/creator-toolkit', 'https://creator-toolkit.com', ARRAY['beginner-friendly', 'web-development', 'education'], true),
('Community Connect', 'A platform that matches creators with mentors and collaborators based on their interests and goals.', 'Samira Patel', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'https://github.com/samirapatel/community-connect', 'https://community-connect.org', ARRAY['mentorship', 'collaboration', 'community'], true),
('Accessible Design System', 'A design system built with accessibility and inclusivity as core principles, making beautiful interfaces available to everyone.', 'Alex Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'https://github.com/alexchen/accessible-design', 'https://accessible-design.dev', ARRAY['accessibility', 'design', 'inclusive'], true);

-- Create RLS (Row Level Security) policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_tool_integrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Allow public read access to pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Allow public read access to team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access to faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access to user_activities" ON user_activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to project_likes" ON project_likes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to social_posts" ON social_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dev_tool_integrations" ON dev_tool_integrations FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_activities_updated_at BEFORE UPDATE ON user_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_likes_updated_at BEFORE UPDATE ON project_likes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_tool_integrations_updated_at BEFORE UPDATE ON dev_tool_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 