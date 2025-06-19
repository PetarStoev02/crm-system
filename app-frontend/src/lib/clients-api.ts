import { API_BASE_URL } from './config';

// Client interfaces
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  status: string;
  type: string;
  totalValue: number;
  outstandingBalance: number;
  notes?: string;
  createdAt: string;
  lastInvoiceDate?: string;
  assignedToUserId: string;
  assignedToUser?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  status: string;
  type: string;
  totalValue?: number;
  outstandingBalance?: number;
  notes?: string;
}

export interface UpdateClientRequest extends CreateClientRequest {
  id: number;
}

export interface ClientStats {
  totalClients: number;
  activeClients: number;
  prospectClients: number;
  totalRevenue: number;
  outstandingAmount: number;
  overdueInvoices: number;
}

export interface ClientsResponse {
  clients: Client[];
  totalCount: number;
}

export interface GetClientsParams {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

class ClientsAPI {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getClients(params: GetClientsParams = {}): Promise<ClientsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.type) searchParams.append('type', params.type);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const url = `${API_BASE_URL}/api/clients${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }

    return response.json();
  }

  async getClient(id: number): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch client: ${response.statusText}`);
    }

    return response.json();
  }

  async createClient(client: CreateClientRequest): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`Failed to create client: ${response.statusText}`);
    }

    return response.json();
  }

  async updateClient(id: number, client: CreateClientRequest): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`Failed to update client: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteClient(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete client: ${response.statusText}`);
    }
  }

  async getClientStats(): Promise<ClientStats> {
    const response = await fetch(`${API_BASE_URL}/api/clients/stats`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch client stats: ${response.statusText}`);
    }

    return response.json();
  }
}

export const clientsAPI = new ClientsAPI(); 