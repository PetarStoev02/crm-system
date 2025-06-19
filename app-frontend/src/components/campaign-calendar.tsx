import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, parseISO } from 'date-fns';
import { campaignsAPI } from '@/lib/campaigns-api';
import { CalendarWidget, type CalendarItem } from './calendar-widget';

interface CampaignEvent {
  id: number;
  name: string;
  startDate: string;
  endDate?: string;
  status: string;
  type: string;
}

interface CampaignCalendarProps {
  mode?: 'compact' | 'full';
  onCampaignSelect?: (campaign: CampaignEvent) => void;
}

export function CampaignCalendar({ mode = 'compact', onCampaignSelect }: CampaignCalendarProps) {
  const [campaigns, setCampaigns] = useState<CampaignEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignsAPI.getCampaignsForCalendar();
      console.log('Campaign Calendar: Fetched campaigns:', data);
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCampaignsForDate = (date: Date, campaigns: CalendarItem[]) => {
    return campaigns.filter(campaign => {
      if (!campaign.startDate) return false;
      
      const startDate = parseISO(campaign.startDate);
      const endDate = campaign.endDate ? parseISO(campaign.endDate) : startDate;
      
      return (
        (isSameDay(date, startDate)) ||
        (isSameDay(date, endDate)) ||
        (date >= startDate && date <= endDate)
      );
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'draft':
        return 'bg-gray-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'paused':
        return 'outline';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const renderCampaignCard = (campaign: CalendarItem) => (
    <div
      key={campaign.id}
      className="flex items-center justify-between p-2 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={() => onCampaignSelect && onCampaignSelect(campaign as CampaignEvent)}
    >
      <div className="flex-1">
        <h5 className="font-medium text-sm text-gray-900">{campaign.name}</h5>
        <p className="text-xs text-gray-500">{campaign.type}</p>
      </div>
      <Badge variant={getStatusBadgeVariant(campaign.status) as any} className="text-xs">
        {campaign.status}
      </Badge>
    </div>
  );

  const legend = [
    { color: 'bg-green-500', label: 'Active' },
    { color: 'bg-yellow-500', label: 'Paused' },
    { color: 'bg-blue-500', label: 'Completed' },
    { color: 'bg-gray-500', label: 'Draft' },
    { color: 'bg-red-500', label: 'Cancelled' }
  ];

  // Convert campaigns to CalendarItem format
  const calendarItems: CalendarItem[] = campaigns.map(campaign => ({
    id: campaign.id,
    title: campaign.name,
    name: campaign.name,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    status: campaign.status,
    type: campaign.type
  }));

  return (
    <CalendarWidget
      title="Campaign Calendar"
      items={calendarItems}
      loading={loading}
      mode={mode}
      onItemSelect={(item) => onCampaignSelect && onCampaignSelect(item as CampaignEvent)}
      getItemsForDate={getCampaignsForDate}
      getStatusColor={getStatusColor}
      getStatusBadgeVariant={getStatusBadgeVariant}
      renderItemCard={renderCampaignCard}
      legend={legend}
    />
  );
} 