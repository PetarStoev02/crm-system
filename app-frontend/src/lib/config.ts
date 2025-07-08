// API base URL configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in development
  if (import.meta.env.DEV) {
    return 'http://localhost:5153';
  }
  
  // Check if we're on GitHub Pages
  if (window.location.hostname === 'petarstoev.github.io' || 
      window.location.hostname.includes('github.io')) {
    // For GitHub Pages, you'll need to deploy your backend separately
    // You can use services like Railway, Render, or Azure
    return 'https://your-backend-url.railway.app'; // Replace with your actual backend URL
  }
  
  // Production environment
  return 'https://your-production-backend.com'; // Replace with your actual production backend URL
};

export const API_BASE_URL = getApiBaseUrl(); 