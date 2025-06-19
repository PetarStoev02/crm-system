import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, ListChecks, CheckCircle2, AlertCircle, Plus, Clock, Edit, Trash2 } from "lucide-react";
import { tasksAPI, type Task, type TaskFilters } from "@/lib/tasks-api";
import { TaskForm } from "./task-form";
import { TaskCalendar } from "@/components/task-calendar";

type ViewMode = 'list' | 'create' | 'edit';

export function TasksOverview() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });
  
  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completedToday: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksAPI.getTasks(filters);
      setTasks(response.tasks);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      setStats({
        total: response.totalTasks,
        inProgress: response.tasks.filter(t => t.status === 'In Progress' || t.status === 'Pending').length,
        completedToday: response.tasks.filter(t => {
          if (!t.completedAt) return false;
          const completed = new Date(t.completedAt);
          return completed >= today;
        }).length,
        overdue: response.tasks.filter(t => {
          if (!t.dueDate || t.status === 'Completed') return false;
          return new Date(t.dueDate) < now;
        }).length
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TaskFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : Number(value) // Reset to page 1 when changing other filters, ensure number type
    }));
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setViewMode('create');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setViewMode('edit');
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.deleteTask(taskId);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleTaskStatusToggle = async (task: Task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await tasksAPI.updateTaskStatus(task.id, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  const handleFormSubmit = async () => {
    await fetchTasks();
    setViewMode('list');
    setEditingTask(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setEditingTask(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  if (viewMode === 'create') {
    return (
      <TaskForm
        task={null}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  if (viewMode === 'edit' && editingTask) {
    return (
      <TaskForm
        task={editingTask}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Tasks & Calendar</h1>
          <p className="text-gray-500">Manage your tasks and schedule</p>
        </div>
        <Button 
          onClick={handleCreateTask}
          className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Search tasks..." 
              className="w-full md:w-1/4"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <select 
              className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select 
              className="w-full md:w-1/4 border rounded px-3 py-2 text-gray-600 bg-white"
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Total Tasks</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
              <ListChecks className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">In Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.inProgress}</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Completed Today</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.completedToday}</span>
              <CheckCircle2 className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <span className="text-gray-500 text-sm">Overdue</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.overdue}</span>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Task List</h3>
                <div className="text-sm text-gray-500">
                  Showing {tasks.length} of {totalCount} tasks
                </div>
              </div>
              
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {filters.search || filters.status || filters.priority ? 
                    'No tasks found matching your filters.' : 
                    'No tasks yet. Create your first task to get started.'
                  }
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-6 py-4">
                  {tasks.map((task) => (
                    <div key={task.id} className={`flex items-start gap-3 bg-gray-50 rounded-lg p-4 ${isOverdue(task) ? 'border-l-4 border-red-500' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={task.status === 'Completed'}
                        onChange={() => handleTaskStatusToggle(task)}
                        className="mt-1 accent-gray-400" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-gray-900 ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {isOverdue(task) && (
                            <span className="text-xs px-2 py-1 rounded-full font-medium text-red-600 bg-red-50">
                              Overdue
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <div className={`text-sm text-gray-500 mb-2 ${task.status === 'Completed' ? 'line-through' : ''}`}>
                            {task.description}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Due: {formatDate(task.dueDate)}
                            </span>
                          )}
                          {task.relatedLead && (
                            <span>Related to: {task.relatedLead.name}</span>
                          )}
                          {task.relatedCampaign && (
                            <span>Campaign: {task.relatedCampaign.name}</span>
                          )}
                          {task.assignedToUser && (
                            <span>Assigned: {task.assignedToUser.firstName} {task.assignedToUser.lastName}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTask(task)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t">
                  <div className="text-sm text-gray-500">
                    Page {filters.page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={filters.page === 1}
                      onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={filters.page === totalPages}
                      onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar View (1/3 width) */}
        <div className="flex flex-col gap-6">
          <TaskCalendar mode="full" onTaskSelect={(taskEvent) => {
            // Find the full task object from our tasks array
            const fullTask = tasks.find(t => t.id === taskEvent.id);
            if (fullTask) {
              handleEditTask(fullTask);
            }
          }} />
        </div>
      </div>
    </div>
  );
} 