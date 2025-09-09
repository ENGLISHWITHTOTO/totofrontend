#!/bin/bash

# Local development helper script

set -e

echo "🛠️  Setting up local development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint

# Start development server
echo "🚀 Starting development server..."
npm run dev
