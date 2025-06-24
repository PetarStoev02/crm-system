import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Megaphone, Eye, Percent, DollarSign, Plus, Edit, Trash2, 
  Filter, Download, Search, Target
} from "lucide-react";
import { campaignsAPI } from '@/lib/campaigns-api';
import type { 
  CampaignDto, 
  CreateCampaignRequest, 
  UpdateCampaignRequest,
  CampaignStats,
  CampaignFilters
} from '@/lib/campaigns-api';
import { CampaignForm } from './campaign-form';
import { CampaignCalendar } from '@/components/campaign-calendar';
import { parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export function CampaignsOverview() {
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignDto | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>({
    search: '',
    status: '',
    type: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await campaignsAPI.getCampaigns(filters);
      setCampaigns(response.campaigns);
      setTotalPages(response.totalPages);
    } catch (err: unknown) {
      setError('Failed to load campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await campaignsAPI.getCampaignStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching campaign stats:', err);
    }
  };

  const handleCreateCampaign = async (data: CreateCampaignRequest | UpdateCampaignRequest) => {
    try {
      // For creation, we know it's a CreateCampaignRequest
      await campaignsAPI.createCampaign(data as CreateCampaignRequest);
      setShowCreateForm(false);
      fetchCampaigns();
      fetchStats();
      toast.success('Campaign created successfully!');
    } catch (err) {
      toast.error('Failed to create campaign');
      throw err;
    }
  };

  const handleUpdateCampaign = async (data: CreateCampaignRequest | UpdateCampaignRequest) => {
    if (!editingCampaign) return;
    
    try {
      // For updates, we know it's an UpdateCampaignRequest
      await campaignsAPI.updateCampaign(editingCampaign.id, data as UpdateCampaignRequest);
      setEditingCampaign(null);
      fetchCampaigns();
      fetchStats();
      toast.success('Campaign updated successfully!');
    } catch (err) {
      toast.error('Failed to update campaign');
      throw err;
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await campaignsAPI.deleteCampaign(id);
      fetchCampaigns();
      fetchStats();
      toast.success('Campaign deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete campaign');
    }
  };

  const handleFilterChange = (key: keyof CampaignFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      page: 1,
      limit: 10
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getDaysLeft = (endDate?: string) => {
    if (!endDate) return null;
    const days = differenceInDays(parseISO(endDate), new Date());
    return days;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Campaign Management</h1>
          <p className="text-gray-500">Manage and track your marketing campaigns</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>
      {/* Error Alert */}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search campaigns..." 
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-1/4">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange('type', value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-1/4">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Display Ads">Display Ads</SelectItem>
                <SelectItem value="Content Marketing">Content Marketing</SelectItem>
                <SelectItem value="Search Ads">Search Ads</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Active Campaigns</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? stats.activeCampaigns : (loading ? '...' : '0')}
              </span>
              <Megaphone className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Budget</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalBudget) : (loading ? '...' : '$0')}
              </span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Impressions</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? formatNumber(stats.totalImpressions) : (loading ? '...' : '0')}
              </span>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Avg. CTR</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stats ? `${stats.averageCTR.toFixed(1)}%` : (loading ? '...' : '0%')}
              </span>
              <Percent className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <span className="font-semibold text-gray-900">
                  Campaign List ({campaigns.length})
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setFilters(prev => ({ ...prev, page: prev.page! > 1 ? prev.page! - 1 : 1 }))}>
                    Previous
                  </Button>
                  <Button variant="outline" onClick={() => setFilters(prev => ({ ...prev, page: (prev.page! || 1) + 1 }))}>
                    Next
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="px-6 py-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No campaigns found</p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4"
                  >
                    Create your first campaign
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-6 py-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between bg-gray-50 rounded p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                          <div>Budget: {formatCurrency(campaign.budget)}</div>
                          <div>Spent: {formatCurrency(campaign.spent)}</div>
                          <div>Type: {campaign.type}</div>
                          <div>
                            {campaign.endDate ? (
                              `${getDaysLeft(campaign.endDate)} days left`
                            ) : (
                              'No end date'
                            )}
                          </div>
                        </div>
                        {campaign.impressions > 0 && (
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-1">
                            <div>{formatNumber(campaign.impressions)} impressions</div>
                            <div>{formatNumber(campaign.clicks)} clicks</div>
                            <div>CTR: {campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : 0}%</div>
                          </div>
                        )}
                        {campaign.createdByUser && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center text-xs">
                              {campaign.createdByUser.firstName?.[0]}{campaign.createdByUser.lastName?.[0]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {campaign.createdByUser.firstName} {campaign.createdByUser.lastName}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCampaign(campaign)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Campaign Calendar (1/3 width) */}
        <div className="flex flex-col gap-6">
          <CampaignCalendar />
        </div>
      </div>

      {/* Create/Edit Campaign Dialogs */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0">
          <CampaignForm
            onSubmit={handleCreateCampaign}
            onCancel={() => setShowCreateForm(false)}
            isLoading={loading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0">
          {editingCampaign && (
            <CampaignForm
              campaign={editingCampaign}
              onSubmit={handleUpdateCampaign}
              onCancel={() => setEditingCampaign(null)}
              isLoading={loading}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 