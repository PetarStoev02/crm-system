# CRM System

A modern, full-stack Customer Relationship Management (CRM) system built with React, TypeScript, and .NET Core. Manage leads, clients, tasks, campaigns, and communications all in one powerful platform.

🌐 **Live Demo:** [https://petarstoev02.github.io/crm-system/](https://petarstoev02.github.io/crm-system/)

## 🚀 Features

- **Lead Management**: Track and manage potential customers
- **Client Management**: Manage existing customer relationships
- **Task Management**: Organize and track tasks with due dates
- **Communication Tracking**: Log all customer interactions
- **Campaign Management**: Plan and track marketing campaigns
- **Dashboard**: Real-time insights and analytics
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TanStack Router** for routing
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Vite** for build tooling

### Backend
- **.NET 9** with C#
- **Entity Framework Core** for data access
- **SQLite** for database
- **JWT Authentication**
- **ASP.NET Core Web API**

## 📦 Installation

### Prerequisites
- Node.js 18+ and pnpm
- .NET 9 SDK
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/petarstoev02/crm-system.git
   cd crm-system
   ```

2. **Install frontend dependencies**
   ```bash
   cd app-frontend
   pnpm install
   ```

3. **Start the backend**
   ```bash
   cd app-backend/CrmSystem.Api
   dotnet run
   ```

4. **Start the frontend**
   ```bash
   cd app-frontend
   pnpm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5153
   - Default login: `user1@test.test` / `password`

## 🌐 Deployment

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages when you push to the `main` branch using GitHub Actions.

**Live Site:** [https://petarstoev02.github.io/crm-system/](https://petarstoev02.github.io/crm-system/)

**Setup Instructions:**
1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"
2. **Push your changes** to the `main` branch to trigger automatic deployment
3. The workflow (`.github/workflows/pages.yml`) will build and deploy the frontend automatically

**Note:** The frontend connects to a backend API. Make sure your backend is deployed and the API URL is configured in `app-frontend/src/lib/config.ts`.

### Backend Deployment

For the backend, you have several options:

#### Option 1: Railway (Recommended)
1. Create an account at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Deploy the `app-backend` folder
4. Update the API URL in `app-frontend/src/lib/config.ts`

#### Option 2: Render
1. Create an account at [Render](https://render.com)
2. Create a new Web Service
3. Point to your backend directory
4. Set the build command: `dotnet build -c Release`
5. Set the start command: `dotnet run --no-build`

#### Option 3: Azure
1. Create an Azure account
2. Use Azure App Service
3. Deploy your .NET application

### Environment Configuration

After deploying your backend, update the API URL in `app-frontend/src/lib/config.ts`:

```typescript
// Replace with your actual backend URL
return 'https://your-backend-url.railway.app';
```

## 🔧 Development

### Available Scripts

```bash
# Install dependencies
pnpm install:frontend

# Start development servers
pnpm start:frontend    # Frontend only
pnpm start:backend     # Backend only
pnpm start             # Both frontend and backend

# Build for production
pnpm build:frontend

# Lint code
pnpm lint:frontend
```

### Project Structure

```
crm-system/
├── app-frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and API clients
│   │   └── routes/        # Route definitions
│   └── package.json
├── app-backend/           # .NET backend
│   ├── CrmSystem.Api/     # Web API project
│   ├── CrmSystem.Core/    # Domain entities
│   ├── CrmSystem.Application/ # Business logic
│   └── CrmSystem.Infrastructure/ # Data access
└── .github/workflows/     # GitHub Actions
```

## 🔐 Authentication

The system uses JWT authentication. Default test credentials:
- **Email**: `user1@test.test`
- **Password**: `password`

## 📊 Database

The application uses SQLite for local development. The database file is created automatically when you first run the application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/petarstoev02/crm-system/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 📚 Additional Documentation

- [Backend Deployment Guide](BACKEND_DEPLOYMENT.md) - Detailed backend deployment instructions
- [Railway Deployment Guide](RAILWAY_DEPLOYMENT.md) - Step-by-step Railway deployment
- [Leads System Guide](LEADS_SYSTEM_GUIDE.md) - Guide to using the leads management system
- [General Deployment Guide](DEPLOYMENT.md) - Comprehensive deployment documentation

## 🚀 Quick Start

Want to get started quickly? Just run:

```bash
git clone https://github.com/petarstoev02/crm-system.git
cd crm-system
cd app-backend/CrmSystem.Api && dotnet run &
cd app-frontend && pnpm install && pnpm run dev
```

Then visit http://localhost:5173 and log in with `user1@test.test` / `password`. 