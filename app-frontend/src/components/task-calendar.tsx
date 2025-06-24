import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, parseISO } from 'date-fns';
import { tasksAPI } from '@/lib/tasks-api';
import { CalendarWidget, type CalendarItem } from './calendar-widget';

interface TaskEvent {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
  relatedLead?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  relatedCampaign?: {
    id: number;
    name: string;
  };
}

interface TaskCalendarProps {
  onTaskSelect?: (task: TaskEvent) => void;
  refreshTrigger?: number; // Used to trigger refresh from parent
}

export function TaskCalendar({ onTaskSelect, refreshTrigger }: TaskCalendarProps) {
  const [tasks, setTasks] = useState<TaskEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getTasksForCalendar();
      console.log('Task Calendar: Fetched tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDate = (date: Date, tasks: CalendarItem[]) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = parseISO(task.dueDate);
      return isSameDay(date, taskDate);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string, priority?: string) => {
    // For tasks, priority colors take precedence unless completed
    if (status.toLowerCase() === 'completed') {
      return 'bg-blue-500';
    }
    
    if (priority) {
      return getPriorityColor(priority);
    }
    
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-orange-500';
      case 'pending':
        return 'bg-gray-500';
      case 'todo':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'todo':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const renderTaskCard = (task: CalendarItem) => (
    <div
      key={task.id}
      className="flex items-center justify-between p-2 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={() => onTaskSelect && onTaskSelect(task as TaskEvent)}
    >
      <div className="flex-1">
        <h5 className="font-medium text-sm text-gray-900">{task.title}</h5>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority!)}`} />
          <span>{task.priority} Priority</span>
          {task.dueDate && (
            <span>• Due {format(parseISO(task.dueDate), 'MMM d')}</span>
          )}
        </div>
      </div>
      <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
        {task.status}
      </Badge>
    </div>
  );

  const legend = [
    { color: 'bg-red-500', label: 'High Priority' },
    { color: 'bg-yellow-500', label: 'Medium Priority' },
    { color: 'bg-green-500', label: 'Low Priority' },
    { color: 'bg-blue-500', label: 'Completed' },
    { color: 'bg-orange-500', label: 'In Progress' }
  ];

  // Convert tasks to CalendarItem format
  const calendarItems: CalendarItem[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    dueDate: task.dueDate,
    status: task.status,
    priority: task.priority
  }));

  return (
    <CalendarWidget
      title="Task Calendar"
      items={calendarItems}
      loading={loading}
      onItemSelect={(item) => onTaskSelect && onTaskSelect(item as TaskEvent)}
      getItemsForDate={getTasksForDate}
      getStatusColor={getStatusColor}
      getStatusBadgeVariant={getStatusBadgeVariant}
      renderItemCard={renderTaskCard}
      legend={legend}
    />
  );
} 