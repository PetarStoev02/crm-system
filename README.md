# CRM System

A modern, full-stack CRM system built with React, TypeScript, and .NET Core.

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
   git clone https://github.com/yourusername/crm-system.git
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

The frontend is automatically deployed to GitHub Pages when you push to the `main` branch.

1. **Enable GitHub Pages** in your repository settings
2. **Set the source** to "GitHub Actions"
3. **Push your changes** to trigger deployment

The site will be available at: `https://yourusername.github.io/crm-system/`

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

1. Check the [Issues](https://github.com/yourusername/crm-system/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🚀 Quick Start

Want to get started quickly? Just run:

```bash
git clone https://github.com/yourusername/crm-system.git
cd crm-system
cd app-backend/CrmSystem.Api && dotnet run &
cd app-frontend && pnpm install && pnpm run dev
```

Then visit http://localhost:5173 and log in with `user1@test.test` / `password`. 