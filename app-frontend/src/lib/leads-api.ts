import axios from 'axios';
import { authService } from '@/lib/auth';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api`;

// Fallback function to ensure auth headers are included
const getConfig = () => {
  const token = authService.getToken();
  return token ? {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  } : {};
};

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: string; // New, Contacted, Qualified, Proposal, Closed-Won, Closed-Lost
  priority: string; // Low, Medium, High
  notes?: string;
  createdAt: string;
  lastContactedAt?: string;
  assignedToUserId: string;
  assignedToUser?: {
    firstName: string;
    lastName: string;
  };
  estimatedValue: number;
  source: string; // Website, Social Media, Referral, Cold Call, etc.
}

export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  priority?: string;
  notes?: string;
  estimatedValue?: number;
  source?: string;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  lastContactedAt?: string;
}

export interface LeadsFilters {
  search?: string;
  status?: string;
  priority?: string;
  source?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LeadStats {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  hotLeads: number;
  newLeadsThisWeek: number;
  averageEstimatedValue: number;
}

class LeadsAPIService {
  async getLeads(filters: LeadsFilters = {}): Promise<LeadsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.source) params.append('source', filters.source);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get<LeadsResponse>(`${API_URL}/leads?${params}`, getConfig());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw new Error('Failed to fetch leads');
    }
  }

  async getLead(id: number): Promise<Lead> {
    try {
      const response = await axios.get<Lead>(`${API_URL}/leads/${id}`, getConfig());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      throw new Error('Failed to fetch lead');
    }
  }

  async createLead(leadData: CreateLeadRequest): Promise<Lead> {
    try {
      const config = getConfig();
      const response = await axios.post<Lead>(`${API_URL}/leads`, leadData, config);
      return response.data;
    } catch (error) {
      console.error('Failed to create lead:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw new Error('Failed to create lead');
    }
  }

  async updateLead(id: number, leadData: UpdateLeadRequest): Promise<Lead> {
    try {
      const config = getConfig();
      const response = await axios.put<Lead>(`${API_URL}/leads/${id}`, leadData, config);
      return response.data;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw new Error('Failed to update lead');
    }
  }

  async deleteLead(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/leads/${id}`, getConfig());
    } catch (error) {
      console.error('Failed to delete lead:', error);
      throw new Error('Failed to delete lead');
    }
  }

  async getLeadStats(): Promise<LeadStats> {
    try {
      const response = await axios.get<LeadStats>(`${API_URL}/leads/stats`, getConfig());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch lead stats:', error);
      throw new Error('Failed to fetch lead stats');
    }
  }

  async markAsContacted(id: number): Promise<Lead> {
    try {
      const config = getConfig();
      const response = await axios.post<Lead>(`${API_URL}/leads/${id}/contact`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Failed to mark lead as contacted:', error);
      throw new Error('Failed to mark lead as contacted');
    }
  }

  async bulkUpdateStatus(leadIds: number[], status: string): Promise<void> {
    try {
      const config = getConfig();
      await axios.post(`${API_URL}/leads/bulk-update-status`, {
        leadIds,
        status
      }, config);
    } catch (error) {
      console.error('Failed to bulk update leads:', error);
      throw new Error('Failed to bulk update leads');
    }
  }
}

export const leadsAPI = new LeadsAPIService(); 