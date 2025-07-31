# Environment Configuration

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VUE_APP_SUPABASE_URL=your_supabase_project_url
VUE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub OAuth (Optional - for GitHub integration)
VUE_APP_GITHUB_CLIENT_ID=your_github_client_id
VUE_APP_GITHUB_CLIENT_SECRET=your_github_client_secret

# App Configuration
VUE_APP_APP_NAME=Orangopus
VUE_APP_APP_DESCRIPTION=Community-Driven Development Platform
VUE_APP_APP_URL=https://orangopus.org
```

## Setting up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from the project settings
3. Create the required tables using the SQL scripts in the root directory

## Setting up GitHub OAuth (Optional)

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set the callback URL to `http://localhost:8080/auth/callback` for development
4. Copy the Client ID and Client Secret to your `.env` file 