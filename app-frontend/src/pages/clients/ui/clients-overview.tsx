import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus } from 'lucide-react';
import { clientsAPI, type Client, type ClientsResponse, type ClientStats, type CreateClientRequest } from '@/lib/clients-api';
import { ClientForm } from './client-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ViewMode = 'list' | 'create' | 'edit';

export function ClientsOverview() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (viewMode === 'list') {
      fetchClients();
      fetchStats();
    }
  }, [viewMode, filters, pagination.currentPage]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response: ClientsResponse = await clientsAPI.getClients({
        search: filters.search || undefined,
        status: filters.status || undefined,
        type: filters.type || undefined,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      
      setClients(response.clients);
      setPagination(prev => ({
        ...prev,
        total: response.totalCount,
        totalPages: Math.ceil(response.totalCount / prev.pageSize),
      }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await clientsAPI.getClientStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch client stats:', err);
    }
  };

  const handleCreateClient = async (data: CreateClientRequest) => {
    setFormLoading(true);
    try {
      await clientsAPI.createClient(data);
      setViewMode('list');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateClient = async (data: CreateClientRequest) => {
    if (!editingClient) return;
    
    setFormLoading(true);
    try {
      await clientsAPI.updateClient(editingClient.id, data);
      setViewMode('list');
      setEditingClient(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    try {
      await clientsAPI.deleteClient(id);
      fetchClients();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-blue-100 text-blue-800';
      case 'Business': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (viewMode === 'create') {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setViewMode('list')}
          isLoading={formLoading}
        />
      </div>
    );
  }

  if (viewMode === 'edit' && editingClient) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <ClientForm
          client={editingClient}
          onSubmit={handleUpdateClient}
          onCancel={() => {
            setViewMode('list');
            setEditingClient(null);
          }}
          isLoading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Client Management</h1>
          <p className="text-gray-500">Manage your client relationships and accounts</p>
        </div>
        <Button 
          onClick={() => setViewMode('create')}
          className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add New Client
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search clients..." 
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full md:w-1/3 border rounded px-3 py-2 text-gray-600 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Prospect">Prospect</option>
            </select>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full md:w-1/3 border rounded px-3 py-2 text-gray-600 bg-white"
            >
              <option value="">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Clients</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalClients.toLocaleString() : '--'}
              </span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Active Clients</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? stats.activeClients.toLocaleString() : '--'}
              </span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Revenue</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalRevenue) : '--'}
              </span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Outstanding</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.outstandingAmount) : '--'}
              </span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-semibold text-gray-900">
              All Clients ({pagination.total})
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">⏳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading clients...</h3>
              <p className="text-gray-600">Please wait while we fetch your client data.</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first client.</p>
              <Button
                onClick={() => setViewMode('create')}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Add Client
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{client.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(client.type)}`}>
                            {client.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(client.totalValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(client.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingClient(client);
                                setViewMode('edit');
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClient(client.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                        disabled={pagination.currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                        disabled={pagination.currentPage === pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                          <span className="font-medium">{pagination.totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                            disabled={pagination.currentPage === 1}
                            className="rounded-l-md"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="rounded-r-md"
                          >
                            Next
                          </Button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ClientsOverview; 