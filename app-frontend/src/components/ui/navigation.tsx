import { Link, useLocation } from '@tanstack/react-router';
import { BarChart3, Users, UserPlus, Calendar, Settings, LogOut, Users2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/leads', label: 'Leads', icon: UserPlus },
    { path: '/clients', label: 'Clients', icon: Users2 },
    { path: '/campaigns', label: 'Campaigns', icon: Calendar },
    { path: '/team', label: 'Team', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">CRM System</h1>
      </div>
      
      <div className="px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={signOut}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 