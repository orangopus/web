#!/bin/bash

# Run the slug migration on Supabase
# This script adds a slug column to the projects table

echo "🚀 Running slug migration on Supabase..."

# Check if VUE_APP_SUPABASE_URL and VUE_APP_SUPABASE_ANON_KEY are set
if [ -z "$VUE_APP_SUPABASE_URL" ] || [ -z "$VUE_APP_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: VUE_APP_SUPABASE_URL and VUE_APP_SUPABASE_ANON_KEY environment variables must be set"
    echo "Please set them in your .env file or export them in your shell"
    echo ""
    echo "Example:"
    echo "export VUE_APP_SUPABASE_URL=https://your-project.supabase.co"
    echo "export VUE_APP_SUPABASE_ANON_KEY=your-anon-key"
    exit 1
fi

# Run the migration
echo "📝 Executing migration-add-slug-column.sql..."
psql "$VUE_APP_SUPABASE_URL" -f migration-add-slug-column.sql

if [ $? -eq 0 ]; then
    echo "✅ Slug migration completed successfully!"
    echo "🎉 Projects now have slug-based URLs"
    echo ""
    echo "Next steps:"
    echo "1. Restart your development server"
    echo "2. Test project detail pages with slugs"
    echo "3. Update any hardcoded project links to use slugs"
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi 