# Environment Configuration

This document describes the environment variables needed for the Orangopus application.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
VUE_APP_SUPABASE_URL=https://your-project.supabase.co
VUE_APP_SUPABASE_ANON_KEY=your-anon-key

# Environment
NODE_ENV=development

# Vue App Configuration
VUE_APP_TITLE=Orangopus
VUE_APP_DESCRIPTION=Grassroots nonprofit open collective platform
```

## How to Get Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to your project dashboard
3. Go to Settings > API
4. Copy the following values:
   - **Project URL**: Use this as `VUE_APP_SUPABASE_URL`
   - **anon public key**: Use this as `VUE_APP_SUPABASE_ANON_KEY`

## Optional Environment Variables

```bash
# GitHub OAuth (if you want to add GitHub integration)
VUE_APP_GITHUB_CLIENT_ID=your-github-client-id
VUE_APP_GITHUB_CLIENT_SECRET=your-github-client-secret

# Analytics (if you want to add analytics later)
VUE_APP_ANALYTICS_ID=your-analytics-id

# Sentry (if you want to add error tracking later)
VUE_APP_SENTRY_DSN=your-sentry-dsn
```

## Important Notes

- The `.env` file is already included in `.gitignore` to keep your secrets safe
- Never commit your actual API keys to version control
- For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.)
- All environment variables must be prefixed with `VUE_APP_` to be accessible in the Vue application

## Example .env File

```bash
# Copy this to .env and replace with your actual values
VUE_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VUE_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0NzI5MCwiZXhwIjoxOTUyMTIzMjkwfQ.example
NODE_ENV=development
VUE_APP_TITLE=Orangopus
VUE_APP_DESCRIPTION=Grassroots nonprofit open collective platform
``` 