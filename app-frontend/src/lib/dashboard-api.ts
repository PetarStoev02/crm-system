import axios from 'axios';
import { authService } from '@/lib/auth';

const API_BASE_URL = 'http://localhost:5001/api';

// Fallback function to ensure auth headers are included
const getConfig = () => {
  const token = authService.getToken();
  return token ? {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  } : {};
};

export interface DashboardStats {
  activeCampaigns: number;
  totalLeads: number;
  conversionRate: number;
  monthlyROI: number;
}

export interface RecentCampaign {
  id: number;
  name: string;
  type: string;
  status: string;
  daysLeft: number;
  endDate?: string;
}

export interface UpcomingTask {
  id: number;
  title: string;
  dueDate?: string;
  priority: string;
  isCompleted: boolean;
  relatedEntityName?: string;
}

export interface HighPriorityLead {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  status: string;
  priority: string;
  lastContactedAt?: string;
}

export interface TeamActivity {
  userName: string;
  activity: string;
  timestamp: string;
  entityType: string;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentCampaigns: RecentCampaign[];
  upcomingTasks: UpcomingTask[];
  highPriorityLeads: HighPriorityLead[];
  teamActivity: TeamActivity[];
}

class DashboardAPIService {
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await axios.get<DashboardOverview>(`${API_BASE_URL}/dashboard/overview`, getConfig());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw new Error('Failed to fetch dashboard data');
    }
  }
}

export const dashboardAPI = new DashboardAPIService(); 