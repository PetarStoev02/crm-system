import { API_BASE_URL } from './config';

// Communication interfaces
export interface Communication {
  id: number;
  type: string; // Email, Call, Meeting, SMS
  subject: string;
  content: string;
  direction: string; // Inbound, Outbound
  status: string; // Sent, Received, Scheduled, Cancelled
  priority: string; // Low, Medium, High
  communicationDate: string;
  followUpDate?: string;
  notes: string;
  isRead: boolean;
  tags: string;
  createdAt: string;
  updatedAt?: string;
  clientId?: number;
  clientName?: string;
  leadId?: number;
  leadName?: string;
  userId: string;
  userName: string;
  duration?: string; // For calls and meetings
  location?: string; // For meetings
  attendees?: string; // For meetings
}

export interface CreateCommunicationRequest {
  type: string;
  subject: string;
  content: string;
  direction: string;
  status: string;
  priority: string;
  communicationDate: string;
  followUpDate?: string;
  notes: string;
  tags: string;
  clientId?: number;
  leadId?: number;
  duration?: string;
  location?: string;
  attendees?: string;
}

export interface UpdateCommunicationRequest extends CreateCommunicationRequest {
  isRead: boolean;
}

export interface CommunicationStats {
  totalMessages: number;
  unreadMessages: number;
  followUpsDue: number;
  responseRate: number;
  emailsSent: number;
  callsMade: number;
  meetingsScheduled: number;
}

export interface CommunicationsResponse {
  communications: Communication[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetCommunicationsParams {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  unreadOnly?: boolean;
  clientId?: number;
  leadId?: number;
  page?: number;
  pageSize?: number;
}

export interface FollowUp {
  id: number;
  type: string;
  subject: string;
  followUpDate: string;
  priority: string;
  clientId?: number;
  clientName?: string;
  leadId?: number;
  leadName?: string;
}

class CommunicationsAPI {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getCommunications(params: GetCommunicationsParams = {}): Promise<CommunicationsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);
    if (params.priority) searchParams.append('priority', params.priority);
    if (params.unreadOnly !== undefined) searchParams.append('unreadOnly', params.unreadOnly.toString());
    if (params.clientId) searchParams.append('clientId', params.clientId.toString());
    if (params.leadId) searchParams.append('leadId', params.leadId.toString());
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const url = `${API_BASE_URL}/api/communications${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch communications: ${response.statusText}`);
    }

    return response.json();
  }

  async getCommunication(id: number): Promise<Communication> {
    const response = await fetch(`${API_BASE_URL}/api/communications/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch communication: ${response.statusText}`);
    }

    return response.json();
  }

  async createCommunication(communication: CreateCommunicationRequest): Promise<Communication> {
    const response = await fetch(`${API_BASE_URL}/api/communications`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(communication),
    });

    if (!response.ok) {
      throw new Error(`Failed to create communication: ${response.statusText}`);
    }

    return response.json();
  }

  async updateCommunication(id: number, communication: UpdateCommunicationRequest): Promise<Communication> {
    const response = await fetch(`${API_BASE_URL}/api/communications/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(communication),
    });

    if (!response.ok) {
      throw new Error(`Failed to update communication: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteCommunication(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/communications/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete communication: ${response.statusText}`);
    }
  }

  async markAsRead(communicationIds: number[]): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/communications/mark-as-read`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ communicationIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark communications as read: ${response.statusText}`);
    }

    return response.json();
  }

  async getCommunicationStats(): Promise<CommunicationStats> {
    const response = await fetch(`${API_BASE_URL}/api/communications/stats`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch communication stats: ${response.statusText}`);
    }

    return response.json();
  }

  async getFollowUps(days: number = 7): Promise<FollowUp[]> {
    const response = await fetch(`${API_BASE_URL}/api/communications/follow-ups?days=${days}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch follow-ups: ${response.statusText}`);
    }

    return response.json();
  }
}

export const communicationsAPI = new CommunicationsAPI(); 