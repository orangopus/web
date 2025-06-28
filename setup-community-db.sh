#!/bin/bash

# Setup Community Database Schema for Supabase
echo "Setting up Community Database Schema..."

# Check if SUPABASE_URL and SUPABASE_ANON_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set"
    echo "Please set them in your .env file or export them"
    exit 1
fi

# Run the SQL schema
echo "Running community schema SQL..."
psql "$SUPABASE_URL" -f supabase-community-schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Community database schema setup completed successfully!"
    echo ""
    echo "Tables created:"
    echo "  - community_posts"
    echo "  - post_likes" 
    echo "  - post_comments"
    echo ""
    echo "Features enabled:"
    echo "  - Row Level Security (RLS)"
    echo "  - Automatic like counting"
    echo "  - Comment counting"
    echo "  - Sample data inserted"
else
    echo "❌ Error setting up community database schema"
    exit 1
fi 