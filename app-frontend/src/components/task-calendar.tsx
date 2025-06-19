import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { tasksAPI, type Task } from "@/lib/tasks-api";
import { format, isSameDay, startOfMonth, endOfMonth, parseISO } from "date-fns";

interface TaskCalendarProps {
  className?: string;
  compact?: boolean;
}

export function TaskCalendar({ className, compact = false }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [currentMonth]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      
      const response = await tasksAPI.getTasks({
        limit: 100,
        dueDateFrom: format(startDate, 'yyyy-MM-dd'),
        dueDateTo: format(endDate, 'yyyy-MM-dd')
      });
      
      setTasks(response.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(parseISO(task.dueDate), date)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-blue-600 bg-blue-50';
      case 'todo': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM d, h:mm a');
  };

  if (compact) {
    // Compact view for dashboard
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Task Calendar</h3>
            <div className="flex items-center gap-2 text-gray-500">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[100px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-gray-400"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading tasks...</div>
            ) : (
              <>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border-none"
                  components={{
                    DayButton: ({ day, ...props }) => {
                      const dayTasks = getTasksForDate(day.date);
                      return (
                        <Button
                          {...props}
                          className={`relative h-8 w-8 p-0 text-sm ${props.className}`}
                        >
                          <span>{day.date.getDate()}</span>
                          {dayTasks.length > 0 && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                              {dayTasks.slice(0, 3).map((task, index) => (
                                <div
                                  key={index}
                                  className={`w-1 h-1 rounded-full ${getPriorityColor(task.priority)}`}
                                />
                              ))}
                              {dayTasks.length > 3 && (
                                <div className="w-1 h-1 rounded-full bg-gray-400" />
                              )}
                            </div>
                          )}
                        </Button>
                      );
                    }
                  }}
                />
                
                {/* Task list for selected date */}
                {selectedDate && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Tasks for {format(selectedDate, 'MMM d, yyyy')}
                    </h4>
                    {getTasksForDate(selectedDate).length === 0 ? (
                      <p className="text-xs text-gray-500">No tasks scheduled</p>
                    ) : (
                      <div className="space-y-2">
                        {getTasksForDate(selectedDate).map((task) => (
                          <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                            <div className="flex-1">
                              <div className={`font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {task.title}
                              </div>
                              {task.dueDate && (
                                <div className="text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(task.dueDate)}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary" className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Legend */}
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-1 bg-red-500 rounded inline-block" /> High Priority
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-1 bg-yellow-500 rounded inline-block" /> Medium Priority
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-1 bg-green-500 rounded inline-block" /> Low Priority
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full calendar view for tasks page
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Calendar View</h3>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading tasks...</div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border"
              components={{
                DayButton: ({ day, ...props }) => {
                  const dayTasks = getTasksForDate(day.date);
                  return (
                    <Button
                      {...props}
                      className={`relative h-12 w-full p-1 text-sm flex flex-col items-center justify-start ${props.className}`}
                    >
                      <span className="font-medium">{day.date.getDate()}</span>
                      {dayTasks.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {dayTasks.slice(0, 3).map((task, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
                              title={task.title}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title={`+${dayTasks.length - 3} more`} />
                          )}
                        </div>
                      )}
                    </Button>
                  );
                }
              }}
            />
            
            {/* Selected date tasks */}
            {selectedDate && (
              <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Tasks for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h4>
                {getTasksForDate(selectedDate).length === 0 ? (
                  <p className="text-gray-500">No tasks scheduled for this date</p>
                ) : (
                  <div className="space-y-3">
                    {getTasksForDate(selectedDate).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                        <div className="flex-1">
                          <div className={`font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                            {task.relatedLead && <span>Lead: {task.relatedLead.name}</span>}
                            {task.relatedCampaign && <span>Campaign: {task.relatedCampaign.name}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Legend */}
            <div className="flex gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-red-500 rounded inline-block" /> High Priority
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-yellow-500 rounded inline-block" /> Medium Priority
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-green-500 rounded inline-block" /> Low Priority
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 