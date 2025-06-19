import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Flame, Percent, UserPlus, Eye, Edit, Trash2, Phone, Mail, Building, Search, Filter, Download, MoreVertical } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { leadsAPI, type Lead, type LeadsFilters, type LeadStats, type CreateLeadRequest, type UpdateLeadRequest } from '@/lib/leads-api';
import { LeadForm } from './lead-form';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ViewMode = 'list' | 'create' | 'edit';

export function LeadsOverview() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const [filters, setFilters] = useState<LeadsFilters>({
    search: '',
    status: '',
    priority: '',
    source: '',
    page: 1,
    limit: 10
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getLeads(filters);
      setLeads(response.leads);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await leadsAPI.getLeadStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateLead = async (data: CreateLeadRequest) => {
    try {
      setFormLoading(true);
      await leadsAPI.createLead(data);
      setViewMode('list');
      fetchLeads();
      fetchStats();
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateLead = async (data: UpdateLeadRequest) => {
    if (!editingLead) return;
    
    try {
      setFormLoading(true);
      await leadsAPI.updateLead(editingLead.id, data);
      setViewMode('list');
      setEditingLead(null);
      fetchLeads();
      fetchStats();
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await leadsAPI.deleteLead(leadId);
      fetchLeads();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
    }
  };

  const handleMarkAsContacted = async (leadId: number) => {
    try {
      await leadsAPI.markAsContacted(leadId);
      fetchLeads();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as contacted');
    }
  };

  const handleFilterChange = (key: keyof LeadsFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Proposal': return 'bg-purple-100 text-purple-800';
      case 'Closed-Won': return 'bg-emerald-100 text-emerald-800';
      case 'Closed-Lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (viewMode === 'create') {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <LeadForm
          onSubmit={handleCreateLead}
          onCancel={() => setViewMode('list')}
          isLoading={formLoading}
        />
      </div>
    );
  }

  if (viewMode === 'edit' && editingLead) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <LeadForm
          lead={editingLead}
          onSubmit={handleUpdateLead}
          onCancel={() => {
            setViewMode('list');
            setEditingLead(null);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Leads Management</h1>
          <p className="text-gray-500">Track and manage your sales leads</p>
        </div>
        <Button 
          onClick={() => setViewMode('create')}
          className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add New Lead
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
            <div className="relative w-full md:w-1/4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search leads..." 
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Closed-Won">Closed-Won</option>
              <option value="Closed-Lost">Closed-Lost</option>
            </select>
            <select 
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select 
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Social Media">Social Media</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Event">Event</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Leads</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalLeads.toLocaleString() : '--'}
              </span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Qualified Leads</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? stats.qualifiedLeads.toLocaleString() : '--'}
              </span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Conversion Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? `${stats.conversionRate.toFixed(1)}%` : '--'}
              </span>
              <Percent className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Hot Leads</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? stats.hotLeads.toLocaleString() : '--'}
              </span>
              <Flame className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-semibold text-gray-900">
              All Leads ({pagination.total})
            </span>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-200 text-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-600">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No leads found</h3>
              <p className="text-sm mb-4">Get started by adding your first lead</p>
              <Button onClick={() => setViewMode('create')}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Lead
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Contact</th>
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Priority</th>
                    <th className="px-6 py-3 font-medium">Value</th>
                    <th className="px-6 py-3 font-medium">Last Contact</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          {lead.company || 'No company'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{lead.source}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(lead.estimatedValue)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {lead.lastContactedAt ? formatDate(lead.lastContactedAt) : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-blue-600"
                            title="View lead"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-green-600"
                            onClick={() => {
                              setEditingLead(lead);
                              setViewMode('edit');
                            }}
                            title="Edit lead"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-orange-600"
                            onClick={() => handleMarkAsContacted(lead.id)}
                            title="Mark as contacted"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteLead(lead.id)}
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * (filters.limit || 10) + 1} to{' '}
                {Math.min(pagination.page * (filters.limit || 10), pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 