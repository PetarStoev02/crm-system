import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Icon } from 'lucide-react';

interface EmptyStateProps {
  icon?: Icon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  size = 'md',
  className = ''
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-6',
    md: 'py-12',
    lg: 'py-20'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]}`}>
        {Icon && (
          <div className="mb-4">
            <Icon className={`${iconSizes[size]} text-gray-400`} />
          </div>
        )}
        
        <h3 className={`font-semibold text-gray-900 mb-2 ${
          size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'
        }`}>
          {title}
        </h3>
        
        <p className={`text-gray-500 mb-4 max-w-sm ${
          size === 'lg' ? 'text-base' : 'text-sm'
        }`}>
          {description}
        </p>
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant="outline"
            size={size === 'lg' ? 'default' : 'sm'}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Specific empty state variants for common use cases
export function EmptyLeads({ onCreateLead }: { onCreateLead?: () => void }) {
  return (
    <EmptyState
      title="No leads yet"
      description="Start building your pipeline by adding your first lead."
      actionLabel="Add Lead"
      onAction={onCreateLead}
    />
  );
}

export function EmptyCampaigns({ onCreateCampaign }: { onCreateCampaign?: () => void }) {
  return (
    <EmptyState
      title="No campaigns running"
      description="Create your first marketing campaign to start generating leads."
      actionLabel="Create Campaign"
      onAction={onCreateCampaign}
    />
  );
}

export function EmptyTasks({ onCreateTask }: { onCreateTask?: () => void }) {
  return (
    <EmptyState
      title="All caught up!"
      description="You have no pending tasks. Great job staying on top of things!"
      actionLabel="Add Task"
      onAction={onCreateTask}
      size="sm"
    />
  );
}

export function EmptyActivity() {
  return (
    <EmptyState
      title="No recent activity"
      description="Team activity will appear here as people complete tasks and create campaigns."
      size="sm"
    />
  );
} 