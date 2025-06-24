import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';

export interface CalendarItem {
  id: number;
  title: string;
  name?: string; // For campaigns
  startDate?: string;
  endDate?: string;
  dueDate?: string; // For tasks
  status: string;
  type?: string; // Campaign type
  priority?: string; // Task priority
}

export interface CalendarWidgetProps {
  title: string;
  items: CalendarItem[];
  loading: boolean;
  onItemSelect?: (item: CalendarItem) => void;
  getItemsForDate: (date: Date, items: CalendarItem[]) => CalendarItem[];
  getStatusColor: (status: string, priority?: string) => string;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
  renderItemCard: (item: CalendarItem) => React.ReactNode;
  legend: Array<{ color: string; label: string }>;
}

export function CalendarWidget(props: CalendarWidgetProps) {
  const {
    title,
    items, 
    loading,
    getItemsForDate,
    getStatusColor,
    renderItemCard,
    legend
  } = props;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getSelectedDateItems = () => {
    if (!selectedDate) return [];
    return getItemsForDate(selectedDate, items);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <span className="font-semibold text-gray-900">{title}</span>
          <div className="flex items-center gap-2 text-gray-500">
            <Button size="icon" variant="ghost" onClick={handlePreviousMonth} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-24 text-center">
              {format(currentDate, 'MMM yyyy')}
            </span>
            <Button size="icon" variant="ghost" onClick={handleNextMonth} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading {title.toLowerCase()}...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No {title.toLowerCase()} found</div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-400 mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const startOfCalendarMonth = startOfMonth(currentDate);
                  const endOfCalendarMonth = endOfMonth(currentDate);
                  const startDay = startOfWeek(startOfCalendarMonth);
                  const endDay = endOfWeek(endOfCalendarMonth);
                  const days = [];
                  
                  let currentDay = startDay;
                  while (currentDay <= endDay) {
                    const dayToRender = currentDay;
                    const isCurrentMonth = isSameMonth(dayToRender, currentDate);
                    const isSelected = selectedDate && isSameDay(dayToRender, selectedDate);
                    const dayItems = getItemsForDate(dayToRender, items);
                    
                    days.push(
                      <div
                        key={dayToRender.toISOString()}
                        className={`
                          aspect-square p-1 text-sm cursor-pointer rounded border
                          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                          ${isSelected ? 'bg-blue-100 border-blue-500' : 'border-gray-200 hover:bg-gray-50'}
                        `}
                        onClick={() => setSelectedDate(dayToRender)}
                      >
                        <div className="flex flex-col h-full">
                          <span className="text-center">{format(dayToRender, 'd')}</span>
                          {dayItems.length > 0 && (
                            <div className="flex-1 mt-1 space-y-0.5">
                              {dayItems.slice(0, 2).map((item, index) => (
                                <div
                                  key={`${item.id}-${index}`}
                                  className={`w-full h-1 rounded ${getStatusColor(item.status, item.priority)}`}
                                  title={item.title || item.name || ''}
                                />
                              ))}
                              {dayItems.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">+{dayItems.length - 2}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                    currentDay = addDays(currentDay, 1);
                  }
                  return days;
                })()}
              </div>
              
              {/* Selected Date Items */}
              {selectedDate && getSelectedDateItems().length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {format(selectedDate, 'MMM d, yyyy')} - {getSelectedDateItems().length} {title.slice(0, -1)}{getSelectedDateItems().length > 1 ? 's' : ''}
                  </h4>
                  <div className="space-y-2">
                    {getSelectedDateItems().slice(0, 3).map((item) => renderItemCard(item))}
                    {getSelectedDateItems().length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{getSelectedDateItems().length - 3} more {title.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
                {legend.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className={`w-3 h-1 rounded inline-block ${item.color}`} /> {item.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 