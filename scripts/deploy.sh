#!/bin/bash

# Simple deployment script
# Customize this based on your deployment target

set -e

echo "🚀 Starting deployment..."

# Build and tag Docker image
echo "📦 Building Docker image..."
docker build -t totofrontend:latest .

# Option 1: Deploy to local Docker
echo "🐳 Starting application with Docker Compose..."
docker-compose down
docker-compose up -d

# Option 2: Deploy to remote server (uncomment and configure)
# echo "📤 Pushing to remote server..."
# docker save totofrontend:latest | gzip | ssh user@your-server 'gunzip | docker load'
# ssh user@your-server 'cd /path/to/app && docker-compose up -d'

# Option 3: Deploy to container registry (uncomment and configure)
# echo "📤 Pushing to container registry..."
# docker tag totofrontend:latest your-registry/totofrontend:latest
# docker push your-registry/totofrontend:latest

echo "✅ Deployment completed!"
echo "🌐 Application should be available at http://localhost:3000"
