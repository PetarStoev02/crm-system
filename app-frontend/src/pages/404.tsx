import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, AlertTriangle } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (authService.isAuthenticated()) {
      navigate({ to: '/authed/dashboard' });
    } else {
      navigate({ to: '/login' });
    }
  };

  const getHomeText = () => {
    return authService.isAuthenticated() ? 'Go to Dashboard' : 'Go to Login';
  };

  const getDescription = () => {
    if (authService.isAuthenticated()) {
      return "The page you're looking for doesn't exist. Let's get you back to your dashboard.";
    } else {
      return "The page you're looking for doesn't exist. Please log in to access the application.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertTriangle className="w-16 h-16 text-gray-400" />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                404
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getDescription()}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleGoHome}
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
            >
              <Home className="w-4 h-4 mr-2" />
              {getHomeText()}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              Go Back
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 