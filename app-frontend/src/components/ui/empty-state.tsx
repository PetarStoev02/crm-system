import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  actionLabel, 
  onAction,
  size = 'md' 
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
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]}`}>
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
      
      {action && <div className="flex justify-center">{action}</div>}
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
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