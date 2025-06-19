import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay, isSameMonth, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';

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
  mode?: 'compact' | 'full';
  onItemSelect?: (item: CalendarItem) => void;
  getItemsForDate: (date: Date, items: CalendarItem[]) => CalendarItem[];
  getStatusColor: (status: string, priority?: string) => string;
  getStatusBadgeVariant: (status: string) => string;
  renderItemCard: (item: CalendarItem) => React.ReactNode;
  legend: Array<{ color: string; label: string }>;
}

export function CalendarWidget({ 
  title,
  items, 
  loading, 
  mode = 'compact', 
  onItemSelect,
  getItemsForDate,
  getStatusColor,
  getStatusBadgeVariant,
  renderItemCard,
  legend
}: CalendarWidgetProps) {
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

  if (mode === 'compact') {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-semibold text-gray-900">{title}</span>
            <div className="flex items-center gap-2 text-gray-500">
              <Button size="icon" variant="ghost" onClick={handlePreviousMonth} className="text-gray-400">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-24 text-center">
                {format(currentDate, 'MMM yyyy')}
              </span>
              <Button size="icon" variant="ghost" onClick={handleNextMonth} className="text-gray-400">
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
                
                {/* Custom Calendar Grid */}
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

  // Full mode - similar structure with larger calendar
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {title}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreviousMonth}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <h3 className="text-lg font-semibold min-w-48 text-center">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <Button variant="outline" onClick={handleNextMonth}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading {title.toLowerCase()}...</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-400 mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              
              {/* Large Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
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
                          aspect-square p-2 text-sm cursor-pointer rounded-lg border-2
                          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                          ${isSelected ? 'bg-blue-100 border-blue-500' : 'border-gray-200 hover:bg-gray-50'}
                        `}
                        onClick={() => setSelectedDate(dayToRender)}
                      >
                        <div className="flex flex-col h-full">
                          <span className="font-medium text-center mb-1">{format(dayToRender, 'd')}</span>
                          {dayItems.length > 0 && (
                            <div className="flex-1 space-y-1">
                              {dayItems.slice(0, 3).map((item, index) => (
                                <div
                                  key={`${item.id}-${index}`}
                                  className={`w-full h-2 rounded text-white text-xs px-1 ${getStatusColor(item.status, item.priority)}`}
                                  title={item.title || item.name || ''}
                                />
                              ))}
                              {dayItems.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">+{dayItems.length - 3}</div>
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

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm">
                {legend.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={`w-4 h-2 rounded ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Items */}
      {selectedDate && getSelectedDateItems().length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {title} for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
              {getSelectedDateItems().map((item) => renderItemCard(item))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 