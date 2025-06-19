#!/bin/bash

echo "🚀 Military Asset Management System - Deployment Script"
echo "======================================================="

# Check if this is a git repository
if [ ! -d ".git" ]; then
    echo "❌ This is not a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Military Asset Management System"
fi

# Check if GitHub CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📋 Please install it from: https://cli.github.com/"
    echo "🔗 Or create a GitHub repository manually and add it as remote."
    exit 1
fi

# Check if user is authenticated
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ Please authenticate with GitHub CLI first:"
    echo "   gh auth login"
    exit 1
fi

# Create GitHub repository
echo "📁 Creating GitHub repository..."
REPO_NAME="military-asset-management-$(date +%s)"
gh repo create $REPO_NAME --public --description "Military Asset Management System - Full Stack Application"

if [ $? -eq 0 ]; then
    echo "✅ GitHub repository created: $REPO_NAME"
    
    # Add remote and push
    git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"
    git branch -M main
    git push -u origin main
    
    echo "✅ Code pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Deploy Backend to Railway:"
    echo "   - Visit: https://railway.app"
    echo "   - Import your repo: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    echo "   - Set root directory to 'backend'"
    echo ""
    echo "2. Deploy Frontend to Vercel:"
    echo "   - Visit: https://vercel.com"
    echo "   - Import your repo: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    echo "   - Set root directory to 'frontend'"
    echo ""
    echo "📖 Full instructions: See QUICK_DEPLOY.md"
else
    echo "❌ Failed to create GitHub repository."
    echo "🔗 Please create it manually at: https://github.com/new"
    echo "📋 Repository name: $REPO_NAME"
fi 