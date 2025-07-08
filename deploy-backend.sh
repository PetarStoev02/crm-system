#!/bin/bash

# Backend Deployment Script
# This script helps deploy the .NET backend to various cloud platforms

echo "🚀 CRM System Backend Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -d "app-backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📁 Found backend directory: app-backend/"

# Build the backend
echo "🔨 Building backend..."
cd app-backend
dotnet restore
dotnet build

if [ $? -eq 0 ]; then
    echo "✅ Backend built successfully!"
else
    echo "❌ Backend build failed!"
    exit 1
fi

echo ""
echo "🌐 Deployment Options:"
echo "1. Railway (Recommended - Free tier)"
echo "2. Render (Free tier)"
echo "3. Azure (Free tier available)"
echo "4. Local development"
echo ""

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo "🚂 Deploying to Railway..."
        echo "📋 Steps:"
        echo "1. Go to https://railway.app"
        echo "2. Sign up/Login with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select this repository"
        echo "5. Set root directory to: app-backend"
        echo "6. Add environment variables:"
        echo "   - ASPNETCORE_ENVIRONMENT=Production"
        echo "   - ConnectionStrings__DefaultConnection=your-db-connection"
        echo "   - JwtSettings__SecretKey=your-jwt-secret"
        echo ""
        echo "🔗 After deployment, update app-frontend/src/lib/config.ts with your Railway URL"
        ;;
    2)
        echo "🎨 Deploying to Render..."
        echo "📋 Steps:"
        echo "1. Go to https://render.com"
        echo "2. Sign up/Login with GitHub"
        echo "3. Click 'New' → 'Web Service'"
        echo "4. Connect your GitHub repository"
        echo "5. Configure:"
        echo "   - Build Command: cd app-backend && dotnet build"
        echo "   - Start Command: cd app-backend && dotnet run --project CrmSystem.Api --urls http://0.0.0.0:\$PORT"
        echo "   - Environment: .NET"
        echo ""
        echo "🔗 After deployment, update app-frontend/src/lib/config.ts with your Render URL"
        ;;
    3)
        echo "☁️ Deploying to Azure..."
        echo "📋 Steps:"
        echo "1. Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        echo "2. Run: az login"
        echo "3. Create App Service: az webapp create --name your-app-name --resource-group your-rg"
        echo "4. Deploy: az webapp deployment source config --name your-app-name --resource-group your-rg --repo-url https://github.com/your-username/crm-system --branch main --manual-integration"
        echo ""
        echo "🔗 After deployment, update app-frontend/src/lib/config.ts with your Azure URL"
        ;;
    4)
        echo "💻 Running locally..."
        echo "Starting backend on http://localhost:5153"
        dotnet run --project CrmSystem.Api
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-4."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see: BACKEND_DEPLOYMENT.md"
echo "🌐 Your frontend is already deployed at: https://petarstoev02.github.io/crm-system/" 