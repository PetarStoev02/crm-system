# Backend Deployment Guide

This guide will help you deploy the .NET backend API to various cloud platforms so your frontend can connect to it.

## Quick Deploy Options

### Option 1: Railway (Recommended - Free Tier Available)

1. **Sign up at [Railway](https://railway.app)**
2. **Connect your GitHub repository**
3. **Deploy the backend:**
   ```bash
   # Railway will automatically detect it's a .NET project
   # Just point it to the app-backend directory
   ```

4. **Environment Variables to set:**
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=your-production-connection-string
   JwtSettings__SecretKey=your-production-jwt-secret
   ```

### Option 2: Render (Free Tier Available)

1. **Sign up at [Render](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Build Command:** `cd app-backend && dotnet build`
   - **Start Command:** `cd app-backend && dotnet run --project CrmSystem.Api --urls http://0.0.0.0:$PORT`
   - **Environment:** .NET

### Option 3: Azure (Free Tier Available)

1. **Sign up for Azure**
2. **Create an App Service**
3. **Deploy using Azure CLI or GitHub Actions**

## Database Options

### For Production Database:

1. **Railway PostgreSQL** (Free tier available)
2. **Render PostgreSQL** (Free tier available)
3. **Azure SQL Database**
4. **Supabase** (Free tier available)

### Update Connection String:

Replace the SQLite connection in `app-backend/CrmSystem.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-production-database-connection-string"
  }
}
```

## Update Frontend Configuration

Once your backend is deployed, update the frontend configuration:

1. **Edit `app-frontend/src/lib/config.ts`:**
   ```typescript
   // Replace this line:
   return 'https://your-backend-url.railway.app';
   
   // With your actual backend URL, e.g.:
   return 'https://your-app-name.railway.app';
   ```

2. **Redeploy the frontend** (GitHub Actions will do this automatically)

## Environment Variables for Production

Set these in your cloud platform:

```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=your-database-connection-string
JwtSettings__SecretKey=your-super-secret-jwt-key-that-is-at-least-256-bits-long
JwtSettings__Issuer=CrmSystem
JwtSettings__Audience=CrmSystemUsers
```

## CORS Configuration

The backend is already configured to allow requests from:
- `http://localhost:5173` (development)
- `http://localhost:5174` (development)
- `http://localhost:3000` (development)

For production, you'll need to add your GitHub Pages domain to the CORS policy in `app-backend/CrmSystem.Api/Program.cs`:

```csharp
policy.WithOrigins(
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:3000",
    "https://petarstoev02.github.io"  // Add this line
)
```

## Testing Your Deployment

1. **Deploy the backend** using one of the options above
2. **Update the frontend config** with your backend URL
3. **Push to GitHub** to trigger frontend redeployment
4. **Test at:** https://petarstoev02.github.io/crm-system/

## Troubleshooting

### Common Issues:

1. **CORS errors:** Make sure your GitHub Pages domain is in the CORS policy
2. **Database connection:** Ensure your production database is accessible
3. **Environment variables:** Verify all required env vars are set
4. **Port configuration:** Some platforms use `$PORT` environment variable

### Debug Steps:

1. Check your backend logs in the cloud platform dashboard
2. Test the API directly: `curl https://your-backend-url.com/swagger`
3. Check browser console for CORS errors
4. Verify environment variables are set correctly

## Security Notes

- Use strong, unique JWT secrets in production
- Enable HTTPS for all production deployments
- Consider using a proper database (PostgreSQL/MySQL) instead of SQLite for production
- Set up proper authentication and authorization for production use 