#!/bin/bash

# Docker Build Script for IMFA Backoffice
# This script builds the Docker image with environment variables

set -e

echo "🐳 IMFA Backoffice - Docker Build Script"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "VITE_SUPABASE_URL=your_supabase_project_url"
    echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo ""
    exit 1
fi

# Load environment variables from .env.local
export $(grep -v '^#' .env.local | xargs)

# Check if required variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please ensure .env.local contains:"
    echo "  - VITE_SUPABASE_URL"
    echo "  - VITE_SUPABASE_ANON_KEY"
    exit 1
fi

# Get image name and tag from arguments or use defaults
IMAGE_NAME=${1:-imfa-backoffice}
IMAGE_TAG=${2:-latest}

echo "📦 Building Docker image..."
echo "Image: $IMAGE_NAME:$IMAGE_TAG"
echo ""

# Build the Docker image with build args
docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  -t "$IMAGE_NAME:$IMAGE_TAG" \
  -f Dockerfile.production \
  .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Docker image built successfully!"
    echo ""
    echo "To run the container:"
    echo "  docker run -d -p 3000:80 --name imfa-backoffice $IMAGE_NAME:$IMAGE_TAG"
    echo ""
    echo "Or use Docker Compose:"
    echo "  docker-compose up -d"
else
    echo ""
    echo "❌ Docker build failed!"
    exit 1
fi
