-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('project', 'question', 'showcase', 'discussion')),
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  github_repo JSONB,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Likes Table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Post Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_post_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_likes_count ON community_posts(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

-- Row Level Security (RLS) Policies
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Community Posts Policies
CREATE POLICY "Community posts are viewable by everyone" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Post Likes Policies
CREATE POLICY "Post likes are viewable by everyone" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Post Comments Policies
CREATE POLICY "Post comments are viewable by everyone" ON post_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON post_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON post_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Functions for incrementing/decrementing likes
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  UPDATE community_posts 
  SET likes_count = likes_count + 1 
  WHERE id = post_id;
  
  RETURN (SELECT likes_count FROM community_posts WHERE id = post_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes(post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  UPDATE community_posts 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = post_id;
  
  RETURN (SELECT likes_count FROM community_posts WHERE id = post_id);
END;
$$ LANGUAGE plpgsql;

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comments(post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  UPDATE community_posts 
  SET comments_count = comments_count + 1 
  WHERE id = post_id;
  
  RETURN (SELECT comments_count FROM community_posts WHERE id = post_id);
END;
$$ LANGUAGE plpgsql;

-- Function to decrement comment count
CREATE OR REPLACE FUNCTION decrement_comments(post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  UPDATE community_posts 
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = post_id;
  
  RETURN (SELECT comments_count FROM community_posts WHERE id = post_id);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO community_posts (user_id, user_name, user_avatar, content, post_type, tags, likes_count, comments_count, github_repo) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Ellie@orangopus',
  'https://c.animaapp.com/bX3QfjDJ/img/logo-1.svg',
  'Just finished working on a new Vue.js component library! 🎉 It''s designed to make building beautiful UIs easier than ever. Check it out and let me know what you think! #vue #components #ui',
  'showcase',
  ARRAY['vue', 'components', 'ui'],
  15,
  3,
  '{"name": "vue-component-library", "description": "A beautiful Vue.js component library for modern web applications", "url": "https://github.com/orangopus/vue-component-library", "stars": 23, "forks": 8, "language": "Vue", "last_updated": "2024-01-15T10:00:00Z", "topics": ["vue", "components", "ui", "typescript"]}'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Jordan@orangopus',
  'https://c.animaapp.com/bX3QfjDJ/img/logo-2.svg',
  'Question for the community: What''s your favorite way to handle state management in large Vue applications? I''m working on a new project and would love to hear your experiences! #vue #state-management #discussion',
  'question',
  ARRAY['vue', 'state-management', 'discussion'],
  8,
  12,
  NULL
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Rim@orangopus',
  'https://c.animaapp.com/bX3QfjDJ/img/logo.svg',
  'Showcasing my latest project: A real-time collaboration tool built with WebSockets and Vue 3! Features include live editing, user presence, and conflict resolution. #showcase #websockets #collaboration',
  'showcase',
  ARRAY['showcase', 'websockets', 'collaboration'],
  32,
  7,
  '{"name": "real-time-collab", "description": "Real-time collaboration tool with WebSocket support", "url": "https://github.com/orangopus/real-time-collab", "stars": 45, "forks": 12, "language": "JavaScript", "last_updated": "2024-01-14T15:30:00Z", "topics": ["websockets", "collaboration", "vue", "realtime"]}'
)
ON CONFLICT DO NOTHING; 