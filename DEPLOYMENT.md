# Deployment Guide

This guide will help you deploy the CRM System to production.

## 🚀 Frontend Deployment (GitHub Pages)

The frontend is automatically deployed to GitHub Pages using GitHub Actions.

### Prerequisites
1. Push your code to a GitHub repository
2. Enable GitHub Pages in your repository settings
3. Set the source to "GitHub Actions"

### Steps
1. **Push to main branch** - The GitHub Action will automatically:
   - Install dependencies
   - Build the frontend
   - Deploy to GitHub Pages

2. **Access your site** at: `https://yourusername.github.io/crm-system/`

## 🔧 Backend Deployment

Since GitHub Pages only hosts static content, you need to deploy the backend separately.

### Option 1: Railway (Recommended)

Railway is a modern platform that makes it easy to deploy .NET applications.

#### Steps:
1. **Create Railway account** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Create a new service** and select "Deploy from GitHub repo"
4. **Set the root directory** to `app-backend`
5. **Configure environment variables** if needed
6. **Deploy** - Railway will automatically detect it's a .NET app

#### Environment Variables (if needed):
```
ASPNETCORE_ENVIRONMENT=Production
```

### Option 2: Render

Render is another excellent platform for .NET applications.

#### Steps:
1. **Create Render account** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Root Directory**: `app-backend`
   - **Build Command**: `dotnet build -c Release`
   - **Start Command**: `dotnet CrmSystem.Api.dll`
5. **Deploy**

### Option 3: Azure App Service

For enterprise deployments, Azure is a great choice.

#### Steps:
1. **Create Azure account** and App Service
2. **Deploy using Azure CLI** or Visual Studio
3. **Configure connection strings** and environment variables

### Option 4: Docker (Any Platform)

You can also containerize the application.

#### Create Dockerfile:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["CrmSystem.Api/CrmSystem.Api.csproj", "CrmSystem.Api/"]
COPY ["CrmSystem.Core/CrmSystem.Core.csproj", "CrmSystem.Core/"]
COPY ["CrmSystem.Application/CrmSystem.Application.csproj", "CrmSystem.Application/"]
COPY ["CrmSystem.Infrastructure/CrmSystem.Infrastructure.csproj", "CrmSystem.Infrastructure/"]
RUN dotnet restore "CrmSystem.Api/CrmSystem.Api.csproj"
COPY . .
WORKDIR "/src/CrmSystem.Api"
RUN dotnet build "CrmSystem.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CrmSystem.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CrmSystem.Api.dll"]
```

## 🔗 Connecting Frontend to Backend

After deploying your backend, update the API URL in the frontend:

1. **Edit** `app-frontend/src/lib/config.ts`
2. **Replace** the backend URL with your deployed URL:

```typescript
// For Railway
return 'https://your-app-name.railway.app';

// For Render
return 'https://your-app-name.onrender.com';

// For Azure
return 'https://your-app-name.azurewebsites.net';
```

3. **Commit and push** - The frontend will be redeployed automatically

## 🔐 Environment Configuration

### Production Database

For production, consider using a proper database instead of SQLite:

#### PostgreSQL (Recommended)
1. **Add PostgreSQL package**:
   ```bash
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   ```

2. **Update connection string** in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=your-host;Database=crm_system;Username=your-user;Password=your-password"
     }
   }
   ```

#### SQL Server
1. **Add SQL Server package**:
   ```bash
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   ```

2. **Update connection string**:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=your-server;Database=crm_system;User Id=your-user;Password=your-password;TrustServerCertificate=true"
     }
   }
   ```

### JWT Configuration

Update JWT settings in `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "https://your-domain.com",
    "Audience": "https://your-domain.com",
    "ExpirationHours": 24
  }
}
```

## 📊 Monitoring and Logging

### Application Insights (Azure)
If using Azure, enable Application Insights for monitoring.

### Health Checks
The application includes health checks at `/health`.

## 🔒 Security Considerations

1. **Use HTTPS** - All production deployments should use HTTPS
2. **Environment Variables** - Store sensitive data in environment variables
3. **CORS Configuration** - Update CORS settings for your domain
4. **Rate Limiting** - Consider adding rate limiting for production
5. **Input Validation** - Ensure all inputs are properly validated

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update CORS configuration in `Program.cs`
   - Add your frontend domain to allowed origins

2. **Database Connection Issues**
   - Check connection strings
   - Ensure database is accessible from your deployment platform

3. **Build Failures**
   - Check .NET version compatibility
   - Ensure all dependencies are properly referenced

4. **Authentication Issues**
   - Verify JWT configuration
   - Check token expiration settings

### Debugging

1. **Check logs** in your deployment platform
2. **Test API endpoints** using tools like Postman
3. **Verify environment variables** are set correctly
4. **Check network connectivity** between frontend and backend

## 📈 Performance Optimization

1. **Enable compression** in production
2. **Use CDN** for static assets
3. **Implement caching** strategies
4. **Optimize database queries**
5. **Use connection pooling**

## 🔄 Continuous Deployment

The GitHub Actions workflow automatically deploys the frontend. For the backend:

### Railway
- Automatically deploys on push to main branch

### Render
- Automatically deploys on push to main branch

### Azure
- Configure Azure DevOps or GitHub Actions for automated deployment

## 📞 Support

If you encounter deployment issues:

1. Check the platform-specific documentation
2. Review application logs
3. Test locally first
4. Use staging environments for testing 