import axios from 'axios';
import { API_BASE_URL } from './config';

const getAuthToken = () => localStorage.getItem('auth-token');

const getConfig = () => ({
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  }
});

// Types matching backend DTOs
export interface UserDto {
  firstName: string;
  lastName: string;
}

export interface CampaignDto {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  targetAudience: number;
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: string;
  createdByUserId: string;
  createdByUser?: UserDto;
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  type?: string;
  status?: string;
  startDate: string;
  endDate?: string;
  budget: number;
  targetAudience: number;
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  targetAudience?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
}

export interface CampaignsResponse {
  campaigns: CampaignDto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CampaignFilters {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface CampaignStats {
  activeCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageConversionRate: number;
}

export const campaignsAPI = {
  // Get campaigns with filters
  async getCampaigns(filters: CampaignFilters = {}): Promise<CampaignsResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get(
        `${API_BASE_URL}/api/campaigns?${params.toString()}`,
        getConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  // Get single campaign
  async getCampaign(id: number): Promise<CampaignDto> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/campaigns/${id}`,
        getConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      throw error;
    }
  },

  // Create campaign
  async createCampaign(data: CreateCampaignRequest): Promise<CampaignDto> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/campaigns`,
        data,
        getConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  // Update campaign
  async updateCampaign(id: number, data: UpdateCampaignRequest): Promise<CampaignDto> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/campaigns/${id}`,
        data,
        getConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating campaign ${id}:`, error);
      throw error;
    }
  },

  // Delete campaign
  async deleteCampaign(id: number): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/campaigns/${id}`,
        getConfig()
      );
    } catch (error) {
      console.error(`Error deleting campaign ${id}:`, error);
      throw error;
    }
  },

  // Get campaigns for select dropdown (simple format)
  async getCampaignsForSelect(): Promise<Array<{ id: number; name: string }>> {
    try {
      const response = await this.getCampaigns({ limit: 100 });
      return response.campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name
      }));
    } catch (error) {
      console.error('Error fetching campaigns for select:', error);
      return [];
    }
  },

  // Calculate campaign statistics
  async getCampaignStats(): Promise<CampaignStats> {
    try {
      const response = await this.getCampaigns({ limit: 1000 });
      const campaigns = response.campaigns;

      const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
      const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
      const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
      const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
      const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

      const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      return {
        activeCampaigns,
        totalBudget,
        totalSpent,
        totalImpressions,
        totalClicks,
        totalConversions,
        averageCTR,
        averageConversionRate
      };
    } catch (error) {
      console.error('Error calculating campaign stats:', error);
      return {
        activeCampaigns: 0,
        totalBudget: 0,
        totalSpent: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        averageCTR: 0,
        averageConversionRate: 0
      };
    }
  },

  // Get campaigns for calendar (with dates)
  async getCampaignsForCalendar(): Promise<Array<{
    id: number;
    name: string;
    startDate: string;
    endDate?: string;
    status: string;
    type: string;
  }>> {
    try {
      const response = await this.getCampaigns({ limit: 100 });
      return response.campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: campaign.status,
        type: campaign.type
      }));
    } catch (error) {
      console.error('Error fetching campaigns for calendar:', error);
      return [];
    }
  }
}; 