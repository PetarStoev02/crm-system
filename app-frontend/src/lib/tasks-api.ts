import axios from "axios";
import { authService } from "@/lib/auth";
import { API_BASE_URL } from "./config";

const getConfig = () => {
  const token = authService.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export interface TaskUser {
  firstName: string;
  lastName: string;
}

export interface RelatedEntity {
  id: number;
  name: string;
  type: string; // "Lead" or "Campaign"
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  assignedToUserId: string;
  assignedToUser?: TaskUser;
  relatedLeadId?: number;
  relatedLead?: RelatedEntity;
  relatedCampaignId?: number;
  relatedCampaign?: RelatedEntity;
}

export interface TasksResponse {
  tasks: Task[];
  totalCount: number;
  totalTasks: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  relatedLeadId?: number;
  relatedCampaignId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  relatedLeadId?: number;
  relatedCampaignId?: number;
}

export interface UpdateTaskStatusRequest {
  status: string;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  limit?: number;
}

export const tasksAPI = {
  async getTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/api/tasks?${params.toString()}`,
      getConfig()
    );
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await axios.get(
      `${API_BASE_URL}/api/tasks/${id}`,
      getConfig()
    );
    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await axios.post(
      `${API_BASE_URL}/api/tasks`,
      data,
      getConfig()
    );
    return response.data;
  },

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await axios.put(
      `${API_BASE_URL}/api/tasks/${id}`,
      data,
      getConfig()
    );
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/api/tasks/${id}`,
      getConfig()
    );
  },

  async updateTaskStatus(id: number, data: UpdateTaskStatusRequest): Promise<Task> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/tasks/${id}/status`,
      data,
      getConfig()
    );
    return response.data;
  },

  // Helper method to get leads for task creation/editing
  async getLeadsForSelect(): Promise<Array<{ id: number; name: string }>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/leads?limit=100`,
        getConfig()
      );
      return response.data.leads.map((lead: any) => ({
        id: lead.id,
        name: `${lead.firstName} ${lead.lastName} (${lead.company || 'No Company'})`
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Helper method to get campaigns for task creation/editing
  async getCampaignsForSelect(): Promise<Array<{ id: number; name: string }>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/campaigns?limit=100`,
        getConfig()
      );
      return response.data.campaigns?.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name
      })) || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }
}; 