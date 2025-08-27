#!/bin/bash

# Expense Management App Deployment Script
# This script builds and deploys the application

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build files are in the 'dist' directory"

# Optional: Deploy to different platforms
echo ""
echo "🎯 Deployment options:"
echo "1. GitHub Pages (manual upload)"
echo "2. Netlify (drag and drop dist folder)"
echo "3. Vercel (vercel --prod)"
echo "4. Local preview (npm run preview)"

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo "📤 For GitHub Pages:"
        echo "1. Go to your repository settings"
        echo "2. Navigate to Pages section"
        echo "3. Set source to 'Deploy from a branch'"
        echo "4. Select 'gh-pages' branch and '/ (root)' folder"
        echo "5. Or use the GitHub Actions workflow (.github/workflows/deploy.yml)"
        ;;
    2)
        echo "📤 For Netlify:"
        echo "1. Go to netlify.com"
        echo "2. Drag and drop the 'dist' folder"
        echo "3. Or connect your GitHub repository"
        ;;
    3)
        echo "📤 For Vercel:"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Run: vercel --prod"
        ;;
    4)
        echo "🌐 Starting local preview..."
        npm run preview
        ;;
    *)
        echo "❌ Invalid option selected."
        ;;
esac

echo ""
echo "🎉 Deployment script completed!"
echo "📁 Your built files are ready in the 'dist' directory"


