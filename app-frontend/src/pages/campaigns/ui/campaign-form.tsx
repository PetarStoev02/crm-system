import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Card components not needed for dialog form
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import type { CampaignDto, CreateCampaignRequest, UpdateCampaignRequest } from '@/lib/campaigns-api';

interface CampaignFormProps {
  campaign?: CampaignDto;
  onSubmit: (data: CreateCampaignRequest | UpdateCampaignRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const CAMPAIGN_TYPES = [
  'Email',
  'Social Media',
  'Display Ads',
  'Content Marketing',
  'Search Ads',
  'Video Marketing',
  'Influencer Marketing',
  'Direct Mail',
  'Event Marketing',
  'Referral Program'
];

const CAMPAIGN_STATUSES = [
  'Draft',
  'Active',
  'Paused',
  'Completed',
  'Cancelled'
];

export function CampaignForm({ campaign, onSubmit, onCancel, isLoading = false, isEditing = false }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    type: campaign?.type || 'Email',
    status: campaign?.status || 'Draft',
    startDate: campaign?.startDate ? campaign.startDate.split('T')[0] : '',
    endDate: campaign?.endDate ? campaign.endDate.split('T')[0] : '',
    budget: campaign?.budget.toString() || '',
    targetAudience: campaign?.targetAudience.toString() || '',
    spent: campaign?.spent.toString() || '0',
    impressions: campaign?.impressions.toString() || '0',
    clicks: campaign?.clicks.toString() || '0',
    conversions: campaign?.conversions.toString() || '0'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Campaign description is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.budget || isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a valid number greater than 0';
    }

    if (!formData.targetAudience || isNaN(Number(formData.targetAudience)) || Number(formData.targetAudience) <= 0) {
      newErrors.targetAudience = 'Target audience must be a valid number greater than 0';
    }

    if (formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (isEditing) {
      if (formData.spent && (isNaN(Number(formData.spent)) || Number(formData.spent) < 0)) {
        newErrors.spent = 'Spent amount must be a valid number';
      }

      if (formData.impressions && (isNaN(Number(formData.impressions)) || Number(formData.impressions) < 0)) {
        newErrors.impressions = 'Impressions must be a valid number';
      }

      if (formData.clicks && (isNaN(Number(formData.clicks)) || Number(formData.clicks) < 0)) {
        newErrors.clicks = 'Clicks must be a valid number';
      }

      if (formData.conversions && (isNaN(Number(formData.conversions)) || Number(formData.conversions) < 0)) {
        newErrors.conversions = 'Conversions must be a valid number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      budget: Number(formData.budget),
      targetAudience: Number(formData.targetAudience),
      ...(isEditing && {
        spent: Number(formData.spent || '0'),
        impressions: Number(formData.impressions || '0'),
        clicks: Number(formData.clicks || '0'),
        conversions: Number(formData.conversions || '0')
      })
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Campaign' : 'Add New Campaign'}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Summer Sale Campaign"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your campaign goals and strategy..."
                rows={3}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Campaign Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  disabled={isLoading}
                >
                  {CAMPAIGN_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  disabled={isLoading}
                >
                  {CAMPAIGN_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates and Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Dates & Budget</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  disabled={isLoading}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  disabled={isLoading}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.budget && (
                  <p className="text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience Size *</Label>
                <Input
                  id="targetAudience"
                  type="number"
                  min="1"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="1000"
                  disabled={isLoading}
                />
                {errors.targetAudience && (
                  <p className="text-sm text-red-600">{errors.targetAudience}</p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Metrics (only for editing) */}
          {isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spent">Spent ($)</Label>
                  <Input
                    id="spent"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.spent}
                    onChange={(e) => handleInputChange('spent', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.spent && (
                    <p className="text-sm text-red-600">{errors.spent}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impressions">Impressions</Label>
                  <Input
                    id="impressions"
                    type="number"
                    min="0"
                    value={formData.impressions}
                    onChange={(e) => handleInputChange('impressions', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.impressions && (
                    <p className="text-sm text-red-600">{errors.impressions}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clicks">Clicks</Label>
                  <Input
                    id="clicks"
                    type="number"
                    min="0"
                    value={formData.clicks}
                    onChange={(e) => handleInputChange('clicks', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.clicks && (
                    <p className="text-sm text-red-600">{errors.clicks}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversions">Conversions</Label>
                  <Input
                    id="conversions"
                    type="number"
                    min="0"
                    value={formData.conversions}
                    onChange={(e) => handleInputChange('conversions', e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.conversions && (
                    <p className="text-sm text-red-600">{errors.conversions}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 