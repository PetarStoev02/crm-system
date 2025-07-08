# Railway Deployment Guide

This guide will help you deploy your CRM system backend to Railway.

## 🚀 Quick Deploy to Railway

### Step 1: Sign up for Railway
1. Go to [Railway](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project"

### Step 2: Deploy from GitHub
1. Select "Deploy from GitHub repo"
2. Choose your repository: `petarstoev02/crm-system`
3. Railway will automatically detect the Dockerfile

### Step 3: Configure Environment Variables
In your Railway project dashboard, add these environment variables:

```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Data Source=crm_database.db
JwtSettings__SecretKey=your-super-secret-jwt-key-that-is-at-least-256-bits-long
JwtSettings__Issuer=CrmSystem
JwtSettings__Audience=CrmSystemUsers
```

### Step 4: Deploy
1. Click "Deploy" 
2. Wait for the build to complete (usually 2-3 minutes)
3. Railway will provide you with a URL like: `https://your-app-name.railway.app`

### Step 5: Update Frontend Configuration
1. Copy your Railway URL
2. Edit `app-frontend/src/lib/config.ts`
3. Replace the placeholder URL with your Railway URL:

```typescript
// Replace this line:
return 'https://your-backend-url.railway.app';

// With your actual Railway URL:
return 'https://your-app-name.railway.app';
```

4. Commit and push the changes
5. GitHub Actions will automatically redeploy your frontend

## 🔧 Configuration Details

### Dockerfile
The project includes a `Dockerfile` that:
- Uses .NET 9 runtime and SDK
- Copies the backend code from `app-backend/`
- Builds and publishes the application
- Exposes port 80 and 443

### Port Configuration
The application is configured to use Railway's `$PORT` environment variable:
- Development: Uses port 5153
- Production: Uses Railway's assigned port

### Database
- Uses SQLite for simplicity
- Database file is created automatically
- For production, consider using Railway's PostgreSQL service

## 🚨 Troubleshooting

### Build Failures
If the build fails:
1. Check that the Dockerfile is in the root directory
2. Verify all .csproj files exist in app-backend/
3. Check Railway logs for specific error messages

### Runtime Errors
If the app doesn't start:
1. Check environment variables are set correctly
2. Verify the port configuration
3. Check application logs in Railway dashboard

### CORS Issues
If you see CORS errors:
1. Verify your Railway URL is in the CORS configuration
2. Check that the frontend is using the correct backend URL

## 📊 Monitoring

### Railway Dashboard
- View real-time logs
- Monitor resource usage
- Check deployment status

### Health Check
Your API includes a health check endpoint:
- URL: `https://your-app-name.railway.app/health`
- Use this to verify the API is running

## 🔗 Next Steps

After successful deployment:
1. Test your API: `https://your-app-name.railway.app/swagger`
2. Update frontend configuration
3. Test the full application at: https://petarstoev02.github.io/crm-system/

## 💡 Tips

- Railway provides free tier with generous limits
- Automatic deployments on git push
- Built-in SSL certificates
- Easy environment variable management
- Real-time logs and monitoring 