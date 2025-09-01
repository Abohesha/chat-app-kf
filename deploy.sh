#!/bin/bash

# Render Deployment Script for Kareem Fuad Dream Interpretations

echo "🚀 Starting Render deployment preparation..."

# Check if Node.js version is compatible
NODE_VERSION=$(node --version)
echo "📋 Current Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️  Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🌟 Your app is ready for deployment on Render!"

echo ""
echo "📝 Next steps:"
echo "1. Push changes to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Set environment variables in Render dashboard:"
echo "   - MONGODB_URI"
echo "   - ADMIN_TOKEN"
echo "4. Deploy!"
echo ""
echo "🌐 Admin access: https://your-app.onrender.com/admin?token=YOUR_ADMIN_TOKEN"