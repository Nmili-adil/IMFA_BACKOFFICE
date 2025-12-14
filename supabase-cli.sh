#!/bin/bash

# IMFA Backoffice - Supabase CLI Helper Script
# This script provides easy access to Supabase CLI commands

echo "🚀 IMFA Backoffice - Supabase CLI Helper"
echo "========================================"
echo ""

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not installed. Please install Node.js and npm."
    exit 1
fi

# Display menu
echo "Available commands:"
echo "1. Check Supabase CLI version"
echo "2. Initialize Supabase project (local)"
echo "3. Start local Supabase"
echo "4. Stop local Supabase"
echo "5. Check Supabase status"
echo "6. Link to remote Supabase project"
echo "7. Generate TypeScript types from database"
echo "8. Run database migrations"
echo "9. Open Supabase Studio (local)"
echo "0. Custom command"
echo ""

read -p "Enter your choice (0-9): " choice

case $choice in
    1)
        echo "Checking Supabase CLI version..."
        npx supabase --version
        ;;
    2)
        echo "Initializing Supabase project..."
        npx supabase init
        ;;
    3)
        echo "Starting local Supabase..."
        npx supabase start
        ;;
    4)
        echo "Stopping local Supabase..."
        npx supabase stop
        ;;
    5)
        echo "Checking Supabase status..."
        npx supabase status
        ;;
    6)
        read -p "Enter your Supabase project ref: " project_ref
        echo "Linking to remote project..."
        npx supabase link --project-ref $project_ref
        ;;
    7)
        echo "Generating TypeScript types..."
        echo "Make sure you have SUPABASE_ACCESS_TOKEN in your environment"
        npx supabase gen types typescript --local > src/types/supabase.ts
        echo "✅ Types generated at src/types/supabase.ts"
        ;;
    8)
        echo "Running database migrations..."
        npx supabase db push
        ;;
    9)
        echo "Opening Supabase Studio..."
        echo "Studio should open at http://localhost:54323"
        npx supabase start
        ;;
    0)
        read -p "Enter custom Supabase command (without 'npx supabase'): " custom_cmd
        npx supabase $custom_cmd
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
